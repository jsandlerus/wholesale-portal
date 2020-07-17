const axios = require('axios');
const express = require("express");
const router = express.Router();
const User = require('../schemas/userSchema')
const jwt = require("jsonwebtoken");

// @route   GET /docuSign/userCanSign
// @desc    Checks if user is already confirmed and can sign document
// @access  Private
router.get("/userCanSign", (req, res) => {
    if (req.user.docusignVerified)
        res.send(true);
    else
        res.send(false);
});

// @route   GET /docuSign/userHasSigned
// @desc    Checks if user is already confirmed and can sign document
// @access  Private
router.get("/userHasSigned", (req, res) => {
    if (req.user.documentSigned)
        res.send(true);
    else
        res.send(false);
});

// @route   GET /docuSign/userInfo
// @desc    Gets an information from a user that can already sign
// @access  Private
router.get("/userToken", (req, res) => {
        if (req.user.docusignVerified)
            res.send(req.user.docusignVerified.access_token)
        else
            res.send(false)
});

// @route   POST /docuSign/confirmUser
// @desc    Confirm in user DB that It has access to the docusign and can sign the document
// @access  Private
router.post("/confirmUser", async (req, res) => {
    try {
/*        //Create JWT Payload
        const payload = {
            id: user.id,
            name: user.name
        };
        //Sign token
        jwt.sign(
            payload,
            pvtKey,
            {
                algorithm: 'RS256',
                header: {
                    "alg": "RS256",
                    "typ":"JWT"
                },
                body: {
                    "iss": process.env.DOCUSIGN_INTEGRATION_KEY,
                    "sub": "lala"
                }
            }), (err, token) => {
            res.json({
                success:true,
                token: "Bearer " + token
            });
        }*/
        console.log(req.body);
        await User.updateOne({ _id: req.user.id }, {
            docusignVerified: req.body
        })
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.status(500).send('error confirming docusign')
    }
});



module.exports = router;