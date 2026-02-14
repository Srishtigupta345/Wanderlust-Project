🌍 Wanderlust – Airbnb Inspired Listing Platform

Wanderlust is a full-stack web application inspired by Airbnb where users can explore, create, edit, and review travel listings.

Built using the MERN backend stack with authentication, session management, cloud image storage, and map integration.

🚀 Live Demo

🔗 Live Project:  https://wanderlust-project-kdxb.onrender.com

✨ Features :- 

🏡 Create, edit & delete property listings

🔐 User authentication (Signup/Login/Logout)

🧑‍💼 Authorization (Only owner can edit/delete listing)

⭐ Add & delete reviews

🗺 Interactive map using Leaflet

☁ Image upload with Cloudinary

💾 Session storage using MongoDB Atlas

🌐 Deployed on Render

🛠 Tech Stack 

Backend :-

Node.js

Express.js

MongoDB Atlas

Mongoose

Passport.js

express-session

connect-mongo

Frontend :-

EJS

Bootstrap

Leaflet.js

Deployment :-

Render

MongoDB Atlas

📦 Installation (For Local Setup) 

1️⃣ Clone the repository
git clone https://github.com/your-username/wanderlust.git
cd wanderlust

2️⃣ Install dependencies
npm install

3️⃣ Create .env file
ATLAS_DB_URL=your_mongodb_connection_string
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_key
CLOUD_API_SECRET=your_secret
SESSION_SECRET=your_secret

4️⃣ Run the server
npm start
App will run on:
http://localhost:8080

🔐 Authentication & Authorization 

Uses passport-local-mongoose

Passwords are hashed & salted automatically

Only listing owner can edit/delete

Only review author can delete review

🗺 Map Integration

Coordinates stored in GeoJSON format

Leaflet used to render interactive map

Custom Wanderlust marker

## 📸 Screenshots

### 🏠 Home Page
![Home Page](screenshots/Home%20Page.png)

### 🔐 Login Page
![Login Page](screenshots/Login%20Page.png)

### 📝 Sign Up Page
![Sign Up Page](screenshots/SignUp%20Page.png)

### ➕ Create New Listing
![Create Listing 1](screenshots/Create%20New%20Listing%201.png)
![Create Listing 2](screenshots/Create%20New%20Listing%202.png)

### 📍 Show Listing Page
![Show Listing 1](screenshots/Show%20Listing%20Page%201.png)
![Show Listing 2](screenshots/Show%20Listing%20Page%202.png)

### 🔐 Show Listing (With Login)
![Show Listing 3](screenshots/Show%20Listing%20Page%203%20(With%20Login).png)
![Show Listing 4](screenshots/Show%20Listing%20Page%204%20(With%20Login).png)

📁 Folder Structure

/models
/routes
/controllers
/views
/public
/utils
/middleware.js
/app.js

📌 Future Improvements

Filtering & search functionality

Pagination

React frontend version

Booking system

User profile dashboard

👩‍💻 Author

Srishti Gupta
Full-Stack Developer
