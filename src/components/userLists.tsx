import { type User } from '../types.d'

interface Props {
  users: User[]
}

export function UserList ({ users }: Props) {
  return (
    <table>
      <thead>
        <th>Photo</th>
        <th>Name</th>
        <th>Last Name</th>
        <th>Country</th>
        <th>Accions</th>
      </thead>
      <tbody>
        {users.map(user => {
          return (
            <tr key={user.id.value}>
              <td>
                <img src={user.picture.thumbnail}></img>
              </td>
              <td>
                {user.name.first}
              </td>
              <td>
                {user.name.last}
              </td>
              <td>
                {user.location.country}
              </td>
              <td>
                <button>Delete</button>
              </td>
            </tr>
          )
        })}

      </tbody>
    </table>
  )
}
