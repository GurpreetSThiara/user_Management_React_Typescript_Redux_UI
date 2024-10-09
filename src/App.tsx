import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './App.css';
import { useVerifyAccessTokenMutation } from "./redux/api/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/slices/userSlice";
import { RootState } from "./redux/store";

const App = () => {
  const [verifyAccessToken] = useVerifyAccessTokenMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRef = useSelector((state:RootState) => state.user); // Get the current user from Redux store
  const user = userRef?.user

  useEffect(() => {
    const authenticateUsingToken = async () => {
      if (!user) { // Only call API if user is not already set
        try {
          const res = await verifyAccessToken({});
          dispatch(setUser(res.data.data));
          console.log("User set successfully");
        } catch (error) {
          console.error("Error verifying token:", error);
        }
      } else {
        console.log("User already authenticated, skipping API call");
      }
    };

    authenticateUsingToken();
  }, [user, dispatch, verifyAccessToken]); // Add user as a dependency

  return (
    <div className="bg-transparent">
      <main className="bg-transparent">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
