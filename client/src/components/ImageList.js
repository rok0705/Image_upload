import React, { useContext } from "react";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import "./ImageList.css";
import { Link } from "react-router-dom";

const ImageList = () => {
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);
  const [me] = useContext(AuthContext);

  const imageList = (isPublic ? images : myImages).map((image) => (
    <Link to={`/images/${image._id}`}>
      <img
        alt=""
        key={image.key}
        src={`http://localhost:5000/uploads/${image.key}`}
      ></img>
    </Link>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        사진첩 ({isPublic ? "공개사진" : "개인사진"})
      </h3>
      {me && (
        <button onClick={() => setIsPublic(!isPublic)}>
          {(isPublic ? "개인" : "공개") + "사진 보기"}
        </button>
      )}
      <div className="image-list-container">{imageList}</div>
    </div>
  );
};

export default ImageList;
