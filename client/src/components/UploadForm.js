import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./ProgressBar";

const UploadForm = () => {
  const defaultFileName = "이미지 파일을 업로드해주세요.";
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [fileName, setFileName] = useState(defaultFileName);
  const [percent, setPercent] = useState(0);

  const imageSelectHandler = (event) => {
    const imageFile = event.target.files[0];
    console.log("file:", imageFile);
    setFileName(imageFile.name);
    setFile(imageFile);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (event) => setImgSrc(event.target.result);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("/images", formData, {
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
        setImgSrc(null);
      }, 6000);
      toast.success("Image upload success!");
    } catch (err) {
      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);
      toast.error("Image upload error!");
    }
  };

  return (
    <div>
      <form onSubmit={(event) => onSubmit(event)}>
        <img
          src={imgSrc}
          className={`image-preview ${imgSrc ? "image-preview-show" : ""}`}
        />
        <ProgressBar percent={percent} />
        <div className="file-dropper">
          {fileName}
          <input
            id="image"
            type="file"
            accept="image/*"
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
