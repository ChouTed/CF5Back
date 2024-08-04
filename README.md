# Backend
## Overview

This project is a backend API for managing orders and user authentication for a restaurant system. It uses Node.js with Express, MySQL for the database, and Swagger for API documentation.

## Features

- User authentication with session management.
- CRUD operations for orders.
- Fetching menu items and user details.
- API documentation with Swagger.

## Technologies Used

- Node.js
- Express
- MySQL
- Express-Session
- Swagger

## Prerequisites

- Node.js (v14 or later)
- MySQL server

### Installation

#### 1. Clone the repository:

```bash
git clone https://github.com/ChouTed/CF5Back.git
cd CF5Back

```


#### 2. Install dependencies:

```bash

npm install


```

#### 3. Set up MySQL:

Create a MySQL database named asoe.
Update the MySQL credentials in methods.js if necessary.

## Running the Server

### Start the development server with:

```bash
npm run devStart
```
The server will run on http://localhost:5000.
## Project Structure

- node_modules: Directory where project dependencies are installed.
- .gitattributes
- .gitignore: Specifies files and directories to be ignored by Git.
- index.js: The main entry point for the server. It sets up routes, middleware, and starts the server.
- methods.js: Contains functions for database operations and session management.
- package-lock.json: Contains the exact version of dependencies installed.
- package.json: Contains the project metadata and dependencies.




### API Documentation

API documentation is available at http://localhost:5000/api-docs.
