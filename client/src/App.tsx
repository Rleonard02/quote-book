import React, { useRef, useState } from "react";
import "./App.css";
import { JSX } from "react/jsx-runtime";
import NavBar from './components/Navbar';

function App(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const goToEtsy = () => {
    window.location.href = "https://www.etsy.com/listing/4396593803/me-myself-my-mind-the-first-book-from?ls=r&ref=hp_recent_activity_hub-1&content_source=727f1b926fb92eaafe8ad9cf687a97b8%253ALT150414f7bdcdd5debea0b7f1592fc99872925acd&logging_key=727f1b926fb92eaafe8ad9cf687a97b8%3ALT150414f7bdcdd5debea0b7f1592fc99872925acd";
  };

  const goToStripe = async () => {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <NavBar></NavBar>
      <div className="app-root">

        <div className="container">

          {/* <img src="/flames.gif" alt="Flames background" id="myVideo" /> */}

          <div className="qr-code">
              <img src="/QRCode.png" alt="" />
            </div>

          <div className="content">

            <h1>Welcome to the Henry Kudish Experience</h1>
            <button id="myBtn" onClick={goToEtsy}>
              <h2>BUY THE BOOK</h2>
            </button>
          </div>

          <div className="qr-code">
            <img src="/QRCode.png" alt="" />
          </div>
          
        </div>
        
        
      </div>
    </>
    
  );
}

export default App;
