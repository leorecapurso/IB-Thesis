from flask import Flask, request, jsonify, send_from_directory
import os
import json

# Initialize Flask app
app = Flask(__name__, static_folder='static')

# Serve the index.html file
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Serve static files (e.g., main.js, style.css, images)
@app.route('/<path:filename>')
def serve_static_files(filename):
    return send_from_directory(app.static_folder, filename)

# Handle POST requests to log data
@app.route('/log_data.py', methods=['POST'])
def log_data():
    try:
        # Receive JSON data from the POST request
        data = request.json

        # Save the data to a local file named 'data.json'
        save_path = 'data.json'
        with open(save_path, 'w') as outfile:
            json.dump(data, outfile, indent=4)
        
        # Print confirmation to terminal
        print("Data saved successfully to:", os.path.abspath(save_path))
        
        # Return success response
        return jsonify({"status": "success", "message": "Data logged successfully"}), 200

    except Exception as e:
        # Log the error to the terminal
        print("Error while logging data:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, port=5000)
