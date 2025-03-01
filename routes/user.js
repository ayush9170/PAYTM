const express = require('express')
const app = express();
const router = express.Router();
// import {User,Account} from "../db"
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET= "123@WBNITDGP"
const  { user_Middle} = require("../middleware");
const z = require("zod");




const signupBody = z.object({
    username: z.string().email(),
    password : z.string(),
    firstName:z.string(),
    LastName : z.string()
  });

router.post("/signup", async function(req,res){
    const{username,password,firstName,LastName} = req.body;
              const { success}=    signupBody.safeParse(req.body);
              if (!success) {
                return res.status(411).json({
                    message: "Email already taken / Incorrect inputs"
                })
            }

const user = await User.create({
    username : username,
    password : password,
    firstName: firstName,
    LastName : LastName
})

const  userId =  user._id;

await Account.create({
    userId,
    balance: 1 + Math.random() * 10000
})



res.json({
    message : "user successfully signed in"
  
})
})


const signinBody = z.object({
    username: z.string().email(),
	password: z.string()
})


router.post("/signin" , async function(req,res){
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return  res.json({
            message:"data formet not correct"
        })
    }
const {username ,password} = req.body;

const user = await User.findOne({
    username : username,
    password: password
})


    const token = jwt.sign({
        userId : user._id
    }, JWT_SECRET);


res.json({ token : token})
})


router.put("/", user_Middle ,async function(req,res){

   await User.updateOne(req.body,{
 id:req.id
    })

    res.json({
        message:"updated"
    })
})


router.get('/search',user_Middle, async (req, res) => {
    const query = req.query.q.toLowerCase();
    const user  = await User.find({
        username : query
    })
  
    res.json(user);
  });

  router.get('/people',user_Middle,async (req,res)=>{
    try {
        const people = await User.find();
        console.log(people); // Add logging to verify the data structure
        res.json({
          people
        });
      } catch (error) {
        console.error("Error fetching people:", error);
        res.status(500).json({ error: 'Failed to fetch people.' });
      }
  })

module.exports = router;



