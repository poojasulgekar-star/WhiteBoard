import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

 const handleContinue = () => {
  if (!email.trim()) {
    alert("Please enter your email.");
    return;
  }

  localStorage.setItem("loginEmail", email);

  navigate("/password", {
    state: { email },
  });
};

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "#000",
      }}
    >
      <div
        className="card border-0 shadow-lg p-4"
        style={{
          width: "470px",
          backgroundColor: "#1b1b1b",
          borderRadius: "20px",
          color: "white",
        }}
      >

        {/* Heading */}
        <h2
          className="text-center fw-bold mb-5"
          style={{ lineHeight: "1.4" }}
        >
          Sign in to Real-Time
          <br />
          Collaborative Whiteboard
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="form-label fw-semibold">
            Email
          </label>

          <input
            type="email"
            className="form-control form-control-lg"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #3b3b3b",
              color: "white",
            }}
          />
        </div>

        {/* Continue Button */}
        <button
          className="btn btn-light btn-lg fw-bold w-100"
          onClick={handleContinue}
          style={{
            borderRadius: "10px",
          }}
        >
          Continue
        </button>

        {/* Register */}
        <p className="text-center mt-4 mb-0 text-secondary">
          Don't have an account?{" "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;