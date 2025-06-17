# 🍳 Cooking Assistant

A comprehensive culinary management platform that revolutionizes how you organize recipes, track ingredients, and plan meals. Built with modern web technologies to make cooking more enjoyable and efficient.

## ✨ Features

### 🔐 User Authentication

- Secure user registration and login system
- Personal recipe collections for each user
- Protected routes and personalized experience

### 📖 Recipe Management

- Create, edit, and delete your own recipes
- Browse all community recipes
- Advanced filtering by ingredients, cooking time, and recipe type
- Detailed recipe information with step-by-step instructions

### 🥬 Smart Ingredient Tracking

- Personal ingredient inventory management
- Automatic expiration date monitoring
- Storage condition recommendations
- Visual alerts for expired ingredients

### 🍽️ Menu Planning

- Create complete meal plans combining multiple recipes
- Categorize menus by meal type (breakfast, lunch, dinner)
- **Smart Missing Ingredients Detection** - automatically identifies what you need to buy in menu section
- Comprehensive meal preparation planning

### 📊 Advanced Analytics

- Recipe statistics and cooking insights
- PDF report generation
- Track your most and least used ingredients
- Analyze cooking patterns and preferences

## 🛠️ Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Styling**: CSS + Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js installed on your machine
- PostgreSQL installed and running
- A PostgreSQL query tool (pgAdmin, DBeaver, or psql)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cooking-assistant
   ```

2. **Setup Database**

   - Create a new PostgreSQL database
   - Open your preferred PostgreSQL query tool
   - Execute all queries from the `database.sql` file to create tables and initial data
   - Update your database connection settings (username, password, database name) in the backend configuration

3. **Setup Backend**

   ```bash
   cd backend
   npm i
   npm run dev
   ```

4. **Setup Frontend**

   ```bash
   cd frontend
   npm i
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to start using the application!

## 🎯 How It Works

1. **Register/Login** - Create your personal account
2. **Add Ingredients** - Track what you have in your kitchen
3. **Create Recipes** - Build your recipe collection with detailed instructions
4. **Plan Menus** - Combine recipes into complete meals
5. **Smart Shopping** - Get automatic shopping lists for missing ingredients
6. **Cook & Enjoy** - Follow your organized meal plans!

## 🌟 Key Highlights

- **Intelligent Inventory**: Never forget ingredients again with smart tracking
- **Community Recipes**: Access recipes from other users while keeping yours private
- **Meal Planning Made Easy**: Create complex menus with automatic ingredient analysis
- **Professional Reports**: Generate PDF statistics for your cooking journey
- **Modern UI**: Clean, intuitive interface that makes cooking planning enjoyable

## 🤝 Contributing

We welcome contributions! Feel free to submit issues and pull requests.

---

**Made with ❤️ for cooking enthusiasts who want to organize their culinary adventures!**
