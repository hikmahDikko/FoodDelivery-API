const User = require("../models/user");
const handleError = require("../errorHandlers/errors");
const QueryMethod = require("../utils/query");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
const multer = require("multer");

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_USER_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//Get All Users
exports.getAllUsers = async (req, res) => {
    try {
      let queriedUsers = new QueryMethod(User.find(), req.query)
        .sort()
        .filter()
        .limit()
        .paginate();
    let users = await queriedUsers.query;
    res.status(200).json({
        status: "success",
        results: users.length,
        data: users,
    }); 
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
}

//Get one user
exports.getOneUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json({
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    }
};

//Upload a food image
const multerStorage = multer.diskStorage({});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  }
};


const uploadImage = multer({
    storage : multerStorage,
    fileFilter : multerFilter
});

exports.uploadProfileImage = uploadImage.single("profileImage");

exports.resizeImage = async (req, res, next) => {
    if (req.file) {
        let profileImage;

        const user = await User.findById(req.params.id);

        if (!user) {
          return res.status(400).json({
            status: "fail",
            message: `There is no user with the ID ${req.params.id}`,
          });
        }
    
        const result = await cloudinary.uploader.upload(req.file.path, {
                public_id : `${user._id}_profileImage`,
                width : 2000,
                height : 1500
            }).catch((err) => console.log(err)); 

  
        profileImage = result.url;
        req.body.profileImage = profileImage;
      }
  
    next();
  };


//Update a user account
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(400).json({
            status: "fail",
            message: `There is no user with the ID ${req.params.id}`,
          });
        }
        const fullName = req.body.fullName === undefined ? user.fullName : req.body.fullName;
        const email =
          req.body.email === undefined ? user.email : req.body.email;
        const phoneNumber =
          req.body.phoneNumber === undefined ? user.phoneNumber : req.body.phoneNumber;
        const address =
          req.body.address === undefined ? user.address : req.body.address;
        const password =
          req.body.password === undefined ? user.password : req.body.password;
        const profileImage =
          req.body.profileImage === undefined ? user.profileImage : req.body.profileImage;
        const update = { fullName, email, password, address, phoneNumber, profileImage };
        const updatedUser = await User.findByIdAndUpdate(req.params.id, update);
        res.status(200).json({
          status: "success",
          data: {
            updatedUser
          },
        });
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}

//Delete user account
exports.deleteUser = async (req, res) => {
    try {
        const del = await User.findByIdAndDelete(req.params.id);

        if(del) {
            return res.status(204).send();
        }else{
            return res.status(404).send({
                status : false,
                message : "Account cannot be fetched"
            })
        }
    }catch (err) {
        const errors = handleError(err)
        res.status(400).json({ errors });
    }
}