# HR Pro Chatbot - Frontend

Modern React application for the HR Pro Chatbot interface.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 Simple authentication system
- 💬 Chatbot interface integrated with Flowise
- 📱 Mobile-friendly design
- 🚀 Fast and optimized

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Then edit `.env` and set your Flowise URL:
```env
REACT_APP_FLOWISE_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Environment Variables

- `REACT_APP_FLOWISE_URL`: The URL of your Flowise chatbot instance (default: http://localhost:3000)

## Authentication

The current implementation uses localStorage for authentication. In production, you should integrate with a proper authentication service (e.g., JWT tokens, OAuth, etc.).

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── Auth/
│   │   │   └── SignIn.jsx
│   │   └── Chat/
│   │       └── ChatbotWidget.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── SignInPage.jsx
│   │   └── ChatPage.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── tailwind.config.js
```

## Technologies Used

- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (Icons)

## Notes

- Make sure your Flowise instance is running and accessible
- Configure CORS on your Flowise server if needed
- The chatbot iframe requires proper security headers

