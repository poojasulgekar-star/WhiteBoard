import { Link } from "react-router-dom";
import "../App.css";

export default function WhiteboardAuth() {
  return (
    <div className="login-page">
      <main className="login-card">
        <h1 className="title">Whiteboard</h1>
        <p className="subtitle">
          Collaborate in real-time with your team
        </p>
        
        <Link to="/login">
        <button className="login-btn">
          Sign In to Continue
        </button>
        </Link>

        <p className="footer-text">
          You need to be authenticated to use<br />the whiteboard
        </p>
      </main>
    </div>
  );
}
