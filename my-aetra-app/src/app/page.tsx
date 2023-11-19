// "use client";

// import { useEffect, useState } from "react";

// export default function Home() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const url = `${process.env.NEXT_PUBLIC_AETRA_API_HOST}/products`;
//       const response = await fetch(url);

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data)
//         setProducts(data);
//         console.log(products);
//       }
//     };
//     fetchProducts();
//   }, []);

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       {Array.isArray(products) && products.length > 0 ? (
//         products.map((product) => <div key={product.id}>{product.name}</div>)
//       ) : (
//         <p>No products available.</p>
//       )}
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  image_url: string;
  stock_quantity: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = `${process.env.NEXT_PUBLIC_AETRA_API_HOST}/products`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <main>
      {products.length > 0 ? (
        <div className="">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h1 className="text-lg text-bold">Products</h1>
            {/* <h2 className="sr-only text-black">Products</h2> */}

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <a key={product.id} href={product.image_url} className="group">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    ${product.price}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No products available.</p>
      )}
    </main>
  );
}
