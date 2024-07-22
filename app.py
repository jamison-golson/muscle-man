import os

import requests
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from PIL import Image
from pyzbar import pyzbar
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

upc_codes = []


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/fetch_upc_from_image", methods=["POST"])
def fetch_upc_from_image():
    if "image" not in request.files:
        return jsonify({"error": "No image file in request"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file:
        # filename = secure_filename(file.filename)
        # filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        # file.save(filepath)
        image = Image.open(file)
        barcodes = pyzbar.decode(image)

        for barcode in barcodes:
            upc = barcode.data.decode("utf-8")

        # Here, you would process the image to extract the UPC

        return jsonify(
            {"upc": upc, "message": "File successfully uploaded and processed"}
        )


@app.route("/fetch_product_data", methods=["POST"])
def fetch_product_data():
    print("Fetching product data...")
    upc = request.json.get("upc")
    print(f"Received UPC: {upc}")

    if not upc:
        return jsonify({"error": "No UPC provided"}), 400

    try:
        response = requests.get(f"https://world.openfoodfacts.org/api/v2/product/{upc}")
        response.raise_for_status()
        data = response.json()

        processed_data = {
            "code": data.get("code", upc),
            "product_name": data.get("product", {}).get("product_name", "N/A"),
            "generic_name": data.get("product", {}).get("generic_name", "N/A"),
            "brands": data.get("product", {}).get("brands", "N/A"),
            "categories": data.get("product", {}).get("categories", "N/A"),
            "ingredients": data.get("product", {}).get("ingredients_text", "N/A"),
            "nutriments": data.get("product", {}).get("nutriments", "N/A"),
            "image_front_url": data.get("product", {}).get("image_front_url", "N/A"),
            "image_nutrition_url": data.get("product", {}).get(
                "image_nutrition_url", "N/A"
            ),
            # Explain exactly what ecoscore grade is and why it recieved that grade
            "ecoscore_grade": data.get("product", {}).get("ecoscore_grade", "N/A"),
            # Explain exactly what ecoscore is and why it recieved that score
            "ecoscore_score": data.get("product", {}).get("ecoscore_score", "N/A"),
            """
            Nutriscore_data, detail of data the Nutri-Score was computed upon
            
            Negative points: energy, saturated fat, sugars, sodium (high levels are considered unhealthy)

            Positive points: the proportion of fruits, vegetables and nuts, of olive, colza and nut oils, of fibers and proteins.
            """
            "nutriscore_data": data.get("product", {}).get("nutriscore_data", "N/A"),
            # Explain exactly what nutriscore grade is and why it recieved that grade
            "nutriscore_grade": data.get("product", {}).get("nutriscore_grade", "N/A"),
            # Explain exactly what nutriscore is and why it recieved that score
            "nutriscore_score": data.get("product", {}).get("nutriscore_score", "N/A"),
            # List all 'uncompleted' items in a neat table for user to update
            "states": data.get("product", {}).get("states", "N/A"),
        }
        return processed_data

        # return jsonify(processed_data)
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
