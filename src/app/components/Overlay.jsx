"use client";
import { useState, useCallback } from "react";

export default function MatchOverlayDetails({ matchData }) {
  const [homeLogo, setHomeLogo] = useState(null);
  const [awayLogo, setAwayLogo] = useState(null);

  const handleDrop = useCallback((e, setLogo) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const preventDefaults = e => e.preventDefault();

  const renderDropZone = (logo, setLogo, altText) => (
    <div
      className="team-logo-dropzone"
      onDrop={e => handleDrop(e, setLogo)}
      onDragOver={preventDefaults}
      onDragEnter={preventDefaults}
      onDragLeave={preventDefaults}
    >
      {typeof logo === "string" && logo.trim() !== "" ? (
        <img src={logo} alt={altText} />
      ) : (
      <span className="team-logo-placeholder">Drop Logo</span>
      )}

    </div>
  );

  return (
    <>
      {/* Overlay Bar */}
      <div className="overlay-bar">
        {/* Team 1 */}
        <div className="team-info">
          <div className="team-logo-left">
            {renderDropZone(homeLogo, setHomeLogo, "Team 1 Logo")}
          </div>
          <div className="vertical-line"></div> 
          <div className="team-details">
            <span className="team-name">{matchData.homeTeam}</span>          
            {matchData.homeScore && matchData.homeScore.trim() !== "" && (
              <span className="team-score">{matchData.homeScore}</span>
              )}
          </div>
        </div>

        {/* Match Status */}
        <div className="match-status">
          {matchData.matchStatus && matchData.matchStatus.trim() !== "" ? matchData.matchStatus : "VS"}
          </div>


        {/* Team 2 */}
        <div className="team-info">
          <div className="team-details team-details-right">
            <span className="team-name">{matchData.awayTeam}</span>
            {matchData.homeScore && matchData.homeScore.trim() !== "" && (
            <span className="team-score">{matchData.awayScore}</span>
          )}
          </div>
          <div className="vertical-line"></div> 
          <div className="team-logo-right">
            {renderDropZone(awayLogo, setAwayLogo, "Team 2 Logo")}
          </div>
        </div>
      </div>

      {/* Extra Details */}
      <div className="extra-details">
        <div><strong>Ground:</strong> {matchData.ground}</div>
        <div><strong>Date:</strong> {matchData.matchDate}</div>
        <div><strong>Umpires:</strong> {matchData.umpires}</div>
        <div><strong>Scorers:</strong> {matchData.scorers}</div>
      </div>
    </>
  );
}
