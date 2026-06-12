import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Password = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Email received from Login page
  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Replace with API call
    if (password === "123456") {
      alert("Login Successful");
      navigate("/home");
    } else {
      alert("Invalid Password");
    }
  };

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "#000",
      }}
    >
      <div
        className="card text-white p-4"
        style={{
          width: "470px",
          background: "#1c1c1c",
          borderRadius: "20px",
        }}
      >
        <div className="text-center mb-4">

          <h2 className="fw-bold mt-4">
            Sign in to Real-Time
            <br />
            Collaborative Whiteboard
          </h2>
        </div>

        <label className="mb-2 fw-semibold">
          Email
        </label>

        <div className="input-group mb-4">

          <input
            type="text"
            className="form-control"
            value={email}
            readOnly
          />

          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/login")}
          >
            Edit
          </button>

        </div>

        <label className="mb-2 fw-semibold">
          Password
        </label>

        <div className="input-group mb-4">

          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

        <button
          className="btn btn-light fw-bold py-2"
          onClick={handleLogin}
        >
          Continue
        </button>

        <button
          className="btn text-white mt-3"
          onClick={() => navigate("/login")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Password;