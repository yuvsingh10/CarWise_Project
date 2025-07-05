import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SellCar from './pages/SellCar';
import MyCars from './pages/MyCars';
import EditCar from './pages/EditCar';
import CarDetails from './pages/CarDetails';
import Profile from './pages/Profile'; 
import Delete from './pages/Delete';
import Favorites from './pages/Favorites';  

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sell" element={<SellCar />} />
        <Route path="/my-cars" element={<MyCars />} />
        <Route path="/edit-car" element={<EditCar />} />
        <Route path="/car-details" element={<CarDetails />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/delete" element={<Delete />} />
        <Route path="/favorites" element={<Favorites />} />  
      </Routes>
    </Router>
  );
};

export default App;
