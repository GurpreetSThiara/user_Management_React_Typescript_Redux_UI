import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom';



const UserstableItem = ({user , handleEditUser , handleDeleteUser,selectedFeilds}) => {
    console.log("user item rendered with id: " + user._id );
    const navigate = useNavigate();

  return (
   
    <tr key={user._id}>
    {selectedFeilds.first_name && (
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <img className="h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`} alt="" />
                <div className="ml-4 text-sm font-medium text-gray-900 dark:text-white">
                    {user.first_name} {user.last_name}
                </div>
            </div>
        </td>
    )}
    {selectedFeilds.email && (
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
        </td>
    )}
    {selectedFeilds.role && (
        <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {user.role}
            </span>
        </td>
    )}
    {selectedFeilds.status && (
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {user.status}
            </span>
        </td>
    )}
    {selectedFeilds.createdAt && (
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</div>
        </td>
    )}
    {selectedFeilds.updatedAt && (
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">{new Date(user.updatedAt).toLocaleDateString()}</div>
        </td>
    )}
    {selectedFeilds.lastLogin && (
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">{new Date(user.lastLogin).toLocaleDateString()}</div>
        </td>
    )}
    {selectedFeilds.username && (
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900 dark:text-white">{user.username}</div>
        </td>
    )}
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button onClick={() => handleEditUser(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
        <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900  mr-4">Delete</button>
        <button onClick={() => navigate(`/user/${user.username}`)} className="text-indigo-600 hover:text-indigo-900">More</button>

    </td>
</tr>
  )
}

export default memo(UserstableItem)