/*
import React, { useState, useRef } from 'react';
import axios from 'axios';

function NutritionTracker() {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [scannedProduct, setScannedProduct] = useState(null);
  const [upcCode, setUpcCode] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
  };

  const handleUpcInputChange = (e) => {
    setUpcCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMeals([...meals, newMeal]);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setScannedProduct(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const upc = await scanBarcodeFromImage(file);
      if (upc) {
        setUpcCode(upc);
        await fetchAndSetProductData(upc);
      } else {
        alert("No barcode detected. Please try another image or enter the UPC manually.");
      }
    }
  };

  const scanBarcodeFromImage = async (imageFile) => {
    try {
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new window.BarcodeDetector({ formats: ['upc_a', 'ean_13'] });
        const bitmap = await createImageBitmap(imageFile);
        const barcodes = await barcodeDetector.detect(bitmap);

        if (barcodes.length > 0) {
          return barcodes[0].rawValue;
        }
      } else {
        console.warn('Barcode detection is not supported in this browser.');
        alert("Barcode detection is not supported in this browser. Please enter the UPC manually.");
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
    return null;
  };

  const fetchAndSetProductData = async (upc) => {
    const productData = await fetchProductData(upc);
    if (productData) {
      setScannedProduct(productData);
      setNewMeal({
        name: productData.product_name,
        calories: productData.nutriments.energy_100g || '',
        protein: productData.nutriments.proteins_100g || '',
        carbs: productData.nutriments.carbohydrates_100g || '',
        fat: productData.nutriments.fat_100g || '',
      });
    } else {
      alert("Unable to fetch product data. Please check the UPC or try again later.");
    }
  };

  const fetchProductData = async (upc) => {
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v2/product/${upc}`);
      const data = response.data;

      if (data.status === 0) {
        throw new Error("Product not found");
      }

      return {
        code: data.code || upc,
        product_name: data.product?.product_name || 'N/A',
        generic_name: data.product?.generic_name || 'N/A',
        brands: data.product?.brands || 'N/A',
        categories: data.product?.categories || 'N/A',
        ingredients: data.product?.ingredients_text || 'N/A',
        nutriments: data.product?.nutriments || {},
        image_front_url: data.product?.image_front_url || 'N/A',
        image_nutrition_url: data.product?.image_nutrition_url || 'N/A',
        ecoscore_grade: data.product?.ecoscore_grade || 'N/A',
        ecoscore_score: data.product?.ecoscore_score || 'N/A',
        nutriscore_grade: data.product?.nutriscore_grade || 'N/A',
        nutriscore_score: data.product?.nutriscore_score || 'N/A',
      };
    } catch (error) {
      console.error('Error fetching product data:', error);
      return null;
    }
  };

  const handleUpcSubmit = async (e) => {
    e.preventDefault();
    if (upcCode) {
      await fetchAndSetProductData(upcCode);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Nutrition Tracker</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Enter UPC or Scan Product Barcode</h3>
        <form onSubmit={handleUpcSubmit} className="flex items-center mb-2">
          <input
            type="text"
            value={upcCode}
            onChange={handleUpcInputChange}
            placeholder="Enter UPC code"
            className="p-2 border rounded mr-2 flex-grow"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Fetch Product
          </button>
        </form>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Upload Image
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Meal name</label>
          <input
            type="text"
            name="name"
            value={newMeal.name}
            onChange={handleInputChange}
            placeholder="Meal name"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Calories</label>
          <input
            type="number"
            name="calories"
            value={newMeal.calories}
            onChange={handleInputChange}
            placeholder="Calories"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
          <input
            type="number"
            name="protein"
            value={newMeal.protein}
            onChange={handleInputChange}
            placeholder="Protein (g)"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
          <input
            type="number"
            name="carbs"
            value={newMeal.carbs}
            onChange={handleInputChange}
            placeholder="Carbs (g)"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fat (g)</label>
          <input
            type="number"
            name="fat"
            value={newMeal.fat}
            onChange={handleInputChange}
            placeholder="Fat (g)"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Meal
        </button>
      </form>

      {scannedProduct && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Scanned Product</h3>
          <div className="bg-gray-100 p-4 rounded">
            <h4 className="font-semibold">{scannedProduct.product_name}</h4>
            <p>Brand: {scannedProduct.brands}</p>
            <p>Categories: {scannedProduct.categories}</p>
            <p>Ingredients: {scannedProduct.ingredients}</p>
            <p>Nutriscore: {scannedProduct.nutriscore_grade} ({scannedProduct.nutriscore_score})</p>
            <p>Ecoscore: {scannedProduct.ecoscore_grade} ({scannedProduct.ecoscore_score})</p>
            {scannedProduct.image_front_url !== 'N/A' && (
              <img src={scannedProduct.image_front_url} alt="Product" className="mt-2 max-w-xs" />
            )}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-2">Today's Meals</h3>
        {meals.map((meal, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded mb-2">
            <h4 className="font-semibold">{meal.name}</h4>
            <p>Calories: {meal.calories}, Protein: {meal.protein}g, Carbs: {meal.carbs}g, Fat: {meal.fat}g</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NutritionTracker;

*/

