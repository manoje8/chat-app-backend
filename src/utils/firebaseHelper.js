import auth from "../config/firebaseConfig.js";

const verifyAccessToken = async (req, res, next) => { 

    if(!req.headers['authorization']) return next('unAuthorized')

        try
        {
            const header = req.headers['authorization']
            const bearerToken = header.split(" ");
            const token = bearerToken[1];
        
            const payload = await auth.verifyIdToken(token)   

            
            if(payload)
            {
                req.payload = payload
                return next()
            }
        }
        catch(error)
        {
            console.log("UnAuthorized");
        }
}

const verifySocketToken = async (socket, next) => {
    const token = socket.handshake.auth.token
    try 
    {
        const payload = await auth.verifyIdToken(token)
        if(payload)
        {
            socket.payload = payload
            return next()
        }
    } catch (error) 
    {
        console.error("UnAuthorized token");
    }
}

export {verifyAccessToken, verifySocketToken}