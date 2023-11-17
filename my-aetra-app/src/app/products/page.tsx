"use client";

import { useState, FormEvent } from "react";

// export const metadata = {
//   title: "Add Product - Aetra",
// };

export default function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // New state variable

  const addProduct = async (event: FormEvent) => {
    event.preventDefault();
    const data = {
      name: name,
      description: description,
      image_url: imageUrl,
      price: price,
      stock_quantity: quantity,
      weight: weight,
    };

    const prodUrl = `${process.env.NEXT_PUBLIC_AETRA_API_HOST}/products`;

    const response = await fetch(prodUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setName("");
      setDescription("");
      setName("");
      setImageUrl("");
      setPrice("");
      setQuantity("");
      setWeight("");
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Add Product</h1>
      <form onSubmit={addProduct}>
        <input
          className="mb-3 w-full input input-bordered"
          required
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="textarea-bordered input mb-3 w-full"
          required
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="mb-3 w-full input input-bordered"
          required
          name="image_url"
          type="url"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          className="mb-3 w-full input input-bordered"
          required
          name="price"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="mb-3 w-full input input-bordered"
          required
          name="stock_quantity"
          placeholder="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          className="mb-3 w-full input input-bordered"
          required
          name="weight"
          placeholder="Weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button className="btn btn-primary btn-block" type="submit">
          Add Product
        </button>
       {isSubmitted && <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Product added successfully.</span>
          </div>
        </div>}
      </form>
    </div>
  );
}
