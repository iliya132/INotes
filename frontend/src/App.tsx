import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import GuardRoute from './components/GuardRoute';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import { currentUser, isAuth, isLoaded } from './store/reducers/authReducer';
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Home = React.lazy(() => import('./pages/Home/home'));
const Login = React.lazy(() => import('./pages/Login'));
const NotesPage = React.lazy(() => import('./pages/Notes'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Register = React.lazy(() => import('./pages/Register'));
const RestorePassword = React.lazy(() => import('./pages/RestorePassword'));
const Shared = React.lazy(() => import('./pages/Shared'));

const App = () => {
    const isAuthenticated = useSelector(isAuth);
    const isLoadingFinished = useSelector(isLoaded);
    console.log(isLoadingFinished);
    const loaded = isLoadingFinished === undefined ? false : isLoadingFinished;
    const activeUser = useSelector(currentUser);
    const isSignedIn = isAuthenticated === undefined ? false : isAuthenticated;
    const AuthRoute = (children: JSX.Element, redirectTo?: string) => <ProtectedRoute isAuth={isSignedIn} redirectTo={redirectTo}>{children}</ProtectedRoute>

    return !loaded ? (<Loading />) :
        (<Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/"
                    element={
                        <GuardRoute canActivate={isSignedIn} redirectTo="/home">
                            <NotesPage />
                        </GuardRoute>
                    } />
                <Route path="/note/:selectedNote"
                    element={AuthRoute(<NotesPage />)} />
                <Route
                    path="/home"
                    element={
                        <GuardRoute canActivate={!isSignedIn} redirectTo="/"><Home /></GuardRoute>
                    } />
                <Route
                    path="/login"
                    element={
                        <Login />
                    } />
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
                    element={AuthRoute(<Profile user={activeUser!} />)} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/restore-password/:userId/:verificationCode" element={<RestorePassword />} />
                <Route path="/notFound" element={<NotFound />} />
                <Route path="*" element={<Navigate to={'/notFound'} replace={true} />} />
            </Routes>
        </Suspense>
        );
};
export default App;
