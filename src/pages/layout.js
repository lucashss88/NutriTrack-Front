import React from "react";
import {useLocation} from "react-router-dom";
import Navbar from "../components/navbar";

export default function Layout({ children }: { children: React.ReactNode}) {
    const location = useLocation();

    const rotasSemNavbar = ['/login', '/register', '/'];
    const esconderNavbar = rotasSemNavbar.includes(location.pathname);

    return (
        <div>
            {!esconderNavbar && <Navbar />}
            <main>
                {children}
            </main>
        </div>
    );
}