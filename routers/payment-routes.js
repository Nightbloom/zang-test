const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

router.post("/orders", async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: "rzp_test_awSOd88V7EAs3V",
			key_secret: "yvb55TlJSkpwkqRN6JDxXn5P",
		});

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});

router.post("/verify", async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", "yvb55TlJSkpwkqRN6JDxXn5P")
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
});

module.exports = router;





// const express = require('express');
// const { createOrder, payOrder, listOrders } = require('../controllers/payment-controller');

// const router = express.Router()

// router.route("/create-order", createOrder)
// router.route("/pay-order", payOrder)
// router.route("/list-orders", listOrders)
// router.route("/get-razorpay-key", listOrders)

// module.exports = router