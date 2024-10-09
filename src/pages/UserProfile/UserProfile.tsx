import React from 'react';
import { useGetUserByUsernameQuery } from '../../redux/api/userManagementSlice';
import { useParams } from 'react-router-dom';
import LayoutLoader from '../../components/LayoutLoader/LayoutLoader';


interface UserProfile {
  settings: {
    notifications: {
      email_notifications: boolean;
      sms_notifications: boolean;
    };
    visibility: string;
  };
  status: string;
  _id: string;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  experience: any[];
  education: any[];
  skills: string[];
  connections: string[];
  connection_requests: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// const userProfileData: UserProfile = {
//   "settings": {
//     "notifications": {
//       "email_notifications": true,
//       "sms_notifications": false
//     },
//     "visibility": "public"
//   },
//   "status": "ACTIVE",
//   "_id": "6703c565234447f24a3baa5c",
//   "role": "USER",
//   "first_name": "chris",
//   "last_name": "martin",
//   "email": "chris@peoples.com",
//   "username": "chris",
//   "experience": [],
//   "education": [],
//   "skills": [],
//   "connections": [],
//   "connection_requests": [],
//   "createdAt": "2024-10-07T11:26:29.616Z",
//   "updatedAt": "2024-10-07T11:26:29.616Z",
//   "__v": 0
// };

const UserProfilePage: React.FC = () => {
    const { username } = useParams<{ username: string }>(); 
    const { data, isLoading: userLoading ,error} = useGetUserByUsernameQuery(username, { skip: !username }); // Query by username//   const formatDate = (dateString: string) => {
    const userProfileData = data?.data?.user;
   console.log(userProfileData)
   console.log(userProfileData)


  const renderValue = (value: any): React.ReactNode => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      return value.length === 0 ? 'None' : value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).map(([key, val]) => (
        <div key={key} className="ml-4">
          <span className="font-medium">{key.replace(/_/g, ' ')}:</span> {renderValue(val)}
        </div>
      ));
    }
    return value.toString();
  };

  if(userLoading){
    return <LayoutLoader/>
  }

  if(error){
    return <div className="">{JSON.stringify(error)}</div>
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-2xl leading-6 font-semibold text-gray-900">
              User Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and application.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userProfileData.first_name} {userProfileData.last_name}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userProfileData.username}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userProfileData.email}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userProfileData.role}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {userProfileData.status}
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Settings</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {renderValue(userProfileData.settings)}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Experience</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userProfileData.experience.length === 0 ? 'No experience listed' : renderValue(userProfileData.experience)}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Education</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userProfileData.education.length === 0 ? 'No education listed' : renderValue(userProfileData.education)}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Skills</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userProfileData.skills.length === 0 ? 'No skills listed' : renderValue(userProfileData.skills)}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Connections</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userProfileData.connections.length} connections, {userProfileData.connection_requests.length} pending requests
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Account created</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(userProfileData.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last updated</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(userProfileData.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;