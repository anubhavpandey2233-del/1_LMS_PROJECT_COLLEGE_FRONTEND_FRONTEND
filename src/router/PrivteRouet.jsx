import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { CheackAuth } from "../redux/slice/auth.slice";

function PrivteRouet() {
  const auth = localStorage.getItem("checkauth");

  const userdata = auth != 'undefined' ? JSON.parse(auth) : null;

  console.log("checklogin", auth, userdata);

  if (userdata) {
    if (userdata.role === "Instructor" || userdata.role === "admin") {
      return <Outlet />;
    } else {
      return <Navigate to="/" />;
    }
  } else {
    return <Navigate to="/auth/instructor" />
  }

  // return (
  //   <div>
  //     auth ? <Outlet /> : <Navigate to="/auth" />
  //   </div>
  // );
}

export default PrivteRouet;
