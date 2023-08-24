import React from 'react'
import { useContextComp } from './MyContext'
import { Navigate, Outlet } from 'react-router'
import Loading from './Loading'
import ChatHolder from '../components/Chat/ChatHolder'

const Protected = () => {
  const {user, loading} = useContextComp()
  
  return (
      loading ? <Loading /> : user.email ? (<><Outlet/><ChatHolder /></>) : <Navigate to="/login"/> 
  )
}

export default Protected
