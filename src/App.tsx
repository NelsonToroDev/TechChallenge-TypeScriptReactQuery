import { useEffect, useState, useRef } from 'react'
import './App.css'
import { UserList } from './components/userLists';
import { User } from './types';

function App () {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sortByCountry, setSortByCountry] = useState(false);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  // UseRef keeps its Value between renderings and when Its value will be changed no new rendering will be fired
  const originalUsers = useRef<User[]>([]);

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
        originalUsers.current = res.results
      })
      .catch(err => console.log(err));

    return
  }, [])

  const toggleShowColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    setSortByCountry(prevState => !prevState)
  }

  const filteredUsers = filterCountry != null && filterCountry.length > 0
    ? users.filter(user => {
    return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
    })
    : users

  // sort function change the original array
  // toSorted function copy to new array and sort it before return, the original was not mutated
  const sortedUsers = sortByCountry ? filteredUsers.toSorted((a, b) => {
    return a.location.country.localeCompare(b.location.country)
  }) : filteredUsers

  const handleDeleteUser = (userToDelete: User) => {
    const filteredUsers = users.filter(user => user.login.uuid !== userToDelete.login.uuid)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  return (
    <div className='App'>
      <h1>React Technical Challenge</h1>
      <header>
        <button
          onClick={toggleShowColors}>Show Colors</button>
        <button onClick={toggleSortByCountry}>
          {sortByCountry ? 'Disable Sort by Country' : 'Enable Sort by Country'}
        </button>
        <button
          onClick={handleReset}>Reset</button>
        <input placeholder='Filter by country' onChange={(e) => { setFilterCountry(e.target.value) }} />
      </header>
      <main>
        <UserList deleteUser={handleDeleteUser} showColors={showColors} users={sortedUsers} />
      </main>
    </div>
  )
}

export default App

