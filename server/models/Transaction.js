const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/ // Email validation
    },
    description: {
        type: String,
        default: 'No description provided'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    transactionType: {
        type: String,
        enum: ['credit', 'debit'],
        default: 'credit'
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed', 'cancelled'],
        required: true
    },
    planType: {
        type: String,
        default: 'Standard'
    },
    transactionReference: {
        type: String,
        required: true,
        unique: true
    },
    currencyCode: {
        type: String,
        default: 'NGN'
    },
    paymentMethod: {
        type: String,
        default: 'bank_transfer'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
