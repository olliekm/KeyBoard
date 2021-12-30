 const express = require('express')
 const router = express.Router()
 const Subscriber = require('../models/subscriber')
 const multer = require('multer')
 const path = require('path')
 const User = require('../models/user.js')


 const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, './Images')
  },

  filename: (req, file, cb) =>{
    cb(null, Date.now() + path.extname(file.originalname))
  }
})


router.post('/:id/like/:userId', async (req,res) =>{
  let post
  try{
    post = await Subscriber.findOneAndUpdate({
      _id: req.params.id
    }, {
      $addToSet: {
        usersLiked: req.params.userId
      },
  
    })
    
  }catch{
      return res.status(500).json("Server Error in attempt to like post!")
  }
  res.send(post)
  
})

router.post('/:id/dislike/:userId', async (req,res) =>{
  let post
  try{
    post = await Subscriber.findOneAndUpdate({
      _id: req.params.id
    }, {
      $pull: {
        usersLiked: req.params.userId
      },
  
    })
    
  }catch{
      return res.status(500).json("Server Error in attempt to dislike post!")
  }
  res.send(post)
  
})

const upload = multer({storage: storage})


  router.get('/posts/:name', getPosts, async (req,res) =>{
      res.json(res.posts)
      //console.log(res.posts)
  })


  async function getPosts(req, res, next){
    let posts
    try {
        posts = await Subscriber.find({author: req.params.name})
        if (posts == null){
            return res.status(404).json({message: 'Cannot find posts'})
        }
    } catch(err){
        return res.status(500).json({message: err.message})
    }

    res.posts = posts
    return next();
}

 // Getting all
 router.get('/', async (req, res) => {
    try {
      const subscribers = await Subscriber.find()
      res.json(subscribers)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  
  // Getting One
  router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber)
  })

// Creating one
router.post('/', async (req,res) => {

    const subscriber = new Subscriber({
        name: req.body.name,
        lastName: req.body.lastName,
        desc: req.body.desc,
        author: req.body.author,
        image: req.body.image,
        likeCount: req.body.likes,
    })
    try {
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
        const user = await User.find({username: req.body.author})
        let myNewString = subscriber._id.toString()
        //user[0].posts.insertOne(myNewString)
    } catch(err) {
        res.status(400).json({message: err.message})
    }

})
// Update one
router.patch('/:id',getSubscriber, async (req,res) => {
    if(req.body.name != null){
       res.subscriber.name = req.body.name
     }
    if(req.body.subscriberToChannel != null){
      res.subscriber.subscriberToChannel = req.body.subscriberToChannel
    }
    try{
      const updatedSubscriber = await res.subscriber.save()
      res.json(updatedSubscriber)
    }catch(err){
      res.status(400).json({message: "ERROR"})
    }
})
// Delete one
router.delete('/:id', getSubscriber, async (req,res) => {
     try{
      await res.subscriber.remove()
      res.json({message: "deleted"})

     } catch(err){
      res.status(500).json({message: err.message})
     }
})
//get images
router.get('/upload', async (req, res) => {
  try {

  } catch (err) {

  }
})
//upload images images

router.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file)
  res.send("uploiading")
  
});

async function getSubscriber(req, res, next){
    let subscriber
    try {
        subscriber = await Subscriber.findById(req.params.id)
        if (subscriber == null){
            return res.status(404).json({message: 'Cannot find subscriber'})
        }
    } catch(err){
        return res.status(500).json({message: err.message})
    }

    res.subscriber = subscriber
    return next();
}

 module.exports = router