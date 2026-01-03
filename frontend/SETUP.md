# Quick Setup Guide

## Installation Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   
   Create a `.env` file in the frontend directory with the following content:
   ```
   REACT_APP_FLOWISE_URL=http://localhost:3000
   ```
   
   Replace `http://localhost:3000` with your actual Flowise chatbot URL.

4. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open at http://localhost:3000 (or another port if 3000 is taken).

## What's Included

✅ Modern landing page with hero section, features, and benefits  
✅ Simple sign-in page with authentication  
✅ Chatbot interface page that integrates with Flowise  
✅ Responsive design with Tailwind CSS  
✅ React Router for navigation  
✅ Modern UI components with Lucide React icons  

## Authentication

For demo purposes, the sign-in accepts any email and password. In production, you should integrate with a proper authentication service.

## Flowise Integration

Make sure your Flowise instance is running and accessible at the URL specified in `.env`. The chatbot will be embedded as an iframe on the chat page.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

