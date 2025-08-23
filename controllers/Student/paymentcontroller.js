const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,     
  key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

exports.orderpayment = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // convert to paise
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };
       

        const order = await razorpay.orders.create(options);
        return res.json(order);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' + err.message });
    }
}


// ✅ Verify payment
exports.verifypayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

       

    if (razorpay_signature === expectedSign) {
        return res.json({ success: true });
    } else {
        return res.json({ success: false });
    }
}