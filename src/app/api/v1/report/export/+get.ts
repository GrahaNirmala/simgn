import { db } from "@/server/db";
import { Payment, Cashflow, Occupant } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import * as XLSX from "xlsx";
import { defineHandler } from "@/server/web/handler";
import { getCurrentStaff, useAuth } from "@/server/security/auth";
import { logActivity } from "@/server/utils/logging";
import { sendErrors } from "@/server/web/response";

export const GET = defineHandler(async (req) => {
    useAuth(req, { staff: ["admin", "secretary"] });
    const staff = await getCurrentStaff(req);

    const url = new URL(req.url);
    const monthParam = url.searchParams.get("month");
    const yearParam = url.searchParams.get("year");

    if (!monthParam || !yearParam) {
        return sendErrors(423, {message: "Bulan dan tahun dibutuhkan."});
    }

    const currentMonth = parseInt(monthParam);
    const currentYear = parseInt(yearParam);

    const month = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' });

    const [payments, cashflows, cashflowsOutcome, totalPaymentIncomeAllTime, totalCashflowIncomeAllTime, totalOutcomeAllTime] = await Promise.all([
        // Query untuk Payment berdasarkan bulan dan tahun
        db().query.Payment.findMany({
            where: and(
                eq(Payment.status, 'settlement'),
                sql`EXTRACT(MONTH FROM ${Payment.createdAt}) = ${currentMonth}`,
                sql`EXTRACT(YEAR FROM ${Payment.createdAt}) = ${currentYear}`
            ),
            columns: {
                payerId: true,
                amount: true,
                tanggalBilling: true,
            },
        }),
        // Query untuk Cashflow (pemasukan) berdasarkan bulan dan tahun
        db().query.Cashflow.findMany({
            where: and(
                eq(Cashflow.movement, 'income'),
                sql`EXTRACT(MONTH FROM ${Cashflow.createdAt}) = ${currentMonth}`,
                sql`EXTRACT(YEAR FROM ${Cashflow.createdAt}) = ${currentYear}`
            ),
            columns: {
                title: true,
                amount: true,
            },
        }),
        // Query untuk Cashflow (pengeluaran) berdasarkan bulan dan tahun
        db().query.Cashflow.findMany({
            where: and(
                eq(Cashflow.movement, 'outcome'),
                sql`EXTRACT(MONTH FROM ${Cashflow.createdAt}) = ${currentMonth}`,
                sql`EXTRACT(YEAR FROM ${Cashflow.createdAt}) = ${currentYear}`
            ),
            columns: {
                title: true,
                amount: true,
            },
        }),
        // Query total pemasukan dari Payment tanpa filter bulan dan tahun
        db().select({
            sum: sql<number>`SUM(${Payment.amount})`
        }).from(Payment).where(eq(Payment.status, 'settlement')),
        // Query total pemasukan dari Cashflow tanpa filter bulan dan tahun
        db().select({
            sum: sql<number>`SUM(${Cashflow.amount})`
        }).from(Cashflow).where(eq(Cashflow.movement, 'income')),
        // Query total pengeluaran tanpa filter bulan dan tahun
        db().select({
            sum: sql<number>`SUM(${Cashflow.amount})`
        }).from(Cashflow).where(eq(Cashflow.movement, 'outcome')),
    ]);

    const uniquePayerIds = [...new Set(payments.map(payment => payment.payerId))];

    const occupants = uniquePayerIds.length > 0
        ? await db().query.Occupant.findMany({
            where: sql`${Occupant.id} IN (${sql.join(uniquePayerIds, sql`, `)})`,
            columns: {
                id: true,
                name: true,
            },
        })
        : [];

    const occupantMap = new Map(occupants.map(occupant => [occupant.id, occupant.name]));

    const incomeData = [
        ...payments.map((payment, index) => {
            const billingDate = payment.tanggalBilling ? new Date(payment.tanggalBilling) : null;
            const month = billingDate ? billingDate.toLocaleString("id-ID", { month: "long" }) : 'Unknown';
            const year = billingDate ? billingDate.getFullYear() : 'Unknown';
    
            return {
                No: index + 1,
                Title: `Pembayaran iuran oleh ${occupantMap.get(payment.payerId) || 'Unknown'} bulan ${month} ${year}`,
                Amount: payment.amount,
            };
        }),
        ...cashflows.map((cashflow, index) => ({
            No: payments.length + index + 1,
            Title: cashflow.title,
            Amount: cashflow.amount,
        })),
    ];

    const outcomeData = cashflowsOutcome.map((cashflow, index) => ({
        No: index + 1,
        Title: cashflow.title,
        Amount: cashflow.amount,
    }));

    const totalIncome = incomeData.reduce((acc, income) => acc + income.Amount, 0);
    const totalOutcome = outcomeData.reduce((acc, outcome) => acc + outcome.Amount, 0);
    const balance = totalIncome - totalOutcome;

    // Hitung total pemasukan keseluruhan (Payment + Cashflow)
    const totalCash = Number(totalPaymentIncomeAllTime[0]?.sum || 0) + Number(totalCashflowIncomeAllTime[0]?.sum || 0) - Number(totalOutcomeAllTime[0]?.sum || 0);


    const workbook = XLSX.utils.book_new();
    const sheetData = [
        [`Monthly Report Perumahan Bulan ${month} ${currentYear}`],
        [],
        ["Pemasukan"],
        ["No", "Judul", "Jumlah"],
        ...incomeData.map(income => [income.No, income.Title, income.Amount]),
        ["","Total Pemasukan", totalIncome],
        [],
        ["Pengeluaran"],
        ["No", "Judul", "Jumlah"],
        ...outcomeData.map(outcome => [outcome.No, outcome.Title, outcome.Amount]),
        ["","Total Pengeluaran", totalOutcome],
        [],
    
        ["Sisa Saldo Bulan Ini", balance],
        [],
        ["Total Kas Perumahan", totalCash],  // Menambahkan total kas di sini
    ];

    console.log("Total Payment Income All Time:", totalPaymentIncomeAllTime[0]?.sum);
    console.log("Total Cashflow Income All Time:", totalCashflowIncomeAllTime[0]?.sum);
    console.log("Total Outcome All Time:", totalOutcomeAllTime[0]?.sum);

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Report");

    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const formattedRole = staff.role === "secretary" 
        ? "sekretaris" 
        : staff.role === "treasurer" 
        ? "bendahara" 
        : staff.role;

    await logActivity(
        staff.id,
        "Report Monthly",
        "Export",
        `Pengurus dengan nama ${staff.name} dengan Role ${formattedRole} Melakukan Export Data Report Bulan ${month}_${currentYear}`,
    );

    return new Response(excelBuffer, {
        headers: {
            "Content-Disposition": `attachment; filename="monthly_report_${month}_${currentYear}.xlsx"`,
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        status: 200,
    });
});
