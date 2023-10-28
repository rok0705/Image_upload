import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [imageUrl, setImageUrl] = useState("/images");
  const [me] = useContext(AuthContext);

  const loaderMoreImages = () => {
    if (images.length === 0) return;
    const lastImageId = images[images.length - 1]._id;
    setImageUrl(`/images?lastid=${lastImageId}`);
  };

  useEffect(() => {
    axios
      .get(imageUrl)
      .then((result) => setImages((prevData) => [...prevData, ...result.data]))
      .catch((error) => console.log(error));
  }, [imageUrl]);

  useEffect(() => {
    if (me)
      setTimeout(() => {
        axios
          .get("/users/me/images")
          .then((result) => setMyImages(result.data))
          .catch((err) => console.log(err));
      }, 0);
    else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me]);

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
        loaderMoreImages,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
