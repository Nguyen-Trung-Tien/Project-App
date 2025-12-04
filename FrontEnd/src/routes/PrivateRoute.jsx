import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { Spinner } from "react-bootstrap";

const PrivateRoute = ({ requiredRole }) => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const verifyToken = () => {
      if (!user || !token) {
        setValid(false);
        setChecking(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;

        if (requiredRole && user.role !== requiredRole) {
          setValid(false);
        } else if (!isExpired) {
          setValid(true);
        } else {
          setValid(true);
        }
      } catch (err) {
        console.error("Token decode error:", err);
        setValid(false);
      } finally {
        setChecking(false);
      }
    };

    verifyToken();
  }, [user, token, requiredRole]);

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-muted">
        <div className="text-center">
          <Spinner animation="border" size="sm" variant="primary" />
          <p>Đang xác thực phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <Navigate
        to={requiredRole === "admin" ? "/admin/login" : "/login"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
