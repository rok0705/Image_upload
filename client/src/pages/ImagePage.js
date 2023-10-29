import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ImagePage = () => {
  const navigate = useNavigate();
  const { imageId } = useParams();
  const { images, setImages, setMyImages } = useContext(ImageContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [image, setImage] = useState();
  const [error, setError] = useState(false);
  const [me] = useContext(AuthContext);
  const imageRef = useRef();

  useEffect(() => {
    imageRef.current = images.find((image) => image._id === imageId);
  }, [images, imageId]);

  useEffect(() => {
    if (imageRef.current) setImage(imageRef.current);
    else
      axios
        .get(`/images/${imageId}`)
        .then(({ data }) => {
          setImage(data);
          setError(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setError(true);
        });
  }, [imageId]);

  const refreshImage = (images, image) =>
    [...images.filter((image) => image._id !== imageId), image].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (result.data.public)
      setImages((prevData) => refreshImage(prevData, result.data));
    setMyImages((prevData) => refreshImage(prevData, result.data));

    setHasLiked(!hasLiked);
  };

  const deleteHandler = async () => {
    try {
      if (!window.confirm("Do you want to delete the image?")) return;
      const result = await axios.delete(`/images/${imageId}`);
      setImages((prevData) =>
        prevData.filter((image) => image._id !== imageId)
      );
      setMyImages((prevData) =>
        prevData.filter((image) => image._id !== imageId)
      );
      toast.success(result.data.message);
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
  }, [me, image]);

  if (error) return <h3>Error.</h3>;
  else if (!image) return <h3>Loading...</h3>;
  return (
    <div>
      <h3>{imageId}</h3>
      <img
        style={{ width: "100%" }}
        alt={imageId}
        src={`http://localhost:5000/uploads/${image.key}`}
      ></img>
      <span>좋아요 {image.likes.length}</span>
      {me && image.user._id === me.userId && (
        <button
          style={{ float: "right", marginLeft: 10 }}
          onClick={deleteHandler}
        >
          삭제
        </button>
      )}
      <button onClick={onSubmit} style={{ float: "right" }}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
    </div>
  );
};

export default ImagePage;
