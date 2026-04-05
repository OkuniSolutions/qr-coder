import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [logoSrc, setLogoSrc] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setLogoSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoSrc(null);
    fileInputRef.current.value = '';
  };

  const logoSize = Math.round(512 * 0.22);

  return (
    <div className="App">
      <header className="App-header">
        <h1>QR Code Generator</h1>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter text to generate QR Code"
        />
        <div className="logo-upload">
          <label htmlFor="logo-input">Logo (opcional)</label>
          <div className="logo-upload-controls">
            <input
              id="logo-input"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              ref={fileInputRef}
            />
            {logoSrc && (
              <button onClick={handleRemoveLogo} className="remove-btn">
                Quitar logo
              </button>
            )}
          </div>
          {logoSrc && <img src={logoSrc} alt="Logo preview" className="logo-preview" />}
        </div>
        <div className='qr-container'>
          {inputValue && (
            <QRCode
              value={inputValue}
              size={512}
              level="H"
              {...(logoSrc && {
                imageSettings: {
                  src: logoSrc,
                  width: logoSize,
                  height: logoSize,
                  excavate: true,
                },
              })}
            />
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
