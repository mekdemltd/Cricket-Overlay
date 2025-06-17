"use client"; // Ensures that this component is rendered on the client-side only

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for App Router

export default function VideoInput() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [params, setParams] = useState({
    matchId: "",
    siteId: "",    
    season: "",
  });

  // Use useEffect to ensure params are available after the component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setParams({
      matchId: urlParams.get("matchId"),
      siteId: urlParams.get("siteId"),      
      season: urlParams.get("season"),
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { matchId, siteId, season } = params;

    const queryParams = new URLSearchParams({
      videoUrl,
      matchId,
      siteId,      
      season,
    });

    // Simulating a loading state before redirect
    setTimeout(() => {
      router.push(`/live_with_overlay?${queryParams.toString()}`);
    }, 500); // Add a delay to show the spinner
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Provide Live Video URL
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
        <div>
          <label className="font-semibold text-gray-700" htmlFor="videoUrl">
            Live Video URL
          </label>
          <input
            type="text"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded mt-1 focus:ring-2 focus:ring-blue-300"            
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 w-full"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="mt-6 text-center">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full"></div>
        </div>
      )}
    </div>
  );
}
