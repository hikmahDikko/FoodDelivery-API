const Review = require("../models/review");
const OrderedItems = require("../models/order-history");

exports.createReview =  async (req, res) => {
    const orderId = req.params.id;
    const order = OrderedItems.findOne(orderId);

    if(order) {
        Review.create({
            ...req.body,
            })
            .then((savedReview) => {
                return OrderedItems.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { comments: savedReview._id } },
                { new: true }
                );
            })
            .then((updatedOrder) => res.status(201).json(updatedOrder))
            .catch((err) => res.status(400).send(err));
    }
};
