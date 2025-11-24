import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import Layout from './pages/Layout';
import Beach from './pages/Beach';
import Museum from './pages/Museum';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redirect from "/" to "/learn" */}
          <Route index element={<Navigate to="beach" replace />} />
          <Route path="beach" element={<Beach />} />
          <Route path="museum" element={<Museum />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
