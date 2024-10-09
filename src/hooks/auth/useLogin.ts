import { AppDispatch } from './../../redux/store';
import { useLoginMutation } from "../../redux/api/authSlice";
import { setUser } from "../../redux/slices/userSlice";
import { useDispatch } from 'react-redux';
import { UserProfile } from '../../types/userTypes';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (credentials: { username: string; password: string }) => {
        try {
            const userData = await login(credentials).unwrap();
            console.log(userData)
            const user: UserProfile = userData.data.user;
            dispatch(setUser(user));
            console.log(user)
            navigate('/')
            return userData;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    return { handleLogin, isLoading, isError, error };
};

export default useLogin;
