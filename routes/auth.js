const express = require('express')
const { authenticate } = require('passport')
const passport = require('passport')
const router = express.Router()


// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile']}))

// @desc    Google Auth Callback
// @route   GET / /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req,res)=>{
    res.redirect('/dashboard')
})

// @desc logout user
//@route /auth/logout
router.get('/logout', (req,res)=>{
    req.logOut()
    res.redirect('/')
})

module.exports = router