const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // שורת הקסם שקוראת את הסודות מקובץ ה-.env

const app = express();
const port = 5000;

// הגדרת חיבור למסד הנתונים בענן
// אנחנו משתמשים בקישור שהחבאנו ב-process.env.MONGO_URI
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas!'))
    .catch((err) => console.log('❌ Failed to connect to MongoDB', err));

// נתיב בדיקה כדי לראות שהשרת מגיב
app.get('/', (req, res) => {
    res.send('ברוכה הבאה לשרת הטיול השנתי של בנות משה!');
});

// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});