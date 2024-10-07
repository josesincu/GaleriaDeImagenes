import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CreateImage from './components/CreateImage';
import Profile from './components/Profile';
import ExtractText from './components/ExtractText';
import UpRekog from './components/upRekog';

const App = () => {
  const location = useLocation();

  // Define las rutas en las que no quieres que aparezca el Navbar
  const hideNavbarRoutes = ['/', '/login', '/register'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* Solo mostrar Navbar si no estamos en las rutas de login o registro */}
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/upload_image" element={<CreateImage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/extract_text" element={<ExtractText />} />
        <Route path="/upRekog" element={<UpRekog />} />


        {/* Agrega más rutas según sea necesario */}
      </Routes>
    </>
  );
};

export default App;

