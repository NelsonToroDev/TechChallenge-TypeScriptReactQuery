import { SortBy, type User } from '../types.d'

interface Props {
  changeSorting: (newSorting: SortBy) => void,
  deleteUser: (userToDelete: User) => void
  showColors: boolean,
  users: User[]
}

export function UserList ({ changeSorting, deleteUser, showColors, users }: Props) {


  return (
    <table width='100%'>
      <thead>
        <tr>
          <th >Photo</th>
          <th className='pointer' onClick={ () => changeSorting(SortBy.NAME)}>Name</th>
          <th className='pointer' onClick={ () => changeSorting(SortBy.LAST)}>Last Name</th>
          <th className='pointer' onClick={ () => changeSorting(SortBy.COUNTRY)}>Country</th>
          <th>Accions</th>
        </tr>
      </thead>
      <tbody className={ showColors ? 'table--showColors' : 'table'}>
        {
          users.map((user) => {
            return (
              <tr key={user.login.uuid}>
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
                  <button onClick={() => deleteUser(user)}>Delete</button>
                </td>
              </tr>
            )
          })}

      </tbody>
    </table>
  )
}
