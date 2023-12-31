import React from "react";

const CustomInput = ({ label, value, setValue, type = "text" }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        style={{ width: "100%" }}
        value={value}
        type={type}
        onChange={(event) => setValue(event.target.value)}
      ></input>
    </div>
  );
};

export default CustomInput;
