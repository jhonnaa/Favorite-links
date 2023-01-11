module.exports = {
    isLogedIn(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        return res.redirect('/signin')
    },

    isNotLogedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next()
        }
        return res.redirect('/profile')
    }
    
}