import { memo } from "react"
import UserstableItem from "./UserstableItem"

const Userstable = ({filteredUsers , handleEditUser,selectedFeilds}) => {

    console.log("users table rendered")
    return     (
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
    {selectedFeilds.first_name && (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
    )}
    {selectedFeilds.email && (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
    )}
    {selectedFeilds.role && (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
    )}
    {selectedFeilds.status && (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
    )}
    {selectedFeilds.createdAt && (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created At</th>
    )}
    {selectedFeilds.updatedAt && (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Updated At</th>
    )}
    {selectedFeilds.lastLogin && (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Last Login</th>
    )}
    {selectedFeilds.username && (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Username</th>
    )}
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
</tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map(user => (
               <UserstableItem  key={user._id} user={user} handleEditUser={handleEditUser} handleDeleteUser={()=>{}} selectedFeilds={selectedFeilds}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )
  }
 

  export default memo(Userstable)