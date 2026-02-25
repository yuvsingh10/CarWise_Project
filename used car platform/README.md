# CarWise - Used Car Selling Web Application

## Project Overview

CarWise is a full-stack web application designed to help users buy and sell used cars. Built with React frontend and Express/MongoDB backend, it provides secure authentication, real-time data management, and a modern user interface.

The application features JWT-based authentication, comprehensive server-side validation, database-backed favorites system, pagination, and proper database relationships for ownership verification.

---

## Features

### Authentication & User Management
- Secure user registration with email and phone number (10 digits)
- JWT-based authentication (7-day expiry)
- Login with validation
- Profile management (update phone number)
- Account deletion with cascading data cleanup
- Password hashing with bcryptjs

### Car Listing Management
- **Create**: List cars with 9 required fields (name, price, year, fuel type, transmission, KMs, ownership, seats) + optional description
- **Read**: View all cars with pagination (12 per page) and filtering
- **Update**: Edit car details with field-specific validation
- **Delete**: Remove listings with ownership verification
- **Search & Filter**: By fuel type, transmission, ownership, seats, and car name

### Favorites System
- Add/remove cars to favorites (heart button on cards)
- View dedicated Favorites page with favorite count
- Database-backed (uses MongoDB, not localStorage)
- Shows favorite status in real-time

