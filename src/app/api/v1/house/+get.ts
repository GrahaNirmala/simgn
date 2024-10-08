import { db } from "@/server/db"
import { House, Occupant, TOccupant } from "@/server/db/schema"
import { toHouseResponse } from "@/server/models/responses/house"
import { defineHandler } from "@/server/web/handler"
import { sendData } from "@/server/web/response"
import { and, eq } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

const Owner = alias(Occupant, "owner")
const Renter = alias(Occupant, "renter")

export const GET = defineHandler(async () => {
  const houses = await db()
    .select()
    .from(House)
    .leftJoin(Owner, and(eq(House.id, Owner.houseId), eq(Owner.role, "owner")))
    .leftJoin(
      Renter,
      and(eq(House.id, Renter.houseId), eq(Renter.role, "renter")),
    )

  return sendData(
    200,
    houses.map((house) =>
      toHouseResponse(house.house, {
        owner: house.owner as TOccupant,
        renter: house.renter as TOccupant,
      }),
    ),
  )
})
