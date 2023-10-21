import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("이미지 파일을 업로드해주세요.");

  const imageSelectHandler = (event) => {
    const imageFile = event.target.files[0];
    setFileName(imageFile.name);
    setFile(imageFile);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("res:", res);
    } catch (err) {
      console.error("err:", err);
    }
  };

  return (
    <div>
      <form onSubmit={(event) => onSubmit(event)}>
        <label htmlFor="image">{fileName}</label>
        <input
          id="image"
          type="file"
          onChange={(event) => imageSelectHandler(event)}
        ></input>
        <button type="submit">제출</button>
      </form>
    </div>
  );
};

export default UploadForm;
