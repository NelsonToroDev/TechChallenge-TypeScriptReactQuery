import { useEffect, useState, useRef, useMemo } from 'react'
import './App.css'
import { UserList } from './components/userLists'
import { SortBy, type User } from './types.d'
import { useInfiniteQuery } from '@tanstack/react-query'

/**
 * 
 * @returns (property) queryFn?: unique symbol | QueryFunction<{
    users: User[];
    nextCursor?: number | undefined;
}, QueryKey, unknown> | undefined
 */

type UsersResponse = {
  nextCursor?: number,
  users: User[]
}

async function fetchUsers ({ pageParam }: { pageParam: UsersResponse['nextCursor'] }): Promise<UsersResponse> {
  return await fetch(`https://randomuser.me/api/?results=10&seed=torodev&page=${pageParam}`)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error('An error occurs fectching users')
      }

      return await res.json()
    })
    .then(res => {
      const currentCursor = Number(res.info.page)
      const nextCursor = currentCursor > 3 ? undefined : currentCursor + 1
      return {
        users: res.results,
        nextCursor
      }
    })
}


function App () {
  const {
    isLoading,
    isError,
    data,
    refetch,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery
      ({
        queryKey: ['users'],  // Key of the query
        queryFn: fetchUsers,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextCursor
      })

  const users: User[] = data?.pages?.flatMap(page => page.users) ?? []

  const [showColors, setShowColors] = useState(false)
  const [filterCriteria, setFilterCriteria] = useState<string | null>(null)

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [enableSorting, setEnableSorting] = useState(false)
  const prevSorting = useRef<SortBy>(SortBy.COUNTRY) // It cannot be None

  // UseRef keeps its Value between renderings and when Its value will be changed no new rendering will be fired
  //const originalUsers = useRef<User[]>([])

  const toggleShowColors = () => {
    setShowColors(!showColors)
  }

  const filteredUsers = useMemo(() => {
    //console.log('Calculating filteredUsers')
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
    //setUsers(filteredUsers)
  }

  const handleReset = async () => {
    //setUsers(originalUsers.current)
    await refetch()
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
        {users.length > 0
          && <UserList
            changeSorting={handleChangeSorting}
            deleteUser={handleDeleteUser}
            showColors={showColors}
            users={sortedUsers} />
        }

        {isLoading && <strong>Loading...</strong>}

        {isError && <strong>An error occurs</strong>}

        {!isLoading && !isError && users.length === 0 && <strong>There are not users</strong>}

        {!isLoading && !isError && users.length > 0 && hasNextPage
          && < button onClick={() => fetchNextPage()}>Load more users</button>
        }

        {!isLoading && !isError && !hasNextPage
          && <strong>No more users</strong>
        }
      </main>
    </div>
  )
}

export default App
