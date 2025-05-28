# Secure Military Communication Web App

A mini full-stack MERN project that enables secure, role-based communication between military personnel using encrypted messaging.

![Node.js](https://img.shields.io/badge/Backend-Express.js-green?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=flat&logo=mongodb)
![React](https://img.shields.io/badge/Frontend-React-blue?style=flat&logo=react)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow?style=flat)
![License](https://img.shields.io/github/license/amankumar025/SecureMilitaryCommApp)

---

## Features

Secure Signup/Login with JWT authentication
AES-128-CBC end-to-end message encryption
Role-based access: Officer, Admin
Encrypted message storage in MongoDB
Decrypted inbox viewer
Fully protected frontend routes
Logout + token management
Responsive Bootstrap UI

---

##  Tech Stack

**Frontend**: React.js, Axios, React Router, Bootstrap
**Backend**: Node.js, Express.js, Mongoose, Crypto
**Database**: MongoDB Atlas
**Security**: AES Encryption, JWT Auth, Bcrypt

---

## How to Run Locally

### Backend
```bash
cd server
npm install
touch .env

---

## Add your .env

PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=supersecret
AES_SECRET_KEY=1234567890123456

node server.js

### Frontend

cd client
npm install
npm start
