const FavCart = require("../models/fav-model");
const Food = require("../models/food-model");
const  FavOrder = require("../models/favOrder-model");
const QueryMethod = require("../utils/query")

//Create a Cart
exports.createFavCart = async (req, res) => {
    try {
        const { foodId, quantity } = req.body;
        const userId = req.user.id;
        
        const food = await Food.findById(foodId);
        unitPrice = food.price;
        
        if (!food) {
            return res.status(400).send(`The product ${food.name} is not available`)
        }

        deliveryFee = 500;
        amount = quantity * unitPrice;
        isCompleted = false;
        
        const cartt = await FavCart.findOne({isCompleted : false});
        let cartItem;
        if(!cartt) {
            cartItem = await FavCart.create({
                userId,
                foodId,
                foodName : food.name,
                quantity,
                isCompleted,
                unitPrice,
                amount
            });
            const myOrder = await FavOrder.findOne({ userId: req.user.id });
                if (!myOrder) {
                    await FavOrder.create({
                        userId: req.user.id,
                        cartId: [cartItem.id],
                        deliveryFee,
                        totalAmount: cartItem.amount + deliveryFee,
                    });
                } else {
                    let cart_Id = [...myOrder.cartId, cartItem.id];
                    let totalAmount = myOrder.totalAmount + amount;
                    
                    const update = {
                        totalAmount,
                        cartId: cart_Id,
                    };
                    const order = await FavOrder.findOneAndUpdate(
                        { userId: req.user.id },
                        { $set: update },
                        { new: true }
                    );
                }
                res.status(200).json({
                    status: "success",
                    data: { cartItem },
                });
            
            }else if(cartt || cartt.foodId === req.body.foodId ) {
                
                res.status(200).send(`${food.name} already exist in the cart, Please try update the item in the cart`)
            }
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

//Get all Carts
exports.getAllFavCarts = async (req, res) => {
    try { 
        const userId = req.user.id;

        let queriedCarts = new QueryMethod(FavCart.find({isCompleted : false}), req.query)
          .sort()
          .filter()
          .limit()
          .paginate();
        let cart = await queriedCarts.query;
        
        let userCart = cart.filter(cartItem => cartItem.userId.toString() === userId.toString());

        if (!userCart) {
            return res.status(403).send(`You are not authorized!!!!!!!`);
        }
        res.status(200).json({
            status: "success",
            results: userCart.length,
            data: userCart,
        });
    } catch (error) {
        console.log(error);
        res.status(404).send(error)
    }
  };
  
  //Get a Cart
  exports.getOneFavCart = async (req, res) => {
      try {
          const cart = await FavCart.findById(req.params.id);
        
          if (!cart) {
            return res.status(400).send(`There is no favorite-cart with the id ${req.params.id}`);
          }
        
          if (req.user.id !== cart.userId.toString()) {
            return res.status(403).send(`You are not authorized!!!!!!!`);
          }
        
          if(cart.isCompleted === false) {
            res.status(200).json({
                status: "success",
                data: cart,
              });
          } else {
              res.status(404).send("Cart not found");
          }
      } catch (error) {
          console.log(error);
          res.status(404).send(error);
      }
  };
  
  //Update Cart
  exports.updateFavCart = async (req, res) => {
    try { 
      const cart = await FavCart.findById(req.params.id);
      
      if (req.user.id !== cart.userId.toString()) {
          return res.status(403).send(`You are not authorized!!!!!!!`);
      }
      if (!cart) {
          return res.status(400).send(`There is no cart with Id ${req.params.id}`)
      }

      if(cart.isCompleted === false) {
        const quantity = req.body.quantity;

        deliveryFee = 500;
        amount = quantity * cart.unitPrice + deliveryFee;
        
        const myOrder = await FavOrder.findOne({ userId: req.user.id });
        let totalAmount = myOrder.totalAmount - cart.amount;
        
        let newAmount = totalAmount + amount;
        const update = { amount, quantity };
    
        const updatedCart = await FavCart.findByIdAndUpdate(
            req.params.id,
            { $set: update },
            {
                new: true,
            }
        );
    
        await FavOrder.findOneAndUpdate(
            { userId: req.user.id },
            { $set: { totalAmount: newAmount } },
            { new: true }
        );
    
        return res.status(200).json({
            status: "success",
            data: { updatedCart },
        });
      } else {
        res.status(404).send("Cart not found")
      }
      
    } catch (error) {
      console.log(error);
      res.status(404).send(error)
    }
};
  
//Delete an Cart
exports.deleteFavCart = async (req, res) => {
    try {
      const cart = await FavCart.findById(req.params.id);
      if (!cart) {
          return res.status(400).send(`There is no cart with Id ${req.params.id}`)
      }

      if(cart.isCompleted === false) {
        const myOrder = await FavOrder.findOne({ userId: req.user.id });
        let totalAmount = myOrder.totalAmount - cart.amount;
        const cart_id = myOrder.cartId.filter(
            (id) => id.toString() !== cart._id.toString()
        );
        const update = {
            totalAmount,
            cartId: cart_id,
        };

        await FavCart.findByIdAndDelete(req.params.id);
        if (cart_id.length === 1) {
            await FavOrder.findOneAndDelete({ userId: req.user.id });
        }
        await FavOrder.findOneAndUpdate(
            { userId: req.user.id },
            { $set: update },
            { new: true }
        );

        res.status(204).send();
      } else {
        res.status(404).send("Cart not found")
      }
      
        
    } catch (error) {
        console.log(error);
        res.status(404).send(error)
    }
};