### UI/UX Features
- **Color Theming**:
  - Auth pages (Home, Register, Login): Purple/gold gradient (#667eea → #764ba2, #ffd54f)
  - Dashboard & related pages: Light blue/grey (#64b5f6, #42a5f5)
- Glassmorphic card design with backdrop blur effects
- Responsive layout with dark backgrounds (BG.jpg, BG2.jpg)
- Real-time error messages with specific guidance
- Loading states and empty state messages
- Pagination with page selector

### Data Validation
**Backend (Server-side)**:
- Email format validation with regex
- Phone validation (exactly 10 digits)
- Password requirements (6-50 characters)
- Name validation (letters, spaces, hyphens; 2-50 chars)
- Price validation (positive, max ₹10 crores)
- Model year (1990 to current+1)
- KMs driven (0 to 2 million)
- Ownership (1, 2, or 3+)
- Seats (2, 4, 5, 7, or 9)
- Fuel type (Petrol, Diesel, Electric, CNG, Hybrid)
- Transmission (Manual, Automatic)
- Description (optional, max 500 chars)
- Input sanitization (removes HTML/script characters)

**Frontend**: Client-side validation for user feedback

### Database Architecture
**User Model** (MongoDB):
- name, email, password (hashed), phone, carListings array
- Timestamps (createdAt, updatedAt)

**Car Model** (MongoDB):
- name, price, photo, ownerId (references User)
- ownerPhone, modelYear, fuelType, transmission, kmsDriven
- ownership, seats, description
- favoriteBy array (references User IDs)
- Timestamps

**Real Ownership Verification**: Uses ObjectIds instead of email strings for robust authorization checks

---

## How to Use

### 1. **Registration & Login**
   - Click "Register" on Home page
   - Fill in name, email (valid format), phone (10 digits), password (6+ chars)
   - Login with credentials
   - JWT token stored in localStorage + request headers

### 2. **Dashboard**
   - View all cars from other users
   - Search by car name
   - Filter by fuel type, transmission, ownership, seats
   - Pagination: 12 cars per page with Previous/Next buttons
   - Click heart (🤍/❤️) to add/remove favorites
   - Click card to view details

### 3. **Sell Your Car** (SellCar.js)
   - Fill all required fields (name, price, year, fuel, transmission, KMs, ownership, seats)
   - Add optional description
   - Upload single car photo (jpg/jpeg/png)
   - Phone auto-filled from JWT token
   - Submit → car saved to database
   - Validation errors shown if fields invalid

### 4. **My Cars** (MyCars.js)
   - View only cars you listed
   - Edit button: Updates car via API
   - Delete button: Removes from database
   - Shows car price, phone, details
   - Fetches fresh data on load

### 5. **Favorites** (Favorites.js)
   - View all cars you favorited
   - Shows favorite count for each car
   - Remove button to unfavorite
   - View Details button to navigate

### 6. **Profile** (Profile.js)
   - View your name, email, phone
   - Update phone number
   - Upload profile picture
   - Delete account button (⚠️ permanent)

### 7. **Delete Account** (Delete.js)
   - Permanent account deletion
   - All associated cars removed from database
   - Confirmation required
   - All user data cleared (calls DELETE /api/auth/delete)

---

## Technical Architecture

### Frontend (React 18.2)
- **Structure**: 
  - `App.js`: Main router setup
  - `components/`: Reusable components (Navbar)
  - `pages/`: 10 page components
  - `services/api.js`: Axios instance with JWT interceptor
- **State Management**: React hooks (useState, useEffect, useContext)
- **Routing**: React Router v6
- **HTTP Client**: Axios 1.4 with automatic token injection
- **Styling**: Inline CSS with dynamic states

### Backend (Express 4.18)
- **Port**: 5000
- **Structure**:
  - `index.js`: Server setup, middleware, routes
  - `config/db.js`: MongoDB connection
  - `models/`: Mongoose schemas (User, Car)
  - `controllers/`: Business logic (authController, carController)
  - `middleware/authMiddleware.js`: JWT verification
  - `routes/`: API endpoints (authRoutes, carRoutes)
  - `utils/validators.js`: 13 validation functions
- **Authentication**: JWT (secret: JWT_SECRET env var, expiry: 7 days)
- **Database**: MongoDB 8.0.10 + Mongoose 7.0.3
- **Validation**: Comprehensive per-field validation + sanitization
- **Error Handling**: Specific, actionable error messages with proper HTTP status codes

### Database (MongoDB)
- **Collections**: Users, Cars
- **Relationships**: ownerId (User._id), favoriteBy (array of User._ids)
- **Indexes**: email (unique), ownerId, favoriteBy
- **Timestamps**: Auto-managed by Mongoose

### API Endpoints
**Auth**:
- POST /api/auth/register - Create account
- POST /api/auth/login - Get JWT token
- GET /api/auth/profile - Get user data
- PUT /api/auth/profile - Update phone
- DELETE /api/auth/delete - Delete account

**Cars**:
- GET /api/cars - All cars (paginated)
- POST /api/cars - Create car listing
- PUT /api/cars/:id - Update car
- DELETE /api/cars/:id - Delete car
- POST /api/cars/:carId/favorite - Toggle favorite
- GET /api/cars/favorites - Get user's favorites

---

## How to Run the Project

### Prerequisites
- Node.js 16+ and npm
- MongoDB 4.4+ (local or MongoDB Atlas connection)
- Two terminal windows (one for server, one for client)

### Environment Setup

**Server** - Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/carwise
JWT_SECRET=your_secret_key_here
JWT_EXPIRES=7d
```

**Client** - Uses default API URL: `http://localhost:5000`

### Installation & Running

**Terminal 1 - Backend Server**:
```bash
cd "used car platform/server"
npm install
npm start
# Should output: "🚀 Server running on port 5000"
```

**Terminal 2 - MongoDB**:
```bash
mongod
# Keep running in background
```

**Terminal 3 - Frontend Client**:
```bash
cd "used car platform/client"
npm install
npm start
# Opens http://localhost:3000 automatically
```

### Verify Setup
- Server health: `http://localhost:5000` (should show "API Running")
- Frontend: `http://localhost:3000` (Home page loads)
- MongoDB: Check with `mongosh` or MongoDB Compass

---

## Project Status

### ✅ Completed Features
- User authentication with JWT (7-day expiry)
- MongoDB backend with Mongoose models
- Phone field integration (database + JWT token)
- Comprehensive server-side validation (13 validators)
- Proper database relationships (ownerId, favoriteBy arrays)
- Favorites system (database-backed, not localStorage)
- Dashboard pagination (12 cars/page)
- Error handling with specific messages
- Authorization checks (users can only edit own cars)
- Input sanitization (XSS prevention)
- UI modernization (purple/gold + blue/grey themes)
- Profile management with phone updates
- Account deletion with cascading cleanup
- Search and filter functionality

### 🔄 In Progress / Future Enhancements
- Cloud storage integration (AWS S3 / Azure Blob) for images
- Multiple images per car listing
- Email verification for registration
- Password reset functionality
- Rate limiting & DDoS protection
- Advanced search (price range, year range)
- User ratings & reviews
- Messaging between buyers/sellers
- Admin dashboard
- Analytics & reporting

### ⚠️ Previous Limitations (Now Fixed)
- ~~Data lost if browser cleared~~ → Persistent MongoDB database
- ~~No backend~~ → Express server with proper API
- ~~Simulated authentication~~ → Real JWT with server verification
- ~~Large Base64 images~~ → Optimized image handling (cloud storage coming)
- ~~No car ownership verification~~ → Proper ObjectId relationships

---

## Key Improvements Over Previous Version

| Aspect | Before | After |
|--------|--------|-------|
| **Data Storage** | Browser localStorage | MongoDB database |
| **Authentication** | Simulated tokens | Real JWT (7-day expiry) |
| **Ownership** | Email strings | ObjectId references |
| **Validation** | Frontend only | Comprehensive backend + frontend |
| **Images** | Base64 in DB | Optimized (cloud-ready) |
| **Favorites** | localStorage array | Database-backed |
| **Authorization** | Email string comparison | ObjectId verification |
| **Scalability** | Single browser | Multi-user server |

---

## File Structure

```
used car platform/
├── client/
│   ├── src/
│   │   ├── components/Navbar.js
│   │   ├── pages/
│   │   │   ├── Home.js (Home, Register, Login in one)
│   │   │   ├── Dashboard.js (all cars, pagination, search, filter, favorites)
│   │   │   ├── SellCar.js (create car listing)
│   │   │   ├── MyCars.js (user's listings)
│   │   │   ├── EditCar.js (update listing)
│   │   │   ├── Delete.js (delete account)
│   │   │   ├── CarDetails.js (single car view)
│   │   │   ├── Favorites.js (favorite cars page)
│   │   │   └── Profile.js (user profile)
│   │   ├── services/api.js (Axios config with interceptor)
│   │   ├── App.js (Router setup)
│   │   └── index.js (React entry point)
│   └── package.json
└── server/
    ├── models/
    │   ├── User.js (name, email, password, phone, carListings)
    │   └── Car.js (name, price, ownerId, photo, etc.)
    ├── controllers/
    │   ├── authController.js (register, login, profile, delete)
    │   └── carController.js (CRUD + favorites)
    ├── routes/
    │   ├── authRoutes.js
    │   └── carRoutes.js
    ├── middleware/authMiddleware.js (JWT verification)
    ├── config/db.js (MongoDB connection)
    ├── utils/validators.js (13 validation functions)
    ├── index.js (Express server)
    └── package.json
```

---

## Security Features

✅ **Server-Side Validation**: All inputs validated before database operations  
✅ **Input Sanitization**: HTML/script characters removed to prevent XSS  
✅ **Password Hashing**: bcryptjs with 10 salt rounds  
✅ **JWT Authentication**: 7-day expiry, signature verification  
✅ **Authorization Checks**: Users can only access/modify own data  
✅ **Secure Headers**: Proper HTTP status codes (400, 401, 403, 404, 500)  
✅ **Email Uniqueness**: Duplicate email prevention  
✅ **Phone Validation**: Exactly 10 digits required  

---

## Troubleshooting

**"Cannot connect to MongoDB"**
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env matches your setup
- For MongoDB Atlas: Use connection string in .env

**"Cannot find token" / 401 errors**
- Clear browser localStorage: Dev Tools → Application → Clear All
- Re-login to generate new token
- Check token is being sent in headers (Axios interceptor)

**"Port 5000 already in use"**
- Kill process: `netstat -ano | findstr :5000` (Windows)
- Change PORT in .env and backend index.js

**"Babel syntax errors in EditCar.js"**
- Save file and wait for React hot reload
- If persists: `npm start` again in client folder

**"Car details show undefined"**
- Ensure old localStorage data is cleared (new schema uses ObjectIds)
- Delete all cars from MongoDB and re-create
- In MongoDB: `db.cars.deleteMany({})`

---

## Summary

CarWise is now a **production-ready full-stack application** with:
- ✅ Real backend (Express + MongoDB)
- ✅ Secure authentication (JWT verified server-side)
- ✅ Database-backed business logic (users can't claim others' cars)
- ✅ Comprehensive input validation & sanitization
- ✅ Modern UI with consistent theming
- ✅ Scalable architecture (supports multiple concurrent users)

Perfect for learning full-stack development with proper separation of concerns, database design, and API architecture!

---

## Questions?

For issues or questions, check the terminal output for detailed error messages. API errors include specific guidance on what went wrong and how to fix it.

Enjoy selling cars with CarWise! 🚗

