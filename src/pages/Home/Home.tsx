import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LayoutLoader from "../../components/LayoutLoader/LayoutLoader";
import useGetAllUsers from "../../hooks/userManagement/useGetAllUsers";
import { UserProfile } from "../../types/userTypes";

interface Settings {
  darkMode: boolean;
  notificationsEnabled: boolean;
  language: "en" | "es" | "fr";
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

const UserManagementDashboard: React.FC = () => {
  const { fetchUsers, data, error, isLoading } = useGetAllUsers();
  
  const { users } = useSelector((state: RootState) => state.users);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    notificationsEnabled: true,
    language: "en",
  });
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchUsers({ page: paginationInfo.currentPage, limit: 5 });
  }, [paginationInfo.currentPage]);

  useEffect(() => {
    if (users) {
      const filtered = users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    // Implement delete functionality here
  };

  const handleSaveUser = (user: UserProfile) => {
    // Implement save functionality here
    setIsModalOpen(false);
  };

  const toggleDarkMode = () => {
    setSettings({ ...settings, darkMode: !settings.darkMode });
  };

  const handlePageChange = (newPage: number) => {
    setPaginationInfo((prev) => ({ ...prev, currentPage: newPage }));
  };

  if (users === null) {
    return <LayoutLoader />;
  }

  return (
    <div className={`min-h-screen p-4 ${settings.darkMode ? "dark" : ""}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">
            User Management Dashboard
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {settings.darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 mb-2 sm:mb-0"
          />
          <button
            onClick={handleAddUser}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Last Login</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {user.first_name} 
                  </td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-left">{user.role}</td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={`py-1 px-3 rounded-full text-xs ${
                        user.status === "Active"
                          ? "bg-green-200 text-green-600"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {user.lastLogin ? user.lastLogin.toString() : "Not available"}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={handlePageChange}
        />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 dark:text-white">
                {modalMode === "add" ? "Add User" : "Edit User"}
              </h2>
              <UserForm
                user={selectedUser}
                onSave={handleSaveUser}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Settings</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="mb-4">
              <label className="flex items-center dark:text-white">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      notificationsEnabled: !settings.notificationsEnabled,
                    })
                  }
                  className="mr-2"
                />
                Enable Notifications
              </label>
            </div>
            <div className="mb-4">
              <label className="block mb-2 dark:text-white">Language</label>
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    language: e.target.value as "en" | "es" | "fr",
                  })
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Premium Features
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg dark:border-gray-700">
                <h3 className="font-bold mb-2 dark:text-white">
                  Advanced Analytics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gain deeper insights into user behavior and trends.
                </p>
              </div>
              <div className="border p-4 rounded-lg dark:border-gray-700">
                <h3 className="font-bold mb-2 dark:text-white">Custom Roles</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create and manage custom user roles and permissions.
                </p>
              </div>
              <div className="border p-4 rounded-lg dark:border-gray-700">
                <h3 className="font-bold mb-2 dark:text-white">Audit Logs</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track all user actions and changes in the system.
                </p>
              </div>
              <div className="border p-4 rounded-lg dark:border-gray-700">
                <h3 className="font-bold mb-2 dark:text-white">
                  Bulk Operations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Perform actions on multiple users simultaneously.
                </p>
              </div>
            </div>
            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface UserFormProps {
  user: UserProfile | null;
  onSave: (user: UserProfile) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserProfile>(
    user || {
      _id: "",
      first_name: "",
      email: "",
      role: "User",
      status: "Active",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="first_name" className="block mb-1 dark:text-white">
          Name
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-1 dark:text-white">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>
      <div>
        <label htmlFor="role" className="block mb-1 dark:text-white">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="User">User</option>
        </select>
      </div>
      <div>
        <label htmlFor="status" className="block mb-1 dark:text-white">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4">
      <ul className="inline-flex -space-x-px">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`px-3 py-2 leading-tight ${
                currentPage === number
                  ? "text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default UserManagementDashboard;