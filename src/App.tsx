import { useEffect, useState } from 'react'
import './App.css'
import { UserList } from './components/userLists';



function App () {
  const [users, setUsers] = useState([]);
  const [showColors, setShowColors] = useState(false);

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

  function toggleShowColors () {
    setShowColors(!showColors)
  }

  return (
    <div className='App'>
      <h1>React Technical Challenge</h1>
      <header>
        <button onClick={toggleShowColors}>Show Colors</button>
      </header>
      <main>
        <UserList showColors={showColors} users={users} />
      </main>
    </div>
  )
}

export default App
