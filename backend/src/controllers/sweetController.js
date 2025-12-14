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

export const updateSweet = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSweet = await Sweet.findByIdAndUpdate(id, req.body, {
      new: true, // return updated document
    });

    if (!updatedSweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    return res.status(200).json({
      message: "Sweet updated successfully",
      data: updatedSweet,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteSweet = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Sweet.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    return res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const purchaseSweet = async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ message: "Sweet is out of stock" });
    }

    sweet.quantity -= 1;
    await sweet.save();

    return res.status(200).json({
      message: "Sweet purchased successfully",
      data: sweet
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};