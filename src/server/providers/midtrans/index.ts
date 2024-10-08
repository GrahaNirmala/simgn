// @ts-ignore
import midtransClient from "midtrans-client"
import crypto from "crypto"
import { config } from "@/server/config"
import { singleton } from "@/server/utils/singleton"

const clientConfig = {
  isProduction: true,
  serverKey: config.midtrans.serverKey,
  clientKey: config.midtrans.clientKey,
}

export function core() {
  return singleton("midtrans_core", () => new midtransClient.Core(clientConfig))
}

export function snap() {
  return singleton("midtrans_snap", () => new midtransClient.Snap(clientConfig))
}

export function generateOrderId() {
  return crypto.randomUUID().toString()
}
