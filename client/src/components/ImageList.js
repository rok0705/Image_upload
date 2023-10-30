import React, { useContext, useRef, useEffect, useCallback } from "react";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import "./ImageList.css";
import { Link } from "react-router-dom";

const ImageList = () => {
  const {
    images,
    isPublic,
    setIsPublic,
    setImageUrl,
    imageLoading,
    imageError,
  } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const elementRef = useRef(null);

  const loaderMoreImages = useCallback(() => {
    if (images.length === 0 || imageLoading) return;
    const lastImageId = images[images.length - 1]._id;
    setImageUrl(`${isPublic ? "" : "/users/me/"}/images?lastid=${lastImageId}`);
  }, [images, imageLoading, isPublic, setImageUrl]);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        console.log(entry.isIntersecting);
        loaderMoreImages();
      }
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loaderMoreImages]);

  const imgList = images.map((image, index) => (
    <Link
      key={image.key}
      to={`/images/${image._id}`}
      ref={index + 5 === images.length ? elementRef : undefined}
    >
      <img
        alt=""
        src={`https://image-upload-storage.s3.us-east-2.amazonaws.com/raw/${image.key}`}
      ></img>
    </Link>
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
      <div className="image-list-container">{imgList}</div>
      {imageError && <div>Error.</div>}
      {imageLoading && <div>Loading..</div>}
    </div>
  );
};

export default ImageList;
