"use client"; // This ensures that this component is rendered on the client-side only

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for App Router

export default function MatchFetcher() {
  const [siteId, setSiteId] = useState("3760");  
  const [season, setSeason] = useState("2025");
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false); // State to track if we're on the client side
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const [loading, setLoading] = useState(false); // State to track loading
  const rowsPerPage = 15; // Number of rows per page
  const [filterUpcomingOnly, setFilterUpcomingOnly] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This will run only on the client-side
    setIsClient(true);
  }, []);

  const fetchMatches = async (e) => {
    e.preventDefault();
    setError("");
    setMatches([]);
    setLoading(true); // Set loading state to true
    
    const url = season 
    ? `/api/fetchMatches?site_id=${siteId}&season=${season}`
    : `/api/fetchMatches?site_id=${siteId}`;
  
    

    try {
      const res = await fetch(url);
      const data = await res.json();
      const parseDate = (str) => {
        const [day, month, year] = str.split('/').map(Number);
        return new Date(year, month - 1, day); // month is 0-based
      };
            
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize

      const filtered = data.matches
        .map((m) => ({
          ...m,
          parsedDate: parseDate(m.match_date),
        }))
        .filter((m) => {
          return !filterUpcomingOnly || m.parsedDate >= today;
        })
        .sort((a, b) => a.parsedDate - b.parsedDate);

      setMatches(filtered);      
    } catch (err) {
      setError("Error fetching data: " + err.message);
    } finally {
      setLoading(false); // Set loading state to false when done
    }
  };

  const goToVideoPage = (matchId) => {
    const params = new URLSearchParams({
      matchId,
      siteId,      
      season,
    });
    router.push(`/video_input?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageInputChange = (e) => {
    const pageNumber = parseInt(e.target.value, 10);
    if (!isNaN(pageNumber)) {
      handlePageChange(pageNumber);
    }
  };

  // Get the matches to display based on the current page
  const displayedMatches = matches.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSiteChange = (e) => {
    setSiteId(e.target.value)    
  };

  const totalPages = Math.ceil(matches.length / rowsPerPage);

  if (!isClient) {
    return null; // This ensures that nothing is rendered on the server-side
  }

  return (    
    <div className="max-w-full mx-auto p-4">      
      {/* Header */}
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        <span>🏏</span>
        <span>Cricket Match Details</span>
      </h1>

      {/* Form */}
      <form
        onSubmit={fetchMatches}
        className="bg-white p-6 rounded-2xl shadow-lg space-y-6 max-w-3xl mx-auto"
      >
        <div>
          <label className="font-semibold text-gray-700">Site ID *</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded mt-1 focus:ring-2 focus:ring-blue-300"
            value={siteId}
            onChange={handleSiteChange}            
            required
          />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Season</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded mt-1 focus:ring-2 focus:ring-blue-300"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          />
        </div>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="upcomingOnly"
            checked={filterUpcomingOnly}
            onChange={(e) => setFilterUpcomingOnly(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="upcomingOnly" className="text-gray-700 font-medium">
            Show only upcoming matches
          </label>
        </div>

        <div className="text-center space-x-4 mt-6">
        <button type="submit" 
        disabled={loading} className={`${ loading ? 'opacity-50 cursor-not-allowed' : ''} bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300`}>
          {loading ? "Loading..." : "Submit"}
        </button>

          <button
            type="button"
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 cursor-pointer"
            onClick={() => {
              setSiteId("");              
              setSeason("");
              setMatches([]);
              setError("");
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Error Handling */}
      {error && (
        <p className="mt-4 text-red-600 font-medium text-center">{error}</p>
      )}

      {/* Spinner for Loading */}
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="animate-spin rounded-full border-t-4 border-blue-600 h-12 w-12 border-solid"></div>
        </div>
      )}

      {/* Pagination Controls */}
      {matches.length > 15 && !loading && (
        <div className="mt-6 text-center flex items-center justify-center">
          {/* First Page Button */}
          <button
            onClick={() => handlePageChange(1)}
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md mx-2 cursor-pointer"
          >
            {"<<"}
          </button>

          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md mx-2 disabled:opacity-50 cursor-pointer"
          >
            {"<"}
          </button>

          {/* Page Number Input */}
          <input
            type="number"
            className="w-16 text-center p-2 border rounded-md mx-2"
            value={currentPage}
            onChange={handlePageInputChange}
            min={1}
            max={totalPages}
          />
          <span className="text-lg mx-2">/ {totalPages}</span>

          {/* Next Page Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md mx-2 disabled:opacity-50 cursor-pointer"
          >
            {">"}
          </button>

          {/* Last Page Button */}
          <button
            onClick={() => handlePageChange(totalPages)}
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md mx-2 cursor-pointer"
          >
            {">>"}
          </button>
        </div>
      )}

      {/* Matches Table */}
      {matches.length > 0 && !loading && (
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-4 text-left border-r">Select</th>
                <th className="p-4 text-left border-r">Match ID</th>
                <th className="p-4 text-left border-r">Date</th>
                <th className="p-4 text-left border-r">Time</th>
                <th className="p-4 text-left border-r">Competition Type</th>
                <th className="p-4 text-left border-r">League</th>
                <th className="p-4 text-left border-r">Competition</th>
                <th className="p-4 text-left border-r">Match Type</th>
                <th className="p-4 text-left border-r">Game Type</th>
                <th className="p-4 text-left border-r">Ground</th>
                <th className="p-4 text-left border-r">Home Team</th>
                <th className="p-4 text-left">Away Team</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {displayedMatches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-r text-center">
                    <button
                      onClick={() => goToVideoPage(match.id)}
                      className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 cursor-pointer"
                    >
                      Select
                    </button>
                  </td>
                  <td className="p-3 border-b border-r">{match.id}</td>
                  <td className="p-3 border-b border-r">{match.match_date}</td>
                  <td className="p-3 border-b border-r">{match.match_time}</td>
                  <td className="p-3 border-b border-r">{match.competition_type}</td>
                  <td className="p-3 border-b border-r">{match.league_name}</td>
                  <td className="p-3 border-b border-r">{match.competition_name}</td>
                  <td className="p-3 border-b border-r">{match.match_type}</td>
                  <td className="p-3 border-b border-r">{match.game_type}</td>
                  <td className="p-3 border-b border-r">{match.ground_name}</td>
                  <td className="p-3 border-b border-r">{`${match.home_club_name} - ${match.home_team_name}`}</td>
                  <td className="p-3 border-b border-r">{`${match.away_club_name} - ${match.away_team_name}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>        
      )}  
      {/* Footer */(
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p className="font-semibold">Developer: Ram</p>
          <p>
            Email:{" "}
            <a href="mailto:raama.0203@outlook.com" className="text-blue-600 underline">
              raama.0203@outlook.com
            </a>
          </p>
          <p>
            Contact:{" "}
            <a href="tel:+447769002438" className="text-blue-600 underline">
              +44 7769002438
            </a>
          </p>
        </footer>
      )}      
    </div>
    
  );
}
