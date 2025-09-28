# Store Rating App - Setup Instructions

## Issues Fixed
✅ **JWT Secret Inconsistency** - Standardized JWT secret usage across all files
✅ **Missing Password Validation** - Added password validation to login route
✅ **Inconsistent Salt Rounds** - Standardized to 10 rounds for password hashing
✅ **Database Schema** - Fixed admin password to be properly hashed
✅ **Frontend API Calls** - Fixed API endpoint configuration
✅ **Duplicate Routes** - Removed duplicate route in App.jsx

## Required Setup Steps

### 1. Environment Variables

#### Backend Environment File (`backend/.env`)
Create this file in the `backend` directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Ratings
DB_USER=postgres
DB_PASSWORD=root

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend Environment File (`frontend/.env`)
Create this file in the `frontend` directory:
```env
# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
```

### 2. Database Setup

#### Install PostgreSQL
- Download and install PostgreSQL from https://www.postgresql.org/download/
- During installation, remember the password you set for the `postgres` user
- Update the `DB_PASSWORD` in `backend/.env` with your actual PostgreSQL password

#### Create Database
1. Open PostgreSQL command line or pgAdmin
2. Create a database named `Ratings`:
```sql
CREATE DATABASE "Ratings";
```

#### Run Database Schema
1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the schema file:
```bash
psql -U postgres -d Ratings -f database/schema.sql
```

### 3. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

### 4. Start the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:5000

#### Start Frontend Server
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:3000

### 5. Default Admin Account

The system creates a default admin account:
- **Email**: admin@storerating.com
- **Password**: Admin123!
- **Role**: system_admin

## Important Security Notes

### JWT Secret
⚠️ **CRITICAL**: Change the `JWT_SECRET` in `backend/.env` to a strong, random string in production:
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Database Password
⚠️ **IMPORTANT**: Update the `DB_PASSWORD` in `backend/.env` to match your actual PostgreSQL password.

### Production Considerations
- Use environment-specific configurations
- Enable HTTPS in production
- Use a proper database connection pool
- Implement rate limiting
- Add input sanitization
- Use proper logging

## Testing the Application

1. **Register a new user**:
   - Go to http://localhost:3000/register
   - Fill in the form (name must be 20-60 characters, password must have uppercase and special character)
   - Submit the form

2. **Login with existing user**:
   - Go to http://localhost:3000/login
   - Use the admin credentials or your registered user credentials
   - You should be redirected to the appropriate dashboard

3. **Test different user roles**:
   - Admin: Can access `/admin` dashboard
   - Normal User: Can access `/dashboard`
   - Store Owner: Can access `/store-owner` dashboard

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check if PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure the `Ratings` database exists

2. **JWT Token Error**:
   - Check if `JWT_SECRET` is set in backend `.env`
   - Restart the backend server after changing environment variables

3. **CORS Error**:
   - Ensure backend is running on port 5000
   - Check if frontend is making requests to the correct API URL

4. **Frontend Not Loading**:
   - Check if all dependencies are installed
   - Verify the frontend is running on port 3000
   - Check browser console for errors

### Logs and Debugging

- Backend logs: Check the terminal where you ran `npm run dev`
- Frontend logs: Check browser developer console
- Database logs: Check PostgreSQL logs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/update-password` - Update password (requires auth)

### Health Check
- `GET /api/health` - Server health check

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that both servers are running on the correct ports
