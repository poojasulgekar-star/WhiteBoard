import { Routes, Route } from "react-router-dom";

import WhiteboardLogin from "../pages/WhiteboardLogin.tsx";
import Login from "../components/Login.tsx";
import Password from "../components/Password.tsx";
import Home from "../components/Home.tsx";
import WhiteboardPage from "../components/WhiteboardPage.tsx";

const AppRoutes = () => {
  return (
   
      <Routes>
        <Route path="/" element={<WhiteboardLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password" element={<Password />} />
        <Route path="/home" element={<Home />} />
        <Route path="/WhiteboardCanvas/:id" element={<WhiteboardPage />} />
           
      </Routes>

  );
};

export default AppRoutes;