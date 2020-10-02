const mongoose = require('mongoose');

const payments = mongoose.Schema({
    userId: { type: Number, required: true },
    donorId: { type: Number, required: true },
    date: { type: Date, required: true },
    amounts: { type: String, required: true },
    notes: { type: String, required: true },

});

module.exports = mongoose.model('payments', payments);