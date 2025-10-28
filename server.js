// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

const users = {}; // In-memory user storage; replace with database for production
const JWT_SECRET = "yash_key";

// Sign Up Endpoint
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (users[email]) {
        return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users[email] = { username, email, password: hashedPassword };
    res.json({ message: "Signup successful" });
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users[email];
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
        { email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: '140h' }
    );
    res.json({ message: "Login successful", token });
});

app.listen(5004, () => {
    console.log('Server running on http://localhost:5004');
});
