const express = require('express')
const app = express()
const { User, Account } = require("../db");
const  { user_Middle} = require("../middleware");
const mongoose = require('mongoose');
const router = express.Router();




router.get("/balance", user_Middle ,async function(req,res){

    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance : account.balance
    })
})



router.post("/transfer", user_Middle, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        account.balance -= amount;
        toAccount.balance += amount;

      
        await account.save();
        await toAccount.save();

       
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
            message: "An error occurred during the transfer",
            error: error.message
        });
    }
});

module.exports = router;

