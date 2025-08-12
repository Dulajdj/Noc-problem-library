import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddProblem from './components/AddProblem';
import EditProblem from './components/EditProblem';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-50">
        <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Problem Library</h1>
          <img src="https://via.placeholder.com/150x50?text=Company+Logo" alt="Company Logo" className="h-10" />
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddProblem />} />
          <Route path="/edit/:id" element={<EditProblem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;