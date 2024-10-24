import { OccupantLogin, StaffLogin } from "./model"
import { AnnouncementResponse } from "@/server/models/responses/announcement"
import { StaffResponse } from "@/server/models/responses/staff"
import {
  HouseResponse,
  HouseResponseWithFamilyCard,
} from "@/server/models/responses/house"
import {
  GetAllOccupantsResponse,
  OccupantResponse,
} from "@/server/models/responses/occupant"
import { TransactionCasflow, TransactionResponse } from "@/server/models/responses/transaction"
import { BillingResponse } from "@/server/models/responses/billing"
import { TInsertPayment, TPayment } from "@/server/db/schema"
import { CashflowResponse } from "@/server/models/responses/cashflow"
import { FamilyResponse } from "@/server/models/responses/family"
import { StorageResponse } from "@/server/models/responses/storage"
import { errServer } from "@/server/constants/error"
import { catchError } from "./utils"
import { BillingConfigResponse } from "@/server/models/responses/billing-config"
import { LogActivityResponse } from "@/server/models/responses/log-activity"

const isServer = typeof window === "undefined"
const baseURL = isServer ? "https://simgn.vercel.app/api/v1" : "/api/v1"

export type FetchError = { field?: string; message: string }[] | null

type RequestOptions = RequestInit & { endpointProtected?: boolean }

const requestOptionsDefaults: Pick<RequestOptions, "endpointProtected"> = {
  endpointProtected: false,
}

async function handleFetch<T>(
  url: string,
  requestOptions: RequestOptions = { ...requestOptionsDefaults },
): Promise<[T, FetchError]> {
  try {
    let res: Response

    if (requestOptions.endpointProtected && isServer) {
      const { cookies } = await import("next/headers")

      res = await fetch(`${baseURL}${url}`, {
        headers: {
          Authorization: `Bearer ${cookies().get("token")?.value ?? ""}`,
        },
        cache: "no-store",
        ...requestOptions,
      })
    } else {
      res = await fetch(`${baseURL}${url}`, {
        cache: "no-store",
        ...requestOptions,
      })
    }

    const resJson = await res.json()

    if (!res.ok) {
      if (res.status >= 500 || (!resJson.errors[0].field && res.status !== 404)){
        throw new Error(`${resJson.errors[0].message}`)
     } else if (res.status >= 400) return [null as T, resJson.errors]

      throw new Error(errServer)
      
    }

    return [resJson.data, null]
  } catch (error) {
    if (!isServer) {
      catchError(error)
    }
    throw error
  }
}

async function handleFetchNoContent(
  url: string,
  requestOptions: RequestOptions = { ...requestOptionsDefaults },
) {
  try {
    let res: Response

    if (requestOptions.endpointProtected && isServer) {
      const { cookies } = await import("next/headers")

      res = await fetch(`${baseURL}${url}`, {
        headers: {
          Authorization: `Bearer ${cookies().get("token")?.value ?? ""}`,
        },
        ...requestOptions,
      })
    } else {
      res = await fetch(`${baseURL}${url}`, requestOptions)
    }

    if (!res.ok) {
      const resJson = await res.json()

      throw new Error(resJson.errors[0].message)
    }
  } catch (error) {
    catchError(error)
    throw new Error(errServer)
  }
}

export async function occupantLogin(body: {}): Promise<
  [OccupantLogin, FetchError]
> {
  const res = await handleFetch<OccupantLogin>("/auth/occupant/login", {
    method: "POST",
    body: JSON.stringify(body),
  })
  return res
}

