const express = require("express")
const Flutterwave = require("flutterwave-node-v3");
const FavOrder = require("../models/favOrder-model");
const nodemailer = require("nodemailer");
const FavCart = require("../models/fav-model");

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

//Checkout Ordered food items
exports.checkoutFavOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        let payload = req.body;
        
        let cart = await FavCart.findOne({userId});
        let order = await FavOrder.findOne({userId});
        let user = req.user;
        
        if(order && cart) {
            payload = {
                ...payload, 
                enckey: process.env.FLW_ENCRYPT_KEY, 
                amount : cart.amount, 
                email : user.email, 
                fullname : user.fullname, 
                phone_number : user.phoneNumber,
                tx_ref: "hy_ " + Math.floor((Math.random() * 1000000000) + 1) 
            };
            
            const response = await flw.Charge.card(payload);
            
            if (response.meta.authorization.mode === 'pin') {
                let payload2 = payload
                payload2.authorization = {
                    "mode": "pin",
                    "fields": [
                        "pin"
                    ],
                    "pin": 3310
                }
                const reCallCharge = await flw.Charge.card(payload2)

                // Add the OTP to authorize the transaction
                const callValidate = await flw.Charge.validate({
                    "otp": "12345",
                    "flw_ref": reCallCharge.data.flw_ref
                })
                
                if(callValidate.status === 'success') {
                                    
                let favOrder = await FavOrder.findOne({userId});
                let cartItems = await FavCart.find({userId});
                if (cartItems) {
                    cartItems.map(async cartItem => {
                        await FavCart.findByIdAndDelete(cartItem._id);
                    }) 
                }
                
                let mail = nodemailer.createTransport({
                    service : 'gmail',
                    auth : {
                        user : process.env.HOST_EMAIL,
                        pass : process.env.EMAIL_PASS
                    }
                });

                let mailOptions = {
                    from : process.env.HOST_EMAIL,
                    to : process.env.VENDORS_EMAIL,
                    subject : "Orders",
                    text : "Ordered favorite-items are as follows " + '\n' + favOrder
                }
                
                mail.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent : ' + info.response);
                    }
                })
                return res.status(201).send({
                    status : "Payment successfully made",
                    message : "Your orders has been received",
                })
                } 
                if(callValidate.status === 'error') {
                    res.status(400).send("please try again");
                }
                else {
                    res.status(400).send("payment failed");
                }
            }

            
            if (response.meta.authorization.mode === 'redirect') {
    
                var url = response.meta.authorization.redirect
                open(url)
            }
        } else {
            res.status(400).send("Cart not found");
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
}

//Get one cart in favorite
exports.getOneFavOrder = async (req, res) => {
    try {
        const favOrder = await FavOrder.findById(req.params.id);
      
        if (!favOrder) {
          return res.status(400).send(`There is no favorite-order with the id ${req.params.id}`);
        }
      
        if (req.user.id !== favOrder.userId.toString()) {
          return res.status(403).send(`You are not authorized!!!!!!!`);
        }
      
        res.status(200).json({
          status: "success",
          data: favOrder,
        });
    } catch (error) {
        console.log(error);
    }
};

//Get all favorite orders
exports.getAllFavOrders = async (req, res) => {
    const owner = req.user._id;
    try {
        const orders = await FavOrder.find({ owner : owner }).sort({ date : -1 });
        if(orders) {
            return res.status(200).json({
                message : "success",
                results : orders.length,
                data : {
                    orders
                }
            })
        }
        res.status(404).send("No favorite-orders found");
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
};

//Delete a favorite-order
exports.deleteFavOrder = async (req, res) => {
    try {
        const del = await FavOrder.findByIdAndDelete(req.params.id);

        if(del) {
            return res.status(204);
        }else{
            return res.status(404).send({
                status : false,
                message : "Order favorite details cannot be fetched"
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(404).send(error)
    }
};