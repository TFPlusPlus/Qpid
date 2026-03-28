const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from project root (index.html, styles.css, script.js)
app.use(express.static(path.join(__dirname)));

// Minimal API placeholder — POST to /api/submission for server-side handling
app.post('/api/submission', (req, res) => {
  // For now just log and respond; replace with Firestore Admin or other logic if needed
  console.log('Received submission:', req.body);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server listening: http://localhost:${port}`);
});
