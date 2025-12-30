import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlogByCategory } from "../redux/slice/blogSlice";
import "./CategoryBlogs.css";

const CategoryBlogs = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  const { blogs, isLoading } = useSelector((state) => state.blog);

  useEffect(() => {
    if (categoryId) {
      dispatch(getBlogByCategory(categoryId));
    }
  }, [categoryId,dispatch]);

  const IMAGE_BASE_URL = "http://localhost:9006/images/";

  return (
    <div className="blog-container">
      <h2 className="page-title">Category Blogs</h2>

      {isLoading && <p className="loading">Loading...</p>}

      {!isLoading && blogs?.length > 0 ? (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              {blog.image && (
                <img
                  src={IMAGE_BASE_URL + blog.image}
                  alt={blog.name}
                  className="blog-image"
                />
              )}

              <div className="blog-content">
                <h3 className="blog-title">{blog.name}</h3>
                <p className="blog-short">{blog.short_desc}</p>

                <p className="blog-long">
                  {blog.long_desc.substring(0, 150)}...
                </p>

                <button className="read-more-btn">Read More</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No blogs found</p>
      )}
    </div>
  );
};

export default CategoryBlogs;
