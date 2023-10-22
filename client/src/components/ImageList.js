import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageList = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const response = axios
      .get("/images")
      .then((result) => {
        console.log("result:", result);
        setImages(result.data);
      })
      .catch((error) => console.log("ImageList:", error));
  }, []);

  return (
    <div>
      {images.map((image, index) => (
        <img
          key={index}
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
