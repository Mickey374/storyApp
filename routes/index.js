const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuests} = require('../middleware/auth')
const Story = require('../models/Story')


// @desc    Login/Landing Page
// @route   GET /
router.get('/', ensureGuests,(req, res)=>{
    res.render('login',{
        layout: 'login'
    })
})

// @desc    Dashboard
// @route   GET /
router.get('/dashboard', ensureAuth, async(req, res)=>{
    try {
        const stories = await Story.find({user: req.user.id}).lean()
        // console.log(req.user)
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    
})

module.exports = router