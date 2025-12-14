import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createAxiosInstance } from "../api/axiosInstance";

export default function Dashboard() {
  const { token } = useAuth();
  const api = createAxiosInstance(token);

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const res = await api.get("/sweets");
      setSweets(res.data.data);
    } catch (err) {
      console.error("Error fetching sweets:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading sweets...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Available Sweets</h1>

      {/* Grid */}
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

            <button
              disabled={sweet.quantity === 0}
              className={`mt-4 w-full py-2 rounded-lg text-white transition 
              ${sweet.quantity === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
              `}
            >
              Purchase
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}
