const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validators =require('../validators/validator');

const createUser = async function(req,res)
{
    try
    {
        if(!validators.isValidRequestBody(req.body))

        return res.status(400).send({status : false, message : "Invalid request parameter. Please provide user details in request body."});
    
        let {title,name,phone,email,password,address} = req.body;

        if(!validators.isValidField(title))
        
            return res.status(400).send({status : false, message : "Title is required."});

        if(!validators.isValidTitle(title))
        
            return res.status(400).send({status : false, message : "Invalid title. Title can only be either 'Mr', 'Mrs', or 'Miss'."});

        if(!validators.isValidField(name))
        
            return res.status(400).send({status : false, message : "User Name is required."});
        
        if(!validators.isValidField(phone))
        
            return res.status(400).send({status : false, message : "Phone Number is required."});
        
        if(!validators.isValidMobileNo(phone))
        
            return res.status(400).send({status : false, message : "Invalid phone number. Please enter a valid Indian phone number."});
        
        let mobileAlreadyExists = await userModel.findOne({phone});

        if(mobileAlreadyExists)
        
            return res.status(400).send({status : false, message : "Phone number has already been used."});
        
        if(!validators.isValidField(email))

            return res.status(400).send({status : false, message : "Email is required."});

        if(!validators.isValidEmail(email))

            return res.status(400).send({status : false, message : "Email is invalid."});

        let emailAlreadyExists = await userModel.findOne({email});

        if(emailAlreadyExists)

            return res.status(400).send({status : false, message : "Email has already been registered."});

        if(!validators.isValidField(password))

            return res.status(400).send({status : false, message : "Password is required."});

        if(!validators.isValidPassword(password))

            return res.status(400).send({status : false, message : "Password should consist a minimum of 8 characters and a maximum of 15 characters."});

        let userDetails = {title,name,phone,email,password,address};

        let newUser = await userModel.create(userDetails);
        
        res.status(201).send({status : true,message : "User created successfully.", data : newUser});
    }
    catch(err)
    {
        return res.status(500).send({status : false, message : err.message});
    }
};

const loginUser = async function (req, res) 
{
    try 
    {
        let requestBody = req.body

        // request body validation 

        if (!validators.isValidRequestBody(requestBody)) 
        
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' });

        if (requestBody.email && requestBody.password) 
        {

            // email id or password is velid or not check validation 

            let userEmail = await userModel.findOne({ email: requestBody.email });

            if (!userEmail) 
            {
                return res.status(400).send({ status: true, msg: "Invalid user email" })
            }

            let userPassword = await userModel.findOne({ password: requestBody.password });

            if (!userPassword) 
            {
                return res.status(400).send({ status: true, msg: "Invalid user password" })
            }

            // jwt token create and send back the user

            let payload = { _id: userEmail._id }

            let token = jwt.sign(payload, 'projectThird', { expiresIn: '1800s' })

            res.header('x-api-key', token);

            res.status(200).send({ status : true, message : "User  login successfull.", token : token })

        } 
        else 
        {

            return res.status(400).send({ status: false, msg: "Must contain email and password." })
            
        }

    } 
    catch (error) 
    {
        res.status(500).send({ status: false, msg: error.message });
    }
};

module.exports={createUser,loginUser};