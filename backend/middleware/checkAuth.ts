const jwt = require("jsonwebtoken");

module.exports = (req: any, res: any, next: any) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    } catch (error) {
        req.userData = null;
        next();
    }
};