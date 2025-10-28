import React from "react";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Henry Kudish Experience</h1>
      <button
        onClick={async () => {
          try {
            const res = await fetch('/api/create-checkout-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
          } catch (err) {
            console.error(err);
          }
        }}
      >
        BUY THE BOOK
      </button>
    </div>
  );
}

export default App;
