import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserProvider";
import { Link, useParams } from "react-router-dom";

export default function Profile() {
  const { user: { username }, fetchCategories, userAxios } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const { category } = useParams();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    userAxios.get('/api/questions/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories", err));
  }, [category ]);



  // const [toggle, setToggle] = useState(false)
  return (
    <div className="profile-page">
      <h1 className="welcome">Welcome @{username}!</h1>
      <h2 className="categories">Categories:</h2>
      <ul>
  {categories && categories.map((category) => (
    <li key={category}>
      <Link to={`/category/${category}`}>{category}</Link>
    </li>
  ))}
</ul>
    </div>
  );
}
