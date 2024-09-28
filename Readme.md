
---

# 🚀 Y-tube: A High-Level, Production-Ready Backend Application

**Y-tube** is a **high-level**, **production-grade** backend system developed using **JavaScript** and **MongoDB**, with advanced features like **Mongoose aggregation pipelines**, **MongoDB operators**, **custom methods**, **hooks**, and thorough testing via **Postman collections**. Designed to mimic the functionality of platforms like YouTube, Y-tube is built for scalability, performance, and security, making it suitable for real-world production environments.

---

## 📖 Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Database Connection](#database-connection)
4. [Environment Variables](#environment-variables)
5. [Middleware Usage](#middleware-usage)
6. [Authentication & Security](#authentication--security)
7. [Error Handling](#error-handling)
8. [Mongoose Aggregation Pipelines](#mongoose-aggregation-pipelines)
9. [MongoDB Operators & Nested Pipelines](#mongodb-operators--nested-pipelines)
10. [Custom Mongoose Methods](#custom-mongoose-methods)
11. [Mongoose Hooks](#mongoose-hooks)
12. [Key Packages & Tools](#key-packages--tools)
13. [Routes & Controllers](#routes--controllers)
14. [Postman Collections](#postman-collections)
15. [Cloudinary Integration](#cloudinary-integration)
16. [File System (FS)](#file-system-fs)
17. [Multer for File Uploads](#multer-for-file-uploads)

---

## 1. 📝 Overview

**Y-tube** backend focuses on handling **MongoDB operations** with efficiency and precision. The project mimics video upload and streaming features, with advanced **Mongoose aggregation pipelines** and **operators** to handle complex data structures like videos, users, comments, and ratings.

---

## 2. ✨ Key Features

- **High-level, production-grade architecture** mimicking platforms like YouTube.
- Efficient **MongoDB operations** using advanced operators like `$lookup`, `$match`, `$or`, and `$cond`.
- **Complex data transformations** using **nested aggregation pipelines**.
- Secure user authentication via **JWT** and **Bcrypt**.
- Fully tested using **Postman collections**.
- Modular design for **routes and controllers**.

---

## 3. 🗄️ Database Connection

Y-tube provides two approaches for managing MongoDB connections:
- **Direct Connection**: Defined in the main entry file for simplicity.
- **Modular Connection**: Encapsulated in a dedicated module for flexibility, ideal for large-scale applications.

Both approaches use **async/await** and are wrapped in **try-catch** for robust error handling.

---

## 4. 🔐 Environment Variables

Sensitive information like **API keys** and **database URIs** are handled securely using the **dotenv** package.

```bash
# .env file example
MONGO_URI=mongodb://localhost:27017/ytube
JWT_SECRET=mysecret
CLOUDINARY_API_KEY=your_api_key
```

---

## 5. ⚙️ Middleware Usage

Middleware plays a key role in:
- Parsing JSON and form-encoded data.
- Serving static files (e.g., images, videos).
- Managing cookies with **cookie-parser**.
- Enforcing **authentication checks** on protected routes.

---

## 6. 🔒 Authentication & Security

Authentication is managed via **JWT** (JSON Web Tokens) and **Bcrypt** for password hashing, ensuring secure user sessions.

### Features:
- **JWT for Access Tokens**: Provides short-lived tokens for user sessions.
- **Bcrypt for Password Hashing**: Ensures passwords are stored securely after hashing.

---

## 7. ❗ Error Handling

Errors are managed globally with middleware, ensuring a consistent response format.

```javascript
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

---

## 8. 🛠️ Mongoose Aggregation Pipelines

**Aggregation Pipelines** are used for transforming and analyzing video-related data, such as filtering videos by category, counting views, or grouping user activity.

```javascript
const pipeline = [
  { $match: { isActive: true } },
  { $group: { _id: "$category", totalViews: { $sum: "$views" } } },
  { $project: { category: "$_id", totalViews: 1, _id: 0 } }
];

const result = await Video.aggregate(pipeline);
```

---

## 9. 🛠️ MongoDB Operators & Nested Pipelines

Y-tube utilizes various **MongoDB operators** to optimize data queries and manipulations for handling video uploads, user interactions, and more.

### Key Operators:
- **$or**: Used for querying multiple conditions, such as video filters.
  ```javascript
  const videos = await Video.find({ $or: [{ views: { $gt: 1000 } }, { likes: { $gt: 100 } }] });
  ```

- **$lookup**: Performs a join between video data and user data for relational queries.
  ```javascript
  const pipeline = [
    { $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "uploader"
      }
    }
  ];
  ```

- **$match**: Filters documents matching specific criteria.
  ```javascript
  { $match: { status: "public" } }
  ```

- **$project**: Reshapes each document in the pipeline.
  ```javascript
  { $project: { title: 1, description: 1, views: 1 } }
  ```

- **$addFields**: Adds new fields to documents.
  ```javascript
  { $addFields: { fullTitle: { $concat: ["$title", " - ", "$category"] } } }
  ```

- **$size**: Returns the size of an array field (e.g., comments count).
  ```javascript
  { $project: { commentCount: { $size: "$comments" } } }
  ```

- **$cond**: Conditionally evaluates expressions, useful for applying dynamic logic.
  ```javascript
  { $project: { featured: { $cond: { if: { $gte: ["$views", 1000] }, then: true, else: false } } } }
  ```

### Nested Pipelines:
Nested aggregation pipelines allow for complex data analysis within video metadata, comments, or user interactions.

```javascript
const pipeline = [
  { $unwind: "$comments" },
  {
    $group: {
      _id: "$videoId",
      totalComments: { $sum: 1 },
      comments: { $push: "$comments" }
    }
  }
];
```

---

## 10. 🔧 Custom Mongoose Methods

Custom Mongoose methods simplify repetitive logic, like verifying passwords or retrieving related data for videos:

```javascript
userSchema.methods.isValidPassword = function(password) {
  return bcrypt.compare(password, this.password);
};
```

---

## 11. 🔄 Mongoose Hooks

Mongoose hooks (pre-save, post-save) allow you to run logic before or after a document is saved. For example, hashing the password before saving the user:

```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

---

## 12. 📦 Key Packages & Tools

- **Express**: Web framework for APIs.
- **Mongoose**: MongoDB ODM for schema-based modeling.
- **JWT**: Secure, stateless authentication.
- **Bcrypt**: Secure password hashing.
- **Dotenv**: Manages environment variables.
- **Nodemon**: Automatic restarts in development.

---

## 13. 🛣️ Routes & Controllers

Routes and controllers are organized modularly for scalability:

```javascript
const express = require('express');
const { getVideos, updateVideo } = require('../controllers/videoController');
const router = express.Router();

router.get('/', getVideos);
router.put('/:id', updateVideo);

module.exports = router;
```

---

## 14. 🧪 Postman Collections

Postman collections are used for API testing, ensuring the Y-tube API functions as expected.

### Features:
- Pre-configured **environment variables** for different environments.
- Automated tests with Postman Runner.

---

## 15. ☁️ Cloudinary Integration

Y-tube uses **Cloudinary** for media uploads, allowing efficient storage and retrieval of videos and thumbnails.

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

---

## 16. 📂 File System (FS)

The **File System (FS)** module handles server-side file operations like reading, writing, and deleting files.

---

## 17. 📁 Multer for File Uploads

**Multer** manages file uploads for video and thumbnail content in the Y-tube platform.

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('videoFile'), (



---

This project exemplifies **production-level** code with **scalability**, **security**, and **performance** at its core. By using advanced MongoDB operators and Mongoose capabilities, the system is capable of handling complex queries and data transformations efficiently.

--- 

