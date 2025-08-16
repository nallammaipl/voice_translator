import axios from "axios";
import { useState } from "react";

function UploadAudio() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an audio file first!");
      return;
    }
    const formData = new FormData();
    formData.append("audio_file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/api/transcribe/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data); // { id, transcribed_text, filename, download_url }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Check backend console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.id) return;
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/transcribe/${result.id}/download/`,
        { responseType: "blob" }
      );

      const suggested = result.filename || "transcription.txt";
      const blob = new Blob([res.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = suggested;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-600">
          🎙️ Voice Transcriber
        </h1>

        <input
          type="file"
          accept="audio/*"
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer mb-4 p-2"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upload & Transcribe"}
        </button>

        {result && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2 text-gray-800">✅ Transcription:</h2>
            <p className="p-3 bg-gray-100 rounded-lg text-sm text-gray-700 max-h-40 overflow-y-auto whitespace-pre-wrap">
              {result.transcribed_text}
            </p>

            <button
              onClick={handleDownload}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
            >
              Download Text File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadAudio;
