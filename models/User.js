const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
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
            validator: function (value) {
                if (value === 'צוות') return true;
                return /^[א-ת]{1,2}\s?[0-9]{1,2}$/.test(value);
            },
            message: 'הכיתה חייבת להיות שכבה (א-יב) ומספר (1-20), בלי רווח ביניהם. למשל: י2'
        }
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student'
    }
}, 
{ timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;