import React, { useContext, useState } from "react";
import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);

  const imageList = (isPublic ? images : myImages).map((image) => (
    <img
      alt=""
      key={image.key}
      src={`http://localhost:5000/uploads/${image.key}`}
      style={{
        maxWidth: 600,
        margin: "auto",
      }}
    ></img>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        사진첩 ({isPublic ? "공개사진" : "개인사진"})
      </h3>
      <button onClick={() => setIsPublic(!isPublic)}>
        {(isPublic ? "개인" : "공개") + "사진 보기"}
      </button>
      {imageList}
    </div>
  );
};

export default ImageList;
