import React, { useEffect, useState } from 'react'
import ProductList from '../components/product-list/ProductList'

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("http://localhost:3000/products");
      const data = await res.json();
      // console.log(data)
      setProducts(data);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <ProductList products={products}/>
    </div>
  )
}

export default Home
