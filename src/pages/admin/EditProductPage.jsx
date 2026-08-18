import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [labalPrice, setLabalPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  // Get existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        const product = response.data.product;

        setName(product.name);
        setPrice(product.price);
        setDescription(product.description || "");
        setStock(product.stock);
        setLabalPrice(product.labalPrice);
        setIsAvailable(product.isAvailable);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          name,
          price,
          description,
          stock,
          labalPrice,
          isAvailable,
        }
      );

      alert("Product updated successfully");

      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
      />

      <input
        type="number"
        value={labalPrice}
        onChange={(e) => setLabalPrice(e.target.value)}
        placeholder="Label Price"
      />

      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <label>
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />
        Available
      </label>

      <button type="submit">
        Update Product
      </button>
    </form>
  );
}