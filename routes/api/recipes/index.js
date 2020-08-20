var express = require('express')
var router = express.Router()
var multer = require('multer')
const path = require('path')
const model = require('./recipes.model')



//Initialize model
const init = async () => {
    await model.initModel()
}
init()

//show all recipes
router.get('/showAll', async(req,res)=>{
    try{
        let recipes = await model.showAllRecipes()
        res.status(200).json(recipes)
    }catch(error){
        console.log(error);
        res.status(500).json({"ERROR":"Unable to show all recipes"})
    }
})

//show one recipe
router.get('/info/:recipeid', async (req, res)=>{
    try{
        let {recipeid} = req.params;
        let result = await model.getOneRecipe(recipeid);
        res.status(200).json(result);
    }catch(err){
      console.log(err);
      res.status(500).json({ "ERROR": "Search failed" });
    }
})

//Show user recipes
router.get('/showUserRecipes', async(req,res)=>{
    try{
        var user = req.user._id;
        let recipes = await model.showUserAllRecipes(user)
        res.status(200).json(recipes)
    }catch(error){
        console.log(error);
        res.status(500).json({"ERROR":"Unable to show all recipes"})
    }
})

//Image storage configurations
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads/')
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true)        
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage:storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


//Post own recipe
router.post('/postRecipe', upload.single('recipeImage'), async(req,res)=>{
    try {
        console.log(req.file);
        console.log(req.body);
        var {title, ingredients, preparation, servingSize, calories} = req.body
        var recipeImage = `uploads/${req.file.filename}`
        var user = req.user._id
        var result = await model.postRecipe(title, ingredients, preparation, servingSize, calories, recipeImage, user)        
        res.status(200).json(result)
    }catch(error){
        console.log(error);
        res.status(500).json({"ERROR":"Unable to post your recipe"})
    }
})


//Delete one recipe
router.delete('/deleteRecipe/:recipeid', async(req,res)=>{
    try{
        const {recipeid} = req.params
        const result = await model.deleteRecipe(recipeid)
        res.status(200).json(result)
    }catch(error){
        console.log(error);
        res.status(500).json({"ERROR":"Unable to delete your recipe"})
    }
})


module.exports = router