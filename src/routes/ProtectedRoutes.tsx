import { Navigate, Outlet } from "react-router-dom";
import { User } from "../types/userTypes";
import { useAppSelector } from "../hooks/hooks";
import { useEffect, useState } from "react";
import LayoutLoader from "../components/LayoutLoader/LayoutLoader";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ProtectedRoutes: React.FC = () => {
  const user= useSelector((state:RootState) => state.user);
  console.log("User:", user);

  useEffect(()=>{
    console.log("user :"+ JSON.stringify(user))
    console.log("user :"+ JSON.stringify(user.user))
  },[user])


  if (!user) {
    return <Navigate to={'/auth'} />;
  }

  return <div>{<Outlet />}</div>;
};

export default ProtectedRoutes;
