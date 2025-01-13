# E-Shop Application

## Overview

E-Shop is a full-stack e-commerce application designed for browsing products, managing shopping carts, and performing admin product management tasks. The application focuses on scalability, security, and providing an intuitive user experience. It follows popular design patterns and includes comprehensive end-to-end and integration testing.

---

## Features

### Customer:

- Browse and search products.
- Add/remove items from the cart.
- View cart details.

### Admin:

- Manage products (add, update, delete).
- Post and delete notifications.
- Admin dashboard with restricted access.

### General:

- Role-based access control (Admin/Customer).
- Secure authentication with JWT.
- Responsive Amazon-inspired design.

---

## Tech Stack

- **Frontend:** React.js, CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Security:** Helmet.js, xss-clean, Express Rate Limit

---

## Testing

- **End-to-End Testing:** Comprehensive testing of user flows to ensure a seamless experience.
- **Integration Testing:** Ensured all components and APIs work together efficiently.
- **Design Patterns:** Followed industry-standard design patterns for maintainable and scalable code.

---

## Steps to Run the Application

### Clone the Repository:

```bash
git clone https://github.com/your-repo-name/E-Shop.git
cd E-Shop
```

### Install Dependencies:

```bash
npm install
cd client
npm install
cd ..
```

### Configure Environment Variables:

Create a `.env` file in the root directory and add the following:

```plaintext
MONGO_URL=mongodb://localhost:27017/E-Shop
PORT=3400
JWT_SECRET=your-secret-key
```

### Start MongoDB:

```bash
mongod
```

### Start the Servers:

- **Backend:**
  ```bash
  npm start
  ```
- **Frontend:**
  ```bash
  cd client && npm start
  ```

