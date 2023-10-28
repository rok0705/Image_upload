import React, { useContext } from "react";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";

const ImageList = () => {
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);
  const [me] = useContext(AuthContext);

  const imgList = (isPublic ? images : myImages).map((image) => (
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
        Image List ({isPublic ? "공개 사진" : "개인 사진"})
      </h3>
      {me && (
        <button onClick={() => setIsPublic(!isPublic)}>
          {isPublic ? "개인 사진 보기" : "공개 사진 보기"}
        </button>
      )}
      {imgList}
    </div>
  );
};

export default ImageList;
