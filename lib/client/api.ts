import { parseApiError } from "@/lib/api-error"
import { Paginated, PaginateParams, toSearchParams } from "@/lib/paginate"
import { Client, ClientInput } from "./types"

export const listClients = async (
  params?: PaginateParams
): Promise<Paginated<Client>> => {
  const response = await fetch(`/api/clients${toSearchParams(params)}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch clients")
  }

  return response.json()
}

export const getClient = async (id: string): Promise<Client> => {
  const response = await fetch(`/api/clients/${id}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch client")
  }

  return response.json()
}

export const createClient = async (input: ClientInput): Promise<Client> => {
  const response = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to create client")
  }

  return response.json()
}

export const updateClient = async (
  id: string,
  input: ClientInput
): Promise<Client> => {
  const response = await fetch(`/api/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to update client")
  }

  return response.json()
}

export const deleteClient = async (id: string): Promise<void> => {
  const response = await fetch(`/api/clients/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to delete client")
  }
}

export const removeClientMember = async (
  clientId: string,
  userId: string
): Promise<void> => {
  const response = await fetch(`/api/clients/${clientId}/members/${userId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to remove client member")
  }
}
