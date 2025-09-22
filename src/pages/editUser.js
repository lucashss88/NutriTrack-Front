
// EditUser.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: '',
        name: ''
    });
    const loadToken = () => {
        return localStorage.getItem('token');
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = loadToken();
                const response = await api.get('api/auth/me', {
                        headers: {
                            'x-auth-token': token
                        }
                });
                console.log(response.data);
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setUser({
        ...user,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await api.put('/auth/me', user);
        navigate('/');
        } catch (error) {
        console.error('Error updating user:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={user.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Update User
                </button>
            </form>
        </div>
    );
};

export default EditUser;