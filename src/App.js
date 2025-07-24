import "./App.css";
import EditPost from "./pages/Users/Post/EditPost";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDetail from "./pages/Admin/UserDetail";
import Login from "./pages/Login/Login";
import Register from "./pages/Users/Register";
import ResetPassword from "./pages/Users/ResetPassword";
import ChangePassword from "./pages/Users/Profile/ChangePassword"
import Profile from "./pages/Users/Profile/Profile";
import EditProfile from "./pages/Users/Profile/EditProfile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ListMyPost from "./pages/Users/Post/ListMyPost";
import CreatePost from "./pages/Users/Post/CreatePost";
import PostDetail from "./pages/Users/Post/PostDetail";
import Home from "./components/Home"
import Footer from "./components/Footer"
import MyHistory from "./pages/Users/MyHistory";


function App() {
  return (
    <>
      <Router>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-posts" element={<ListMyPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users/:id" element={<UserDetail />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/register" element={<Register />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/my-history" element={<MyHistory />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
