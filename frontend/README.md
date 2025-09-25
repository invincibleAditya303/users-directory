# Users Directory

A simple web application that lets users view, add, edit, and delete user details.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)  
  - [Backend Setup](#backend-setup)  
  - [Frontend Setup](#frontend-setup)
- [Validation & Error Handling](#validation--error-handling)
- [Assumptions & Limitations](#assumptions--limitations)
- [Challenges Faced](#challenges-faced)

## About

This project is a user management dashboard that allows CRUD operations on user data. Unlike a mock API, this version uses a backend built with Node.js, Express, and SQLite to store data persistently (within the bounds of SQLite). The frontend communicates with those backend API routes to manage the user records.

---

## Features

- View users (with ID, First Name, Last Name, Email, Department)  
- Add new users  
- Edit existing users  
- Delete users  
- Pagination (10 / 25 / 50 / 100 per page or infinite scroll)  
- Search and sort (by first name, last name, email, etc.)  
- Filter by first name, last name, email, department  
- Responsive UI  
- Client-side validations and error feedback  
- Graceful handling of backend errors  

---

## Architecture & Tech Stack

| Layer           | Technology / Library                               |
|-----------------|----------------------------------------------------|
| Backend         | Node.js, Express, SQLite (via `sqlite3` or an ORM) |
| Frontend        | React                                              |
| HTTP client     | Fetch API                                          |
| UI / Styling    | CSS                                                |
| Others          | body-parser, CORS                                  |

---

## Getting Started

### Prerequisites

- Node.js (version 1.0.0)  
- npm or yarn  
- (Optional) sqlite3 CLI, if you want to inspect the database file  

### Backend Setup

1. Navigate to `backend/` (or wherever your server code lives)  
2. Install dependencies:
   ```bash
   npm install

# Database Schema

**users Table**

| Column      | Type    | Constraints               |
| --------    | ------- | ------------------------- |
| id          | INTEGER | PRIMARY KEY AUTOINCREMENT |
| first_name  | VARCHAR | NOT NULL                  |
| last_name   | VARCHAR | NOT NULL                  |
| email       | VARCHAR | NOT NULL UNIQUE           |
| department  | VARCHAR | NOT NULL                  |

# API Endpoints
** Routes **
| Route	                            | Method |	Description
| --------------------------------- | ------ | -------------------------------------------------------------- |
| POST /users       	              | POST	 | Create a new user                                              |
| GET /users	                      | GET	   | List all users (with support for search, sort, pagination)     |
| PUT /users/:id                    |	PUT    |	Update a user                                                 |
| DELETE /users/:id                 |	DELETE |	Delete a user                                                 |

# Validation and Error Handling
- Client-side: Forms validate required fields; show immediate feedback for empty or invalid inputs.
- Server-side: All incoming data is validated before being inserted into database.
- Errors return meaningful HTTP status codes and messages (e.g. 400 Bad Request, 404 Not Found).

### Frontend Setup

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

ok.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Assumptions & Limitations

- SQLite is used as simple file-based DB, so concurrency / scalability is limited
- No authentication (anyone can use API)
- No relationship models — just a flat user table

## Future Improvements

- Replace SQLite with a more robust database (PostgreSQL, MySQL, etc.)
- Add authentication & user roles (admin, user)
- Better error logging, monitoring, and retry strategies
- Bulk operations (bulk delete, bulk update)
- UI enhancements (animations, better styling)
- Role-based access control
  
## Challenges Faced

- Managing frontend state complexity: combining search, sort, filter, and pagination logic so that they all work together without conflicts   (for example, resetting page when filters change, maintaining sort order, etc.).
- Performance concerns: as the number of users grows, doing all filtering/searching/sorting on the frontend can degrade UI responsiveness or  lag, especially on less powerful devices.
- Handling validation both on frontend and backend: ensuring consistent rules (e.g. valid email format, required fields), showing meaningful error messages.
- Designing a clean and maintainable backend API with Express + SQLite: setting up routes, controllers, model interactions, handling database file, schema.
- UI responsiveness: ensuring the layout works well across different screen sizes, especially tables/lists with many fields, filter popups etc.
