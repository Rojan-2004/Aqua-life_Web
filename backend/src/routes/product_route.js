const express = require("express");
const router = express.Router();
const Product = require("../models/product_model");
const Review = require("../models/review_model");

function toImageArray(p) {
    if (Array.isArray(p.images) && p.images.length) return p.images;
    if (p.image) return [p.image];
    return [];
}

// GET /api/v1/products  (public catalogue)
router.get("/", async (req, res, next) => {
    try {
        const category = req.query.category;
        const search = req.query.search;
        const featured = req.query.featured === "true";
        const page = parseInt(req.query.page, 10) || 1;
        const limit = Math.min(parseInt(req.query.limit, 10) || 12, 24);
        const skip = (page - 1) * limit;

        const query = { isActive: true };
        if (featured) query.isFeatured = true;
        if (category && category !== "All") query.category = category;
        if (search) query.name = { $regex: search, $options: "i" };

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(query),
        ]);

        const mapped = products.map((p) => {
            const obj = p.toObject();
            return { ...obj, images: toImageArray(obj), id: obj.id };
        });

        res.status(200).json({
            success: true,
            products: mapped,
            total,
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/v1/products/:id  (public single product with reviews)
router.get("/:id", async (req, res, next) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true,
        });
        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
        }

        const reviews = await Review.find({ product: req.params.id })
            .populate("user", "firstName lastName")
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const obj = product.toObject();
        const mappedReviews = reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            user: r.user
                ? { firstName: r.user.firstName, lastName: r.user.lastName }
                : null,
        }));

        res.status(200).json({
            success: true,
            product: { ...obj, images: toImageArray(obj), id: obj.id },
            reviews: mappedReviews,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
