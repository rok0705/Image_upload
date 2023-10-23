import React, { useState } from "react";
import CustomInput from "./../components/CustomInput";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

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
      <form>
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
      </form>
    </div>
  );
};

export default RegisterPage;
