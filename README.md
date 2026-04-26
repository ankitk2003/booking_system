# 🚀 Smart Booking System

A scalable backend system for booking workers with time slots, built using **Node.js, Express, MongoDB, and Redis (for caching)**.

---

# 📌 Overview

This project simulates a **service marketplace platform** where:

* Customers can view workers
* Check available slots
* Book a worker for a specific time
* Prevent double booking using **MongoDB unique index**
* Improve performance using **Redis caching**

---

# 🏗️ Architecture

## 🔹 MVC + Service Layer Pattern

This project follows a **clean and scalable architecture**:

### 📂 Structure

```id="c1m8pl"
/controllers   → Handle request/response  
/models        → Database schemas  
/routes        → API routes  
/services      → Business logic  
/config        → DB & Redis config  
/middleware    → Auth, error handling  
```

---

## 🔹 Flow

```id="s6f2ru"
Client → Routes → Controllers → Services → Models (DB)
                             ↓
                           Redis (Cache)
```

---

## 🔹 Responsibilities

### ✅ Controllers

* Handle HTTP request & response
* Call service layer

### ✅ Services

* Core business logic
* Booking validation
* Cache handling

### ✅ Models

* MongoDB schemas
* Data structure + indexes

---

# 🧠 System Design

## 🗂️ Collections (MongoDB)

---

### 👤 Users

```js id="9f5y1r"
{
  _id,
  name,
  email,
  password,
  role: "customer" | "worker"
}
```

---

### 🧑‍🔧 Workers

```js id="w8zx6u"
{
  _id,
  name,
  skills,
  rating
}
```

---

### 📅 Schedules

```js id="0g1kyo"
{
  _id,
  workerId,
  date: "DD/MM/YYYY",
  slots: [
    {
      slotId,
      startTime,
      endTime,
      isBooked: false
    }
  ]
}
```

---

### 📖 Bookings

```js id="5lzvx9"
{
  _id,
  workerId,
  customerId,
  slotId,
  date,
  startTime,
  endTime
}
```

---

# 🔒 Race Condition Handling

Handled using MongoDB unique index:

```js id="l3kqyy"
bookingSchema.index({ workerId: 1, slotId: 1 }, { unique: true });
```

## ✅ Why this works:

* Atomic operation at DB level
* Prevents duplicate bookings
* No race condition even under concurrent requests

---

# ⚡ Redis (Caching Layer)

Redis is used only for **performance optimization**.

---

## 🔹 Cache Worker Slots

* Key:

```id="9j2q3y"
worker:{workerId}:slots
```

---

## 🔹 Flow:

```id="3kz9wu"
Request → Check Redis  
        → If hit → return data ⚡  
        → If miss → fetch DB → store in Redis  
```

---

## 🔹 Cache Invalidation

* On booking:

```js id="6d6pdx"
await redis.del(`worker:${workerId}:slots`);
```

---

# 🔄 Booking Flow

```id="cwr3g3"
1. User selects worker & slot  
2. Request hits controller  
3. Controller calls booking service  
4. Service:
   - Validates slot
   - Creates booking  
5. MongoDB index ensures no duplicate  
6. Redis cache cleared  
```

---

# 📡 API Endpoints

---

## 🔹 Auth APIs

### Register

```http id="kqk3kz"
POST /api/auth/register
```

### Login

```http id="8q8a1w"
POST /api/auth/login
```

---

## 🔹 Worker APIs

### Get All Workers

```http id="o8dw3n"
GET /api/customer/workers
```

---

## 🔹 Schedule APIs

### Get Worker Slots (Cached)

```http id="l52o6u"
GET /api/customer/worker-slots/:workerId
```

---

## 🔹 Booking APIs

### Book Slot

```http id="km1o8k"
POST /api/customer/book-slot
```

### Body:

```json id="7fx9n9"
{
  "workerId": "string",
  "slotId": "string",
  "date": "DD/MM/YYYY",
  "startTime": "10:00",
  "endTime": "11:00"
}
```

---

### Get My Bookings

```http id="q7k0fa"
GET /api/customer/my-bookings
```

---

# ⚠️ Edge Cases Handling

---

## ✅ Double Booking

* Prevented via MongoDB unique index

---

## ✅ Concurrent Requests

* Only one succeeds (DB-level guarantee)

---

## ✅ Redis Failure

* System falls back to MongoDB

---

## ✅ Stale Cache

* Cache cleared after booking

---

# ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Redis (Caching)
* Docker

---

# ▶️ Run Locally

```bash id="1fw0zh"
git clone https://github.com/ankitk2003/booking_system
cd booking_system
npm install
```

---

## Setup `.env`

```env id="n6czhz"
PORT=3000
MONGO_URI=your_uri
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret
```

---

## Start Redis

```bash id="l7s2u3"
docker run -d -p 6379:6379 --name redis redis
```

---

## Run Server

```bash id="4hzn5x"
npm run dev
```

---

# 🧪 Test Credentials

```id="ikg2ey"

these are the id's to book slot
 
Email: customer1@gmail.com  
Password: ankit
role:customer

Email: customer2@gmail.com  
Password: ankit
role:customer


 these are the id's to create slot

Email: worker-1@gmail.com  
Password: ankit
role:customer


Email: worker-2@gmail.com  
Password: ankit
role:worker


```

---

# 📈 Performance

* Redis caching reduces DB load
* Faster API responses
* Efficient slot fetching

---

# 🧠 Design Decisions

* Used MVC + Service layer → clean separation of concerns
* Used MongoDB index → simple and reliable race condition handling
* Used Redis → only for caching (not locking)
* Cache invalidation ensures consistency

---

# 🚀 Future Improvements

* Redis distributed locking (advanced)
* WebSockets for real-time updates
* Smart worker recommendation
* Multi-city scaling

---

# 🎯 Conclusion

This system demonstrates:

* Clean architecture (MVC + services)
* Real-world booking flow
* Strong concurrency handling
* Performance optimization using Redis

---

# 👨‍💻 Author

Ankit Kumar
