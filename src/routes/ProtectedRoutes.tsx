import { Navigate, Outlet } from "react-router-dom";
import { User } from "../types/userTypes";
import { useAppSelector } from "../hooks/hooks";
import { useEffect, useState } from "react";
import LayoutLoader from "../components/LayoutLoader/LayoutLoader";

const ProtectedRoutes: React.FC = () => {
  const user: User = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LayoutLoader/>;
  }

  if (!user) {
    return <Navigate to={'/auth'} />;
  }

  return <div>{<Outlet />}</div>;
};

export default ProtectedRoutes;
