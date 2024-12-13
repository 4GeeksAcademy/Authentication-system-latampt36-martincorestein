"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


# @api.route('/hello', methods=['POST', 'GET'])
# def handle_hello():

#     response_body = {
#         "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
#     }

#     return jsonify(response_body), 200

#CREATE USER | SIGN-UP
@api.route("/signup", methods=['POST'])
def create_user():
    data = request.json
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    name = data.get("name")
    birthdate = data.get("birthdate")
    country = data.get("country")

    if None in [email, username, password]:
        return jsonify({"message": "Email, Username, and Password are required"}), 400

    email_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    if email_exist:
        return jsonify({"message": "The email already exists, try another one or log-in"}), 400

    username_exist = db.session.execute(db.select(User).filter_by(username=username)).one_or_none()
    if username_exist:
        return jsonify({"message": "The username already exists, try another one"}), 400

    password_hash = generate_password_hash(password)

    try:
         birthdate_obj = datetime.strptime(birthdate, "%d/%m/%Y").date() if birthdate else None
    except ValueError:
        return jsonify({"message": "Invalid birthdate format. Use DD/MM/YYYY"}), 400

    new_user = User(email, username, password_hash, name, birthdate_obj, country)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as error:
        db.session.rollback()  
        print("Database error:", error)
        return jsonify({"message": "Error saving user to database"}), 500

    return jsonify({
        "user": new_user.serialize(),
        "message": "Registration completed successfully, you will be redirected to the Log-in"
    }), 200


#GENERATE TOKEN | LOG-IN
@api.route("/login", methods=['POST'])
def token():
    try:
        data = request.json
        email_or_username = data.get("email_or_username") 
        password = data.get("password")
        
        if not email_or_username or not password:
            return jsonify({"message": "Email/Username and Password are required"}), 400
        
        user = db.session.execute(
            db.select(User).filter((User.email == email_or_username) | (User.username == email_or_username))
        ).one_or_none()

        if not user:
            return jsonify({"message": "Wrong email/username or password, try again"}), 400

        user = user[0]
        password_is_valid = check_password_hash(user.password_hash, password)
        if not password_is_valid:
            return jsonify({"message": "Wrong email/username or password, try again"}), 400

        token = create_access_token(identity=str(user.id))
        return jsonify({"token": token}), 201

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"message": "An error occurred during login"}), 500


#PRIVATE DATA
@api.route("/users", methods=['GET'])
@jwt_required()
def get_private_data():
    user_id = get_jwt_identity()  
    print("User ID from token:", user_id)

    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar_one()
    return jsonify(user.serialize()), 200



