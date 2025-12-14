import Sweet from "../models/Sweet.js";

export const createSweet = async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);

    return res.status(201).json({
      message: "Sweet created successfully",
      data: sweet
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();

    return res.status(200).json({
      data: sweets
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let query = {};

    // Name search (case-insensitive)
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Category search
    if (category) {
      query.category = { $regex: category, $options: "i" }; 
    }

    // Price range search
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);

    return res.status(200).json({ data: sweets });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
