const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
//mongoose.connect(process.env.USERDB, {useNewUrlParser: true})
router.get('/', async (req, res) => {
    try {
      const users = await User.find()
      res.send(users)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })


router.post('/:id/setProfilePictures',async (req,res) => {
  let user
  user = await User.findOneAndUpdate({
    username: req.params.id
  }, {
    $set: {
      profilePicture: req.body.profilePicture,
      profileBanner: req.body.profileBanner,

    },

  })
  res.json(user)
}) 


router.post('/signup', async (req,res) => {
    const badEmail = await User.find({email: req.body.email })
    const badUsername = await User.find({username: req.body.username })
    if(badEmail !== null || badUsername !== null){
      res.send("Error:11")
    } else{
      try{
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt) 
        console.log(salt)
        console.log(hashedPassword)
        const users = new User({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email
        })
        const newUser = await users.save()
        res.send(users.username)
        //res.status(201).json(newUser)
      }catch(err){
        res.status(400).json({message: err.message})
      }
    }
    
    
})
router.get('/:id', getUserByName, (req, res) => {
  res.json(res.user)
})

async function getUserByName(req, res, next){
  let user
  try {
    user = await User.find({username: req.params.id})
      if (user == null){
          return res.status(404).json({message: 'Cannot find user'})
      }
  } catch(err){
      return res.status(500).json({message: err.message})
  }

  res.user = user
  return next();
}



router.delete('/:id', getUser, async (req,res) => {
  try{
   await res.user.remove()
   res.json({message: "deleted"})

  } catch(err){
   res.status(500).json({message: err.message})
  }
})

async function getUser(req, res, next){
  let user
  try {
    user = await User.findById(req.params.id)
      if (user == null){
          return res.status(404).json({message: 'Cannot find user'})
      }
  } catch(err){
      return res.status(500).json({message: err.message})
  }

  res.user = user
  return next();
}



router.post('/login', async (req, res) => {
  const user = await User.find({email: req.body.email})
  //console.log(req.body.password, req.body.email)
  if(user === null) {
     return res.status(400).send('cannot find user')
   }
  try {
    
   if(await bcrypt.compare(req.body.password, user[0].password)){
      
     res.send(user[0].username)
      console.log(user[0].email + "is logged in " + user[0].password)
   } else{
    res.send('wrong')
    console.log("wrong")
    }
  } catch{
    res.status(500).send('error!')
  }

})

  module.exports = router