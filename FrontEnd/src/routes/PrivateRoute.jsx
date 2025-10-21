import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../utils/axiosClient";
import { updateToken, removeUser } from "../redux/userSlice";

const PrivateRoute = ({ requiredRole }) => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!user || !token) {
          setValid(false);
          return;
        }

        const decoded = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;

        if (requiredRole && user.role !== requiredRole) {
          setValid(false);
          return;
        }

        if (!isExpired) {
          setValid(true);
        } else {
          const res = await axiosClient.post(
            "/user/refresh-token",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const newToken = res.data?.data?.accessToken;

          if (newToken) {
            localStorage.setItem("accessToken", newToken);
            dispatch(updateToken(newToken));
            setValid(true);
          } else {
            dispatch(removeUser());
            setValid(false);
          }
        }
      } catch (err) {
        console.error("Token verify error:", err);
        dispatch(removeUser());
        setValid(false);
      } finally {
        setChecking(false);
      }
    };

    verifyToken();
  }, [user, token, dispatch, requiredRole]);

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-muted">
        <div className="text-center">
          <div className="spinner-border mb-3" />
          <p>Đang xác thực phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <Navigate
        to={requiredRole === "admin" ? "/admin/login-admin" : "/login"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
