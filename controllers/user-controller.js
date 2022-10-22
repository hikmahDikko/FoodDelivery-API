const User = require("../models/user-model");
const handleError = require("../errorHandlers/errors");
const QueryMethod = require("../utils/query");

//Get All Users
exports.getAll = async (req, res) => {
    try {
      let queriedUsers = new QueryMethod(User.find(), req.query)
        .sort()
        .filter()
        .limit()
        .paginate();
    let user = await queriedUsers.query;
    res.status(200).json({
        status: "success",
        results: user.length,
        data: user,
    }); 
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
}

//Get one user
exports.getOne = async (req, res) => {
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
          req.body.address === undefined ? user.address : req.body.paddress;
        const password =
          req.body.password === undefined ? user.password : req.body.password;
        const update = { fullName, email, password, address, phoneNumber };
        const updatedUser = await User.findByIdAndUpdate(req.params.id, update);
        res.status(200).json({
          status: "success",
          data: {
            product: updatedUser,
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
            return res.status(201).send({
                status : true,
                message : "Account successfully deleted"
            });
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