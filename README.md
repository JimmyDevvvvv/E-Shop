E-Shop Application

Overview
E-Shop is a full-stack e-commerce application for browsing products, managing shopping carts, and admin product management. Built with a focus on scalability, security, and an intuitive user experience.


Features
Customer:
Browse and search products.
Add/remove items from cart.
View cart details.

Admin:
Manage products (add, update, delete).
Post and delete notifications.
Admin dashboard with restricted access.

General:
Role-based access control (Admin/Customer).
Secure authentication with JWT.
Responsive Amazon-inspired design.


Tech Stack
Frontend: React.js, CSS
Backend: Node.js, Express.js, MongoDB, Mongoose
Security: Helmet.js, xss-clean, Express Rate Limit



Steps:
Clone the repository:
bash
Copy code
git clone https://github.com/your-repo-name/E-Shop.git
cd E-Shop



Install dependencies:
bash
Copy code
npm install
cd client
npm install
cd ..






Configure .env:
plaintext
Copy code
MONGO_URL=mongodb://localhost:27017/E-Shop
PORT=3400
JWT_SECRET=your-secret-key






Start MongoDB:
bash
Copy code
mongod
Start the servers:
Backend: npm start
Frontend: cd client && npm start



