/* 
    Update showNutrientDetails so the grapgh does not re-render on each click, it just update the graph that is already renderd

*/

// File upload functionality
const fileUpload = document.createElement('input');
fileUpload.type = 'file';
fileUpload.accept = 'image/*';
fileUpload.id = 'file-upload-input';
document.getElementById('file-upload').appendChild(fileUpload);

fileUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        // Here we'll add code to process the image and extract the UPC
        console.log('File uploaded:', file.name);
    }
});

// Text search functionality
const textSearch = document.createElement('input');
textSearch.type = 'text';
textSearch.id = 'text-search-input';
textSearch.placeholder = 'Enter UPC code';
document.getElementById('text-search').appendChild(textSearch);

const searchButton = document.createElement('button');
searchButton.textContent = 'Search';
searchButton.id = 'text-search-button';
document.getElementById('text-search').appendChild(searchButton);

async function fetchProductData(upc) {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${upc}`);
        if (!response.ok) {

            //This gave me a notification instead of printing the error message to the output
            const resultsSection = document.getElementById('results-section');
            resultsSection.textContent = response.statusText
            throw new Error(`HTTP error! status: ${response.status}`);

            //Print the error message for the user: 404 means 'not found'
        }
        const data = await response.json();

        // Extract and process the required fields
        const processedData = {
            code: data.code || upc,
            product_name: data.product?.product_name || 'N/A',
            generic_name: data.product?.generic_name || 'N/A',
            brands: data.product?.brands || 'N/A',
            categories: data.product?.categories || 'N/A',
            ingredients: data.product?.ingredients_text || 'N/A',
            nutriments: data.product?.nutriments || 'N/A',
            image_front_url: data.product?.image_front_url || 'N/A',
            image_nutrition_url: data.product?.image_nutrition_url || 'N/A',
            ecoscore_grade: data.product?.ecoscore_grade || 'N/A',
            ecoscore_score: data.product?.ecoscore_score || 'N/A',
            nutriscore_grade: data.product?.nutriscore_grade || 'N/A',
            nutriscore_score: data.product?.nutriscore_score || 'N/A',
            states: data.product?.states || 'N/A'
        };

        return processedData;
    } catch (error) {
        console.error('Error fetching product data:', error);
        throw error;
    }
}

// Function to save data to local storage
function saveToLocalStorage(data) {
    let history = JSON.parse(localStorage.getItem('productHistory')) || [];
    const existingIndex = history.findIndex(item => item.code === data.code);

    if (existingIndex !== -1) {
        // If the item already exists, move it to the top
        history.splice(existingIndex, 1);
    }

    history.unshift(data);

    // Keep only the latest 10 items
    history = history.slice(0, 10);

    localStorage.setItem('productHistory', JSON.stringify(history));
    displayHistory();
}

// Function to display search history
function displayHistory() {
    const historySection = document.getElementById('history-section');
    historySection.innerHTML = '<h2>Search History</h2>';

    const history = JSON.parse(localStorage.getItem('productHistory')) || [];

    const ul = document.createElement('ul');
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product_name} (${item.code})`;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
            displayResults(item);
            textSearch.value = item.code;
        });
        ul.appendChild(li);
    });

    historySection.appendChild(ul);
}

// Update the search button event listener
searchButton.addEventListener('click', async () => {
    const upc = textSearch.value.trim();
    if (upc) {
        try {
            const productData = await fetchProductData(upc);
            displayResults(productData);
            saveToLocalStorage(productData);
        } catch (error) {
            console.error('Error fetching product data:', error);
            alert('An error occurred while fetching product data. Please try again.');
        }
    } else {
        alert('Please enter a UPC code');
    }
});

// Function to display results
function displayResults(productData) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = `<h2>${productData.product_name}</h2>`;

    if (productData.image_front_url !== 'N/A') {
        const img = document.createElement('img');
        img.src = productData.image_front_url;
        img.alt = productData.product_name;
        img.style.maxWidth = '200px';
        resultsSection.appendChild(img);
    }

    createNutritionLabel(productData);
}

