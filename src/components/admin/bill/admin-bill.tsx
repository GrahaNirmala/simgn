"use client";

import { useEffect, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { getBills } from "@/lib/api"
import { BillingResponse } from "@/server/models/responses/billing"
import { HouseResponse } from "@/server/models/responses/house"
import { BillListItem, BillTable } from "@/components/ui/bill"

export function AdminBill({ houses }: { houses: HouseResponse[] }) {
  const [selectedHouse, setSelectedHouse] = useState<HouseResponse>(houses[0])
  const [query, setQuery] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const [selectedOccupantId, setSelectedOccupantId] = useState<number>(
    houses[0].owner ? houses[0].owner.id : -1
  );

  const [bills, setBills] = useState<BillingResponse[]>([]);

  useEffect(() => {
    async function fetchBills() {
      const [billsResponse, err] = await getBills(selectedHouse.id.toString())
      setBills(billsResponse)
    }

    setSelectedOccupantId(selectedHouse.owner?.id ?? -1);
    fetchBills()
  }, [selectedHouse])

  const filteredHouses =
  query === ""
    ? houses.sort((a, b) =>
        a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: "base" })
      )
    : houses
        .filter((house) =>
          house.code.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) =>
          a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: "base" })
        )

  const handleSelectHouse = (house: HouseResponse) => {
    setSelectedHouse(house)
    setDropdownOpen(false)
    setQuery(house.code)
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <div className="flex gap-4">
        <div ref={dropdownRef} className="relative w-[200px]">
          <Label className="mb-2">Rumah</Label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            placeholder="Cari rumah..."
          />
          {dropdownOpen && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
              {filteredHouses.length > 0 ? (
                filteredHouses.map((house) => (
                  <li
                    key={house.id}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleSelectHouse(house)}
                  >
                    {house.code}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">Tidak ada rumah</li>
              )}
            </ul>
          )}
        </div>

        <div className="w-[200px]">
          <Label className="mb-2">Pembayar</Label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            onChange={(e) => setSelectedOccupantId(parseInt(e.target.value))}
            value={selectedOccupantId.toString()}
          >
            {selectedHouse.owner && (
              <option value={selectedHouse.owner.id.toString()}>
                {selectedHouse.owner.name}
              </option>
            )}
            {selectedHouse.renter && (
              <option value={selectedHouse.renter.id.toString()}>
                {selectedHouse.renter.name}
              </option>
            )}
          </select>
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
          <p className="text-center text-gray-500">Tidak ada tagihan</p>
        )}
      </BillTable>
    </>
  );
}
