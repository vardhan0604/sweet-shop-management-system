import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createAxiosInstance } from "../api/axiosInstance";

export default function Dashboard() {
  const { token, role } = useAuth();
  const api = createAxiosInstance(token);

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const [showEditForm, setShowEditForm] = useState(false);
  const [editSweet, setEditSweet] = useState(null);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const res = await api.get("/sweets");
      setSweets(res.data.data);
    } catch (err) {
      console.error("Error fetching sweets:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const searchSweets = async () => {
    setLoading(true);

    try {
      const params = {};

      if (name) params.name = name;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get("/sweets/search", { params });
      setSweets(res.data.data);
    } catch (err) {
      console.error("Search failed:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setName("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    fetchSweets();
  };

  // Purchase Sweet
  const purchaseSweet = async (id) => {
    try {
      await api.post(`/sweets/${id}/purchase`);
      fetchSweets();
    } catch (err) {
      console.error("Purchase failed:", err.response?.data);
    }
  };

  // Restock Sweet
  const restockSweet = async (id) => {
    try {
      await api.post(`/sweets/${id}/restock`);
      fetchSweets();
    } catch (err) {
      console.error("Restock failed:", err.response?.data);
    }
  };

  // Delete Sweet
  const deleteSweet = async (id) => {
    try {
      await api.delete(`/sweets/${id}`);
      fetchSweets();
    } catch (err) {
      console.error("Delete failed:", err.response?.data);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading sweets...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Available Sweets</h1>

      {/*  Search + Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={searchSweets}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Search
        </button>

        <button
          onClick={resetFilters}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Reset
        </button>
      </div>

      {/* Add Sweet Button (Admin Only) */}
      {role === "admin" && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Sweet
        </button>
      )}

      {/* Sweets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sweets.map((sweet) => (
          <div
            key={sweet._id}
            className="bg-white shadow-lg rounded-lg p-5 border"
          >
            <h2 className="text-xl font-semibold mb-2">{sweet.name}</h2>

            <p className="text-gray-700">
              Category: <span className="font-medium">{sweet.category}</span>
            </p>

            <p className="text-gray-700">
              Price: <span className="font-medium">₹{sweet.price}</span>
            </p>

            <p className="text-gray-700">
              Quantity: <span className="font-medium">{sweet.quantity}</span>
            </p>

            {/* Purchase Button */}
            <button
              onClick={() => purchaseSweet(sweet._id)}
              disabled={sweet.quantity === 0}
              className={`mt-4 w-full py-2 rounded-lg text-white transition 
              ${
                sweet.quantity === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Purchase
            </button>

            {/* Admin Only Buttons */}
            {role === "admin" && (
              <div className="mt-4 space-y-2">

                <button
                  onClick={() => restockSweet(sweet._id)}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Restock
                </button>

                <button
                  onClick={() => {
                    setEditSweet(sweet);
                    setShowEditForm(true);
                  }}
                  className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteSweet(sweet._id)}
                  className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>

              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Sweet Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">

            <h2 className="text-2xl font-bold mb-4">Add New Sweet</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = new FormData(e.target);

                const data = {
                  name: form.get("name"),
                  category: form.get("category"),
                  price: Number(form.get("price")),
                  quantity: Number(form.get("quantity")),
                };

                try {
                  await api.post("/sweets", data);
                  fetchSweets();
                  setShowAddForm(false);
                } catch (err) {
                  console.error("Add sweet failed:", err.response?.data);
                }
              }}
              className="space-y-4"
            >
              <input name="name" placeholder="Name" className="w-full border p-2 rounded" required />
              <input name="category" placeholder="Category" className="w-full border p-2 rounded" required />
              <input name="price" type="number" placeholder="Price" className="w-full border p-2 rounded" required />
              <input name="quantity" type="number" placeholder="Quantity" className="w-full border p-2 rounded" required />

              <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
                Add Sweet
              </button>
            </form>

            <button
              className="mt-4 w-full py-2 bg-gray-300 rounded-lg"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Sweet Modal */}
      {showEditForm && editSweet && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">

            <h2 className="text-2xl font-bold mb-4">Edit Sweet</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = new FormData(e.target);

                const data = {
                  name: form.get("name"),
                  category: form.get("category"),
                  price: Number(form.get("price")),
                  quantity: Number(form.get("quantity")),
                };

                try {
                  await api.put(`/sweets/${editSweet._id}`, data);
                  fetchSweets();
                  setShowEditForm(false);
                } catch (err) {
                  console.error("Update sweet failed:", err.response?.data);
                }
              }}
              className="space-y-4"
            >
              <input
                name="name"
                defaultValue={editSweet.name}
                placeholder="Name"
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="category"
                defaultValue={editSweet.category}
                placeholder="Category"
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="price"
                type="number"
                defaultValue={editSweet.price}
                placeholder="Price"
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="quantity"
                type="number"
                defaultValue={editSweet.quantity}
                placeholder="Quantity"
                className="w-full border p-2 rounded"
                required
              />

              <button className="w-full bg-yellow-600 text-white py-2 rounded-lg">
                Save Changes
              </button>
            </form>

            <button
              className="mt-4 w-full py-2 bg-gray-300 rounded-lg"
              onClick={() => setShowEditForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
