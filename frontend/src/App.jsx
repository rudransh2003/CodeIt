import React, { useEffect, useContext } from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider, UserContext } from './context/user.context'
import ToastProvider from './components/ToastProvider'

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
      <ToastProvider />
      <Wrapper />
    </UserProvider>
  )
}

export default App