# 🚀 PulseBoard

A modern full-stack real-time polling and feedback platform built using the MERN Stack.

PulseBoard allows users to create polls, share public voting links, collect responses in real-time, and analyze voting statistics through beautiful analytics dashboards.

---

# 🌐 Live Demo

## 🔗 Live Website
https://pulseboard.rupeshpradhan.com

## 💻 GitHub Repository
https://github.com/merupeshpradhan/PulseBoard

---

# 📸 Screenshots

## Login Page
![Login Screenshot](https://github.com/user-attachments/assets/20d2499b-a16a-472b-9517-c04359db9f6f)

---

## Register Page
![Register Screenshot](https://github.com/user-attachments/assets/15d99e46-9d2e-4daf-9c52-bd3905325e4d)

---

## Dashboard
![Dashboard Screenshot](https://github.com/user-attachments/assets/7491ae08-306d-43cc-95c7-213c2d9fcd49)

---

## Profile
![Profile Screenshot](https://github.com/user-attachments/assets/f6211e9d-4959-4f18-80ce-8a749735769c)

---

## Create Poll
![Create Poll Screenshot](https://github.com/user-attachments/assets/5c852f32-a4f8-4d5c-b04d-80a5103f891e)

---

## Poll Voting Page
![Voting Screenshot](https://github.com/user-attachments/assets/b1d8f747-7299-440a-b3cc-b1253589870f)

---

## Poll Analytics
![Analytics Screenshot](https://github.com/user-attachments/assets/cf9824d3-23f7-47fe-b6f3-0186655fc866)

---

## Final Results
![Results Screenshot](https://github.com/user-attachments/assets/8f0835ce-2b8e-458d-9557-5894aa12c9b2)

---

# 🎥 Demo Video

> Add your YouTube demo video link here

[Watch Demo Video](YOUR_YOUTUBE_VIDEO_LINK)

---

# ✨ Features

# 🔐 Authentication System

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Current User Profile
- Logout System

---

# 🗳️ Poll Management

- Create Polls
- Dynamic Poll Options
- Public Poll Sharing
- Anonymous Voting Support
- Poll Expiry System
- Publish Final Results

---

# ⚡ Real-Time Features

- Socket.io Real-Time Updates
- Live Response Count
- Instant Dashboard Notifications
- Live Analytics Updates

---

# 📊 Analytics System

- Dynamic Bar Charts
- Total Vote Counts
- Option Wise Statistics
- Real-Time Poll Analytics
- Published Final Results

---

# 🎨 Frontend Features

- Responsive UI
- Tailwind CSS Design
- React Router Navigation
- Toast Notifications
- Mobile Friendly Interface

---

# 🛠️ Tech Stack

# Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast
- Recharts
- Socket.io Client

---

# Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Joi Validation
- Socket.io
- bcryptjs

---

# 📂 Folder Structure

```bash
PulseBoard/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreatePoll.jsx
│   │   │   ├── PollPage.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── socket/
│   │   │   └── socket.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── common/
│   │   │   ├── config/
│   │   │   │   └── db.js
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── error.middleware.js
│   │   │   │   └── validate.middleware.js
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── api-error.js
│   │   │       ├── api-response.js
│   │   │       └── jwt.utils.js
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── dto/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.middleware.js
│   │   │   │   ├── auth.model.js
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── auth.service.js
│   │   │   │   └── optional-auth.middleware.js
│   │   │   │
│   │   │   └── poll/
│   │   │       ├── dto/
│   │   │       ├── poll.controller.js
│   │   │       ├── poll.model.js
│   │   │       ├── poll.routes.js
│   │   │       └── poll.service.js
│   │   │
│   │   └── app.js
│   │
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=4000

NODE_ENV=development

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

JWT_EXPIRES_IN=1d

CLIENT_URL=http://localhost:5173
```

---

# 🚀 Installation & Setup

# 1️⃣ Clone Repository

```bash
git clone https://github.com/merupeshpradhan/PulseBoard.git
```

---

# 2️⃣ Navigate Into Project

```bash
cd PulseBoard
```

---

# 3️⃣ Install Frontend Dependencies

```bash
cd client
npm install
```

---

# 4️⃣ Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# 5️⃣ Run Backend Server

```bash
npm run dev
```

Backend will run on:

```bash
http://localhost:4000
```

---

# 6️⃣ Run Frontend

```bash
cd ../client
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 🔑 API Endpoints

# Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| GET | `/api/auth/me` | Get Current User |
| POST | `/api/auth/logout` | Logout User |

---

# Poll Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/polls/create` | Create Poll |
| GET | `/api/polls/:id` | Get Single Poll |
| GET | `/api/polls/my-polls` | Get User Polls |
| POST | `/api/polls/submit/:id` | Submit Vote |
| GET | `/api/polls/analytics/:id` | Poll Analytics |
| PATCH | `/api/polls/publish/:id` | Publish Results |
| GET | `/api/polls/results/:id` | Public Results |

---

# ⚡ Socket.io Real-Time System

PulseBoard uses Socket.io for real-time communication.

## Real-Time Features

- Instant vote updates
- Live dashboard notifications
- Real-time analytics updates
- Instant response count refresh

---

# 📊 Analytics System

The analytics dashboard provides:

- Dynamic vote charts
- Total response counts
- Option wise vote analysis
- Published final results
- Interactive chart visualization

Built using:

- Recharts
- ResponsiveContainer
- BarChart

---

# 🔒 Authentication Flow

# User Authentication Process

1. User registers/login
2. JWT token generated
3. Token stored in localStorage
4. Axios interceptor automatically attaches token
5. Protected backend routes verify JWT
6. Authenticated user gets access to dashboard features

---

# 🧠 Learning Highlights

This project demonstrates:

- Full Stack MERN Development
- REST API Architecture
- JWT Authentication
- Realtime Communication using Socket.io
- MongoDB Schema Design
- Backend Modular Architecture
- Joi Validation System
- Protected Routes
- React State Management
- Dynamic Data Visualization

---

# 🚀 Future Improvements

- Multi-question poll creation
- Poll comments system
- Dark mode support
- Email notifications
- Poll categories
- Admin dashboard
- Export analytics PDF
- OAuth Login
- Poll scheduling
- Live leaderboard system

---

# 👨‍💻 Author

# Rupesh Pradhan

Full Stack MERN Developer

## Connect With Me

### GitHub
https://github.com/merupeshpradhan

---

# ⭐ Support

If you like this project:

- ⭐ Star the repository
- 🍴 Fork the project
- 🛠️ Contribute improvements

---

# 📄 License

This project is licensed under the MIT License.

---

# 💡 Project Status

✅ Frontend Completed  
✅ Backend Completed  
✅ Authentication Implemented  
✅ Realtime Voting Implemented  
✅ Analytics Dashboard Implemented  
✅ Deployment Completed

---
