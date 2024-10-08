import { ApiError } from "@/server/models/exceptions/api"
import { NextRequest } from "next/server"
import { sendErrors, sendErrorServer } from "./response"
import * as schema from "../db/schema"
import { PgTransaction } from "drizzle-orm/pg-core"
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js"
import { ExtractTablesWithRelations } from "drizzle-orm"
import { db } from "../db"

interface Handler<T = any> {
  (req: NextRequest, event: { params: any }): T
}

export function defineHandler(handler: Handler) {
  return async (req: NextRequest, event: { params: any }) => {
    try {
      if (event.params?.id) event.params.id = parseInt(event.params.id)

      return await handler(req, event)
    } catch (error) {
      if (error instanceof ApiError) {
        return sendErrors(error.code, error.errors)
      }

      return sendErrorServer()
    }
  }
}

interface TransactionHandler<T = any> {
  (
    tx: PgTransaction<
      PostgresJsQueryResultHKT,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >,
    req: NextRequest,
    event: { params: any },
  ): T
}

export function defineTransactionHandler(handler: TransactionHandler) {
  return async (req: NextRequest, event: { params: any }) => {
    return await db().transaction(async (tx) => {
      try {
        return await handler(tx, req, event)
      } catch (error) {
        tx.rollback()
        if (error instanceof ApiError) {
          return sendErrors(error.code, error.errors)
        }

        return sendErrorServer()
      }
    })
  }
}
