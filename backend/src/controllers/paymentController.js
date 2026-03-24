const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Payment = require('../models/Payment');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("WARN: Razorpay keys are missing from environment variables.");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

exports.createOrder = async (req, res, next) => {
  try {
    const { amount, type, referenceIds } = req.body; 

    const options = {
      amount: amount * 100, // smallest unit
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${req.user._id.toString().substring(0,5)}`
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.user._id,
      amount,
      razorpayOrderId: order.id,
      subscriptionDetails: { type, referenceIds }
    });

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.razorpayWebhook = async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
      const event = req.body.event;
      if (event === 'payment.captured') {
        const paymentData = req.body.payload.payment.entity;
        const orderId = paymentData.order_id;

        const paymentRecord = await Payment.findOne({ razorpayOrderId: orderId });
        if (!paymentRecord) return res.status(404).send('Payment record not found');

        paymentRecord.status = 'captured';
        paymentRecord.razorpayPaymentId = paymentData.id;
        await paymentRecord.save();

        const user = await User.findById(paymentRecord.userId);
        const { type, referenceIds } = paymentRecord.subscriptionDetails;
        
        // Expiration Logic: 30 days for subject (11-12) OR standard mapping for bundles
        const now = new Date();
        const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 Days default for all

        referenceIds.forEach(id => {
          // ensure no duplicate active subjects overlapping if they renew early?
          user.activeSubscriptions.push({
            type,
            referenceId: id,
            expiryDate
          });
        });

        await user.save();
      }

      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('Webhook failed');
  }
};
