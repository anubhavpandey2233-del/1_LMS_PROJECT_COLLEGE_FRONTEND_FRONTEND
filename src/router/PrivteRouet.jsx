

import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheackAuth } from "../redux/slice/auth.slice";

function PrivteRouet() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    dispatch(CheackAuth()).finally(() => {
      setChecking(false);
    });
  }, [dispatch]);

  if (checking || isLoading) {
    return <div>Checking authentication...</div>;
  }

  const userdata = user?.data?.data ?? user?.data ?? user;
  const role = String(userdata?.role || "").trim().toLowerCase();

  if (!userdata || !role) {
    return <Navigate to="/auth/instructor" replace />;
  }

  if (["admin", "instructor", "teacher"].includes(role)) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
}

export default PrivteRouet;





// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// function PrivteRouet() {
//   const auth = localStorage.getItem("checkauth");

//   let userdata = null;

//   try {
//     userdata = auth && auth !== "undefined" ? JSON.parse(auth) : null;
//   } catch {
//     userdata = null;
//   }

//   // Redux/API response mein data nested ho sakta hai
//   userdata = userdata?.data ?? userdata;

//   const role = String(userdata?.role || "").trim().toLowerCase();

//   if (!userdata) {
//     return <Navigate to="/auth/instructor" replace />;
//   }

//   if (role === "admin" || role === "instructor" || role === "teacher") {
//     return <Outlet />;
//   }

//   return <Navigate to="/" replace />;
// }

// export default PrivteRouet;