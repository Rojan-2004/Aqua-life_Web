const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: { type: Number, default: 1 },
                price: { type: Number, default: 0 },
            },
        ],
        total: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

orderSchema.virtual("id").get(function () {
    return this._id.toString();
});

module.exports = mongoose.model("Order", orderSchema, "orders");
