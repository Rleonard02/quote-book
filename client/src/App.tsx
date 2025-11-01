import React, { useRef, useState } from "react";
import "./App.css";
import { JSX } from "react/jsx-runtime";

function App(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const goToEtsy = () => {
    window.location.href = "https://www.etsy.com/listing/4396593803/me-myself-my-mind-the-first-book-from?ls=r&ref=hp_recent_activity_hub-1&content_source=727f1b926fb92eaafe8ad9cf687a97b8%253ALT150414f7bdcdd5debea0b7f1592fc99872925acd&logging_key=727f1b926fb92eaafe8ad9cf687a97b8%3ALT150414f7bdcdd5debea0b7f1592fc99872925acd";
  };

  return (
    <div className="app-root">
      <video
        autoPlay
        muted
        loop
        id="myVideo"
        ref={videoRef}
        playsInline
      >
        <source src="/flames.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <div className="content">
        <h1>Welcome to the Henry Kudish Experience</h1>
        <button id="myBtn" onClick={goToEtsy}>
          BUY THE BOOK
        </button>
      </div>
    </div>
  );
}

export default App;
