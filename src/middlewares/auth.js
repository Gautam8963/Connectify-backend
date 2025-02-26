const adminAuth = (req,res,next)=>{
    const token = "xyz";
    const isAuthorized = token === 'xy';
    if(!isAuthorized){
        res.status(401).send("Non-authorized user")
    }else{
        next();
    }
}

const userAuth = (req,res,next)=>{
    const token = "xyz";
    const isAuthorized = token === 'xy';
    if(!isAuthorized){
        res.status(401).send("Non-authorized user")
    }else{
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth,
};