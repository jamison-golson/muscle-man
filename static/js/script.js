/* 
    Update showNutrientDetails so the grapgh does not re-render on each click, it just update the graph that is already renderd

*/

// File upload functionality
const fileUpload = document.createElement('input');
fileUpload.type = 'file';
fileUpload.accept = 'image/*';
fileUpload.id = 'file-upload-input';
document.getElementById('file-upload').appendChild(fileUpload);

fileUpload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    console.log(event.target.files)
    if (file) {
        try {
            const upc = await fetchUpcFromImage(file);
            console.log('UPC:', upc);
            const productData = await fetchProductData(upc);
            displayResults(productData);
            saveToLocalStorage(productData);
        } catch (error) {
            console.error('Error processing image or fetching product data:', error);
            alert('An error occurred while processing the image or fetching product data. Please try again.');
        } finally {
            // Clear the file input to allow uploading the same file again
            clearFileInput(fileUpload);
        }
    } else {
        alert('Please upload an image');
    }
});

// Function to clear the file input
// This is temporary, will be replaced with sum button functionality 
function clearFileInput(input) {
    // Clear the file input value
    input.value = '';
    
    // For IE/Edge, we need to clear the value in a different way
    if (input.value) {
        input.type = 'text';
        input.type = 'file';
    }
}



async function fetchUpcFromImage(imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch('/fetch_upc_from_image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.upc; // Return the UPC directly
    } catch (error) {
        console.error('Error fetching product data:', error);
        throw error;
    }
}

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
        const response = await fetch('/fetch_product_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ upc: upc }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
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
// let db;

// initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` }).then(function (SQL) {
//     db = new SQL.Database();
//     console.log('SQLite database initialized');
//     // Here we'll create necessary tables
// }).catch(err => console.error(err));