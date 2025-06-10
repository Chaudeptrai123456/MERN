import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
export const UserContext = createContext();
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            setLoading(false);
            return;
        }
        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }
        const fecthUser = async () => {
            try {
                const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(res.data.user);
            } catch (error) {
                console.error("User not authorized or profile fetch failed:", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fecthUser();
    }, []);
    const updateUser = useCallback((userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.tokenAccess);
    }, []);
    const clearUser = useCallback(() => {
        setUser(null);
        localStorage.removeItem("token");
    }, []);
    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};
export default UserProvider;
