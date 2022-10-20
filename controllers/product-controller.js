const Product = require("../models/product-model");
const multer = require("multer");
const sharp = require("sharp");
const QueryMethod = require("../utils/query");

//handle errors
const handleError = (err) => {
    console.log(err.message);
    let errors = { owner : "", name : "", description : "", price : "", quantity : "", productImage : "", category : ""};
    
    //validate errors
    if(err.message.includes('Product validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
        
    }

    return errors;
};

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

exports.uploadProductImage = uploadImage.single("productImage");

exports.resizeImage = async (req, res, next) => {
    if (req.file) {
      let timeStamp = Date.now();
      let id = req.params.id;
      let productName;
      if (id) {
        const product = await Product.findById(id);
        if (!product) {
          return res,status(400),send(`There is no product with the is ${req.params.id}`);
        }
        productName = `${product.name}-${timeStamp}.jpeg`;
      }
      productName = `${req.body.name}-${timeStamp}.jpeg`;
      req.body.productImage = productName;
  
      await sharp(req.file.buffer)
        .resize(320, 240)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(`public/product/img/${productName}`);
    }
  
    next();
  };

//Upload a product
exports.uploadProduct = async (req, res) => {
    try {
        req.body.owner = req.user._id;
        const product = await Product.create(req.body);
        return res.status(200).send({
            status : true,
            meassage : "Successfully uploaded a product",
            data : {
                product
            }
        });
          
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    } 
}


//Get all Products
exports.getAllProducts = async (req, res) => {
    try {
        let queriedProducts = new QueryMethod(Product.find(), req.query)
            .sort()
            .filter()
            .limit()
            .paginate();
        let product = await queriedProducts.query;
        res.status(200).json({
            status: "success",
            results: product.length,
            data: product,
      }); 
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}

//Get a product
exports.getOneProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
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

//Update a Product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
          return res.status(400).json({
            status: "fail",
            message: `There is no product from the vendor with the ID ${req.params.id}`,
          });
        }
        const description = req.body.description === undefined ? product.description : req.body.description;
        const name =
          req.body.name === undefined ? product.name : req.body.name;
        const quantity =
          req.body.quantity === undefined ? product.quantity : req.body.quantity;
        const price =
          req.body.price === undefined ? product.price : req.body.price;
        const productImage =
          req.body.productImage === undefined ? product.productImage : req.body.productImage;
        const update = { name, description, price, quantity, productImage };
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, update);
        res.status(200).json({
          status: "success",
          data: {
            product: updatedProduct,
          },
        });
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}

//Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        
        const delProduct = await Product.findByIdAndDelete(req.params.id);
    
        if(delProduct) {
            return res.status(201).send({
                status : true,
                message : "Product successfully deleted"
            });
        }else{
            return res.status(404).send({
                status : false,
                message : "Product cannot be fetched"
            })
        }
        
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}