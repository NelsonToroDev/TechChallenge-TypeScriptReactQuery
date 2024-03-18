import { useEffect, useState, useRef } from 'react'
import './App.css'
import { UserList } from './components/userLists';
import { User } from './types';

function App () {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sortByCountry, setSortByCountry] = useState(false);

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

  // sort function change the original array
  // toSorted copy the array the sort it before return the new array, the original was not mutated
  const sortedUsers = sortByCountry ? users.toSorted((a, b) => {
    return a.location.country.localeCompare(b.location.country)
  }) : users

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
      </header>
      <main>
        <UserList deleteUser={handleDeleteUser} showColors={showColors} users={sortedUsers} />
      </main>
    </div>
  )
}

export default App

