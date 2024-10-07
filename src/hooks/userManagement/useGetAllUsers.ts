import { useLazyGetAllUsersQuery } from "../../redux/api/userManagementSlice";
import { useDispatch } from "react-redux";
import { setUsers } from "../../redux/slices/users";

const useGetAllUsers = () => {

  const [trigger, { data, error, isLoading }] = useLazyGetAllUsersQuery();


  const dispatch = useDispatch();

  const fetchUsers = async (meta) => {
    try {
      const response = await trigger(meta);
      if (response?.data) {
        console.log(response.data);
        dispatch(setUsers(response.data.data));
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  return {
    fetchUsers,
    data,
    error,
    isLoading
  };
};

export default useGetAllUsers;
