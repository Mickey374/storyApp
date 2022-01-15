module.exports = {

    ensureAuth: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        else{
            res.redirect('/')
        }
    },

    ensureGuests: function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }
        else{
            return next()
        }
    },

}