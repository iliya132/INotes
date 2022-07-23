import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import GuardRoute from './components/GuardRoute';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home/home';
import Login from './pages/Login';
import { NotesPage } from './pages/Notes/notes';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Register from './pages/Register';
import RestorePassword from './pages/RestorePassword';
import Shared from './pages/Shared';
import { currentUser, isAuth } from './store/reducers/authReduces';

const App = () => {
    const isAuthenticated = useSelector(isAuth);
    const activeUser = useSelector(currentUser);
    const isSignedIn = isAuthenticated === undefined ? false : isAuthenticated
    return (
        <Routes>
            <Route path="/">
                <Route
                    index={true}
                    element={
                        <GuardRoute key="notes_guard" canActivate={isSignedIn} redirectTo="/home">
                            <NotesPage />
                        </GuardRoute>
                    }
                />
                <Route
                    path=":selectedNote"
                    element={
                        <GuardRoute key="selectedNote_guard" canActivate={isSignedIn} redirectTo="/home">
                            <NotesPage />
                        </GuardRoute>
                    }
                />
            </Route>
            <Route
                path="/home"
                element={
                    <GuardRoute key="Home_guard" canActivate={!isSignedIn} redirectTo="/">
                        <Home />
                    </GuardRoute>
                }></Route>

            <Route
                path="/login"
                element={
                    <GuardRoute canActivate={!isSignedIn} redirectTo="/">
                        <Login />
                    </GuardRoute>
                }></Route>
            <Route
                path="/register"
                element={
                    <GuardRoute
                        canActivate={!isSignedIn}
                        redirectTo="/">
                        <Register />
                    </GuardRoute>
                }
            />
            <Route path="/Shared/:sharedUrl" element={<Shared />} />
            <Route
                path="/profile"
                element={
                    <GuardRoute canActivate={isSignedIn && activeUser !== undefined} redirectTo="/login">
                        <Profile user={activeUser!} />
                    </GuardRoute>
                }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/restore-password/:userId/:verificationCode" element={<RestorePassword />} />
            <Route path="/notFound" element={<NotFound />} />
            <Route path="*" element={<Navigate to={'/notFound'} replace={true} />} />
        </Routes>
    );
};

export default App;
