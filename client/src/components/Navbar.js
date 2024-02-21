import React from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  const { logout } = props
  return (
    <div className="navbar">
      <Link className="profile" to="/profile">Profile</Link>
      <button className="logoutBtn" onClick={logout}>Logout</button>
    </div>
  );
}
