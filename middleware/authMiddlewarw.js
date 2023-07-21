
const jwt =require('jsonwebtoken')

exports.appMiddlewares = (req, res, next) => {
    console.log("Applicatiuon Specific Middleware");
    next()
}
exports.jwtMiddleware = (req, res, next) => {
    console.log("inside jwtMiddleware");
    // get token from req header
    const token = req.headers["access-token"]
    // verify token
    try {
        const {loginAcno} = jwt.verify(token,"supersecretkey12345")
        console.log(loginAcno);
        req.loginData=loginAcno
        next()
    }
    catch {
        res.status(406).json("Please login")
    }
}