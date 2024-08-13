import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './authContext';
import Logoutbutton from './logoutbutton';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <div className="navbar">
            <div>
                <Link to="/">Home</Link>
                <Link to="/diets">Create Diet</Link>
                {user ? (
                    <>
                        <span>{user.username}</span>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        {/*<Logoutbutton />*/}
                    </>

                )}
            </div>
        </div>

    );
};

export default Navbar;
