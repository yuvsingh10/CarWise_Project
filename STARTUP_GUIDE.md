# How to Start Servers and Fix Issues

## ⚠️ Current Problem
Both servers have Exit Code 1 = They crashed or failed to start

---

## Step 1: Start the Backend Server

**Open a NEW PowerShell window and run:**

```powershell
cd "D:\COLLEGE\CarWise_Project\used car platform\server"
npm start
```

**Watch for these messages:**

✅ **Good - Server is running:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

❌ **Bad - MongoDB not connected:**
```
❌ MongoDB connection error: ...
⏳ Retrying in 5 seconds...
```
**FIX:** You need MongoDB running. Use MongoDB Atlas (cloud) or install locally.

❌ **Bad - Port already in use:**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**FIX:** Kill the process using port 5000 or change the port in .env

---

## Step 2: Start the Frontend Client

**Open a DIFFERENT PowerShell window and run:**

```powershell
cd "D:\COLLEGE\CarWise_Project\used car platform\client"
npm start
```

**Watch for:**
```
Compiled successfully!
You can now view carwise in the browser.
Local:            http://localhost:3000
```

**If you see errors:**
- Read the error message carefully
- Most common: Missing dependency → run `npm install`

---

## Step 3: Check the App

1. Open http://localhost:3000
2. Press **Ctrl+Shift+R** to hard refresh (clear cache)
3. Login if needed
4. Check Navbar for **💬 Messages**

---

## Troubleshooting Checklist

| Problem | Solution |
|---------|----------|
| Server won't start | Check if port 5000 is free, MongoDB is running |
| Client won't start | Run `npm install`, then `npm start` |
| Messages option missing | Refresh browser (Ctrl+Shift+R) |
| Browser shows blank page | Open DevTools (F12) → Console, check for errors |
| "Cannot connect to API" | Make sure backend server is running on port 5000 |

---

## Quick Test

Once both are running, try:
1. Navigate to http://localhost:3000
2. Look at browser DevTools (F12)
3. Go to Network tab
4. Send a message
5. Check if the POST request to `/api/messages/send` succeeds (200 status)

---

## If Still Stuck

Share the EXACT error message from:
1. Server console (Terminal 1)
2. Client console (Terminal 2)
3. Browser console (F12)

And I'll help fix it!
