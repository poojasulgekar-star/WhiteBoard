import "../App.css";
import { useState } from "react";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import { LuCopyPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

type Session = {
  id: string;
  title: string;
  code: string;
};

const Home = () => {
  const navigate = useNavigate();

  const loginEmail = localStorage.getItem("loginEmail") || "Guest";
const username = loginEmail.split("@")[0];

  const [showModal, setShowModal] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");

  const savedSessions = localStorage.getItem("sessions");

  const [sessions, setSessions] = useState<Session[]>(
  savedSessions ? JSON.parse(savedSessions) : []
  );

  const handleLogout = () => {
    navigate("/login");
  };

  const handleCreateSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: sessionTitle.trim() || "Untitled Session",
      code: Math.random().toString(36).substring(2, 10).toUpperCase(),
    };

    const updatedSessions = [...sessions, newSession];

    setSessions(updatedSessions);
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));

    setShowModal(false);
    setSessionTitle("");

    navigate(`/WhiteboardCanvas/${newSession.id}`);
  };

  return (
    <div className="home-container">

      {/* Header */}

      <header className="home-header">
        <div>
          <h1 className="logo-title">Whiteboard</h1>
          <p className="welcome-text">
            Welcome, {username}
          </p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" />
          Sign Out
        </button>
      </header>

      {/* Cards */}

      <div className="container py-5">

        <div className="row g-4">

          {/* Create Session */}

          <div className="col-lg-6">

            <div
              className="session-card"
              onClick={() => setShowModal(true)}
            >

              <div className="icon-box">
                <FaPlus size={35} />
              </div>

              <div>
                <h3>Create New Session</h3>
                <p>Start a new whiteboard session</p>
              </div>

            </div>

          </div>

          {/* Join Session */}

          <div className="col-lg-6">

            <div className="session-card">

              <div className="icon-box join">
                <LuCopyPlus size={35} />
              </div>

              <div>
                <h3>Join Session</h3>
                <p>Join an existing session with a code</p>
              </div>

            </div>

          </div>

    {/* Sessions */}

       <div className="sessions-section">
  <h2 className="sessions-title">Your Sessions</h2>

  {sessions.length === 0 ? (
    <div className="empty-session">
      <h5>No Sessions Available</h5>
      <p>Create a session to start collaborating.</p>
    </div>
  ) : (
    <div className="row g-4">
      {sessions.map((session) => (
        <div className="col-lg-4 col-md-6" key={session.id}>
          <div className="saved-session-card">
            <h3>{session.title}</h3>
            <p className="created-date">
              Created {new Date(Number(session.id)).toLocaleDateString()}
            </p>

            <div className="code-box">
              <p>Session Code</p>
              <div className="d-flex align-items-center gap-2">
                <b>{session.code}</b>
                <button
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(session.code)}
                >
                  📋
                </button>
              </div>
            </div>

            <button
              className="open-session-btn"
              onClick={() => navigate(`/WhiteboardCanvas/${session.id}`)}
            >
              Open Session
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        </div>

      </div>

      {/* Modal */}

      {showModal && (

        <div className="modal-overlay">

          <div className="custom-modal">

            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h2>Create New Whiteboard Session</h2>

            <label className="form-label">
              Session Title (Optional)
            </label>

            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="e.g. Team Brainstorm"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
            />

            <button
              className="btn btn-primary w-100 mt-4"
              onClick={handleCreateSession}
            >
              Create Session
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Home;