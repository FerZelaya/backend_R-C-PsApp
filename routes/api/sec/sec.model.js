const db = require('../../dao/db')
const ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')
const { use } = require('passport')
const e = require('express')

let usersColl

module.exports = class {

    static async initModel(){
        if(!usersColl){
            let _db = await db.getDB()
            usersColl = await _db.collection('users');
            if(process.env.ENSUREINDEX == "1"){
                //console.log('User index being created');
                await usersColl.createIndex({"email":1},{unique:true})
            }
            console.log("Users collection created");
            return
        }else{
            return
        }
    }

    //User Info
    static async userInfo(userid){
        try{
            let filter = { "_id": new ObjectId(userid)};
            const result = await usersColl.findOne(filter);
            return result;
        }catch(error){
            console.log(error);
            return errorS
        }
    }

    //Sign Up
    static async signUp(data){
        const {name, email, password } = data

        try {
            let newUser = {
                "name":name,
                "email":email,
                "password": bcrypt.hashSync(password,10),
                "roles": ["public"]
            }
            let result = await usersColl.insertOne(newUser)
            return result
        } catch(error){
            console.log(error);
            return error
        }
    }


    //Get user by email
    static async getByEmail(email){
        try{
            let filter = {"email":email}
            let user = await usersColl.findOne(filter)
            return user 
        }catch(error){
            console.log(error);
            return error
        }
    }

    //Compare Password
    static async comparePassword( rawPassword, cryptedPassword) {
        try{
            return bcrypt.compareSync(rawPassword,cryptedPassword)
        }catch(error){
            return false
        }
    }


}