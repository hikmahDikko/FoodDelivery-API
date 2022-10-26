const express = require("express")
const Flutterwave = require("flutterwave-node-v3");
const Order = require("../models/order-model");
const nodemailer = require("nodemailer");
const Cart = require("../models/cart-model");

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

//Checkout ordered foods
exports.checkoutOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        let payload = req.body;
        
        let cart = await Cart.findOne({userId});
        let order = await Order.findOne({userId});
        let user = req.user;
        
        if(order && cart) {
            payload = {
                ...payload, 
                enckey: process.env.FLW_ENCRYPT_KEY, 
                amount : order.totalAmount, 
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
                                    
                let order = await Order.findOne({userId});
                let cartItems = await Cart.find({userId});
                if (cartItems) {
                    cartItems.map(async cartItem => {
                        await Cart.findByIdAndDelete(cartItem._id);
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
                    text : "Ordered items are as follows " + '\n' + order
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

//Get one Order
exports.getOneOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
      
        if (!order) {
          return res.status(400).send(`There is no order with the id ${req.params.id}`);
        }
      
        if (req.user.id !== order.userId.toString()) {
          return res.status(403).send(`You are not authorized!!!!!!!`);
        }
      
        res.status(200).json({
          status: "success",
          data: order,
        });
    } catch (error) {
        console.log(error);
    }
};

//Get all ordered items
exports.getAllOrders = async (req, res) => {
    const owner = req.user._id;
    try {
        const orders = await Order.find({ owner : owner }).sort({ date : -1 });
        if(orders) {
            return res.status(200).json({
                message : "success",
                results : orders.length,
                data : {
                    orders
                }
            })
        }
        res.status(404).send("No orders found");
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
};

//Delet a order
exports.deleteOrder = async (req, res) => {
    try {
        const del = await Order.findByIdAndDelete(req.params.id);

        if(del) {
            return res.status(204);
        }else{
            return res.status(404).send({
                status : false,
                message : "Order details cannot be fetched"
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(404).send(error)
    }
};