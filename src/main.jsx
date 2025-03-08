import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import RateMyProf from './RateMyProf';
import GradeSearch from './components/GradeSearch';
import App from './app'; 

// Render the root React component inside the <div id="root"> in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  // Wrap the entire app in <BrowserRouter> to enable routing
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
