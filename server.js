const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;
const SECRET_KEY = "mysecretkey123";

app.use(cors());
app.use(express.json());

// Dummy user
const user = {
  email: 'user@example.com',
  password: '12345',
};

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if(email === user.email && password === user.password) {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected route
app.get('/dashboard', (req, res) => {
  const authHeader = req.headers['authorization'];
  if(!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if(err) return res.status(403).json({ message: 'Invalid token' });
    res.json({ message: `Welcome to dashboard, ${decoded.email}` });
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
