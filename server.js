const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('./voting.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Create tables if they don't exist
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE NOT NULL,
      vote TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS page_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE NOT NULL,
      visit_count INTEGER DEFAULT 1,
      first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_visit DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Middleware to track visitors
app.use((req, res, next) => {
  let userId = req.cookies.userId;
  
  if (!userId) {
    userId = uuidv4();
    res.cookie('userId', userId, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 year
  }
  
  req.userId = userId;
  
  // Track page visit
  if (req.path === '/' || req.path === '/index.html') {
    db.get('SELECT * FROM page_visits WHERE user_id = ?', [userId], (err, row) => {
      if (err) {
        console.error('Error checking visit:', err);
      } else if (row) {
        db.run(
          'UPDATE page_visits SET visit_count = visit_count + 1, last_visit = CURRENT_TIMESTAMP WHERE user_id = ?',
          [userId]
        );
      } else {
        db.run('INSERT INTO page_visits (user_id) VALUES (?)', [userId]);
      }
    });
  }
  
  next();
});

// API Routes

// Get current user's vote
app.get('/api/vote', (req, res) => {
  db.get('SELECT vote FROM votes WHERE user_id = ?', [req.userId], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ vote: row ? row.vote : null });
    }
  });
});

// Submit or update vote
app.post('/api/vote', (req, res) => {
  const { vote } = req.body;
  
  if (vote !== 'yes' && vote !== 'no') {
    return res.status(400).json({ error: 'Invalid vote. Must be "yes" or "no"' });
  }
  
  db.get('SELECT * FROM votes WHERE user_id = ?', [req.userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (row) {
      // Update existing vote
      db.run(
        'UPDATE votes SET vote = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [vote, req.userId],
        (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to update vote' });
          } else {
            res.json({ success: true, message: 'Vote updated' });
          }
        }
      );
    } else {
      // Insert new vote
      db.run(
        'INSERT INTO votes (user_id, vote) VALUES (?, ?)',
        [req.userId, vote],
        (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to save vote' });
          } else {
            res.json({ success: true, message: 'Vote recorded' });
          }
        }
      );
    }
  });
});

// Admin API - Get statistics
app.get('/api/admin/stats', (req, res) => {
  const stats = {};
  
  // Get total unique visitors
  db.get('SELECT COUNT(DISTINCT user_id) as total FROM page_visits', (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    stats.totalVisitors = row.total;
    
    // Get vote counts
    db.all('SELECT vote, COUNT(*) as count FROM votes GROUP BY vote', (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      stats.votes = {
        yes: 0,
        no: 0
      };
      
      rows.forEach(row => {
        stats.votes[row.vote] = row.count;
      });
      
      stats.totalVotes = stats.votes.yes + stats.votes.no;
      
      // Get all votes with timestamps
      db.all(
        'SELECT user_id, vote, created_at, updated_at FROM votes ORDER BY updated_at DESC',
        (err, votes) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          
          stats.voteDetails = votes;
          res.json(stats);
        }
      );
    });
  });
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Voting app running at http://localhost:${PORT}`);
  console.log(`Admin page: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
