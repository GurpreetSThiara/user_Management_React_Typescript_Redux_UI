import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import pagination from "../../components/pagination/pagination";
import useGetAllUsers from "../../hooks/userManagement/useGetAllUsers";
import { RootState } from "../../redux/store";
import { UserProfile } from "../../types/userTypes";
import LayoutLoader from "../../components/LayoutLoader/LayoutLoader";
import Header from "../../components/header/Header";
import UsersTable from "../../components/tables/UsersTable/UsersTable";
import Modal from "../../components/Modal/Modal";
import UserForm from "../../components/form/AddEditUserForm/AddEditUserForm";
import { TableFieldSelector } from "../../components/tables/UsersTable/TableFeildSelector";
import { useNavigate } from "react-router-dom";

const MemoizedPagination = memo(pagination);

const UserManagementTable: React.FC = memo(() => {
  const { fetchUsers, data, error, isLoading } = useGetAllUsers();
  const { users, meta } = useSelector((state: RootState) => state.users);

  const [filUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeildsModalOpen, setIsFeildsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [dmode, setDarkMode] = useState(false);

  const availableFields = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'updatedAt', label: 'Updated At' },
    { key: 'lastLogin', label: 'Last Login' },
    { key: 'username', label: 'Username' },
  ];

  const [selectedFeilds, setSelectedFeilds] = useState({
    first_name: true,
    email: true,
    last_name: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    lastLogin: true,
    username: true,
  });
  const darkMode = useMemo(() => {
    return dmode;
  }, [dmode]);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });

  const filteredUsers = useMemo(() => {
    return filUsers;
  }, [filUsers]);

  useEffect(() => {
    fetchUsers({ page: paginationInfo.currentPage, limit: 5 });
  }, [paginationInfo.currentPage]);

  useEffect(() => {
    if (meta) {
      setFilteredUsers(users || []);
      setPaginationInfo({
        currentPage: meta.currentPage,
        totalPages: meta.totalPages,
        totalUsers: meta.totalUsers,
      });
    }
  }, [meta]);

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

  const handleAddUser = useCallback(() => {
    setSelectedUser(null);
    setModalMode("add");
    setIsModalOpen(true);
  }, []);

  const handleEditUser = useCallback((user: UserProfile) => {
    setSelectedUser(user);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const handleSaveUser = useCallback((user: UserProfile) => {
    console.log("Save user:", user);
    setIsModalOpen(false);
    // Optionally refresh the users here
  }, []);

  const handleDeleteUser = useCallback((userId: string) => {
    console.log("Delete user:", userId);
    // Implement deletion logic here
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPaginationInfo((prev) => ({ ...prev, currentPage: newPage }));
  }, []);

  const handleSelectTableFeilds = () => {
    setIsFeildsModalOpen(true);
  };

  const paginationProps = useMemo(
    () => ({
      currentPage: paginationInfo.currentPage,
      totalPages: paginationInfo.totalPages,
      onPageChange: handlePageChange,
    }),
    [paginationInfo.currentPage, paginationInfo.totalPages, handlePageChange]
  );

  if (isLoading || !users || !meta) return <LayoutLoader />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? "dark" : ""}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-md border dark:bg-gray-700"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSelectTableFeilds}
              className="w-full sm:w-auto px-4 py-2 bg-white rounded-md"
            >
              Selected Feilds
            </button>
            <button
              onClick={handleAddUser}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Add New User
            </button>
          </div>{" "}
        </div>

        <UsersTable
          filteredUsers={filteredUsers}
          handleEditUser={handleEditUser}
          selectedFeilds={selectedFeilds}
        />
        <MemoizedPagination {...paginationProps} />
      </div>

      <Modal
        close={() => setIsModalOpen(false)}
        open={isModalOpen}
        modalMode={modalMode === "add" ? "Add New User" : "Edit User"}
      >
        <UserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        close={() => setIsFeildsModalOpen(false)}
        open={isFeildsModalOpen}
        modalMode={"Select Feilds to display"}
      >
        <TableFieldSelector selectedFields={selectedFeilds} setFields={setSelectedFeilds} availableFields={availableFields} />
      </Modal>
    </div>
  );
});

export default memo(UserManagementTable);
