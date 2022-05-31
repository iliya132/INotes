import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Faq from './pages/FAQ';
import GettingStarted from './pages/GettingStarted';
import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Notes from './pages/Notes';
import Register from './pages/Register';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/getting-started" element={<GettingStarted/>}/>
            <Route path="/faq" element={<Faq/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/notes" element={<Notes/>}/>
        </Routes>
    );
}
