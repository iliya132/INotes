import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import GuardRoute from './components/GuardRoute';
import ReloadPage from './components/ReloadPage/ReloadPage';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import { NotesPage } from './pages/Notes/notes';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Shared from './pages/Shared';
import { currentUser, isAuth } from './store/reducers/authReduces';

export default function App() {
    const isAuthenticated = useSelector(isAuth);
    const activeUser = useSelector(currentUser);

    return isAuthenticated === undefined ? null : (
        <Routes>
            <Route path="/">
                <Route
                    index={true}
                    element={
                        <GuardRoute canActivate={isAuthenticated} redirectTo="/home">
                            <NotesPage />
                        </GuardRoute>
                    }
                />
                <Route
                    path=":selectedNote"
                    element={
                        <GuardRoute canActivate={isAuthenticated} redirectTo="/home">
                            <NotesPage />
                        </GuardRoute>
                    }
                />
            </Route>
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
            <Route
                path="/register"
                element={
                    <GuardRoute canActivate={!isAuthenticated} redirectTo="/">
                        <Register />
                    </GuardRoute>
                }
            />
            <Route path="/Shared/:sharedUrl" element={<Shared />} />
            <Route
                path="/profile"
                element={
                    <GuardRoute canActivate={isAuthenticated && activeUser !== undefined} redirectTo="/login">
                        <Profile user={activeUser!} />
                    </GuardRoute>
                }
            />
            <Route path="/notFound" element={<ReloadPage />} />
            <Route path="*" element={<Navigate to={'/notFound'} replace={true} />} />
        </Routes>
    );
}
