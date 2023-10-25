import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);

  const logoutHandler = async (event) => {
    try {
      await axios.patch("/users/logout");
      setMe();
      toast.success("logout success.");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    setMe(null);
  };

  return (
    <div>
      <Link to="/">
        <span>Home</span>
      </Link>
      {me ? (
        <>
          <span onClick={logoutHandler} style={{ float: "right" }}>
            Logout ({me.name})
          </span>
        </>
      ) : (
        <>
          <Link to="http://localhost:3000/auth/login">
            <span style={{ float: "right" }}>Login</span>
          </Link>
          <Link to="http://localhost:3000/auth/register">
            <span style={{ float: "right", marginRight: 15 }}>Register</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default ToolBar;