import React, { useState, useRef } from 'react';
import axios from 'axios';

function NutritionTracker() {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    name: '',
    servings: '1',
    caloriesPerServing: '',
    proteinPerServing: '',
    carbsPerServing: '',
    fatPerServing: ''
  });
  const [scannedProduct, setScannedProduct] = useState(null);
  const [upcCode, setUpcCode] = useState('');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal(prevMeal => ({
      ...prevMeal,
      [name]: value
    }));
  };

  const calculateDisplayedValues = (meal) => {
    const servings = parseFloat(meal.servings) || 1;
    return {
      calories: (parseFloat(meal.caloriesPerServing) * servings).toFixed(2),
      protein: (parseFloat(meal.proteinPerServing) * servings).toFixed(2),
      carbs: (parseFloat(meal.carbsPerServing) * servings).toFixed(2),
      fat: (parseFloat(meal.fatPerServing) * servings).toFixed(2),
    };
  };

  const handleUpcInputChange = (e) => {
    setUpcCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const displayedValues = calculateDisplayedValues(newMeal);
    const mealToAdd = {
      ...newMeal,
      ...displayedValues,
    };
    setMeals([...meals, mealToAdd]);
    setNewMeal({
      name: '',
      servings: '1',
      caloriesPerServing: '',
      proteinPerServing: '',
      carbsPerServing: '',
      fatPerServing: ''
    });
    setScannedProduct(null);
  };

  const fetchAndSetProductData = async (upc) => {
    const productData = await fetchProductData(upc);
    if (productData) {
      setScannedProduct(productData);
      setNewMeal({
        name: productData.product_name,
        servings: '1',
        caloriesPerServing: productData.nutriments['energy-kcal_serving']|| '',
        proteinPerServing: productData.nutriments.proteins_serving || '',
        carbsPerServing: productData.nutriments.carbohydrates_serving || '',
        fatPerServing: productData.nutriments.fat_serving || '',
      });
    } else {
      alert("Unable to fetch product data. Please check the UPC or try again later.");
    }
  };

  const fetchProductData = async (upc) => {
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v2/product/${upc}`);
      const data = response.data;

      if (data.status === 0) {
        throw new Error("Product not found");
      }

      return {
        code: data.code || upc,
        product_name: data.product?.product_name || 'N/A',
        generic_name: data.product?.generic_name || 'N/A',
        brands: data.product?.brands || 'N/A',
        categories: data.product?.categories || 'N/A',
        ingredients: data.product?.ingredients_text || 'N/A',
        nutriments: data.product?.nutriments || {},
        image_front_url: data.product?.image_front_url || 'N/A',
        image_nutrition_url: data.product?.image_nutrition_url || 'N/A',
        ecoscore_grade: data.product?.ecoscore_grade || 'N/A',
        ecoscore_score: data.product?.ecoscore_score || 'N/A',
        nutriscore_grade: data.product?.nutriscore_grade || 'N/A',
        nutriscore_score: data.product?.nutriscore_score || 'N/A',
      };
    } catch (error) {
      console.error('Error fetching product data:', error);
      return null;
    }
  };


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const upc = await scanBarcodeFromImage(file);
      if (upc) {
        setUpcCode(upc);
        await fetchAndSetProductData(upc);
      } else {
        alert("No barcode detected. Please try another image or enter the UPC manually.");
      }
    }
  };
  
  const scanBarcodeFromImage = async (imageFile) => {
    try {
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new window.BarcodeDetector({ formats: ['upc_a', 'ean_13'] });
        const bitmap = await createImageBitmap(imageFile);
        const barcodes = await barcodeDetector.detect(bitmap);

        if (barcodes.length > 0) {
          return barcodes[0].rawValue;
        }
      } else {
        console.warn('Barcode detection is not supported in this browser.');
        alert("Barcode detection is not supported in this browser. Please enter the UPC manually.");
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
    }
    return null;
  };

  const handleUpcSubmit = async (e) => {
    e.preventDefault();
    if (upcCode) {
      await fetchAndSetProductData(upcCode);
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Nutrition Tracker</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Enter UPC or Scan Product Barcode</h3>
        <form onSubmit={handleUpcSubmit} className="flex items-center mb-2">
          <input
            type="text"
            value={upcCode}
            onChange={handleUpcInputChange}
            placeholder="Enter UPC code"
            className="p-2 border rounded mr-2 flex-grow"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Fetch Product
          </button>
        </form>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Upload Image
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Meal name</label>
          <input
            type="text"
            name="name"
            value={newMeal.name}
            onChange={handleInputChange}
            placeholder="Meal name"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Servings</label>
          <input
            type="number"
            name="servings"
            value={newMeal.servings}
            onChange={handleInputChange}
            placeholder="Number of servings"
            className="p-2 border rounded w-full"
            step="0.1"
            min="0.1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Calories (per serving)</label>
          <input
            type="number"
            name="caloriesPerServing"
            value={newMeal.caloriesPerServing}
            onChange={handleInputChange}
            placeholder="Calories per serving"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Protein (g) (per serving)</label>
          <input
            type="number"
            name="proteinPerServing"
            value={newMeal.proteinPerServing}
            onChange={handleInputChange}
            placeholder="Protein (g) per serving"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Carbs (g) (per serving)</label>
          <input
            type="number"
            name="carbsPerServing"
            value={newMeal.carbsPerServing}
            onChange={handleInputChange}
            placeholder="Carbs (g) per serving"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fat (g) (per serving)</label>
          <input
            type="number"
            name="fatPerServing"
            value={newMeal.fatPerServing}
            onChange={handleInputChange}
            placeholder="Fat (g) per serving"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-semibold">Total for {newMeal.servings} serving(s):</h4>
          <p>Calories: {calculateDisplayedValues(newMeal).calories}</p>
          <p>Protein: {calculateDisplayedValues(newMeal).protein}g</p>
          <p>Carbs: {calculateDisplayedValues(newMeal).carbs}g</p>
          <p>Fat: {calculateDisplayedValues(newMeal).fat}g</p>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Meal
        </button>
      </form>
      {scannedProduct && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Scanned Product</h3>
          <div className="bg-gray-100 p-4 rounded">
            <h4 className="font-semibold">{scannedProduct.product_name}</h4>
            <p>Brand: {scannedProduct.brands}</p>
            <p>Categories: {scannedProduct.categories}</p>
            <p>Ingredients: {scannedProduct.ingredients}</p>
            <p>Nutriscore: {scannedProduct.nutriscore_grade} ({scannedProduct.nutriscore_score})</p>
            <p>Ecoscore: {scannedProduct.ecoscore_grade} ({scannedProduct.ecoscore_score})</p>
            {scannedProduct.image_front_url !== 'N/A' && (
              <img src={scannedProduct.image_front_url} alt="Product" className="mt-2 max-w-xs" />
            )}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-2">Today's Meals</h3>
        {meals.map((meal, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded mb-2">
            <h4 className="font-semibold">{meal.name}</h4>
            <p>Servings: {meal.servings}</p>
            <p>Calories: {meal.calories}, Protein: {meal.protein}g, Carbs: {meal.carbs}g, Fat: {meal.fat}g</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default NutritionTracker;
