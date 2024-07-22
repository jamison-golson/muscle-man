import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NutritionTracker from './components/NutritionTracker';
import WorkoutLogger from './components/WorkoutLogger';
import NutriScore from './components/NutriScore';
import WebcamStart from './components/WebcamStart';
// import { Webcam } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Muscle Man</h1>
            <ul className="flex space-x-4">
              <li><Link to="/" className="text-white hover:text-blue-200">Dashboard</Link></li>
              <li><Link to="/nutrition" className="text-white hover:text-blue-200">Nutrition Logger</Link></li>
              <li><Link to="/workout" className="text-white hover:text-blue-200">Workout</Link></li>
              <li><Link to="/nutriscore" className="text-white hover:text-blue-200">NutriScore</Link></li>
              <li><Link to="/webcamstart" className="text-white hover:text-blue-200">Webcam</Link></li>
            </ul>
          </div>
        </nav>
        <main className="container mx-auto mt-8 px-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nutrition" element={<NutritionTracker />} />
            <Route path="/workout" element={<WorkoutLogger />} />
            <Route path="/nutriscore" element={<NutriScore />} />
            <Route path="/webcamstart" element={<WebcamStart />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;