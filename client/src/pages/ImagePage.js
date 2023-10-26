import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ImagePage = () => {
  const { imageId } = useParams();
  const { images, myImages, setImages, setMyImages } = useContext(ImageContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [me] = useContext(AuthContext);

  const image =
    images.find((image) => imageId === image._id) ||
    myImages.find((image) => imageId === image._id);

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
  }, [me, image]);

  const updateImage = (images, image) =>
    [...images.filter((image) => image._id !== imageId), image].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (result.data.public) setImages(updateImage(images, result.data));
    else setMyImages(updateImage(myImages, result.data));

    setHasLiked(!hasLiked);
  };

  if (!image) return <h3>Loading...</h3>;
  return (
    <div>
      <h3>ImagePage - {imageId}</h3>
      <img
        style={{ width: "100%" }}
        alt={imageId}
        src={`http://localhost:5000/uploads/${image.key}`}
      ></img>
      <span>좋아요 {image.likes.length}</span>
      <button style={{ float: "right" }} onClick={onSubmit}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
    </div>
  );
};

export default ImagePage;
