import { useEffect, useState } from "react";

export default function Success() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => setSession(data));
    }
  }, []);

  return (
    <div  className="container">
        <div className="content">
            <h1>Payment Successful.</h1>

            <h3>You are now 1 step closer to greatness.</h3>

            <p>A receipt has been emailed to you.</p>
        </div>
    </div>
  );
}
