# Digital Printing Shop Management System

## Overview
A full-stack management system for a digital printing shop, integrating:
- **Frontend**: React.js (User Interface)
- **Backend**: Node.js & Express (API & Business Logic)
- **Database**: MongoDB (Data Persistence)
- **AI Service**: Python (Delay & Risk Detection)

## Project Structure

```
/digital-printing-shop-management
│
├── /client                 # React.js Frontend
│   ├── /public             # Static assets & index.html
│   ├── /src
│   │   ├── /components     # Reusable UI (Buttons, Navbars)
│   │   ├── /pages          # Modules: UserMgmt, OrderMgmt, Inventory, etc.
│   │   ├── /services       # API calls (Axios/Fetch)
│   │   ├── /context        # Global state (Auth, Notifications)
│   │   └── App.js          # Routing
│   └── package.json
│
├── /server                 # Node.js/Express Backend
│   ├── /config             # MongoDB connection & Env variables
│   ├── /controllers        # Logic for Orders, Billing, & Inventory 
│   ├── /models             # MongoDB Schemas
│   ├── /routes             # API Endpoints
│   ├── /middleware         # Auth & Permissions
│   ├── /utils              # helpers
│   ├── index.js            # Entry point
│   └── package.json
│
├── /ai-service             # Python ML Service
│   ├── /data               # Training datasets
│   ├── /models             # Saved models
│   ├── /notebooks          # Experiments
│   ├── /src                # Source code
│   └── requirements.txt    # Python deps
```

## Getting Started

### Prerequisites
- Node.js
- Python 3.8+
- MongoDB

### Installation

1. **Server**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **AI Service**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   python src/app.py
   ```
