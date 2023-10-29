import React, { useState, useContext } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const [files, setFiles] = useState(null);
  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [previews, setPreviews] = useState([]);
  const { setImages, setMyImages } = useContext(ImageContext);

  const imageSelectHandler = async (event) => {
    const imageFiles = event.target.files;
    setFiles(imageFiles);

    console.log([...imageFiles]);
    const imagePreviews = await Promise.all(
      [...imageFiles].map((imageFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onload = (event) =>
              resolve({
                imgSrc: event.target.result,
                fileName: imageFile.name,
              });
          } catch (err) {
            reject(err);
          }
        });
      })
    );

    setPreviews(imagePreviews);
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
      if (isPublic) setImages((prevData) => [...res.data, ...prevData]);
      setMyImages((prevData) => [...res.data, ...prevData]);
      toast.success("image upload success.");
      setTimeout(() => {
        setPercent(0);
        setPreviews([]);
      }, 3000);
    } catch (err) {
      setPercent(0);
      setPreviews([]);
      toast.error(err.response.data.message);
    }
  };

  const previewImages = previews.map((preview, index) => (
    <img
      style={{ width: 200, height: 200, objectFit: "cover" }}
      key={index}
      alt=""
      src={preview.imgSrc}
      className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
    ></img>
  ));

  const fileName =
    previews.length === 0
      ? "이미지 파일을 업로드 해주세요."
      : previews.reduce(
          (previous, current) => previous + `${current.fileName},`,
          ""
        );

  return (
    <div>
      <form onSubmit={(event) => onSubmit(event)}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>{previewImages}</div>
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
