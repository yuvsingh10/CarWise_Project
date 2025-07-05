# CarWise - Used Car Selling Web Application

## Project Overview

CarWise is a web application designed to help users buy and sell used cars easily. Users can create an account, list their cars for sale with details and photos, manage their profile, and view their car listings.

The project is built using React for the frontend and uses browser localStorage to save user data and car listings. It includes simple authentication using JWT stored in localStorage.

---

## Features

- User registration and login with JWT token authentication.
- Profile page where users can upload a profile picture and update their mobile number.
- Ability to list a car for sale with details like name, price, model year, fuel type, transmission, seats, engine, ownership, and photos.
- Users can view their listed cars, edit or delete them.
- Navigation between pages with React Router.
- Simple, clean, and responsive design with background images.

---

## How to Use

1. **Open the app in a browser.**

2. **Register a new account** by providing your name, email, and password.

3. **Login** using your email and password.

4. After login, you will be directed to the **Dashboard**, where you can:
   - See available cars.
   - Navigate to other pages like **Sell Your Car**, **My Cars**, or **Profile**.

5. In the **Sell Your Car** page, fill in the car details and upload photos to list a car for sale.

6. In **My Cars**, view all your listed cars. You can edit or delete listings from here.

7. In the **Profile** page, upload a profile photo and update your mobile number.

---

## Technical Details

- The app uses **React** with functional components and hooks (`useState`, `useEffect`).
- Navigation is handled by **React Router**.
- User authentication is managed with JWT tokens saved in **localStorage**.
- Car and user data are stored in browser **localStorage** as JSON.
- Image uploads are converted to base64 and stored in localStorage.
- Background images and styling are applied using inline CSS styles.

---

## Limitations

- Data is stored locally in the browser and will be lost if browser data is cleared.
- No backend server or real database; this is a frontend-only prototype.
- Authentication is simulated with JWT tokens but no server verification.
- Large images may slow down the app since they are stored as base64 in localStorage.

---

## How to Run the Project

1. Clone the project repository.

2. Run `npm install` to install dependencies.

3. Run `npm start` to launch the app.

4. Open `http://localhost:3000` in a web browser.

---

## Summary

This project demonstrates the basic functionality of a used car selling platform built with React. It shows how users can register, login, manage profiles, and perform CRUD operations on car listings using localStorage.

---

If you have any questions, please feel free to ask.

