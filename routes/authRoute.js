const express=require('express');

const router=express.Router();
const {adLoginUser}=require('../controller/authController');


router.post('/adlogin', adLoginUser);

module.exports=router;