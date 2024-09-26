import auth from "../config/firebaseConfig.js";

class User
{
    static async getUsersForSidebar(req, res, next)
    {
        const loggedInUserId = req.payload.uid


        try 
        {
            const allUsers = await auth.listUsers()
            
            // Except Authenticated user
            const filteredUsers = allUsers.users.filter((user) => user.uid !== loggedInUserId)
            
            res.status(200).send({users:filteredUsers})
            
        } 
        catch (error) 
        {
            console.log("Error", error);
            next(error)
        }
    }
}

export default User