import React, { useState } from "react";

const UploadBar = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setLink(""); // clear link if file chosen
    }
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
    if (e.target.value) {
      setFile(null); // clear file if link entered
    }
  };

  const handleUpload = () => {
    if (!link && !file) {
      alert("Please provide either a file or a link before uploading!");
      return;
    }

    setUploading(true);
    setProgress(0);

    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);
      if (value >= 100) {
        clearInterval(interval);
        setUploading(false);
        alert(
          `Upload finished!\n\n${
            link ? "Link: " + link : "File: " + file.name
          }`
        );
      }
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url('https://www.cssacademy.com/static/c77c63ab4208fc68b052176f3e156688/6a30e/gradual-gradient.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Upload File OR Link</h2>

        {/* Link Input */}
        <input
          type="text"
          placeholder="Enter a link..."
          value={link}
          onChange={handleLinkChange}
          disabled={!!file}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: file ? "#f3f3f3" : "white",
          }}
        />

        {/* File Input */}
        <input
          type="file"
          onChange={handleFileChange}
          disabled={!!link}
          style={{
            width: "100%",
            marginBottom: "15px",
            backgroundColor: link ? "#f3f3f3" : "white",
          }}
        />

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#ddd",
            borderRadius: "10px",
            overflow: "hidden",
            height: "20px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: "#4caf50",
              height: "100%",
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            padding: "10px 20px",
            background: uploading ? "gray" : "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Uploading..." : "Start Upload"}
        </button>
      </div>
    </div>
  );
};

export default UploadBar;
