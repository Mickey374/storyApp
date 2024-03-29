const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')


// @desc    Show add Page
// @route   GET /stories/add
router.get('/add', ensureAuth,(req, res)=>{
    
    try {
        res.render('stories/add')
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})


// @desc    Process the add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res)=>{
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')

    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

// @desc    Show all Stories Collection
// @route   GET /stories
router.get('/', ensureAuth, async (req, res)=>{
    
    try {
        const stories = await Story.find({status: 'public'}).populate('user').sort({createdAt: -1}).lean()

        res.render('stories/index', {stories})
    } catch (err) {
        console.log(err)
        res.render('error/500')

    }
})

// @desc    Show Stories Page
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res)=>{
    try {
        let story = await Story.findById(req.params.id).populate('user').lean()

        if(!story){
            return res.render('error/404')
        }

        res.render('stories/show', {
            story
        })
    } catch (err) {
        console.log(err)
        res.render('error/404')
    }
})

// @desc    Show Edit stories Page
// @route   GET /stories/edit/${storyId}
router.get('/edit/:id', ensureAuth, async (req, res)=>{

    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
    
        if (!story) {
            return res.render('error/404')
        }
    
        //Redirect if Logged User != Story Owner
        if(story.user != req.user.id){
            res.redirect('/stories')
        } else{
            res.render('stories/edit', {
                story,
            })
        }
    }  catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

// @desc    Update Story
// @route   PUT /stories/edit/:id
router.put('/:id', ensureAuth,async (req, res)=>{

    try {
        let story = await Story.findById(req.params.id).lean()

    if(!story){
        return res.render('error/404')
    }

    //Redirect if Logged User != Story Owner
    if(story.user != req.user.id){
        res.redirect('/stories')
    } else {
        story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            runValidators: true
        })

        res.redirect('/dashboard')
        }
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }

    
})

// @desc    Delete Stories
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth,async (req, res)=>{
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

// @desc    User Stories Page
// @route   GET /stories/user/userID
router.get('/user/:userId', ensureAuth, async (req, res)=>{
    
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        }).populate('user').lean()

        res.render('stories/index',{
            stories
        })
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})


module.exports = router