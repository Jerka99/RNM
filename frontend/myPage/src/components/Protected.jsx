import React from 'react'
import { useContextComp } from './MyContext'
import { Navigate, Outlet } from 'react-router'
import Loading from './Loading'
import Chat from './Chat'

const Protected = () => {
  const {user, loading} = useContextComp()
  
  return (
      loading ? <Loading /> : user.email ? (<><Outlet/><Chat /></>) : <Navigate to="/login"/> 
  )
}

export default Protected
