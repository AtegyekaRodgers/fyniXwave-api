const mongoose = require('mongoose');

const Payment = require('../models/payment');

// Creating a new payment log
Payment.create = async (req, res) => {
    /* req.body = 
        {
            user: "...",  //user _id
            paidFor: "...", //enum[ "course", "career_session"]
            item: "...",  //course_id, or session_id, or skill_id
            amountPaid: "..."
        }
    */ 
  try {
    let paymentData = {
            user:      req.body.user_id,
            paidFor:   req.body.paidFor,
            item_id:   req.body.item_id,
            amountPaid:req.body.amountPaid
        }
    const paymentt = new Payment(paymentData);
    await paymentt.save();
    res.status(200).send({ success: 'Payment record successfully saved' });
  } catch (err) {
    res.status(500).send({error: err.message || 'An error occured while saving a new payment record'});
  }
};

// Retrieve all payment for a specific user
Payment.readAll = async (req, res) => {
  try {
    const payments = await Payment.find()
    .where('user').equals(req.body.user_id);
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).send({error: err.message || 'An error occured while retrieving payments '});
  }
};


module.exports = { Payment };



