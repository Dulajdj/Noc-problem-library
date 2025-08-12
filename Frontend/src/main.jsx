import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import AddProblem from './components/AddProblem.jsx'; // or .jsx if that's the extension
import EditProblem from './components/EditProblem.jsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddProblem />} />
      <Route path='/edit/:id' element={<EditProblem/>}/>
      {/* Add more routes as needed */}
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);