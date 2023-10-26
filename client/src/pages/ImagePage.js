import React, { useContext } from "react";
import { useParams } from "react-router";
import { ImageContext } from "../context/ImageContext";

const ImagePage = () => {
  const { imageId } = useParams();
  const { images, myImages } = useContext(ImageContext);
  const image =
    images.find((image) => imageId === image._id) ||
    myImages.find((image) => imageId === image._id);

  if (!image) return <h3>Loading...</h3>;
  return (
    <div>
      <h3>ImagePage - {imageId}</h3>
      <img
        style={{ width: "100%" }}
        alt={imageId}
        src={`http://localhost:5000/uploads/${image.key}`}
      ></img>
    </div>
  );
};

export default ImagePage;
