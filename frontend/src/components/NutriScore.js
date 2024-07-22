import React, { useState } from 'react';
// import axios from 'axios';

const NutriScore = ({ grade }) => {
  const scores = ['a', 'b', 'c', 'd', 'e'];
  const colors = ['#038141', '#85BB2F', '#FECB02', '#EE8100', '#E63E11'];

  const normalizedGrade = grade ? grade.toLowerCase() : '';

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
      <div className="text-2xl font-bold mb-2 text-gray-700">NUTRI-SCORE</div>
      <div className="flex">
        {scores.map((score, index) => (
          <div
            key={score}
            className={`relative w-12 h-12 flex items-center justify-center text-white font-bold text-xl 
              ${index === 0 ? 'rounded-l-full' : ''} 
              ${index === scores.length - 1 ? 'rounded-r-full' : ''}`}
          >
            <div
              className={`absolute inset-0 
                ${index === 0 ? 'rounded-l-full' : ''} 
                ${index === scores.length - 1 ? 'rounded-r-full' : ''}
                ${normalizedGrade === score ? 'ring-4 ring-blue-500 z-10' : ''}`}
              style={{ backgroundColor: colors[index] }}
            ></div>
            <span className="z-20 relative">{score.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductDataFetcher = () => {
  const [upc, setUpc] = useState('');
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(upc)
      let response = await fetch('http://localhost:5000/fetch_product_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upc: upc }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setProductData(data);


      return
    } catch (error) {
      setError(error.message);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Data Fetcher</h1>
      <div className="mb-4">
        <input
          type="text"
          value={upc}
          onChange={(e) => setUpc(e.target.value)}
          placeholder="Enter UPC"
          className="border p-2 mr-2"
        />
        <button
          onClick={fetchProductData}
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {productData && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">{productData.product_name}</h2>
          <p><strong>Brand:</strong> {productData.brands}</p>
          <p><strong>Categories:</strong> {productData.categories}</p>
          {/*
          For each ingredient, highlight from from a scale of red - green, 
          red being very unhealthy, green being very healthy
           */}
          <p><strong>Ingredients:</strong> {productData.ingredients}</p>

          <div className="mt-4">
            <NutriScore grade={productData.nutriscore_grade} />
          </div>

          <div className="mt-4">
            <h3 className="font-bold">Nutriments:</h3>
            <pre className="bg-gray-200 p-2 rounded mt-2 overflow-x-auto">
              {JSON.stringify(productData.nutriments, null, 2)}
            </pre>
          </div>

          <div className="mt-4">
            <h3 className="font-bold">Images:</h3>
            {productData.image_front_url !== 'N/A' && (
              <img src={productData.image_front_url} alt="Product" className="mt-2 max-w-full h-auto" />
            )}
            {productData.image_nutrition_url !== 'N/A' && (
              <img src={productData.image_nutrition_url} alt="Nutrition" className="mt-2 max-w-full h-auto" />
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-bold">Eco-Score:</h3>
            <p>Grade: {productData.ecoscore_grade}</p>
            <p>Score: {productData.ecoscore_score}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-bold">Nutri-Score:</h3>
            <p>Grade: {productData.nutriscore_grade}</p>
            <p>Score: {productData.nutriscore_score}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-bold">States (Uncompleted Items):</h3>
            <ul className="list-disc list-inside">
              {productData.states
                ? productData.states.split(',').map((state, index) => (
                  <li key={index}>{state.trim()}</li>
                ))
                : <li>No uncompleted items</li>
              }
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDataFetcher;