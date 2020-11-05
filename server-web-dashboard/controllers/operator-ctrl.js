const Operator = require('../models/operator-model')
const jsonwebtoken = require('jsonwebtoken')
const jwtSecret = 'secret123'
const bcrypt = require('bcryptjs');
const saltRounds = 10;

getOperator = async (req, res) => {
    await Operator.findOne({ user: req.params.user }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        } else {
            bcrypt.compare(req.params.password, data.password, function (err, result) {
                if (result == true) {
                    return res
                        .json({
                            token: jsonwebtoken.sign({ user: data.unit_id }, jwtSecret)
                        })
                } else {
                    return res
                        .status(404)
                        .json({ success: false, error: `Password incorrect` })
                }
            });
            // if(data.password == req.params.password) {
            //     return res
            //         .json({
            //             token: jsonwebtoken.sign({ user: data.user }, jwtSecret)
            //     })
            // } else {
            //     return res
            //         .status(404)
            //         .json({ success: false, error: `Password incorrect `})  
            // }
        }
    }).catch(err => console.log(err))
}

checkOperator = async (req, res) => {
    await Operator.findOne({ user: req.params.user }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        } else {
            bcrypt.compare(req.params.password, data.password, function (err, result) {
                if (result == true) {
                    return res
                        .json({ isValid: true })
                } else {
                    return res
                        .json({ isValid: false })
                }
            });
            // if(data.password == req.params.password) {
            //     return res
            //         .json({isValid: true})
            // } else {
            //     return res
            //         .json({isValid: false}) 
            // }
        }
        // return res.status(200).json({ success: true, data: data })
    }).catch(err => console.log(err))
}

module.exports = {
    getOperator,
    checkOperator,
}