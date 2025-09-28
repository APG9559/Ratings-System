# Store Rating Application - Backend

## Setup Instructions

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up PostgreSQL database:
   - Create a database named `store_rating_db`
   - Run the schema.sql file to create tables

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update database credentials and JWT secret

4. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register normal user
- POST `/api/auth/login` - Login user
- PUT `/api/auth/update-password` - Update password

### Users (Admin only)
- GET `/api/users` - Get all users with filters
- POST `/api/users` - Create new user
- GET `/api/users/:id` - Get user details
- GET `/api/users/dashboard-stats` - Get dashboard statistics

### Stores
- GET `/api/stores` - Get all stores (for normal users)
- GET `/api/stores/admin` - Get all stores (for admin)
- POST `/api/stores` - Create new store (admin only)
- GET `/api/stores/owner/dashboard` - Store owner dashboard

### Ratings
- POST `/api/ratings` - Submit/update rating
- GET `/api/ratings/store/:storeId` - Get user's rating for store

## User Roles
- `system_admin` - Full access to all features
- `normal_user` - Can view stores and submit ratings
- `store_owner` - Can view their store's ratings and dashboard
