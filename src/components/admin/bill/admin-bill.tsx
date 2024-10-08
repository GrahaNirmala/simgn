"use client"

import { useEffect, useState } from "react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBills } from "@/lib/api"
import { BillingResponse } from "@/server/models/responses/billing"
import { HouseResponse } from "@/server/models/responses/house"
import { BillListItem, BillTable } from "@/components/ui/bill"

export function AdminBill({ houses }: { houses: HouseResponse[] }) {
  const [selectedHouse, setSelectedHouse] = useState<HouseResponse>(houses[0])

  const [selectedOccupantId, setSelectedOccupantId] = useState<number>(
    houses[0].owner ? houses[0].owner.id : -1,
  )

  const [bills, setBills] = useState<BillingResponse[]>([])

  useEffect(() => {
    async function fetchBills() {
      const [billsResponse, err] = await getBills(selectedHouse.id.toString())
      setBills(billsResponse)
    }

    setSelectedOccupantId(selectedHouse.owner?.id ?? -1)
    fetchBills()
  }, [selectedHouse])

  return (
    <>
      <div className="flex gap-4">
        <div>
          <Label>Rumah</Label>
          <Select
            onValueChange={(value) =>
              setSelectedHouse(
                houses.find((house) => house.id.toString() === value) ??
                  houses[0],
              )
            }
            defaultValue={houses[0].id.toString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {houses
                .sort((a, b) => a.id - b.id)
                .map((house) => (
                  <SelectItem key={house.id} value={house.id.toString()}>
                    {house.code}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Pembayar</Label>
          <Select
            onValueChange={(value) => setSelectedOccupantId(parseInt(value))}
            value={selectedOccupantId.toString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selectedHouse.owner && (
                <SelectItem
                  key={selectedHouse.owner.id}
                  value={selectedHouse.owner.id.toString()}
                >
                  {selectedHouse.owner.name}
                </SelectItem>
              )}
              {selectedHouse.renter && (
                <SelectItem
                  key={selectedHouse.renter.id}
                  value={selectedHouse.renter.id.toString()}
                >
                  {selectedHouse.renter.name}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <BillTable>
        {bills.length ? (
          bills.map((bill) => (
            <BillListItem
              key={bill.id}
              bill={bill}
              occupantId={selectedOccupantId}
            />
          ))
        ) : (
          <p>Tidak ada tagihan</p>
        )}
      </BillTable>
    </>
  )
}
  