const Cart = require("../models/cart-model");
const Product = require("../models/product-model");
const Order = require("../models/order-model");
const QueryMethod = require("../utils/query");

//Create a Cart
exports.createCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        
        const prod = await Product.findById(productId);
        unitPrice = prod.price;
        
        if (!prod) {
            return res.status(400).send(`The product ${prod.name} is not available`)
        }

        amount = quantity * unitPrice;
        const cart = await Cart.create({
            userId,
            productId,
            productName : prod.name,
            quantity,
            unitPrice,
            amount,
        });

        const myOrder = await Order.findOne({ userId: req.user.id });
        if (!myOrder) {
            await Order.create({
                userId: req.user.id,
                cartId: [cart.id],
                productQuantity : [cart.quantity],
                totalAmount: cart.amount,
            });
        } else {
            let cart_Id = [...myOrder.cartId, cart.id];
            let totalAmount = myOrder.totalAmount + amount;
            const update = {
                totalAmount,
                cartId: cart_Id,
            };
            const order = await Order.findOneAndUpdate(
                { userId: req.user.id },
                { $set: update },
                { new: true }
            );
        }
        
        res.status(200).json({
            status: "success",
            data: { cart },
        });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

//Get all Carts
exports.getAllCarts = async (req, res) => {
    try { 
        let queriedCarts = new QueryMethod(Cart.find(), req.query)
          .sort()
          .filter()
          .limit()
          .paginate();
        let cart = await queriedCarts.query;
        res.status(200).json({
          status: "success",
          results: cart.length,
          data: cart,
        });
    } catch (error) {
        console.log(error)
    }
  };
  
  //Get a Cart
  exports.getOneCart = async (req, res) => {
      try {
          const cart = await Cart.findById(req.params.id);
        
          if (!cart) {
            return res.status(400).send(`There is no cart with the id ${req.params.id}`);
          }
        
          if (req.user.id !== cart.userId.toString()) {
            return res.status(403).send(`You are not authorized!!!!!!!`);
          }
        
          res.status(200).json({
            status: "success",
            data: cart,
          });
      } catch (error) {
          console.log(error);
      }
  };
  
  //Update Cart
  exports.updateCart = async (req, res) => {
      try { 
        const cart = await Cart.findById(req.params.id);
        
        if (req.user.id !== cart.userId.toString()) {
            return res.status(403).send(`You are not authorized!!!!!!!`);
        }
        if (!cart) {
            return res.status(400).send(`There is no cart with Id ${req.params.id}`)
        }
        const quantity = req.body.quantity;
    
        amount = quantity * cart.unitPrice;
        const myOrder = await Order.findOne({ userId: req.user.id });
        let totalAmount = myOrder.totalAmount - cart.unitPrice;
        let newAmount = totalAmount + amount;
        const update = { amount, quantity };
    
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: update },
            {
                new: true,
            }
        );
    
        await Order.findOneAndUpdate(
            { userId: req.user.id },
            { $set: { totalAmount: newAmount } },
            { new: true }
        );
    
        return res.status(200).json({
            status: "success",
            data: { updatedCart },
        });
      } catch (error) {
        console.log(error);
        res.status(404).send(error)
      }
  };
  
  //Delete an Cart
  exports.deleteCart = async (req, res) => {
      try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(400).send(`There is no cart with Id ${req.params.id}`)
        }

        const myOrder = await Order.findOne({ userId: req.user.id });
        let totalAmount = myOrder.totalAmount - cart.amount;
        const cart_id = myOrder.cartId.filter(
            (id) => id.toString() !== cart._id.toString()
        );
        const update = {
            totalAmount,
            cartId: cart_id,
        };

        await Cart.findByIdAndDelete(req.params.id);
        if (cart_id.length === 0) {
            await Order.findOneAndDelete({ userId: req.user.id });
        }
        await Order.findOneAndUpdate(
            { userId: req.user.id },
            { $set: update },
            { new: true }
        );

        res.status(200).send({
            status: "success",
            message: "cart deleted successfully",
        });
          
      } catch (error) {
          console.log(error);
          res.status(404).send(error)
      }
  };