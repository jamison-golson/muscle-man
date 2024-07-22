import React, { useState } from 'react';

function WorkoutLogger() {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ name: '', duration: '', type: 'cardio' });

  const handleInputChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setWorkouts([...workouts, newWorkout]);
    setNewWorkout({ name: '', duration: '', type: 'cardio' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Workout Logger</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newWorkout.name}
            onChange={handleInputChange}
            placeholder="Workout name"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="duration"
            value={newWorkout.duration}
            onChange={handleInputChange}
            placeholder="Duration (minutes)"
            className="p-2 border rounded"
            required
          />
          <select
            name="type"
            value={newWorkout.type}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="flexibility">Flexibility</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Log Workout
        </button>
      </form>
      <div>
        <h3 className="text-xl font-semibold mb-2">Recent Workouts</h3>
        {workouts.map((workout, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded mb-2">
            <h4 className="font-semibold">{workout.name}</h4>
            <p>Type: {workout.type}, Duration: {workout.duration} minutes</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutLogger;