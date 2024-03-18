import { type User } from '../types.d'

interface Props {
  deleteUser: (userToDelete: User) => void
  showColors: boolean,
  users: User[]
}

export function UserList ({ deleteUser, showColors, users }: Props) {
  

  return (
    <table width='100%'>
      <thead>
        <th>Photo</th>
        <th>Name</th>
        <th>Last Name</th>
        <th>Country</th>
        <th>Accions</th>
      </thead>
      <tbody>
        {
          users.map((user, index) => {
            const backgroundColor = index % 2 === 0 ? '#333' : '#555'
            const color = showColors ? backgroundColor : 'transparent'
            return (
              <tr key={user.login.uuid} style={{ backgroundColor: color }}>
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
                  <button onClick={() => deleteUser(user) }>Delete</button>
                </td>
              </tr>
            )
          })}

      </tbody>
    </table>
  )
}
