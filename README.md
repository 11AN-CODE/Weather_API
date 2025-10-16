# Weather API 🌤️
This is a web application that provides real-time weather data. It's built with Node.js and Express.js and demonstrates how to integrate with a third-party API, use a front-end templating engine, and handle user authentication.
Integrate the OpenWeatherMap API
Use a library like axios or the built-in fetch to make a GET request to this URL.

✨ Features
User Authentication: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt for password hashing.

Protected Routes: Weather data is only accessible to authenticated users.

Third-Party API Integration: Fetches real-time weather data from the OpenWeatherMap API.

Templating: Renders dynamic content using EJS (Embedded JavaScript) for a clean user interface.

Environment Variables: Securely manages sensitive information like the API key using environment variables.

🚀 Getting Started
Prerequisites
Node.js (version 20.6.0 or higher is recommended)

A code editor like VS Code

An API key from OpenWeatherMap

Installation
Clone this repository to your local machine:

Bash

git clone <repository_url>
cd <project_folder>
Install the required packages:

Bash

npm install express bcrypt jsonwebtoken cookie-parser axios
Configuration
Create a .env file in the root of your project.

Add your OpenWeatherMap API key to the file.

Bash

WEATHER_API_KEY=your_open_weather_map_api_key
PORT=5000
Running the Application
To start the server, use the --env-file flag to load your environment variables.

Bash

node --env-file=.env app.js
Usage
Open your browser and navigate to http://localhost:5000.

Register a new user on the homepage.

Log in with your new credentials.

Once on the dashboard, enter a city name and click "Get Weather" to see the results.

📄 API Endpoints
POST /register: Registers a new user.

POST /login: Authenticates a user and sets a session cookie.

GET /dashboard: Renders the main weather application page (protected).

GET /fetch-weather?city=<city_name>: Fetches weather data for a specified city (protected).

GET /logout: Clears the session cookie and logs the user out.

