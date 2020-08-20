const db = require('../../dao/db')
const ObjectId = require('mongodb').ObjectId

let recipesColl

module.exports = class {
    //initmodel
    static async initModel(){
        if(!recipesColl){
            let _db = await db.getDB()
            recipesColl = await _db.collection('recipes')
            console.log("Recipes collection created")
            return
        } else {
            return
        } 
    }

    //Show all recipes
    static async showAllRecipes(){
        try{
            if(recipesColl){
                let recipes = await recipesColl.find()
                return recipes.toArray()
            }
            return[]
        }catch(error){
            console.log(error);
            return errorS
        }
    }


    //Search one recipe
    static async getOneRecipe(recipeid) {
        try {
          let filter = { "_id": new ObjectId(recipeid)};
          const result = await recipesColl.findOne(filter);
          return result;
        } catch (error) {
          console.log(error);
          return err;
        }
    }


    //Show user posted recipes
    static async showUserAllRecipes(user){
        try{
            if(recipesColl){
                let recipes = await recipesColl.find({
                    "user":ObjectId(user)
                  });
                return recipes.toArray()
            }
            return[]
        }catch(error){
            console.log(error);
            return errorS
        }
    }



    //Post own recipe
    static async postRecipe(title, ingredients, preparation, servingSize, calories, recipeImage, user){
        try {
            let newRecipe = {
                title:title,
                ingredients:ingredients,
                preparation:preparation,
                servingSize:servingSize,
                calories:calories,
                recipeImage:recipeImage,
                user:ObjectId(user)
            }
            let result = await recipesColl.insertOne(newRecipe)
            return result            
        } catch(error){
            console.log(error);
            return error
        }

    }


    //Delete recipe
    static async deleteRecipe(recipeid){
        try{
            let filter = {"_id": new ObjectId(recipeid)}
            const result = await recipesColl.deleteOne(filter)
            return result
        }catch(error){
            console.log(error);
            return error
        }
    }


}




