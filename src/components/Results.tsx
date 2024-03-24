import { useUsers } from "../hooks/useUsers"

export const Results = () => {
  // already act as a global state because of the key query is the same and the data will be retrieved from cache
  const { users } = useUsers() 
  return <h3>Results: { users.length }</h3>
}