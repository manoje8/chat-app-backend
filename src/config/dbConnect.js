import mongoose from "mongoose";

class Mongo
{
    static async connect()
    {
        const MONGODB_URI = process.env.MONGODB_URI;
        if(!MONGODB_URI) throw new Error("MongoDB URI is missing")

        await mongoose.connect(MONGODB_URI, {
            dbName: process.env.DATABASE_NAME,
            bufferCommands: false
        })
        .then(() => console.log('MongoDB is connected'))
        .catch((err) => console.error('Error connectiong to MongoDB', err))
    }
}

export default Mongo