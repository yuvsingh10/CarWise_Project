# Debugging SellCar 500 Error

## Step 1: Check Server is Running

**In Terminal 1**, verify you see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

If NOT running or connection failed, start it:
```bash
cd "used car platform/server"
npm start
```

---

## Step 2: Submit Form WITHOUT Photo

Go to SellCar page and fill:
- Name: Test Car
- Price: 500000
- Year: 2020
- Fuel: Petrol
- Transmission: Manual
- KMs: 50000
- Ownership: 1
- Seats: 5
- Photo: **SKIP (don't upload)**
- Description: (leave empty)

Click Submit → **IMMEDIATELY CHECK SERVER TERMINAL**

---

## Step 3: Copy Error from Server Console

In **Terminal 1 (Server)**, you should see one of:

### **Option A - Full Success ✅**
```
📝 Creating car with data: {
  name: 'Test Car',
  price: 'number',
  ...
  userId: '...',
  userPhone: '...'
}
✅ Car created successfully: [ObjectId]
```

### **Option B - Auth Error ❌**
```
Create car error - Full details: Error: Cannot read property 'id' of undefined
(means req.user is null → JWT token issue)
```

### **Option C - Validation Error ❌**
```
Create car error - Full details: ValidationError: ...
(specific field name will be shown)
```

### **Option D - Database Error ❌**
```
Create car error - Full details: MongooseError: ...
```

---

## Step 4: Share the Error

Copy the error message from server console and paste it here.

The log should look like:
```
📝 Creating car with data: { ... }
Create car error - Full details: [YOUR ERROR HERE]
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| **"Cannot read property 'id' of undefined"** | JWT token not properly decoded → Log in again |
| **"Photo is too large"** | Remove photo, submit again |
| **"ValidationError"** | Invalid field value, server will show which field |
| **MongoDB connection error** | Ensure MongoDB is running and MONGO_URI is correct in .env |
| **Port 5000 already in use** | Change port or kill process using it |

---

## Immediate Actions:

1. ✅ Restart both servers (Ctrl+C and npm start)
2. ✅ Try submitting WITHOUT photo
3. ✅ Check server terminal for the "Create car error" log
4. ✅ Share the complete error message
