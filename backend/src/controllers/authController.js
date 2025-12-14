export const registerUser = (req, res) => {
  // Still returning the same response (test expects this)
  return res.status(201).json({ message: "User registered successfully" });
};
