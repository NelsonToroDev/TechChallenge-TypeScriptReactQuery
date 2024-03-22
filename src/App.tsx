import { useEffect, useState, useRef, useMemo } from 'react'
import './App.css'
import { UserList } from './components/userLists'
import { SortBy, type User } from './types.d'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [filterCriteria, setFilterCriteria] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [enableSorting, setEnableSorting] = useState(false)
  const prevSorting = useRef<SortBy>(SortBy.COUNTRY) // It cannot be None

  // UseRef keeps its Value between renderings and when Its value will be changed no new rendering will be fired
  const originalUsers = useRef<User[]>([])

  useEffect(() => {
    setLoading(true)
    setError(false)

    fetch('https://randomuser.me/api/?results=10')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('An error occurs fectching users')
        }

        return await res.json()
      })
      .then(json => {
        setUsers(json.results)
        originalUsers.current = json.results
        setError(false)
      })
      .catch(err => {
        setError(true)
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })

  }, [])

  const toggleShowColors = () => {
    setShowColors(!showColors)
  }

  const filteredUsers = useMemo(() => {
    // console.log('Calculating filteredUsers')
    return filterCriteria != null && filterCriteria.length > 0
      ? users.filter(user => {
        return user.location.country.toLowerCase().includes(filterCriteria.toLowerCase())
      })
      : users
  }, [users, filterCriteria])

  const handleChangeSorting = (sortingCriteria: SortBy) => {
    const newCriteria = sortingCriteria !== prevSorting.current

    if (newCriteria) {
      prevSorting.current = sortingCriteria
      setEnableSorting(true)
      applySorting()
    } else {
      setEnableSorting(!enableSorting)
    }
  }

  useEffect(() => {
    applySorting()
  }, [enableSorting])

  const applySorting = () => {
    if (enableSorting) {
      setSorting(prevSorting.current)
    } else {
      setSorting(SortBy.NONE)
    }
  }

  const toggleEnableSorting = () => {
    setEnableSorting(!enableSorting)
  }

  // sort function change the original array
  // toSorted function copy to new array and sort it before return, the original was not mutated
  const sortedUsers = useMemo(() => {
    // console.log('Calculating sortedUsers')
    if (sorting === SortBy.NONE) return filteredUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
      [SortBy.COUNTRY]: user => user.location.country
    }

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })
  }, [filteredUsers, sorting])

  const handleDeleteUser = (userToDelete: User) => {
    const filteredUsers = users.filter(user => user.login.uuid !== userToDelete.login.uuid)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
    setShowColors(false)
    setEnableSorting(false)
    setSorting(SortBy.NONE)
    setFilterCriteria('')
  }

  const handleClearFilter = () => {
    setFilterCriteria('')
  }

  return (
    <div className='App'>
      <h1>React Technical Challenge</h1>
      <header>
        <button
          onClick={toggleShowColors}
        >Show Colors
        </button>
        <button onClick={toggleEnableSorting}>
          {sorting !== SortBy.NONE ? `Disable Sort by ${prevSorting.current}` : `Enable Sort by ${prevSorting.current}`}
        </button>
        <button
          onClick={handleReset}
        >Reset
        </button>
        <input placeholder='Filter by country' onChange={(e) => { setFilterCriteria(e.target.value) }} value={filterCriteria === null ? '' : filterCriteria} />
        <button
          onClick={handleClearFilter}
        >Clear Filter
        </button>
      </header>
      <main>
        {loading && <strong>Loading...</strong>}
        
        {!loading && error && <strong>An error occurs</strong>}
        
        {!loading && !error && users.length === 0 && <strong>There are not users</strong>}
        
        {!loading && !error && users.length > 0
          && <UserList
          changeSorting={handleChangeSorting}
          deleteUser={handleDeleteUser} 
          showColors={showColors}
          users={sortedUsers} />
        }
      </main>
    </div>
  )
}

export default App
