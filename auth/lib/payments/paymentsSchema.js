const mongoose = require('mongoose');

const payments = mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: String, required: true },
    notes: { type: String, required: false },
    donorName: { type: String, required: false },
    currency: { type: String, required: true }
});

module.exports = mongoose.model('payments', payments);