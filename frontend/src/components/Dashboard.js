import React from 'react';

function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Nutrition Overview</h2>
        <p>Calories consumed today: 1500 / 2000</p>
        <div className="mt-4 h-4 bg-gray-200 rounded-full">
          <div className="h-full bg-green-500 rounded-full" style={{width: '75%'}}></div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Workout Overview</h2>
        <p>Last workout: Upper Body Strength (2 hours ago)</p>
        <p>Next scheduled: Cardio (in 3 hours)</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
        <p>Weight: 70kg (-0.5kg)</p>
        <p>Workouts completed: 4/5</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Goals</h2>
        <ul className="list-disc list-inside">
          <li>Reach 2000 calories daily</li>
          <li>Complete 5 workouts this week</li>
          <li>Increase protein intake</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { Activity, Droplet, Zap, Apple, Beef, Carrot, ChevronDown, ChevronUp } from 'lucide-react';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// const generateWeeklyData = () => {
//   const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//   return days.map(day => ({
//     day,
//     calories: Math.floor(Math.random() * 1000) + 500,
//     workoutMinutes: Math.floor(Math.random() * 60) + 15,
//     waterIntake: Math.floor(Math.random() * 1000) + 1000,
//   }));
// };

// const generateNutritionData = () => [
//   { name: 'Protein', value: Math.floor(Math.random() * 100) + 50 },
//   { name: 'Carbs', value: Math.floor(Math.random() * 150) + 100 },
//   { name: 'Fat', value: Math.floor(Math.random() * 50) + 30 },
//   { name: 'Fiber', value: Math.floor(Math.random() * 20) + 10 },
// ];

// function Dashboard() {
//   const [caloriesConsumed, setCaloriesConsumed] = useState(0);
//   const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
//   const [waterIntake, setWaterIntake] = useState(0);
//   const [weeklyData, setWeeklyData] = useState(generateWeeklyData());
//   const [nutritionData, setNutritionData] = useState(generateNutritionData());
//   const [showDetails, setShowDetails] = useState(false);
//   const [goals, setGoals] = useState({
//     dailyCalories: 2000,
//     weeklyWorkouts: 5,
//     dailyWaterIntake: 2500,
//   });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCaloriesConsumed(prev => Math.min(prev + Math.floor(Math.random() * 50), goals.dailyCalories));
//       setWorkoutsCompleted(prev => Math.min(prev + 1, goals.weeklyWorkouts));
//       setWaterIntake(prev => Math.min(prev + Math.floor(Math.random() * 100), goals.dailyWaterIntake));
//       setWeeklyData(generateWeeklyData());
//       setNutritionData(generateNutritionData());
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [goals]);

//   const ProgressBar = ({ value, max, color }) => (
//     <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
//       <div 
//         className={`h-full ${color} transition-all duration-500 ease-out`} 
//         style={{ width: `${(value / max) * 100}%` }}
//       ></div>
//     </div>
//   );

//   const Stat = ({ icon: Icon, title, value, color }) => (
//     <div className="flex items-center space-x-2">
//       <div className={`p-2 rounded-full ${color}`}>
//         <Icon className="text-white" size={20} />
//       </div>
//       <div>
//         <p className="text-sm text-gray-600">{title}</p>
//         <p className="text-lg font-semibold">{value}</p>
//       </div>
//     </div>
//   );

//   const ToggleDetailsButton = () => (
//     <button
//       className="mt-4 flex items-center text-blue-500 hover:text-blue-600"
//       onClick={() => setShowDetails(!showDetails)}
//     >
//       {showDetails ? 'Hide Details' : 'Show Details'}
//       {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//     </button>
//   );

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold mb-4">Daily Overview</h2>
//         <div className="space-y-4">
//           <div>
//             <p className="text-sm font-medium text-gray-600">Calories consumed today</p>
//             <p className="text-2xl font-bold">{caloriesConsumed} / {goals.dailyCalories}</p>
//             <ProgressBar value={caloriesConsumed} max={goals.dailyCalories} color="bg-green-500" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Workouts this week</p>
//             <p className="text-2xl font-bold">{workoutsCompleted} / {goals.weeklyWorkouts}</p>
//             <ProgressBar value={workoutsCompleted} max={goals.weeklyWorkouts} color="bg-blue-500" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Water intake today (ml)</p>
//             <p className="text-2xl font-bold">{waterIntake} / {goals.dailyWaterIntake}</p>
//             <ProgressBar value={waterIntake} max={goals.dailyWaterIntake} color="bg-cyan-500" />
//           </div>
//         </div>
//         <ToggleDetailsButton />
//         {showDetails && (
//           <div className="mt-4 space-y-4">
//             <h3 className="text-lg font-semibold">Nutrition Breakdown</h3>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie
//                   data={nutritionData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {nutritionData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold mb-4">Weekly Activity</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={weeklyData}>
//             <XAxis dataKey="day" />
//             <YAxis yAxisId="left" orientation="left" stroke="#16a34a" />
//             <YAxis yAxisId="right" orientation="right" stroke="#2563eb" />
//             <Tooltip />
//             <Legend />
//             <Line yAxisId="left" type="monotone" dataKey="calories" stroke="#16a34a" name="Calories" />
//             <Line yAxisId="right" type="monotone" dataKey="workoutMinutes" stroke="#2563eb" name="Workout (mins)" />
//           </LineChart>
//         </ResponsiveContainer>
//         <ToggleDetailsButton />
//         {showDetails && (
//           <div className="mt-4">
//             <h3 className="text-lg font-semibold mb-2">Water Intake Trend</h3>
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart data={weeklyData}>
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="waterIntake" fill="#0ea5e9" name="Water Intake (ml)" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
//         <h2 className="text-xl font-semibold mb-4">Health Stats</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <Stat icon={Zap} title="Avg. Daily Calories" value={`${Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / 7)}`} color="bg-yellow-500" />
//           <Stat icon={Activity} title="Avg. Weekly Workouts" value={`${(weeklyData.filter(day => day.workoutMinutes > 0).length / 7 * 5).toFixed(1)}`} color="bg-blue-500" />
//           <Stat icon={Droplet} title="Avg. Daily Water Intake" value={`${Math.round(weeklyData.reduce((sum, day) => sum + day.waterIntake, 0) / 7)} ml`} color="bg-cyan-500" />
//         </div>
//         <ToggleDetailsButton />
//         {showDetails && (
//           <div className="mt-4 space-y-4">
//             <h3 className="text-lg font-semibold">Nutrition Goals</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <Stat icon={Apple} title="Daily Fruit & Veg" value="5 servings" color="bg-green-500" />
//               <Stat icon={Beef} title="Weekly Protein Goal" value="350g" color="bg-red-500" />
//               <Stat icon={Carrot} title="Daily Fiber Goal" value="30g" color="bg-orange-500" />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;