export async function forgetPass(body: {}): Promise<[any, FetchError]> {
  const res = await handleFetch<any>("/api/v1/auth/forgetPass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function staffLogin(body: {}): Promise<[StaffLogin, FetchError]> {
  const res = await handleFetch<StaffLogin>("/auth/staff/login", {
    method: "POST",
    body: JSON.stringify(body),
  })

  return res
}

export async function logout(): Promise<void> {
  await handleFetchNoContent(`/auth/logout`)
}

export async function getHouse(
  id: string,
): Promise<[HouseResponseWithFamilyCard, FetchError]> {
  const res = await handleFetch<HouseResponseWithFamilyCard>(`/house/${id}`)
  return res
}

export async function getHouses(): Promise<[HouseResponse[], FetchError]> {
  const res = await handleFetch<HouseResponse[]>(`/house`)
  return res
}

export async function postHouse(body: {}): Promise<
  [HouseResponse, FetchError]
> {
  const res = await handleFetch<HouseResponse>(`/house`, {
    method: "POST",
    body: JSON.stringify(body),
    endpointProtected: true,
  })

  return res
}

export async function putHouse(
  id: string,
  body: {},
): Promise<[HouseResponse, FetchError]> {
  const res = await handleFetch<HouseResponse>(`/house/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    endpointProtected: true,
  })

  return res
}

export async function deleteHouse(
  id: number,
): Promise<[StaffResponse, FetchError]> {
  const res = await handleFetch<StaffResponse>(`/house/${id}`, {
    method: "DELETE",
    endpointProtected: true,
  })
  return res
}

export async function getOccupant(
  id: string,
): Promise<[OccupantResponse, FetchError]> {
  const res = await handleFetch<OccupantResponse>(`/occupant/${id}`, {
    endpointProtected: true,
  })

  return res
}

export async function getOccupants(): Promise<
  [GetAllOccupantsResponse[], FetchError]
> {
  const res = await handleFetch<GetAllOccupantsResponse[]>(`/occupant`, {
    endpointProtected: true,
  })
  return res
}

export async function postOccupant(body: {}): Promise<
  [OccupantResponse, FetchError]
> {
  const res = await handleFetch<OccupantResponse>(`/occupant`, {
    method: "POST",
    body: JSON.stringify(body),
    endpointProtected: true,
  })

  return res
}

export async function putOccupant(
  id: string,
  body: {},
): Promise<[OccupantResponse, FetchError]> {
  const res = await handleFetch<OccupantResponse>(`/occupant/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    endpointProtected: true,
  })
  return res
}

export async function deleteOccupant(
  id: number,
): Promise<[OccupantResponse, FetchError]> {
  const res = await handleFetch<OccupantResponse>(`/occupant/${id}`, {
    method: "DELETE",
    endpointProtected: true,
  })
  return res
}

export async function getStaff(
  id: string,
): Promise<[StaffResponse, FetchError]> {
  const res = await handleFetch<StaffResponse>(`/staff/${id}`, {
    endpointProtected: true,
  })

  return res
}

export async function getStaffs(): Promise<[StaffResponse[], FetchError]> {
  const res = await handleFetch<StaffResponse[]>(`/staff`, {
    endpointProtected: true,
  })
  return res
}

export async function postStaff(body: {}): Promise<
  [StaffResponse, FetchError]
> {
  const res = await handleFetch<StaffResponse>(`/staff`, {
    method: "POST",
    body: JSON.stringify(body),
    endpointProtected: true,
  })
  return res
}

export async function putStaff(
  id: string,
  body: {},
): Promise<[StaffResponse, FetchError]> {
  const res = await handleFetch<StaffResponse>(`/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    endpointProtected: true,
  })
  return res
}

export async function deleteStaff(
  id: number,
): Promise<[StaffResponse, FetchError]> {
  const res = await handleFetch<StaffResponse>(`/staff/${id}`, {
    method: "DELETE",
    endpointProtected: true,
  })
  return res
}

export async function getAnnouncements(): Promise<
  [AnnouncementResponse[], FetchError]
> {
  const res = await handleFetch<AnnouncementResponse[]>(`/announcement`)

  return res
}

export async function getAnnouncement(
  id: string,
): Promise<[AnnouncementResponse, FetchError]> {
  const res = await handleFetch<AnnouncementResponse>(`/announcement/${id}`, {
    endpointProtected: true,
  })

  return res
}

export async function postAnnouncement(formData: FormData): Promise<
  [AnnouncementResponse, FetchError]
> {
  const res = await handleFetch<AnnouncementResponse>(`/announcement`, {
    method: "POST",
    body: formData,
    endpointProtected: true,
  })

  return res
}

export async function putAnnouncement(
  id: string,
  formData: FormData,
): Promise<[AnnouncementResponse, FetchError]> {
  const res = await handleFetch<AnnouncementResponse>(`/announcement/${id}`, {
    method: "PUT",
    body: formData,
    endpointProtected: true,
  })

  return res
}

export async function deleteAnnouncement(id: number) {
  await handleFetchNoContent(`/announcement/${id}`, {
    method: "DELETE",
    endpointProtected: true,
  })
}

export async function getFamily(
  id: string,
): Promise<[FamilyResponse[], FetchError]> {
  const res = await handleFetch<FamilyResponse[]>(`/occupant/${id}/family`, {
    endpointProtected: true,
  })

  return res
}

export async function postFamilyMember(
  occupantId: string,
  body: {},
): Promise<[FamilyResponse, FetchError]> {
  const res = await handleFetch<FamilyResponse>(
    `/occupant/${occupantId}/family`,
    {
      method: "POST",
      body: JSON.stringify(body),
      endpointProtected: true,
    },
  )

  return res
}

export async function getFamilyCard(
  id: string,
): Promise<[StorageResponse, FetchError]> {
  const res = await handleFetch<StorageResponse>(
    `/occupant/${id}/document/family-card`,
  )

  return res
}

export async function uploadFamilyCard(
  id: string,
  body: FormData,
): Promise<[StorageResponse, FetchError]> {
  const res = await handleFetch<StorageResponse>(
    `/occupant/${id}/document/family-card`,
    {
      method: "POST",
      body: body,
      endpointProtected: true,
    },
  )

  return res
}

export async function getTransaction(): Promise<
  [TransactionResponse, FetchError]
> {
  const res = await handleFetch<TransactionResponse>(`/transaction`, {
    endpointProtected: true,
  })

  return res
}

export async function getRecieptCard(
  id: string,
): Promise<[StorageResponse, FetchError]> {
  const res = await handleFetch<StorageResponse>(
    `/transaction/${id}`,
  )

  return res
}


export async function getTransactionById(
  source: string,
  id: string
): Promise<[TransactionCasflow[], FetchError]> {
  const res = await handleFetch<TransactionCasflow[] >(`/transaction/${source}/${id}`, {
    endpointProtected: true,
  })
  return res
}

export async function postCashflow(formData: FormData): Promise<
  [CashflowResponse, FetchError]
> {
  const res = await handleFetch<CashflowResponse>(`/cashflow`, {
    method: "POST",
    body: formData,
    endpointProtected: true,
  })

  return res
}

export async function putCashflow(id: string, formData: FormData): Promise<
  [CashflowResponse, FetchError]
> {
  const res = await handleFetch<CashflowResponse>(`/cashflow/${id}`, {
    method: "PUT",
    body: formData,
    endpointProtected: true,
  })

  return res
}

export async function getCashFlow(
  id: string
): Promise<[CashflowResponse, FetchError]> {
  const res = await handleFetch<CashflowResponse >(`/cashflow/${id}`, {
    endpointProtected: true,
  })
  return res
}

export async function putBillingConfig(
  id: string,
  body: {},
  ): Promise<[BillingConfigResponse, FetchError]
> {
  const res = await handleFetch<BillingConfigResponse>(`/billing/${id}/config `, {
    method: "PUT",
    body: JSON.stringify(body),
    endpointProtected: true,
  })

  return res
}

export async function getBillConfig(
  id: string,
  ): Promise<[BillingConfigResponse, FetchError]> {
  const res = await handleFetch<BillingConfigResponse>(
    `/billing/${id}/config`, {
    endpointProtected: true,
  })
  return res
}

export async function getBills(
  houseId: string,
): Promise<[BillingResponse[], FetchError]> {
  const res = await handleFetch<BillingResponse[]>(
    `/house/${houseId}/billing`,
    {
      endpointProtected: true,
    },
  )

  return res
}

export async function payBill(
  id: number,
): Promise<[TInsertPayment, FetchError]> {
  const res = await handleFetch<TInsertPayment>(`/billing/${id}/pay/transfer`, {
    method: "POST",
    endpointProtected: true,
  })

  return res
}

export async function payBillCash(
  id: number,
  body: { occupant_id: number },
): Promise<[TInsertPayment, FetchError]> {
  const res = await handleFetch<TInsertPayment>(`/billing/${id}/pay/cash`, {
    method: "POST",
    body: JSON.stringify(body),
    endpointProtected: true,
  })

  return res
}

export async function getPaymentHistory(
  id: string,
): Promise<[TPayment[], FetchError]> {
  const res = await handleFetch<TPayment[]>(`/house/${id}/payment`, {
    endpointProtected: true,
  })

  return res
}

export async function getLogActivities(): Promise<[LogActivityResponse[], FetchError]> {
  const [data, error] = await handleFetch<LogActivityResponse[]>('/log', {
    endpointProtected: true,
  });
  return [data ?? [], error];
}

export async function getReport(): Promise<
  [TransactionResponse, FetchError]
> {
  const res = await handleFetch<TransactionResponse>(`/report`, {
    endpointProtected: true,
  })

  return res
}

export async function getStorage(id: string,): Promise<[StorageResponse, FetchError]> {
  const res = await handleFetch<StorageResponse>(`/storage/${id}`, {
    endpointProtected: true,
  })
  return res
}