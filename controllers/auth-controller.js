const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const Token = require("../models/token-model");
const { createToken } = require("../middleware/authMiddleware");
const handleError = require("../errorHandlers/errors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cookie = require("cookie-parser");

//cookie-parser expiry date
const maxAge = 3 * 24 * 60 * 60;

//Create account for user
exports.signUp = async (req, res) => {
    try{
        const {fullName, phoneNumber, address, password, confirmPassword, email, role} = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({message : "Wrong Password Confirmation input"})
        }
        const salt = await bcrypt.genSalt(10);

        if(password === confirmPassword && password.length > 5){
            const hash = await bcrypt.hash(password, salt);
            const user = await User.create({
                fullName, 
                phoneNumber, 
                address, 
                password : hash,
                confirmPassword : hash, 
                email,
                role
            });
             
            const token = createToken(user._id);
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 })
            await new Token({
                userId: user._id,
                token: token,
                createdAt: Date.now(),
            }).save();
            return res.status(201).json({
                status : "success",
                token,
                data : {
                    user
                }
            });
        }
        return res.status(400).json({message : "Password is less than 6 characters"})
    }catch (error) {
        const errors = handleError(error)
        res.status(404).json({ errors });
    }
}

//Log user in
exports.signIn = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if(!user) {
            res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
            });
        }

        if(user) {
            const auth = await bcrypt.compare(password, user.password);
            if(auth) {
                const token = await createToken(user._id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000 })
                res.status(200).json({
                  status: "success",
                  token,
                  data: {
                    user,
                  },
                });    
        }else {
            res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
                });
            }
        }
    }catch (err) {
        const errors = handleError(err)
        res.status(400).json({
            status: "fail",
            message: errors,
        });
    } 
}



const requestPasswordReset = async (req) => {
    try{
        const user = await User.findOne({email : req.body.email});
        
        if (!user) return ({message : "User does not exist"});
        let token = await Token.findOne({ userId: user._id });
        if (token) await token.deleteOne();
        let resetToken = crypto.randomBytes(32).toString("hex");
        
        const tokenReset = await new Token({
            userId: user._id,
            token: resetToken,
            createdAt: Date.now(),
        }).save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auths/reset-password`;
        const message = `To reset your password click on the link below to submit your new password: ${resetUrl}`;

        let mail = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : process.env.EMAIL_HOST,
                pass : process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from : process.env.EMAIL_HOST,
            to : user.email,
            message,
            subject : "Your password reset token. It's valid for 10mins",
            text : resetUrl + "\n" +  "Enter the information provided below in the url" + "\n" + tokenReset
        }
        
        mail.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent : ' + info.response);
            }
        })


        return ({
            status: "success",
            message: "Token has been sent to your mail",
            resetUrl,
            tokenReset
        });
    }catch (error) {
        console.log(error);
    }
}

const resetPass = async (userId, token, password) => {
    try{
        const passwordResetToken = await Token.findOne({ userId });
        if (!passwordResetToken) {
            return ({"message" : "Invalid or expired password reset token"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
            await User.updateOne(
                { _id: userId },
                { $set: { password: hash, confirmPassword: hash } },
                { new: true }
            );
    
        return ({"message" : "You have successfully updated your Password."});
    } catch (error) {
        console.log(error)
    }
};

  
//User request password update
exports.forgotPassword = async (req, res, next) => {
    try{
        const forgotPASS = await requestPasswordReset(
            req
        );
        return res.status(200).json({forgotPASS});
    } catch (error) {
        console.log(error);
        res.status(400).json({message : error});
    }

};
  
//User reset password
exports.resetPassword = async (req, res, next) => {
    try{
        const resetPasswordService = await resetPass(
            req.body.userId,
            req.body.token,
            req.body.password,
            req.body.confirmPassword
        );
        
        if(req.body.password.length < 6 || req.body.password !== req.body.confirmPassword) {
            return res.status(400).send("Ensure password and confirm password are of the same characters, nothing less than 6 characters");
        }
        return res.status(200).json(resetPasswordService);
    } catch (error) {
        console.log(error);
        res.status(400).json({message : error});
    }
};
