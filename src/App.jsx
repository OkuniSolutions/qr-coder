import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import QRGenerator from './pages/QRGenerator';
import ImageConverter from './pages/ImageConverter';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main-content" className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qr-generator" element={<QRGenerator />} />
          <Route path="/image-converter" element={<ImageConverter />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
