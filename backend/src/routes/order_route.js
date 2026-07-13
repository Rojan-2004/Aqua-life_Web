const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const CartItem = require("../models/cart_item_model");
const Order = require("../models/order_model");
const Notification = require("../models/notification_model");
const Product = require("../models/product_model");

const VAT_RATE = 0.13;
const SHIPPING_FLAT = 500;
const FREE_SHIPPING_THRESHOLD = 50000;

router.use(protect);

// POST /api/v1/orders  (place order, clear cart, notify admin)
router.post("/", async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { shippingInfo } = req.body;

        if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
            return res
                .status(400)
                .json({ success: false, message: "Shipping information is required." });
        }

        const cartItems = await CartItem.find({ user: userId }).populate("product");
        const validItems = cartItems.filter((i) => i.product);

        if (validItems.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Cart is empty" });
        }

        // Totals
        const subtotal = validItems.reduce(
            (sum, i) => sum + i.product.price * i.quantity,
            0
        );
        const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
        const vat = Math.round((subtotal + shipping) * VAT_RATE);
        const total = subtotal + shipping + vat;

        const order = await Order.create({
            user: userId,
            total,
            status: "pending",
            shippingInfo,
            items: validItems.map((i) => ({
                product: i.product._id,
                quantity: i.quantity,
                price: i.product.price,
            })),
        });

        // Clear the cart
        await CartItem.deleteMany({ user: userId });

        // Decrement stock for each purchased item
        await Promise.all(
            validItems.map((i) =>
                Product.findByIdAndUpdate(i.product._id, {
                    $inc: { stock: -i.quantity },
                    $set: { isSoldOut: i.product.stock - i.quantity <= 0 },
                })
            )
        );

        // Notify admin
        const itemNames = validItems
            .map((i) => `${i.product.name} x${i.quantity}`)
            .join(", ");
        const shortId = order._id.toString().slice(0, 8);
        await Notification.create({
            type: "new_order",
            orderId: order._id.toString(),
            message: `New order #${shortId} from ${shippingInfo.fullName} — ${itemNames} — Rs. ${total.toLocaleString()}`,
        });

        res.status(201).json({ success: true, orderId: order._id.toString() });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
