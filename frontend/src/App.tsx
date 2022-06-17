import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import GuardRoute from './components/GuardRoute';
import Faq from './pages/FAQ';
import GettingStarted from './pages/GettingStarted';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Notes from './pages/Notes';
import Profile from './pages/Profile';
import Register from './pages/Register';
import { currentUser, isAuth } from './store/reducers/authReduces';

export default function App() {
    const isAuthenticated = useSelector(isAuth);
    const activeUser = useSelector(currentUser);

    return isAuthenticated === undefined ? null : (
        <Routes>
            <Route
                path="/"
                element={
                    <GuardRoute canActivate={isAuthenticated} redirectTo="/home">
                        <Notes />
                    </GuardRoute>
                }></Route>

            <Route
                path="/home"
                element={
                    <GuardRoute canActivate={!isAuthenticated} redirectTo="/">
                        <Home />
                    </GuardRoute>
                }></Route>

            <Route
                path="/login"
                element={
                    <GuardRoute canActivate={!isAuthenticated} redirectTo="/">
                        <Login />
                    </GuardRoute>
                }></Route>
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/faq" element={<Faq />} />
            <Route
                path="/register"
                element={
                    <GuardRoute canActivate={!isAuthenticated} redirectTo="/">
                        <Register />
                    </GuardRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <GuardRoute canActivate={isAuthenticated && activeUser !== undefined} redirectTo="/login">
                        <Profile user={activeUser!} />
                    </GuardRoute>
                }
            />
        </Routes>
    );
}
