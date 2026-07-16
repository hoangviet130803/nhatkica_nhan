import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Authencator/Login";
import Register from "../pages/Authencator/Register";
import ResetPassword from "../pages/Authencator/ResetPassword";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ListPost from "../pages/Post/ListPost";
import CreatePost from "../pages/Post/CreatePost";
import Profile from "../pages//Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import EditPost from "../pages/Post/EditPost";
import PostDetail from "../pages/Post/PostDetail";
import ListMyPost from "../pages/Post/ListMyPost";
import Trash from "../pages/Post/Trash";
import { ThemeProvider } from "../context/ThemeContext";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route
                    element={
                        <ThemeProvider>
                            <MainLayout />
                        </ThemeProvider>
                    }
                >
                    <Route path="/" element={<Home />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/posts" element={<ListPost />} />
                    <Route path="/my-posts" element={<ListMyPost />} />
                    <Route path="/trash" element={<Trash />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/edit-post/:id" element={<EditPost />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/resetpassword" element={<ResetPassword />} />
                </Route>
            </Routes>
        </Router>
    );
};
export default App;
