# Store Rating App

A full-stack web application for rating stores with role-based access control.

## Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Role-Based Access**: Three user roles (System Admin, Normal User, Store Owner)
- **Store Management**: Create and manage stores
- **Rating System**: Rate stores with 1-5 star ratings
- **Admin Dashboard**: User and store management for administrators
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing
- Express Validator for input validation

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd store-rating-app
   ```

2. **Set up environment variables**

   Create `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=Ratings
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Set up database**
   ```bash
   # Create database
   createdb Ratings
   
   # Run schema
   psql -U postgres -d Ratings -f backend/database/schema.sql
   ```

5. **Start the application**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Default Admin Account

- **Email**: admin@storerating.com
- **Password**: Admin123!
- **Role**: system_admin

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/update-password` - Update password

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Stores
- `GET /api/stores` - Get all stores
- `POST /api/stores` - Create new store
- `GET /api/stores/:id` - Get store details
- `PUT /api/stores/:id` - Update store
- `DELETE /api/stores/:id` - Delete store

### Ratings
- `GET /api/ratings` - Get all ratings
- `POST /api/ratings` - Create new rating
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating

## User Roles

### System Admin
- Manage all users and stores
- View system statistics
- Full access to all features

### Normal User
- Rate stores
- View store information
- Update own profile

### Store Owner
- Manage own stores
- View ratings for own stores
- Update store information

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Role-based access control
- CORS protection
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the GitHub repository.
