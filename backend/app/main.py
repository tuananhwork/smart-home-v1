from flask import Flask
from flask_cors import CORS
from api.recognize import bp as recognize_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Cho phép tất cả origin (dev)

app.config['CORS_HEADERS'] = 'Content-Type'

app.register_blueprint(recognize_bp)

@app.route("/")
def home():
    return "Speech recognition backend is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
