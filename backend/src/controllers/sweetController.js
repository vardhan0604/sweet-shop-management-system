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
