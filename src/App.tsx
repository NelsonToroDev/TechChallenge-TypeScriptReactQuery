import { useEffect, useState, useRef, useMemo } from 'react'
import './App.css'
import { UserList } from './components/userLists'
import { SortBy, type User } from './types.d'
import { QueryClient, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUsers } from './hooks/useUsers'
import { Results } from './components/Results'

function App () {


  const {
    isLoading,
    isError,
    users,
    refetch,
    fetchNextPage,
    hasNextPage
  } = useUsers()



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

  const queryClient = useQueryClient()
  const delay = async (ms: number) => await new Promise(resolve => setTimeout(resolve, ms))

  const deleteUser = async (userToDelete: User) => {
    console.log(`Deleting user: ${userToDelete.name.first}`)
    
    // await delay(100)
    // throw new Error('Force to undo the optimistic delete')
  }

  const { mutate, isPending: isLoadingMutation } = useMutation({
    mutationFn: deleteUser,
    onMutate: async (userToDelete) => {
      await queryClient.cancelQueries({
        queryKey: ['users']
      })

      const previousUsers = queryClient.getQueryData(['users'])
      if (userToDelete == null) return { previousUsers }

      queryClient.setQueryData(['users'], (oldUsers) => {
        const pages = oldUsers.pages.map(page => {
          return { ...page, users: page.users.filter(user => user.login.uuid !== userToDelete.login.uuid) }
        })
        
        return { pages: pages, pageParams: oldUsers.pageParams }
      })

      return { previousUsers }
    },
    onError: (context, error) => {
      if (context?.previousUsers != null) {
        queryClient.setQueriesData(['users'], context.previousUsers)
      }
    },
    onSettled: async () => {
      // await queryClient.invalidateQueries({
      //   queryKey: ['users']
      // })
    }
  })

  const handleDeleteUser = (userToDelete: User) => {
    
    //if (isLoadingMutation) return
    mutate(userToDelete)
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
      <Results />
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

        {!isLoading && !isError && users.length === 0 && <strong>There are not more users</strong>}

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
