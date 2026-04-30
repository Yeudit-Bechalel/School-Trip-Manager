require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const cors = require('cors');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' Connected to MongoDB Atlas!'))
    .catch((err) => console.log(' Failed to connect to MongoDB', err));
app.get('/', (req, res) => {
    res.send('ברוכה הבאה לשרת הטיול השנתי של בנות משה!');
});

app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send('המשתמשת נשמרה בהצלחה במסד הנתונים! ');
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send('תעודת הזהות הזו כבר רשומה במערכת!');
        }
        res.status(400).send(error.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { idNumber } = req.body;
        const user = await User.findOne({ idNumber: idNumber });
        if (!user) {
            return res.status(404).json({ message: "תעודת הזהות לא קיימת במערכת." });
        }
        if (user.role !== 'teacher') {
            return res.status(403).json({ message: "גישה חסומה. הצפייה מותרת למורות ומלוות בלבד!" });
        }
        res.status(200).json({ message: "התחברות מוצלחת!", user: user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "שגיאה בשרת, אנא נסי שוב." });
    }
});

app.get('/users', async (req, res) => {
    try {
        const filter = req.query;
        const users = await User.find(filter);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "שגיאה בשליפת הנתונים", error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});