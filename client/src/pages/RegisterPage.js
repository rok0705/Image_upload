import React, { useState, useContext } from "react";
import CustomInput from "./../components/CustomInput";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [me, setMe] = useContext(AuthContext);

  const submitHandler = async (event) => {
    try {
      event.preventDefault();
      if (userName.length < 3)
        throw Error("userName length must be longer than 2.");
      if (password.length < 6)
        throw Error("password length must be longer than 5.");
      if (password !== passwordCheck)
        throw Error("password and passwordcheck does not match.");

      const response = await axios.post("/users/register", {
        name,
        userName,
        password,
      });

      setMe({
        userId: response.data.userId,
        sessionId: response.data.sessionId,
        name: response.data.name,
      });
      console.log(response);
      toast.success("New user registered successfully.");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
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
      <h3>Register</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label="Name" value={name} setValue={setName} />
        <CustomInput label="userName" value={userName} setValue={setUserName} />
        <CustomInput
          label="password"
          value={password}
          setValue={setPassword}
          type="password"
        />
        <CustomInput
          label="passwordCheck"
          value={passwordCheck}
          setValue={setPasswordCheck}
          type="password"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
