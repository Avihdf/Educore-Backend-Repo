const express=require('express')
const router=express.Router();
const payment=require('../../controllers/Student/paymentcontroller')

router.post('/order',payment.orderpayment)

router.post('/verify',payment.verifypayment)

module.exports=router