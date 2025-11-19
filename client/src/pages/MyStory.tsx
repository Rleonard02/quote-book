import { useEffect, useState } from "react";

export default function MyStory() {
  

  return (
    <div  className="navbar-container">

            <a href="/" className="navbar-tab" style={{ textDecoration: "none" }}>
                <h2>Home</h2>
            </a>

            <div className="secondary-links">
                <a href="/" className="navbar-tab" style={{ textDecoration: "none" }}>
                    <h2>My Story</h2>
                </a>

                <a href="/" className="navbar-tab" style={{ textDecoration: "none" }}>
                    <h2>Books</h2>
                </a>

                <a href="/" className="navbar-tab" style={{ textDecoration: "none" }}>
                    <h2>Contact</h2>
                </a>
            </div>
    </div>
  );
}
