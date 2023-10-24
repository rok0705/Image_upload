import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const response = axios
      .get("/images")
      .then((result) => {
        setImages(result.data);
      })
      .catch((error) => console.log("ImageList:", error));
  }, []);

  return (
    <ImageContext.Provider value={[images, setImages]}>
      {prop.children}
    </ImageContext.Provider>
  );
};
