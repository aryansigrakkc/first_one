import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogsByCategory } from "../redux/slices/blogSlice";
import { useParams } from "react-router-dom";

export default function CategoryWiseBlogPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { blogsByCategory } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getBlogsByCategory(id));
  }, [id]);

  const blogList = blogsByCategory[id] || [];

  return (
    <div style={{ padding: 20 }}>
      <h2>Blogs in this Category</h2>

      {blogList.map((blog) => (
        <div
          key={blog._id}
          style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15 }}
        >
          <h3>{blog.title}</h3>
          <p>{blog.description}</p>
        </div>
      ))}
    </div>
  );
}
