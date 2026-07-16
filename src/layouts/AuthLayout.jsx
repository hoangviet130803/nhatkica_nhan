import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "light");
    }, []);
    return (
        <div className="auth-wrapper">
            <div className="auth-box">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
