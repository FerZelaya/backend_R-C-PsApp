let mongoClient = require('mongodb').MongoClient

let _db

module.exports = class {
    static async getDB(){
        if(_db){
            return _db
        } else {
            try {
                let client = await mongoClient.connect(process.env.MONGODBURI, {useNewUrlParser:true, useUnifiedTopology:true})
                _db = client.db(process.env.MONGODBNAME)                
                return _db
            } catch(error){
                console.log(error);
                process.exit(1)
            }
        }
    }
}