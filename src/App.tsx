import { useEffect, useState } from 'react'
import './App.css'
import { UserList } from './components/userLists';



function App () {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=100")
      .then(async (res) => {
        if (await (res.status !== 200)) {
          throw new Error("An error occurs fectching users")
        }

        return res.json()
      })
      .then(res => {
        setUsers(res.results)
      })
      .catch(err => console.log(err));

    return 
  }, [])

  return (
    <div className='App'>
      <h1>Technical Challenge</h1>
      <UserList users={users} />
    </div>
  )
}

export default App
