require('dotenv').config(); // שורת הקסם שקוראת את הסודות מקובץ ה-.env
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // מייבאים את תבנית המשתמש שבנינו

const app = express();
const port = 5000;
app.use(express.json()); // מתורגמן שמאפשר לשרת לקרוא נתונים שנשלחים אליו

// הגדרת חיבור למסד הנתונים בענן
// אנחנו משתמשים בקישור שהחבאנו ב-process.env.MONGO_URI
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas!'))
    .catch((err) => console.log('❌ Failed to connect to MongoDB', err));

// נתיב בדיקה כדי לראות שהשרת מגיב
app.get('/', (req, res) => {
    res.send('ברוכה הבאה לשרת הטיול השנתי של בנות משה!');
});

// נתיב הרשמה - מקבל נתונים ושומר במסד הנתונים
app.post('/register', async (req, res) => {
    try {
        // 1. השרת לוקח את הנתונים שהגיעו בבקשה (req.body) ויוצר מהם משתמשת חדשה
        const newUser = new User(req.body);
        
        // 2. פקודה למונגו לשמור אותה בענן (await אומר - תחכה עד שזה יסיים)
        await newUser.save(); 
        
        // 3. מחזירים תשובה מוצלחת ללקוח
        res.status(201).send('המשתמשת נשמרה בהצלחה במסד הנתונים! 🎉');
        
    } catch (error) {
        // אם משהו השתבש (למשל חסר שם או הת.ז לא 9 ספרות), נחזיר את השגיאה
        res.status(400).send(error.message);
    }
});
// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});