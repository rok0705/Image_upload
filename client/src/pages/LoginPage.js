import React, { useState, useContext } from "react";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [me, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const loginHandler = async (event) => {
    try {
      event.preventDefault();
      if (userName.length < 3 || password.length < 6)
        throw new Error("invalid information.");
      const response = await axios.patch("/users/login", {
        userName,
        password,
      });
      setMe({
        userId: response.data.userId,
        sessionId: response.data.sessionId,
        name: response.data.name,
      });
      navigate("/");
      toast.success("login success.");
    } catch (err) {
      console.error(err.response);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div
      style={{
        marginTop: 100,
        maxWidth: 350,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3>Login</h3>
      <form onSubmit={loginHandler}>
        <CustomInput
          label="name"
          value={userName}
          setValue={setUserName}
        ></CustomInput>
        <CustomInput
          label="password"
          value={password}
          setValue={setPassword}
          type="password"
        ></CustomInput>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
