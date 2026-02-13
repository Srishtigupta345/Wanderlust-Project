const User = require("../Models/user");


module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) =>  {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        // passport-local-mongoose method
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        // Automatic Login as registred User
        req.login(registeredUser, (err) => {
            if(err) {
                console.log("LOGIN ERROR:", err);
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) =>  {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success" , "Welcome back to Wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
          return next(err); 
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
}