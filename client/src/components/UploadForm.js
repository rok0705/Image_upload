import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./ProgressBar";

const UploadForm = () => {
  const defaultFileName = "이미지 파일을 업로드해주세요.";
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(defaultFileName);
  const [percent, setPercent] = useState(0);

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
        onUploadProgress: (ProgressEvent) => {
          setPercent(
            Math.round((100 * ProgressEvent.loaded) / ProgressEvent.total)
          );
        },
      });
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
      }, 6000);
      toast.success("Image upload success!");
    } catch (err) {
      setPercent(0);
      setFileName(defaultFileName);
      toast.error("Image upload error!");
    }
  };

  return (
    <div>
      <form onSubmit={(event) => onSubmit(event)}>
        <ProgressBar percent={percent} />
        <div className="file-dropper">
          {fileName}
          <input
            id="image"
            type="file"
            onChange={(event) => imageSelectHandler(event)}
          ></input>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            height: 40,
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          제출
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
