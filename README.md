# UniConnect - Student Portal

A full-stack student portal built with React, Express, and modern web technologies.

## 🚀 Features

- **Firebase Authentication** - Secure user login and registration
- **Cloudinary Integration** - File upload and management
- **DeepSeek AI Assistant** - AI-powered study help
- **Student Dashboard** - Comprehensive student management interface
- **Modern UI** - Built with Tailwind CSS and Radix UI components

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, Node.js
- **Authentication**: Firebase Auth
- **File Storage**: Cloudinary
- **AI**: DeepSeek API
- **Database**: Drizzle ORM (configurable)
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Cloudinary account
- DeepSeek API key

## 🔒 Security & Environment Variables

### ⚠️ **IMPORTANT: Never Commit API Keys!**

Your project contains sensitive information like API keys. Follow these security practices:

1. **Environment Variables Setup:**
   ```bash
   # Copy the template (safe to commit)
   cp env.example .env
   
   # Edit .env with your real API keys (NEVER commit this file)
   nano .env
   ```

2. **Security Check:**
   ```bash
   # Verify your environment variables are properly set
   npm run check-env
   ```

3. **Git Security:**
   - `.env` file is already in `.gitignore`
   - Only `env.example` is committed (contains placeholders)
   - Your real API keys stay local and secure

### 🔐 **Required Environment Variables:**

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | [Firebase Console](https://console.firebase.google.com/) |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | [Firebase Console](https://console.firebase.google.com/) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | [Cloudinary Console](https://cloudinary.com/console) |
| `DEEPSEEK_API_KEY` | DeepSeek AI API Key | [DeepSeek Platform](https://platform.deepseek.com/) |

### 🚨 **Security Checklist:**

- [ ] `.env` file is in `.gitignore`
- [ ] `env.example` contains only placeholders
- [ ] Real API keys are only in local `.env`
- [ ] Run `npm run check-env` before deploying
- [ ] Use different keys for dev/production

## 🚀 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🌐 Vercel Deployment

1. **Connect your GitHub repository to Vercel**

2. **Set environment variables in Vercel dashboard:**
   - Go to your project settings
   - Add all environment variables from your `.env` file

3. **Deploy:**
   - Vercel will automatically detect the Vite configuration
   - Build command: `npm run build`
   - Output directory: `dist/public`

## 📁 Project Structure

```
UniConnect/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and configs
│   │   └── contexts/     # React contexts
├── server/                # Express backend
│   ├── routes.ts         # API routes
│   ├── ai.ts            # AI integration
│   └── storage.ts       # Database operations
├── shared/               # Shared schemas and types
└── dist/                 # Build output
```

## 🔐 Authentication

The app uses Firebase Authentication with the following features:
- Email/password login and registration
- Secure session management
- Protected routes

## 📤 File Upload

Cloudinary integration provides:
- Image and file upload
- Automatic optimization
- Secure cloud storage

## 🤖 AI Assistant

DeepSeek AI integration offers:
- Study assistance
- Educational content generation
- Student support chat

## 📱 Responsive Design

Built with mobile-first approach using Tailwind CSS for optimal experience across all devices.

## 🚨 Important Notes

- Ensure all environment variables are set in Vercel
- The backend API routes are prefixed with `/api`
- Client-side routing is handled by the Express server in production

## 📞 Support

For issues or questions, please check the project documentation or create an issue in the repository.
