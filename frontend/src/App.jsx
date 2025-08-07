import React, { useEffect, useContext } from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider, UserContext } from './context/user.context'

const Wrapper = () => {
  const { setUser } = useContext(UserContext)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return <AppRoutes />
}

const App = () => {
  return (
    <UserProvider>
      <Wrapper />
    </UserProvider>
  )
}

export default App
