import * as dotenv from "dotenv"

dotenv.config({
  path: ".env.local",
})

type Config = {
  db: {
    host: string
    port: number
    user: string
    pass: string
    name: string
    url: string
  }
  jwt: {
    secret: string
    reset: string
    refresh: string
    expiresIn: string
  }
  midtrans: {
    clientKey: string
    serverKey: string
  }
  firebase:{
    firebase: string
    storageBucket: string
    id: string
    private: string
    email: string
  }
  mail:{
    email: string
    pass: string
  }
  url:{
    resetUrl: string
  }
}

const e = process.env

export const config: Config = {
  db: {
    host: e.DB_HOST!,
    port: parseInt(e.DB_PORT!),
    user: e.DB_USER!,
    pass: e.DB_PASS!,
    name: e.DB_NAME!,
    url: e.POSTGRES_URL!,
  },
  jwt: {
    secret: e.JWT_SECRET!,
    reset: e.JWT_RESET!,
    refresh: e.JWT_REFRESH_TOKEN!,
    expiresIn: e.JWT_EXPIRES_IN!,
  },
  midtrans: {
    clientKey: e.MIDTRANS_CLIENT_KEY!,
    serverKey: e.MIDTRANS_SERVER_KEY!,
  },
  firebase:{
    firebase: e.FIREBASE_SERVICE_ACCOUNT_PATH!,
    storageBucket: e.FIREBASE_STORAGE_BUCKET!,
    id: e.FIREBASE_PROJECT_ID!,
    private: e.FIREBASE_PRIVATE_KEY!,
    email: e.FIREBASE_CLIENT_EMAIL!,
  },
  mail:{
    email: e.EMAIL!,
    pass: e.PASS_EMAIL!,
  },
  url:{
    resetUrl: e.FRONT_END_URL!,
  },
}
