const Review = require("../models/review");
const OrderedItems = require("../models/order-history");
const QueryMethod = require("../utils/query");

exports.createReview =  async (req, res) => {
    const userId = req.user.id;
    //const orderId = req.params.id;
    const order = await OrderedItems.findById(req.params.id);
    
    if(!order) {
        res.status(400).send(`There is no order history with the id ${req.params.id}`)
    }
    if (userId !== order.userId.toString()) {
        return res.status(403).send(`You are not authorized!!!`);
    }

    await Review.create({
        userId,
        ...req.body,
        })
        .then((savedReview) => {
            return OrderedItems.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { reviews: savedReview._id } },
            { new: true }
            );
        })
        .then((updatedOrder) => res.status(201).json(updatedOrder))
        .catch((err) => res.status(400).send(err));
};

exports.getOneReview = async (req, res) => {
    try {
        const review = await  Review.findById(req.params.id);
      
        if (!review) {
          return res.status(400).send(`There is no order history with the id ${req.params.id}`);
        }
      
        if (req.user.id !== review.userId.toString()) {
          return res.status(403).send(`You are not authorized!!!`);
        }
        res.status(200).json({
            status: "success",
            data: review,
        });
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
};


exports.getAllReviews = async (req, res) => {
    try {
        let queriedReviews = new QueryMethod(Review.find().populate("userId", "fullName"), req.query)
          .sort()
          .filter()
          .limit()
          .paginate();
        let reviews = await queriedReviews.query;
        res.status(200).json({
            status: "success",
            results: reviews.length,
            data: reviews,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
};

exports.updateReview = async (req, res) => {
    try {
       const reviews = await Review.findById(req.params.id);
       if (!reviews) {
        return res.status(400).json({
          status: "fail",
          message: `There is no review with the ID ${req.params.id}`,
        });
      }
     
        if (req.user.id !== reviews.userId.toString()) {
            return res.status(403).send(`You are not authorized!!!`);
        }

      const rating = req.body.rating === undefined ? reviews.rating : req.body.rating;
      const review = req.body.review === undefined ? reviews.review : req.body.review;
      
      const update = { rating, review };
      const updatedReview = await Review.findByIdAndUpdate(req.params.id, update);
      res.status(200).json({
        status: "success",
        data: {
          updatedReview
        },
      });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.deleteOneReview = async (req, res) => {
    try {
        const confirm = await Review.findById(req.params.id);

        if(confirm){
            if (req.user.id !== confirm.userId._id.toString()) {
                return res.status(403).send(`You are not authorized!!!`);
            }
    
            await Review.findByIdAndDelete(req.params.id);
            return res.status(204).send();
        } else{
            return res.status(400).send(`There is no review with the id ${req.params.id}`);
        }
    }catch (err) {
        const errors = handleError(err)
        res.status(400).json({ errors });
    }
}