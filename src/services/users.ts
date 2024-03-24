import { User } from "../types"

export type UsersResponse = {
  nextCursor?: number,
  users: User[]
}

export async function fetchUsers ({ pageParam }: { pageParam: UsersResponse['nextCursor'] }): Promise<UsersResponse> {
  return await fetch(`https://randomuser.me/api/?results=5&seed=torodev&page=${pageParam}`)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error('An error occurs fectching users')
      }

      return await res.json()
    })
    .then(res => {
      const currentCursor = Number(res.info.page)
      const nextCursor = currentCursor > 2 ? undefined : currentCursor + 1
      return {
        users: res.results,
        nextCursor
      }
    })
}