import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import GuardRoute from './components/GuardRoute';
import Loading from './components/Loading';
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Home = React.lazy(() => import('./pages/Home/home'));
const Login = React.lazy(() => import('./pages/Login'));
const NotesPage = React.lazy(() => import('./pages/Notes'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Profile = React.lazy(() => import('./pages/Profile'));

const Register = React.lazy(() => import('./pages/Register'));
const RestorePassword = React.lazy(() => import('./pages/RestorePassword'));
const Shared = React.lazy(() => import('./pages/Shared'));
import { currentUser, isAuth, isLoaded } from './store/reducers/authReducer';

const App = () => {
    const isAuthenticated = useSelector(isAuth);
    const isLoadingFinished = useSelector(isLoaded);
    console.log(isLoadingFinished);
    const loaded = isLoadingFinished === undefined ? false : isLoadingFinished;
    const activeUser = useSelector(currentUser);
    const isSignedIn = isAuthenticated === undefined ? false : isAuthenticated;

    return !loaded ? (<Loading />) :
        (<Routes>
            <Route path="/">
                <Route
                    index={true}
                    element={
                        <GuardRoute key="notes_guard" canActivate={isSignedIn} redirectTo="/home">
                            <Suspense fallback={<Loading/>}>
                                <NotesPage />
                            </Suspense>
                        </GuardRoute>
                    }
                />
                <Route
                    path="/note/:selectedNote"

                    element={
                        <GuardRoute key="selectedNote_guard" canActivate={isSignedIn} redirectTo="/home">
                            <Suspense fallback={<Loading/>}>
                                <NotesPage />
                            </Suspense>
                        </GuardRoute>
                    }
                />
            </Route>
            <Route
                path="/home"
                element={
                    <GuardRoute key="Home_guard" canActivate={!isSignedIn} redirectTo="/">
                        <Suspense fallback={<Loading/>}>
                            <Home />
                        </Suspense>
                    </GuardRoute>
                }></Route>

            <Route
                path="/login"
                element={
                    <GuardRoute canActivate={!isSignedIn} redirectTo="/">
                        <Suspense fallback={<Loading/>}>
                            <Login />
                        </Suspense>
                    </GuardRoute>
                }></Route>
            <Route
                path="/register"
                element={
                    <GuardRoute
                        canActivate={!isSignedIn}
                        redirectTo="/">
                        <Suspense fallback={<Loading/>}>
                            <Register />
                        </Suspense>
                    </GuardRoute>
                }
            />
            <Route path="/Shared/:sharedUrl" element={<Shared />} />
            <Route
                path="/profile"
                element={
                    <GuardRoute canActivate={isSignedIn && activeUser !== undefined} redirectTo="/login">
                        <Suspense fallback={<Loading/>}>
                            <Profile user={activeUser!} />
                        </Suspense>
                    </GuardRoute>
                }
            />
            <Route path="/forgot-password" element={<Suspense fallback={<Loading/>}><ForgotPassword /></Suspense>} />
            <Route path="/restore-password/:userId/:verificationCode" element={<Suspense fallback={<Loading/>}><RestorePassword /></Suspense>} />
            <Route path="/notFound" element={<Suspense fallback={<Loading/>}><NotFound /></Suspense>} />
            <Route path="*" element={<Navigate to={'/notFound'} replace={true} />} />
        </Routes>

        );
};

export default App;
