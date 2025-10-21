import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { removeUser } from "../redux/userSlice";

const PrivateRoute = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  if (!user || !token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      dispatch(removeUser());
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    console.log(err);
    dispatch(removeUser());
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
