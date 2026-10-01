const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'rider', 'admin', 'vendor'],
      default: 'student',
    },
    hostelDetails: {
      // Specific to IIT/IIM Jammu
      hostelName: String,
      roomNumber: String,
      campus: {
        type: String,
        enum: ['IIT Jammu', 'IIM Jammu'],
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
