import React from "react";
import UploadForm from "./components/UploadForm";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
      <ToastContainer />
      <h2>사진첩</h2>
      <UploadForm></UploadForm>
    </div>
  );
}

export default App;
