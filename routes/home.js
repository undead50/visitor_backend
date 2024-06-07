const express=require("express");
const router=express.Router();
const {
    readKeyFromFile,encryptSigner
  } = require('../helpers/casba');


router.get("/",(req,res)=>{
    res.send("<h1>VISTOR SYS API Backend is running</h1>");
    });

router.get("/h",(req,res)=>{
    const privateKey = readKeyFromFile('./certificate/private_key_pkcs8.pem')
    const publicKey = readKeyFromFile('./certificate/public_key.pem')
    data = {
        "accountBranchCode": "140",
        "accountBranchName": "Everest Bank Ltd.-Lazimpat Branch",
        "accountName": "SANTOSH SHRESTHA",
        "accountNumber": "01400503200130",
        "accountType": "saving",
        "bankCode": "1001",
        "demat": "1301080000000104",
        "crnNumber": "000136086",
        "mobileNumber": "9851088494"
       }
    const clientKey = "everest"
    const finalResponse = encryptSigner(data, publicKey, privateKey, clientKey)   
    // console.log(finalResponse)
    res.send(finalResponse)
});


module.exports = router;