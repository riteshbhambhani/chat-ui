import { MongoClient } from "mongodb";
import dotnet from 'dotenv'
let db = null

const connectDB = async (done) => {
    try {
        var data = await MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, retryWrites :false,tlsAllowInvalidCertificates:true,tlsAllowInvalidHostnames:true })
        db = data.db('chatGPT')
        done()
    } catch (err) {
        done(err)
    }
}

export { connectDB, db }