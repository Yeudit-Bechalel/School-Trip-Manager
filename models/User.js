const mongoose = require('mongoose');//יבוא ספריית 

// תבנית משתמש אחידה - גם למורות וגם לתלמידות
const userSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: true, // שם פרטי ומשפחה
       match: [/^[א-ת]{2,}(\s+[א-ת]{2,})+$/, 'יש להזין רק אותיות ורווחים (לפחות שני שמות, כל אחד לפחות 2 אותיות).']
    },
    idNumber: { 
        type: String, 
        required: true,
        unique: true,
        match: [/^\d{9}$/, 'תעודת הזהות חייבת להכיל בדיוק 9 ספרות!'] 
    },
    className: {
     type: String,
     required: true,
     validate: {
      validator: function(value) {
        // פטור למורות ולצוות: אם הריאקט שלח את המילה "צוות", הכל תקין ונאשר את השמירה
        if (value === 'צוות') return true;
        
        // אם זו תלמידה, נבדוק את הכיתה לפי הכללים הרגילים
        return /^[א-ת]{1,2}\s?[0-9]{1,2}$/.test(value);
      },
      message: 'הכיתה חייבת להיות שכבה (א-יב) ומספר (1-20), עם או בלי רווח ביניהם. למשל: יא2 או יא 2'
     }
    },
    role: {
        type: String,
        enum: ['student', 'teacher'], // חשוב: מגביל את האפשרויות רק לשתי אלו!
        default: 'student' // אם לא ציינו אחרת, נניח שזו תלמידה
    }
}, { timestamps: true });//חותמת זמן הכנסה וזמן עידכון

const User = mongoose.model('User', userSchema);
module.exports = User;