# Qpid

Minimal Firebase input demo with a small Node.js static server.

This project includes a tiny frontend with three input boxes and Firestore wiring (client-side placeholder), plus a minimal Express server for local serving and a placeholder API.

Files of interest:

- [index.html](index.html)
- [styles.css](styles.css)
- [script.js](script.js)
- [server.js](server.js)

Run locally (Node.js):

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open http://localhost:3000 in your browser.

Notes:

- `server.js` serves the static site and exposes a placeholder POST endpoint at `/api/submission` that logs received JSON. If you want server-side Firestore writes, I can add Firebase Admin integration (requires a service account key).
- Replace the `firebaseConfig` object in `script.js` with your Firebase project config for client-side Firestore usage.

