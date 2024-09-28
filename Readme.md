# 🚀 Backend Project with JavaScript & MongoDB

This project is a backend system built using **JavaScript** and **MongoDB**, showcasing different techniques for managing database connections, middleware, error handling, and user authentication with JWT and Bcrypt. The aim is to provide a robust, secure, and scalable backend solution.

---

## 📖 Table of Contents
1. [Overview](#overview)
2. [Database Connection](#database-connection)
3. [Environment Variables](#environment-variables)
4. [Middleware Usage](#middleware-usage)
5. [Authentication & Security](#authentication--security)
6. [Error Handling](#error-handling)
7. [Key Packages & Tools](#key-packages--tools)
8. [Routes & Controllers](#routes--controllers)
9. [Cloudinary Integration](#cloudinary-integration)
10. [File System (FS)](#file-system-fs)
11. [Multer for File Uploads](#multer-for-file-uploads)

---

## 1. 📝 Overview

This backend project was designed to demonstrate essential backend development concepts using JavaScript and MongoDB. It incorporates key practices such as:

- Modular database connections
- Secure handling of authentication tokens
- Middleware for various use cases
- Environment variable management
- Error handling with standardized responses

This README will guide you through each feature, ensuring a clear understanding of the project structure and its components.

---

## 2. 🗄️ Database Connection

Connecting to **MongoDB** is done in two ways to showcase different design patterns for managing database connections:

### Direct Connection
In the main file, the connection is initialized directly. This approach is simple for smaller applications.

```javascript
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
};
connectDB();
```

### Modular Connection
For larger applications, separating the database connection logic into a dedicated file is more maintainable.

- Create a `db.js` in the `config` folder:
  ```javascript
  const mongoose = require('mongoose');
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Database connected');
    } catch (error) {
      throw new Error('Database connection error');
    }
  };
  module.exports = connectDB;
  ```

- Import and use in the main file:
  ```javascript
  const connectDB = require('./config/db');
  connectDB();
  ```

### Why Async/Await?
Database operations can take time, especially in a networked environment, so **async/await** ensures the code waits for the connection to succeed or fail before moving on.

---

## 3. 🔐 Environment Variables

Environment variables help keep sensitive data, like API keys or database credentials, secure. The **dotenv** package is used to manage these variables, making sure they are accessible throughout the project.

### Setup:
1. Install **dotenv**:
   ```bash
   npm install dotenv
   ```

2. Create a `.env` file in the root folder:
   ```env
   DB_URI=mongodb://localhost:27017/mydatabase
   JWT_SECRET=mysecretkey
   ```

3. Load environment variables in the app:
   ```javascript
   require('dotenv').config();
   ```

This prevents hardcoding sensitive information directly into the codebase and keeps it securely managed in the environment.

---

## 4. ⚙️ Middleware Usage

Middleware functions are crucial in handling incoming requests before they reach the routes. Here's a breakdown of the middleware used in this project:

### Express JSON Parser
This middleware parses incoming JSON requests and limits the request size to avoid payload attacks.
```javascript
app.use(express.json({ limit: '10kb' }));
```

### URL Encoder
Used to parse URL-encoded data (from form submissions) with a size limit for security.
```javascript
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

### Static File Serving
For serving static assets (e.g., images, stylesheets), this middleware helps expose files from the `public` folder.
```javascript
app.use(express.static('public'));
```

### Cookie Parser
Used to handle cookies, allowing the application to securely set, update, and delete browser cookies.
```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

### Custom Middleware for Authentication
Custom middleware ensures only authenticated users can access protected routes.
```javascript
const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(403).json({ message: 'Access Denied' });
  }
  next();
};
app.use(authMiddleware);
```

---

## 5. 🔒 Authentication & Security

Authentication is done using **JWT (JSON Web Tokens)**, and passwords are securely hashed using **Bcrypt**.

### JWT (JSON Web Token)
JWT is used to sign tokens that authenticate users. It's a compact, URL-safe method for representing claims transferred between two parties.

```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
```

### Bcrypt for Password Hashing
**Bcrypt** ensures passwords are stored securely by hashing them before saving in the database.

```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(userPassword, 12);
```

### Refresh & Access Tokens
- **Access Token**: Short-lived and used for quick validation.
- **Refresh Token**: Longer-lived and used to obtain new access tokens without forcing the user to log in again.

---

## 6. ❗ Error Handling

A consistent approach to error handling ensures that issues are detected, logged, and handled appropriately without crashing the server.

### Example Error Middleware:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});
```

By using middleware, the app catches errors in a centralized place, ensuring a user-friendly error message is returned.

---

## 7. 🔧 Key Packages & Tools

Here’s a list of essential packages used in this project and their purposes:

- **Express**: The core web framework used for routing and middleware management.
- **Mongoose**: For database modeling and interacting with MongoDB.
- **JWT**: Used for user authentication.
- **Bcrypt**: For secure password hashing.
- **Dotenv**: For managing environment variables.
- **Cookie-Parser**: To manage cookies on the server.
- **Nodemon**: For automatic server restarts during development.

---

## 8. 🛣️ Routes & Controllers

In this project, routes are separated into their own files for scalability and maintainability.

### Example Basic Route:
```javascript
app.get('/api/v1/resource', (req, res) => {
  res.json({ message: 'Resource fetched successfully' });
});
```

### Modular Route Structure:
For larger applications, routes and controllers are modularized:
1. **routes/resource.js**:
   ```javascript
   const express = require('express');
   const router = express.Router();
   const { getResource } = require('../controllers/resourceController');
   router.get('/', getResource);
   module.exports = router;
   ```

2. **controllers/resourceController.js**:
   ```javascript
   exports.getResource = (req, res) => {
     res.json({ message: 'Resource fetched from controller' });
   };
   ```

---

## 9. ☁️ Cloudinary Integration

**Cloudinary** can be integrated to handle image and video uploads, storage, and management.

### Steps to Integrate Cloudinary:
1. Install the Cloudinary SDK:
   ```bash
   npm install cloudinary
   ```

2. Configure Cloudinary:
   ```javascript
   const cloudinary = require('cloudinary').v2;
   cloudinary.config({
     cloud_name: process.env.CLOUD_NAME,
     api_key: process.env.API_KEY,
     api_secret: process.env.API_SECRET
   });
   ```

3. Upload files:
   ```javascript
   const uploadToCloudinary = async (filePath) => {
     return await cloudinary.uploader.upload(filePath);
   };
   ```

---

## 10. 📂 File System (FS)

**File System (FS)** is used to interact with the server’s file system. This can be useful for reading and writing files such as logs or reports.

### Example Usage:
```javascript
const fs = require('fs');

// Read a file
fs.readFile('path/to/file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

---

## 11. 📁 Multer for File Uploads

**Multer** is a middleware that handles multipart/form-data, primarily used for file uploads.

### Steps to Use Multer:
1. Install Multer:
   ```bash
   npm install multer
   ```

2. Set up Multer for file uploads:
   ```javascript
   const multer = require('multer');
   const upload = multer({ dest: 'uploads/' });

   app

.post('/upload', upload.single('file'), (req, res) => {
     res.json({ message: 'File uploaded successfully' });
   });