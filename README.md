# Voting App

A simple voting application where users can vote yes/no without logging in, and administrators can view voting statistics and visitor counts.

## Features

### Public Page
- Vote Yes/No without login
- Change your vote anytime
- Cookie-based user tracking
- Clean, modern UI

### Admin Dashboard
- View total unique visitors
- See vote counts (Yes/No)
- View vote distribution percentage
- See detailed vote history with timestamps
- Auto-refresh every 30 seconds
- Real-time statistics

## Technologies Used

- **Backend**: Node.js with Express
- **Database**: SQLite
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Session Management**: Cookie-based tracking with UUID

## Installation

1. Install Node.js (if not already installed)

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at:
- Public voting page: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

## Project Structure

```
voting-app/
├── server.js           # Express server and API endpoints
├── package.json        # Project dependencies
├── voting.db          # SQLite database (created automatically)
├── public/
│   ├── index.html     # Public voting page
│   └── admin.html     # Admin dashboard
└── README.md          # This file
```

## How It Works

1. **User Tracking**: Each visitor receives a unique cookie ID that persists for 1 year
2. **Voting**: Users can vote and change their vote; the system tracks both initial vote and updates
3. **Statistics**: Admin dashboard shows real-time data including:
   - Total unique visitors (based on cookies)
   - Vote counts and percentages
   - Detailed vote history with timestamps

## API Endpoints

- `GET /api/vote` - Get current user's vote
- `POST /api/vote` - Submit or update vote (body: `{ "vote": "yes" | "no" }`)
- `GET /api/admin/stats` - Get all voting statistics (for admin dashboard)

## Notes

- The database file `voting.db` is created automatically on first run
- User tracking is cookie-based, so clearing cookies will create a new user ID
- No authentication is required for any page (add authentication for production use)

## Future Enhancements

- Add admin authentication
- Add multiple voting questions
- Export statistics to CSV
- Add charts and visualizations
- Mobile app version
