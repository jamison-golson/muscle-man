# Muscle Man

## Project Overview

Muscle Man is an innovative project designed to streamline the process of nutritional tracking and food identification through advanced technological solutions. By integrating image recognition, text processing, and comprehensive database queries, Muscle Man allows users to easily obtain accurate nutritional information from food products. The application targets individuals aiming to maintain a healthy diet by providing detailed breakdowns of macronutrients, micronutrients, and overall food quality assessments. The core functionality revolves around identifying food items through various input methods and presenting users with an intuitive interface to explore nutritional data, fostering better dietary choices.

## Usage

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies:
   ```
   npm install express
   ```
3. Start the server:
   ```
   node .\web-app\server.js
   ```
4. Open your web browser and go to `http://localhost:3000`.
5. Enter a UPC code in the search box and click the "Search" button.
6. The product information will be displayed in the results section.
7. Your search history will appear at the bottom of the page.
8. Click on any item in the search history to view its details again.

Note: This application uses browser local storage to save your search history. The search history persists even when you close the browser and will be available the next time you open the application, unless you clear your browser data.

Note: This app is still under development, so depending on when you disover this proj. and spin the server up, it may look very bad but it gets the job done




## Objectives

### Input Handling and Validation
- Develop a robust system for inputting UPC codes using camera captures, file uploads, or direct text entries, ensuring accurate data fetching.

### Image Processing
- Implement an image processing module to decode barcodes from uploaded images, ensuring the system can distinguish between image files and text inputs seamlessly.

### Text Processing and Database Querying
- Enhance text input capabilities to interact with the OpenFood database, returning precise search results and allowing users to refine their selections through an intuitive interface.

### API Integration and Data Retrieval
- Integrate with the OpenFood database API to fetch detailed food compositions using UPC codes, ensuring data accuracy and handling potential discrepancies or errors effectively.

### Data Storage and Management
- Design a database schema that efficiently stores retrieved nutritional information, checks for existing entries, and updates the database as necessary while handling errors gracefully.

### Data Visualization and User Interface
- Create a user-friendly interface that visualizes nutritional information, daily goals, and food grades, helping users make informed decisions based on their dietary needs.

### Long-Term Expansion
- Plan for future enhancements including user authentication, a mobile application, improved security measures, and the integration of recipe and diet management tools.

Muscle Man is poised to become an essential tool for anyone focused on health and nutrition, providing a seamless interface to track and analyze dietary intake with precision and ease.
