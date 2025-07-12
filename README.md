# ReWear - Community Clothing Exchange Platform

A full-stack web application that promotes sustainable fashion by enabling users to exchange clothes through direct swaps or a point-based system.

## 🌟 Features

### Core Functionality
- *User Authentication*: JWT-based authentication with role management (user/admin)
- *Item Management*: Upload, browse, and manage clothing items with image support
- *Swap System*: Direct item swapping between users
- *Point System*: Earn and spend points for item exchanges
- *Admin Panel*: Content moderation and platform management
- *Responsive Design*: Mobile-first design with Tailwind CSS

### AI-Ready Features (Placeholders)
- Auto-tagging system for item descriptions
- Image moderation for inappropriate content
- Smart recommendations based on user preferences
- Description enhancement using AI
- AI chat assistant for user guidance

## 🛠 Tech Stack

### Frontend
- *React 18* with JSX
- *Tailwind CSS* for styling
- *React Router* for navigation
- *React Hook Form* with Yup validation
- *Axios* for API communication
- *React Hot Toast* for notifications
- *Headless UI* for accessible components
- *Heroicons* for icons

### Backend
- *Node.js* with Express.js
- *MongoDB* with Mongoose ODM
- *JWT* for authentication
- *Bcrypt* for password hashing
- *Multer* for file uploads
- *Express Validator* for input validation
- *Helmet* for security
- *CORS* for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. *Clone the repository*
   bash
   git clone <repository-url>
   cd rewear-platform
   

2. *Install dependencies*
   bash
   npm install
   

3. *Set up environment variables*
   bash
   cp .env.example .env
   
   
   Update the .env file with your configuration:
   env
   MONGODB_URI=mongodb://localhost:27017/rewear
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   

4. *Start MongoDB*
   Make sure MongoDB is running on your system.

5. *Run the application*
   
   *Development mode (both frontend and backend):*
   bash
   npm run dev:full
   
   
   *Or run separately:*
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run dev
