require('dotenv').config(); // שורת הקסם שקוראת את הסודות מקובץ ה-.env
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // מייבאים את תבנית המשתמש שבנינו
const cors = require('cors'); // 1. מייבאים את שומר הסף

const app = express();
const port = 5000;
app.use(cors()); // 2. מאפשר לאתר שלנו (5173) לדבר עם השרת (5000)
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
        // --- התוספת שלנו למניעת כפילויות ---
        // שגיאה 11000 במונגו אומרת "כפילות נתונים - ייחודיות הופרה"
        if (error.code === 11000) {
            return res.status(400).send('תעודת הזהות הזו כבר רשומה במערכת! 🛑');
        }
        
        // השורה שהייתה חסרה: אם משהו אחר השתבש (למשל חסר שם), נחזיר את השגיאה
        res.status(400).send(error.message);
    }
});

// נתיב התחברות (Login) - שומר הסף שבודק אם זו מורה
app.post('/login', async (req, res) => {
    try {
        // 1. השרת מקבל את תעודת הזהות שהלקוח (ריאקט) שלח לו
        const { idNumber } = req.body; 

        // 2. השרת מחפש במונגו משתמשת עם תעודת הזהות הזו
        const user = await User.findOne({ idNumber: idNumber });

        // 3. אם הוא לא מצא אף אחת כזו:
        if (!user) {
            return res.status(404).json({ message: "תעודת הזהות לא קיימת במערכת." });
        }

        // 4. אם הוא מצא, אבל התפקיד שלה הוא לא 'מורה':
        if (user.role !== 'teacher') {
            return res.status(403).json({ message: "גישה חסומה. הצפייה מותרת למורות ומלוות בלבד!" });
        }

        // 5. אם הכל בסדר והיא מורה, ניתן לה אישור כניסה:
        res.status(200).json({ message: "התחברות מוצלחת!", user: user });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "שגיאה בשרת, אנא נסי שוב." });
    }
});

// נתיב חכם לשליפת משתמשים לפי תנאים (פילטור) - עונה על דרישת השליפות השונות!
app.get('/users', async (req, res) => {
    try {
        // req.query לוקח את כל מה שכתוב אחרי סימן השאלה בכתובת האינטרנט
        // למשל: ?className=יב1&role=student
        const filter = req.query; 
        
        // מונגו יחפש עכשיו רק את מי שמתאים לפילטר! אם הפילטר ריק - הוא יביא את כולם.
        const users = await User.find(filter); 
        
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "שגיאה בשליפת הנתונים", error: error.message });
    }
});

// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});