import React, { useState, ChangeEvent } from "react";
import axios from "axios";

interface BulkResult {
  index: number;
  prediction: number;
  churn_probability: number;
}

const BulkUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<BulkResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResults([]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/bulk-predict`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.results) setResults(res.data.results);
      else setError(res.data.error || "Unknown server error.");
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Upload failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Title Section */}
      <div className="text-center mb-8 animate-slide-up">
        <h2 className="text-3xl font-bold text-glass mb-2">
          Bulk Churn Prediction
        </h2>
        <p className="text-glass-secondary">
          Upload a CSV file to predict churn risk for multiple customers
        </p>
      </div>

      {/* Glass Card for Upload Section */}
      <div className="glass-card p-6 sm:p-8 animate-fade-in">
        <div className="flex flex-col space-y-4 items-center">
          <label className="text-lg font-semibold text-glass">
            Upload CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file:rounded-lg file:bg-gradient-to-r file:from-gradient1 file:to-gradient2 file:text-white file:p-2 file:border-0
              block w-full max-w-xs cursor-pointer text-sm glass-surface rounded-lg p-2 border border-glass/30"
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full max-w-xs bg-gradient-to-r from-gradient1 to-gradient2 text-white font-bold py-2 rounded-lg shadow-glass hover:scale-105 transition-all disabled:bg-gray-500/50 disabled:cursor-not-allowed"
          >
            {loading ? "Scoring..." : "Upload & Score"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 glass-surface rounded-lg border border-red-300/30 text-red-300 text-center font-medium animate-slide-up">
            {error}
          </div>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <div className="mt-8 animate-slide-up">
            <div className="mb-4 text-lg font-semibold text-glass text-center">
              Results ({results.length} records)
            </div>
            <div className="overflow-x-auto glass-card p-4">
              <table className="w-full glass-surface rounded-lg text-glass">
                <thead>
                  <tr className="bg-gradient-to-r from-gradient1/20 to-gradient2/20">
                    <th className="p-3 text-left">Row</th>
                    <th className="p-3 text-left">Prediction</th>
                    <th className="p-3 text-left">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        r.prediction === 1
                          ? "bg-red-100/10 hover:bg-red-100/20"
                          : "bg-green-100/10 hover:bg-green-100/20"
                      } transition-colors`}
                    >
                      <td className="p-3">{r.index + 1}</td>
                      <td
                        className={`p-3 font-semibold ${
                          r.prediction === 1 ? "text-red-300" : "text-green-300"
                        }`}
                      >
                        {r.prediction === 1 ? "Churn" : "Stay"}
                      </td>
                      <td className="p-3">
                        {(r.churn_probability * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;