# PM2 Setup Guide

This guide explains how to use PM2 to manage the HR Chatbot Frontend application.

## Prerequisites

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Install `serve` package for serving the built React app:
```bash
npm install -g serve
```

Or add it to your project:
```bash
cd frontend
npm install --save-dev serve
```

## Building the Application

Before running with PM2, build the React application:

```bash
cd frontend
npm run build
```

## Running with PM2

### Production Mode

Start the application in production mode (serves the built app):

```bash
cd frontend
pm2 start ecosystem.config.js --only hr-chatbot-frontend
```

Or if you want to run it directly:

```bash
pm2 start ecosystem.config.js
```

### Development Mode

To run in development mode (uses react-scripts start):

```bash
cd frontend
pm2 start ecosystem.config.js --only hr-chatbot-frontend-dev
```

## PM2 Commands

- **Start application**: `pm2 start ecosystem.config.js`
- **Stop application**: `pm2 stop hr-chatbot-frontend`
- **Restart application**: `pm2 restart hr-chatbot-frontend`
- **Delete application**: `pm2 delete hr-chatbot-frontend`
- **View logs**: `pm2 logs hr-chatbot-frontend`
- **Monitor**: `pm2 monit`
- **Status**: `pm2 status`
- **Save current process list**: `pm2 save`
- **Start on system boot**: `pm2 startup` (then follow the instructions)

## Configuration

The `ecosystem.config.js` file contains two configurations:

1. **hr-chatbot-frontend** - Production mode (serves built files using `serve`)
2. **hr-chatbot-frontend-dev** - Development mode (uses `npm start`)

You can modify the port, environment variables, and other settings in the config file.

## Logs

Logs are stored in the `frontend/logs/` directory:
- `pm2-error.log` - Error logs
- `pm2-out.log` - Standard output logs
- `pm2-combined.log` - Combined logs

Make sure the `logs` directory exists:
```bash
mkdir -p frontend/logs
```

## Environment Variables

You can set environment variables in the `ecosystem.config.js` file under the `env` section, or use a `.env` file (make sure it's loaded by your application).

## Updating the Application

After making changes and rebuilding:

1. Build the application: `npm run build`
2. Restart PM2: `pm2 restart hr-chatbot-frontend`

