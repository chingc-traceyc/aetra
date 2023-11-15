export const metadata = {
    title: "Add Product - Aetra"
}

export default function AddProduct() {
  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Add Product</h1>
      <form>
        <input
          className="mb-3 w-full input input-bordered"
          required
          name="name"
          placeholder="Name"
        />
        <textarea
          className="textarea-bordered input mb-3 w-full"
          required
          name="description"
          placeholder="Description"
        />
        <input
          className="mb-3 w-full input input-bordered"
          required
          name="image_url"
          type="url"
          placeholder="Image URL"
        />
        <input
          className="mb-3 w-full input input-bordered"
          required
          name="price"
          placeholder="Price"
          type="number"
        />
        <input
          className="mb-3 w-full input input-bordered"
          required
          name="stock_quantity"
          placeholder="Quantity"
          type="number"
        />
        <input
          className="mb-3 w-full input input-bordered"
          required
          name="weight"
          placeholder="Weight"
          type="number"
        />
        <button className="btn btn-primary btn-block" type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
}
