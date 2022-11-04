const OrderedItems = require("../models/order-history");
const QueryMethod = require("../utils/query");

exports.getOneHistory = async (req, res) => {
    try {
        const history = await OrderedItems.findById(req.params.id);
      console.log(history)
        if (!history) {
          return res.status(400).send(`There is no order history with the id ${req.params.id}`);
        }
      
        if (req.user.id !== history.userId.toString()) {
          return res.status(403).send(`You are not authorized!!!`);
        }
        res.status(200).json({
            status: "success",
            data: history,
        });
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
};

exports.getUserHistory = async (req, res) => {
    try {
        const history = await  OrderedItems.findById(req.params.id).populate("userId", "fullName address phoneNumber email");
      
        if (!history) {
          return res.status(400).send(`There is no order history with the id ${req.params.id}`);
        }
      
        res.status(200).json({
            status: "success",
            data: history,
        });
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
};


exports.getAllHistories = async (req, res) => {
    const owner = req.user._id;
    try {
        const orders = await OrderedItems.find({ userId : owner }).sort({ date : -1 });
        if(orders) {
            return res.status(200).json({
                message : "success",
                results : orders.length,
                data : {
                    orders
                }
            })
        }

        res.status(404).send("No History found");
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
};

exports.getAllOrderedItems = async (req, res) => {
    try {
        let queriedHistories = new QueryMethod(OrderedItems.find().populate("userId", "fullName address phoneNumber email"), req.query)
          .sort()
          .filter()
          .limit()
          .paginate();
        let history = await queriedHistories.query;
        res.status(200).json({
            status: "success",
            results: history.length,
            data: history,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
};

exports.deleteHistory = async (req, res) => {
    try {
        const confirm = await OrderedItems.findById(req.params.id);

        if(confirm){
            if (req.user.id !== confirm.userId._id.toString()) {
                return res.status(403).send(`You are not authorized!!!`);
            }
    
            await OrderedItems.findByIdAndDelete(req.params.id);
            return res.status(204).send();
        } else{
            return res.status(400).send(`There is no order history with the id ${req.params.id}`);
        }
    }catch (err) {
        const errors = handleError(err)
        res.status(400).json({ errors });
    }
}