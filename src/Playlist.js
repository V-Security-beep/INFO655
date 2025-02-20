import React, { useState, useEffect } from "react";
import "./App.css"; // Import CSS

const Playlist = () => {
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch("/songs.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        if (data.songs && Array.isArray(data.songs)) {
          setTracks(data.songs);
        } else {
          console.error("Error: Data is not an array", data);
          setTracks([]); 
        }
      })
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  // Handle double-click to play a track
  const handleDoubleClick = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  // Handle Next Button
  const handleNext = () => {
    if (tracks.length === 0) return;
    setIsPlaying(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === null || prevIndex === tracks.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle Previous Button
  const handlePrev = () => {
    if (tracks.length === 0) return;
    setIsPlaying(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === null || prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  // Handle Play/Pause Button
  const handlePlayPause = () => {
    if (currentIndex === null) return;
    setIsPlaying((prev) => !prev);
  };

  // Handle Shuffle Button
  const handleShuffle = () => {
    setTracks((prevTracks) => {
      let shuffledTracks = [...prevTracks].sort(() => Math.random() - 0.5);
      return shuffledTracks;
    });
  };

  return (
    <div className="playlist-container">
      <div className="playlist-box">
        <h2>🎵 Classic Playlist</h2>

        {/* Scrollable Playlist Container */}
        <div className="playlist-scroll-container">
          <ul>
            {tracks.map((track, index) => {
              const isSong = track.artist && track.title;
              const isPodcast = track.episodeTitle;
              return (
                <li
                  key={track.id || `${track.title || track.episodeTitle}-${index}`}
                  onDoubleClick={() => handleDoubleClick(index)}
                  className={`playlist-item ${
                    currentIndex === index ? "active" : ""
                  }`}
                >
                  {isSong
                    ? `${track.title} - ${track.artist} (${track.year || "Unknown"})`
                    : isPodcast
                    ? `${track.podcast || "Podcast"} - ${track.episodeTitle}`
                    : "Unknown Track"}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Status Display */}
        <h3 className="status">
          {currentIndex !== null && tracks[currentIndex] 
            ? (isPlaying 
                ? `▶ Playing: ${tracks[currentIndex].title || tracks[currentIndex].episodeTitle}` 
                : "⏸ Paused")
            : "No track selected"}
        </h3>

        {/* Player Controls */}
        <div className="controls">
          <button onClick={handlePrev}>⏮️ Prev</button>
          <button onClick={handlePlayPause}>{isPlaying ? "⏸ Pause" : "▶ Play"}</button>
          <button onClick={handleNext}>⏭️ Next</button>
          <button onClick={handleShuffle}>🔀 Shuffle</button>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
