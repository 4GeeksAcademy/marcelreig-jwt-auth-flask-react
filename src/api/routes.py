"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hola desde el backend de tu API",
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def handle_signup():
    from werkzeug.security import generate_password_hash

    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        raise APIException("Email and password are required", status_code=400)

    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        raise APIException("User already exists", status_code=400)

    hashed_password = generate_password_hash(data['password'])
    new_user = User(email=data['email'],
                    password=hashed_password, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


@api.route('/login', methods=['POST'])
def handle_login():
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        raise APIException("Email and password are required", status_code=400)

    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        raise APIException("Invalid email or password", status_code=401)

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": access_token,
        "user": user.serialize()
    }), 200



@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        raise APIException("User not found", status_code=404)

    return jsonify({
        "message": f"Welcome {user.email}, you are in a protected route."
    }), 200
