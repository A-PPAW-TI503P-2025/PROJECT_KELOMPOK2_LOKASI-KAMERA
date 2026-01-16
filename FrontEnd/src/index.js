import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // Penting: Import CSS ini agar Tailwind jalan
import App from './App';
import 'leaflet/dist/leaflet.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);