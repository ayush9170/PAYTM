const mongoose = require('mongoose');
require('dotenv').config()

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


mongoose.connect(process.env.mongo_url).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));



const user = new Schema({
 username:{type:String, required: true},
 password: {type:String, required: true ,  minLength: 6},
 firstName: {type:String, required: true,  maxLength: 20},
 LastName: {type:String, required: true , maxLength :20}
});

const  account = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {type:Number , required:true }
});

const User = mongoose.model('user', user );
const Account =  mongoose.model('account', account);

module.exports={
    User,
    Account
}
