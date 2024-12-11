import React, { useState, useEffect } from "react";
import axios from "axios";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    imageUrl: "",
    isActive: true,
  });

  // Fetch products and categories from backend
  useEffect(() => {
    axios
      .get("/api/products")
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    axios
      .get("/api/categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleAddClick = () => {
    setCurrentProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      categoryId: "",
      imageUrl: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentProduct) {
      axios
        .put(`/api/products/${currentProduct.id}`, formData)
        .then(() => {
          setProducts(
            products.map((product) =>
              product.id === currentProduct.id ? { ...product, ...formData } : product
            )
          );
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error("Error updating product:", error);
        });
    } else {
      axios
        .post("/api/products", formData)
        .then((response) => {
          setProducts([...products, response.data.product]);
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error("Error adding product:", error);
        });
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`/api/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 pt-16">
          <h1 className="text-4xl font-bold">Manage Products</h1>
          <button
            onClick={handleAddClick}
            className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
          >
            Add New Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Price</th>
                <th className="py-2 px-4 text-left">Category</th> {/* เพิ่มคอลัมน์ Category */}
                <th className="py-2 px-4 text-left">Stock Quantity</th> {/* เพิ่มคอลัมน์ Stock Quantity */}
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">${product.price}</td>
                  <td className="py-2 px-4">
                    {categories
                      .filter((category) => category.id === product.categoryId)
                      .map((category) => category.categoryName) || "N/A"}
                  </td> {/* แสดงชื่อหมวดหมู่ */}
                  <td className="py-2 px-4">{product.stockQuantity}</td> {/* แสดง stockQuantity */}
                  <td className="py-2 px-4">{product.description}</td>
                  <td className="py-2 px-4 flex space-x-4">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">{currentProduct ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white">Name</label>
                <input
                  type="text"
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-white">Category</label>
                <select
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-white">Price</label>
                <input
                  type="text"
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-white">Description</label>
                <textarea
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-white">Stock Quantity</label>
                <input
                  type="number"
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-white">Image URL</label>
                <input
                  type="text"
                  className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-red-700 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white py-2 px-4 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProducts;
