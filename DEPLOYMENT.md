# Deployment Guide

## Quick Deploy to Railway (Easiest)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically build and deploy
6. Get your public URL from the Railway dashboard

**Your app will be live in ~2 minutes!**

---

## Other Deployment Options

### Render
1. Go to [render.com](https://render.com)
2. "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Deploy (free tier available)

### Heroku
```bash
# Install Heroku CLI first
heroku login
heroku create your-app-name
git push heroku main
heroku open
```

### DigitalOcean App Platform
1. Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. "Create App" → Connect GitHub
3. Auto-detects Node.js
4. Deploy

---

## Sharing Your App

Once deployed, you'll get a URL like:
- Railway: `https://your-app.up.railway.app`
- Render: `https://your-app.onrender.com`
- Heroku: `https://your-app-name.herokuapp.com`

Share this URL with anyone - they can access it from any device!

---

## Important Notes

✅ **Database**: SQLite file persists on most platforms (use PostgreSQL for production)
✅ **Free Tiers**: Railway, Render, and Heroku offer free tiers
⚠️ **Sleep Mode**: Free tiers may "sleep" after inactivity (first request takes longer)
⚠️ **Custom Domain**: Upgrade to paid plans for custom domains

---

## Testing Locally with Ngrok (Quick Share)

For quick testing without deployment:

1. Install [ngrok](https://ngrok.com)
2. Start your app: `npm start`
3. In another terminal: `ngrok http 3000`
4. Share the ngrok URL (e.g., `https://abc123.ngrok.io`)

**Note**: Free ngrok URLs expire when you close the tunnel.