let currentChart;

function createNutritionLabel(productData) {
    const labelContainer = document.getElementById('nutrition-label');
    labelContainer.innerHTML = '<h3>Nutrition Facts</h3>';

    const nutrients = [
        { name: 'Energy', value: productData.nutriments['energy-kcal_100g'], unit: 'kcal' },
        { name: 'Fat', value: productData.nutriments['fat_100g'], unit: 'g' },
        { name: 'Saturated Fat', value: productData.nutriments['saturated-fat_100g'], unit: 'g' },
        { name: 'Carbohydrates', value: productData.nutriments['carbohydrates_100g'], unit: 'g' },
        { name: 'Sugars', value: productData.nutriments['sugars_100g'], unit: 'g' },
        { name: 'Fiber', value: productData.nutriments['fiber_100g'], unit: 'g' },
        { name: 'Proteins', value: productData.nutriments['proteins_100g'], unit: 'g' },
        { name: 'Salt', value: productData.nutriments['salt_100g'], unit: 'g' },
    ];

    nutrients.forEach(nutrient => {
        const row = document.createElement('div');
        row.className = 'nutrition-row';
        row.innerHTML = `<span>${nutrient.name}</span><span>${nutrient.value || 'N/A'} ${nutrient.unit}</span>`;
        row.addEventListener('click', () => showNutrientDetails(nutrient, productData));
        labelContainer.appendChild(row);
    });

    // Add Nutri-Score and Eco-Score
    const scoreRow = document.createElement('div');
    scoreRow.className = 'nutrition-row';
    scoreRow.innerHTML = `
<span>Nutri-Score: ${productData.nutriscore_grade || 'N/A'}</span>
<span>Eco-Score: ${productData.ecoscore_grade || 'N/A'}</span>
`;
    labelContainer.appendChild(scoreRow);
}

function showNutrientDetails(nutrient, productData) {
    const detailsContainer = document.getElementById('nutrient-details');
    detailsContainer.innerHTML = `<h3>${nutrient.name} Details</h3>`;

    // Create a canvas for the Chart.js chart
    // const canvas = document.createElement('canvas');
    // canvas.id = 'nutrientChart';
    // detailsContainer.appendChild(canvas);

    //Grab the canvas from HTML
    const canvas = document.getElementById('myChart')

    // Destroy the existing chart instance if it exists
    if (currentChart) {
        currentChart.destroy();
    }

    // Calculate percentage of daily value (assuming a 2000 calorie diet)
    const dailyValues = {
        'Energy': 2000,
        'Fat': 65,
        'Saturated Fat': 20,
        'Carbohydrates': 300,
        'Sugars': 50,
        'Fiber': 25,
        'Proteins': 50,
        'Salt': 6
    };

    const value = parseFloat(nutrient.value) || 0;
    const percentageOfDV = (nutrient.value / dailyValues[nutrient.name]) * 100;

    // Create the chart
    currentChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: [`${nutrient.name} (${percentageOfDV.toFixed(1)}% of DV)`, 'Remaining'],
            datasets: [{
                data: [percentageOfDV, Math.max(0, 100 - percentageOfDV)],
                backgroundColor: ['#FF6384', '#36A2EB']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: `${nutrient.name} as Percentage of Daily Value`
            }
        }
    });

    // Add more details or comparisons here
    detailsContainer.innerHTML += `
        <p>Amount per 100g: ${value.toFixed(2)} ${nutrient.unit}</p>
        <p>Percentage of Daily Value: ${percentageOfDV.toFixed(1)}%</p>
    `;
}

// Initialize SQLite database
let db;

initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` }).then(function (SQL) {
    db = new SQL.Database();
    console.log('SQLite database initialized');
    // Here we'll create necessary tables
}).catch(err => console.error(err));