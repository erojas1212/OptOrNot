import React, {useContext } from "react";
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import Public from "./components/Public";
import CategoryOptions from "./components/CategoryOptions";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserContext } from "./context/UserProvider";

function App() {
  const { token, logout } = useContext(UserContext)
  return (
    <div className="App">
        { token && <Navbar logout={logout}/>}
        <Routes>
          <Route
            path="/"
            element={ token ? <Navigate to= "/profile" /> : <Auth />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute token={token} redirectTo="/">
              <Profile />
            </ProtectedRoute>}
          />
          <Route
            path="/public"
            element={<ProtectedRoute token={token} redirectTo="/">
              <Public />
            </ProtectedRoute>}
          />
        <Route path="/category/:category" element={<CategoryOptions />} />
        </Routes>
    </div>
  );
}

export default App;
