import React, { useContext } from "react";
import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
  const [images] = useContext(ImageContext);

  return (
    <div>
      {images.map((image) => (
        <img
          key={image.key}
          src={`http://localhost:5000/uploads/${image.key}`}
          style={{
            maxWidth: 600,
            margin: "auto",
          }}
        ></img>
      ))}
    </div>
  );
};

export default ImageList;
