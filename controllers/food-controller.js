const Food = require("../models/food-model");
const multer = require("multer");
const sharp = require("sharp");
const QueryMethod = require("../utils/query");

//handle errors
const handleError = (err) => {
    console.log(err.message);
    let errors = { vendor : "", name : "", description : "", price : "", quantity : "", foodImage : "", category : ""};
    
    //validate errors
    if(err.message.includes('Product validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
        
    }

    return errors;
};

//Upload a food image
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    res.status(400).send("Please upload only an image file");
  }
};


const uploadImage = multer({
    storage : multerStorage,
    fileFilter : multerFilter
});

exports.uploadFoodImage = uploadImage.single("foodImage");

exports.resizeImage = async (req, res, next) => {
    if (req.file) {
      let timeStamp = Date.now();
      let id = req.params.id;
      let foodName;
      if (id) {
        const food = await Food.findById(id);
        if (!food) {
          return res.status(400).send(`There is no food with the ${req.params.id}`);
        }
        foodName = `${food.name}-${timeStamp}.jpeg`;
      }
      foodName = `${req.body.name}-${timeStamp}.jpeg`;
      req.body.foodImage = foodName;
  
      await sharp(req.file.buffer)
        .resize(320, 240)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(`public/food/img/${foodName}`);
    }
  
    next();
  };

//Upload a food
exports.uploadFood = async (req, res) => {
    try {
        req.body.vendor = req.user._id;
        const food = await Food.create(req.body);
        return res.status(200).send({
            status : true,
            meassage : "Successfully uploaded a food",
            data : {
                food
            }
        });
          
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    } 
}


//Get all foods
exports.getAllFoods = async (req, res) => {
    try {
        let queriedFoods = new QueryMethod(Food.find(), req.query)
            .sort()
            .filter()
            .limit()
            .paginate();
        let food = await queriedFoods.query;
        res.status(200).json({
            status: "success",
            results: food.length,
            data: food,
      }); 
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}

//Get a food
exports.getOneFood = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Food.findById(id);
        res.status(200).json({
            status: "success",
            data: {
                product
            }
        });
    } catch (err) {
        const errors = handleError(err)
        res.status(400).json({ errors });
    }
};

//Update a food
exports.updateFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
          return res.status(400).json({
            status: "fail",
            message: `There is no product from the vendor with the ID ${req.params.id}`,
          });
        }
        const description = req.body.description === undefined ? food.description : req.body.description;
        const name =
          req.body.name === undefined ? food.name : req.body.name;
        const quantity =
          req.body.quantity === undefined ? food.quantity : req.body.quantity;
        const price =
          req.body.price === undefined ? food.price : req.body.price;
        const foodImage = 
          req.body.foodImage === undefined ? food.foodImage : req.body.foodImage;
        const categogy =
          req.body.categogy === undefined ? food.categogy : req.body.categogy;
        const update = { name, description, price, quantity, foodImage, categogy };
        const updatedFood = await Food.findByIdAndUpdate(req.params.id, update);
        res.status(200).json({
            status: "success",
            data: {
                food: updatedFood,
            },
        });
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}

//Delete a food
exports.deleteFood = async (req, res) => {
    try {
        
        const delFood = await Food.findByIdAndDelete(req.params.id);
    
        if(delFood) {
            return res.status(204);
        }else{
            return res.status(404).send({
                status : false,
                message : "Food menu cannot be fetched"
            })
        }
        
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}