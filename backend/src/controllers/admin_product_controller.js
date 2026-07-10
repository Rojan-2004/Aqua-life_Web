const Product = require("../models/product_model");
const { createProductSchema, updateProductSchema } = require("../validations/admin_product_validation");
const fs = require("fs");
const path = require("path");

// @desc    Get all products
// @route   GET /api/v1/admin/products
// @access  Private/Admin
const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/v1/admin/products/:id
// @access  Private/Admin
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/v1/admin/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = createProductSchema.parse(req.body);

    // Handle image file
    let imageFilename = "default-product.png";
    if (req.file) {
      imageFilename = req.file.filename;
    }

    const images = Array.isArray(req.body.images)
      ? req.body.images
      : req.body.images
      ? [req.body.images]
      : [];

    const product = await Product.create({
      ...validatedData,
      image: imageFilename,
      category: req.body.category || "Fish",
      images,
      isActive: true,
      isFeatured: req.body.isFeatured === true || req.body.isFeatured === "true",
      specs: req.body.specs && typeof req.body.specs === "object" ? req.body.specs : {},
      stock: parseInt(req.body.stock, 10) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // Clean up uploaded file if validation failed
    if (req.file) {
      const filePath = path.join("public", "item_photos", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (error.name === "ZodError" || error.errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors || error.message,
      });
    }
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/v1/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      if (req.file) {
        const filePath = path.join("public", "item_photos", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`,
      });
    }

    // Validate request body
    const validatedData = updateProductSchema.parse(req.body);

    // Handle image file
    if (req.file) {
      // Delete old image if it's not the default
      if (product.image && product.image !== "default-product.png") {
        const oldPath = path.join("public", "item_photos", product.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      validatedData.image = req.file.filename;
    }

    product = await Product.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    // Clean up uploaded file if validation failed
    if (req.file) {
      const filePath = path.join("public", "item_photos", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (error.name === "ZodError" || error.errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors || error.message,
      });
    }
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`,
      });
    }

    // Delete image if not the default
    if (product.image && product.image !== "default-product.png") {
      const imgPath = path.join("public", "item_photos", product.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
