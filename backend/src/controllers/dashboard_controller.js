const Product = require("../models/product_model");
const User = require("../models/user_model");
const Order = require("../models/order_model");
const WishlistItem = require("../models/wishlist_item_model");
const Review = require("../models/review_model");

function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

function mapOrder(o) {
    return {
        id: o._id.toString(),
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
        items: (o.items || []).map((it) => ({
            quantity: it.quantity,
            price: it.price,
            product: it.product
                ? {
                      name: it.product.name,
                      images:
                          Array.isArray(it.product.images) &&
                          it.product.images.length
                              ? it.product.images
                              : it.product.image
                              ? [it.product.image]
                              : [],
                  }
                : null,
        })),
    };
}

// GET /api/v1/admin/stats
exports.getAdminStats = async (req, res, next) => {
    try {
        const [productsLive, activeUsers, ordersToday] = await Promise.all([
            Product.countDocuments({ isActive: true }),
            User.countDocuments({ status: "active" }),
            Order.countDocuments({ createdAt: { $gte: startOfToday() } }),
        ]);

        // No delivered-order revenue recorded yet — show 0 until orders exist.
        const revenue = 0;

        res.status(200).json({
            success: true,
            data: {
                revenue,
                ordersToday,
                productsLive,
                activeUsers,
            },
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/admin/orders/recent
exports.getRecentOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "firstName lastName")
            .lean();

        const data = orders.map((o) => ({
            id: o._id.toString(),
            total: o.total,
            status: o.status,
            createdAt: o.createdAt,
            customer:
                [o.user?.firstName, o.user?.lastName]
                    .filter(Boolean)
                    .join(" ") || "Customer",
        }));

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/user/dashboard
exports.getUserDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const [orders, wishlist, reviews, recentOrders] = await Promise.all([
            Order.countDocuments({ user: userId }),
            WishlistItem.countDocuments({ user: userId }),
            Review.countDocuments({ user: userId }),
            Order.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("items.product", "name image images")
                .lean(),
        ]);

        res.status(200).json({
            success: true,
            data: {
                orders,
                wishlist,
                reviews,
                recentOrders: recentOrders.map(mapOrder),
            },
        });
    } catch (err) {
        next(err);
    }
};
