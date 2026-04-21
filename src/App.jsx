import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import QRGenerator from './pages/QRGenerator';
import ImageConverter from './pages/ImageConverter';
import ImageCompressor from './pages/ImageCompressor.jsx';
import ImageCropper from './pages/ImageCropper.jsx';
import ExifRemover from './pages/ExifRemover.jsx';
import FaviconGenerator from './pages/FaviconGenerator.jsx';
import OcrTool from './pages/OcrTool.jsx';
import PdfGenerator from './pages/PdfGenerator.jsx';
import PdfCompressor from './pages/PdfCompressor.jsx';
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
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/image-cropper" element={<ImageCropper />} />
          <Route path="/exif-remover" element={<ExifRemover />} />
          <Route path="/favicon-generator" element={<FaviconGenerator />} />
          <Route path="/ocr" element={<OcrTool />} />
          <Route path="/pdf-generator" element={<PdfGenerator />} />
          <Route path="/pdf-compressor" element={<PdfCompressor />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
