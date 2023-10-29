import React, { useContext, useRef, useEffect } from "react";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import "./ImageList.css";
import { Link } from "react-router-dom";

const ImageList = () => {
  const {
    images,
    myImages,
    isPublic,
    setIsPublic,
    loaderMoreImages,
    imageLoading,
    imageError,
  } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      console.log(entry.isIntersecting);
      if (entry.isIntersecting) {
        loaderMoreImages();
      }
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loaderMoreImages]);

  const imgList = isPublic
    ? images.map((image, index) => (
        <Link
          key={image.key}
          to={`/images/${image._id}`}
          ref={index + 5 === images.length ? elementRef : undefined}
        >
          <img
            alt=""
            key={image.key}
            src={`http://localhost:5000/uploads/${image.key}`}
            style={{
              maxWidth: 600,
              margin: "auto",
            }}
          ></img>
        </Link>
      ))
    : myImages.map((image, index) => (
        <Link
          key={image.key}
          to={`/images/${image._id}`}
          ref={index + 5 === myImages.length ? elementRef : undefined}
        >
          <img
            alt=""
            key={image.key}
            src={`http://localhost:5000/uploads/${image.key}`}
            style={{
              maxWidth: 600,
              margin: "auto",
            }}
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
