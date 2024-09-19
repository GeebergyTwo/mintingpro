const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    isUserActive: {
        type: Boolean,
        default: false
    },
    referralRedeemed: {
        type: Boolean,
        default: false
    },
    deposit: {
        type: Number,
        default: 0
    },
    country: {
        type: String,
        default: 'Nigeria'
    },
    role: {
        type: String,
        default: 'user'
    },
    inactiveReferrals: {
        type: Number,
        default: 0
    },
    activeReferrals: {
        type: Number,
        default: 0
    },
    referralsCount: {
      type: Number,
      default: 0
    },
    balance: {
        type: Number,
        default: 0,
        min: 0 // balance in naira
    },
    mint_rate: {
        type: Number,
        default: 0,
        min: 0 // mint rate in naira
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Email validation
    },
    phone_no: {
        type: String,
        required: true,
        unique: true,
        // Add regex to validate phone number format
    },
    password: {
        type: String,
        required: true // This will hold the hashed password
    },
    userReferralCode: {
        type: String,
        unique: true // Unique referral code for this user
    },
    referredBy: {
        type: String, // Referral code used to sign up, if any
        default: null
    },
    walletAddress: {
        type: String,
        unique: true // Unique wallet address for this user
    },
    mint_points: {
        type: Number,
        default: 0
    },
    completed_tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task' // Assuming you have a Task model
    }]
}, { timestamps: true });

const User = mongoose.model('User', schema);
module.exports = User;
