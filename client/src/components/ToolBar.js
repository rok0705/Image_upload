import React from "react";
import { Link } from "react-router-dom";

const ToolBar = () => {
  return (
    <div>
      <span>Home</span>
      <Link to="http://localhost:3000/auth/login">
        <span style={{ float: "right" }}>Login</span>
      </Link>
      <Link to="http://localhost:3000/auth/register">
        <span style={{ float: "right", marginRight: 15 }}>Register</span>
      </Link>
    </div>
  );
};

export default ToolBar;
