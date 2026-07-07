const mongoose = require("mongoose");
const Product = require("../models/product_model");
const User = require("../models/user_model");

function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

// Access collections that may not exist yet (orders, wishlist, tanks).
// Returns 0 / [] gracefully so the UI shows real zero states instead of errors.
function getCollection(name) {
    return mongoose.connection.collection(name);
}

async function countCollection(name, query = {}) {
    try {
        return await getCollection(name).countDocuments(query);
    } catch (e) {
        return 0;
    }
}

async function findRecentOrders(limit = 5) {
    try {
        const coll = getCollection("orders");
        const docs = await coll
            .aggregate([
                { $sort: { createdAt: -1 } },
                { $limit: limit },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        id: { $toString: "$_id" },
                        total: 1,
                        status: 1,
                        createdAt: 1,
                        customer: {
                            $trim: {
                                input: {
                                    $concat: [
                                        { $ifNull: ["$user.firstName", ""] },
                                        " ",
                                        { $ifNull: ["$user.lastName", ""] },
                                    ],
                                },
                            },
                        },
                        productCount: { $size: { $ifNull: ["$products", []] } },
                    },
                },
            ])
            .toArray();
        return docs;
    } catch (e) {
        return [];
    }
}

// GET /api/v1/admin/stats
exports.getAdminStats = async (req, res, next) => {
    try {
        const [productsLive, activeUsers, ordersToday] = await Promise.all([
            Product.countDocuments({ status: "active" }),
            User.countDocuments({ status: "active" }),
            countCollection("orders", { createdAt: { $gte: startOfToday() } }),
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
        const orders = await findRecentOrders(5);
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/user/dashboard
exports.getUserDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const [orders, wishlist, tanks] = await Promise.all([
            (async () => {
                try {
                    const docs = await getCollection("orders")
                        .find({ user: userId })
                        .sort({ createdAt: -1 })
                        .limit(5)
                        .toArray();
                    return docs.map((o) => ({
                        id: o._id.toString(),
                        total: o.total,
                        status: o.status,
                        createdAt: o.createdAt,
                    }));
                } catch (e) {
                    return [];
                }
            })(),
            countCollection("wishlists", { user: userId }),
            countCollection("tanks", { user: userId }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                orders,
                wishlist,
                tanks,
            },
        });
    } catch (err) {
        next(err);
    }
};
