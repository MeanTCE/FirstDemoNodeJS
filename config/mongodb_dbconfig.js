// Import Mongodb
const MongoClient = require("mongodb").MongoClient

// Mongodb Connection String
// const url = "mongodb://localhost:27017/" // No user/passsword
//const url = "mongodb://Teerapat:123456@localhost:27017/" // With user/password

var _db                                     //ไว้เก็บ object ของ connection
var dbname = "smartinvdb"

//MongoDB Atlas
const url = "mongodb+srv://MeanTCE:Mean1820@cluster0.3srql.mongodb.net/"+dbname

const connectDb = (callback) => {
    if (_db) return callback()
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
        if (err) return console.log(err)
        _db = client.db(dbname) 
        console.log("Database Connected")
        callback()
    })
}

const getDb = () => _db

module.exports = {
    connectDb,
    getDb
}