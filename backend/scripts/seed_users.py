import requests
from faker import Faker
import uuid

import os

# Initialize Faker
fake = Faker()

# API endpoint
API_URL = os.getenv("API_URL")

def create_user():
    """Creates a single user by calling the API."""
    user_data = {
        "email": fake.unique.email(),
        "name": fake.name(),
        "picture": fake.image_url(),
        "google_id": str(uuid.uuid4()),
    }
    try:
        response = requests.post(API_URL, json=user_data)
        response.raise_for_status()  # Raise an exception for bad status codes
        print(f"Successfully created user: {user_data['email']}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating user {user_data['email']}: {e}")
        if e.response:
            print(f"Response: {e.response.text}")
        return None

def seed_users(num_users: int = 100):
    """Seeds the database with a specified number of users."""
    print(f"Starting to seed {num_users} users...")
    for _ in range(num_users):
        create_user()
    print("User seeding complete.")

if __name__ == "__main__":
    seed_users(500)

