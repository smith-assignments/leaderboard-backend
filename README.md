# 🏆 Leaderboard Backend

This is the **Node.js + Express + MongoDB backend** for the **Leaderboard System**, powering APIs for user management, point claiming, ranking, and claim history.

---

## 🚀 Features
- REST APIs for user creation, claiming points, leaderboard ranking.
- Random point allocation logic (1–10 points per claim).
- Claim history tracking stored in MongoDB.
- CORS enabled for frontend integration.

---

## 🛠 Tech Stack
- **Node.js** with **Express.js**
- **MongoDB** (Mongoose ODM)
- **Nodemon** for development

---

## 📡 API Endpoints
- GET /api/users → Fetch all users
- POST /api/users → Add new user
- POST /api/claim/:userId → Claim random points for a user
- GET /api/users/leaderboard → Fetch sorted leaderboard according to their rank
- GET /api/users/history → Fetches global history of claims of all users
- GET /api/users/history/:userId → Fetch claim history for a user
  
  {Refer to postman collection for API testing}

---

🔗 Frontend
Connects with the Leaderboard Frontend deployed at:
👉 [https://3w-leaderboard-smith.netlify.app/](https://3w-leaderboard-smith.netlify.app/)
