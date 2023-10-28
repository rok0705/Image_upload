import React, { useState, useContext } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const defaultFileName = "이미지 파일을 업로드해주세요.";
  const [files, setFiles] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [fileName, setFileName] = useState(defaultFileName);
  const [percent, setPercent] = useState(0);
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const [isPublic, setIsPublic] = useState(true);

  const imageSelectHandler = (event) => {
    const imageFiles = event.target.files;
    setFiles(imageFiles);
    const imageFile = imageFiles[0];
    setFileName(imageFile.name);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (event) => setImgSrc(event.target.result);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    for (let file of files) formData.append("image", file);
    formData.append("public", isPublic);
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
      }, 3000);
      toast.success("image upload success.");
      if (isPublic) setImages([...images, ...res.data]);
      else setMyImages([...myImages, ...res.data]);
    } catch (err) {
      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div>
      <form onSubmit={(event) => onSubmit(event)}>
        <img
          alt=""
          src={imgSrc}
          className={`image-preview ${imgSrc ? "image-preview-show" : ""}`}
        />
        <ProgressBar percent={percent} />
        <div className="file-dropper">
          {fileName}
          <input
            id="image"
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => imageSelectHandler(event)}
          ></input>
        </div>
        <input
          type="checkbox"
          id="public-check"
          value={!isPublic}
          onChange={() => setIsPublic(!isPublic)}
        ></input>
        <label htmlFor="public-check">비공개</label>
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
