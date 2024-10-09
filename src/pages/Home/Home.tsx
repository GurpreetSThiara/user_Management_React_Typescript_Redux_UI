import React from 'react'
import UserManagementTable from '../../Widgets/Table/UserManagementTable'
import Schemas from '../schemas/Schemas'

const Home = () => {
  return (
    <div>
      <UserManagementTable/>
      <Schemas/>
    </div>
  )
}

export default Home