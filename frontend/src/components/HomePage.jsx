import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getCategory } from "../redux/slice/categorySlice";
import {
  getBlog,
  likeBlog,
  addComment,
  updateComment,
  deleteComment,
} from "../redux/slice/blogSlice";

import { AiFillLike } from "react-icons/ai";
import { FaRegComment, FaEdit, FaTrash } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";

import { Modal, Button } from "antd";
import "antd/dist/reset.css";

import "./HomePage.css";
import { logoutUser } from "../redux/slice/userSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = useSelector((state) => state.category?.data?.data || []);
  const blogs = useSelector((state) => state.blog?.blogs || []);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [likedBlogs, setLikedBlogs] = useState([]); 
  const [commentText, setCommentText] = useState({});

 
  const [openLikes, setOpenLikes] = useState(false);
  const [likeUsersList, setLikeUsersList] = useState([]);


  const [openComments, setOpenComments] = useState({
    isOpen: false,
    blogId: null,
  });
  const [commentListData, setCommentListData] = useState([]);

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate("/");
  };

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getBlog());
  }, [dispatch]);

  // utilities
  const safeParseToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  };

 
  const blogsByCategory = categories.map((cat) => ({
    category: cat,
    blogs: (blogs || []).filter((b) => b.category === cat._id).slice(0, 3),
  }));

  
  const showLikesModal = (likes = []) => {
    const names = (likes || []).map((e) => { 
      return e?.userId?.name || e?.name || "User";
    });
    setLikeUsersList(names);
    setOpenLikes(true);
  };

  

 
  const showCommentsModal = (blogId, comments = []) => {
    const cloned = (comments || []).map((c) => ({
      ...c,
      isEditing: false,
      editText: c.text || "",
    }));
    setCommentListData(cloned);
    setOpenComments({ isOpen: true, blogId });
  };


  const handleLikeClick = (blog) => {
    
    dispatch(likeBlog(blog._id));

  
    setLikedBlogs((prev) =>
      prev.includes(blog._id) ? prev.filter((id) => id !== blog._id) : [...prev, blog._id]
    );
  };

 
  const handleAddComment = (blogId) => {
    const text = commentText[blogId]?.trim();
    if (!text) return;
    dispatch(addComment({ blogId, text }));
    setCommentText((prev) => ({ ...prev, [blogId]: "" }));
  };

  
  const handleDeleteComment = (blogId, commentId) => {
    dispatch(deleteComment({ blogId, commentId }));
    setCommentListData((prev) => prev.filter((c) => c._id !== commentId));
  };

 
  const handleSaveEditedComment = (blogId, index) => {
    const c = commentListData[index];
    if (!c) return;
    const newText = (c.editText || "").trim();
    if (!newText) return;
    dispatch(updateComment({ blogId, commentId: c._id, text: newText }));

   
    const newList = [...commentListData];
    newList[index] = { ...newList[index], text: newText, isEditing: false };
    setCommentListData(newList);
  };

 
  const openCommentsForBlog = (blog) => {
    showCommentsModal(blog._id, blog.comments || []);
  };


  const tokenPayload = safeParseToken();
  const currentUserId = tokenPayload?._id || null;

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <h1 className="home-title">📚 Blog Home</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Categories */}
      <ul className="category-list">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className={`category-item ${selectedCategory === cat._id ? "active" : ""}`}
            onClick={() => {
              setSelectedCategory(cat._id);
              navigate(`/categoryblogs/${cat._id}`);
            }}
          >
            {cat.name}
          </li>
        ))}
      </ul>

      {/* Blog sections */}
      {blogsByCategory.map(({ category, blogs }) => (
        <div key={category._id} className="category-section">
          <h2 className="category-title">{category.name}</h2>

          <div className="blog-grid">
            {blogs && blogs.length > 0 ? (
              blogs.map((blog) => {
                // defensive defaults
                const likeArr = blog?.likes || [];
                const commentArr = blog?.comments || [];
                const likesCount = likeArr.length || 0;

                return (
                  <div key={blog._id} className="blog-card">
                    {blog.image && (
                      <img
                        src={`http://localhost:9006/images/${blog.image}`}
                        alt={blog.name}
                        className="blog-image"
                      />
                    )}

                    <h3 className="blog-title">{blog.name}</h3>
                    <p className="blog-short">{blog.short_desc}</p>

                    {/* Like / Comment / Share */}
                    <div className="flex items-center gap-6 mt-4 text-xl cursor-pointer text-gray-600">
                      {/* LIKE */}
                      <div
                        className="flex items-center gap-1"
                        style={{ alignItems: "center" }}
                      >
                        <div
                          onClick={() => handleLikeClick(blog)}
                          style={{ display: "flex", alignItems: "center", gap: 8 }}
                        >
                          <AiFillLike
                            className={`hover:text-blue-600 ${
                              likedBlogs.includes(blog._id) ? "text-blue-600" : ""
                            }`}
                            style={{ fontSize: 20 }}
                          />
                        </div>

                        {/* likes count clickable */}
                        <span
                          style={{ cursor: "pointer", userSelect: "none" }}
                          onClick={() => showLikesModal(likeArr)}
                          title="View who liked"
                        >
                          {likesCount}
                        </span>
                      </div>

                      {/* COMMENT */}
                      <div
                        className="flex items-center gap-1"
                        style={{ alignItems: "center" }}
                        onClick={() => openCommentsForBlog(blog)}
                      >
                        <FaRegComment className="hover:text-green-600" style={{ fontSize: 18 }} />
                        <span style={{ cursor: "pointer" }}>{commentArr.length || 0}</span>
                      </div>

                      {/* SHARE */}
                      {/* <IoShareSocialSharp className="hover:text-purple-600" style={{ fontSize: 18 }} /> */}
                    </div>

                    {/* COMMENT BOX */}
                    <div className="comment-box">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText[blog._id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({ ...prev, [blog._id]: e.target.value }))
                        }
                        className="comment-input"
                      />
                      <button
                        className="comment-btn"
                        onClick={() => handleAddComment(blog._id)}
                      >
                        Comment
                      </button>
                    </div>

                    {/* last two comments preview */}
                    {(commentArr?.slice?.(-2) || []).map((c, i) => (
                      <p key={c._id || i} className="existing-comment" style={{ marginTop: 8 }}>
                        <b>{c?.userId?.name || c?.name || "User"}:</b> {c?.text}
                      </p>
                    ))}
                  </div>
                );
              })
            ) : (
              <p>No blogs found</p>
            )}
          </div>

          <div style={{ textAlign: "right", marginTop: 10 }}>
            <Link to={`/categoryblogs/${category._id}`} className="view-more-btn">
              View More
            </Link>
          </div>
        </div>
      ))}

      {/* Likes Modal */}
      <Modal
        title="Liked By"
        open={openLikes}
        onCancel={() => setOpenLikes(false)}
        footer={[
          <Button key="close" onClick={() => setOpenLikes(false)}>
            Close
          </Button>,
        ]}
      >
        {likeUsersList.length > 0 ? (
          likeUsersList.map((name, idx) => (
            <p key={idx} style={{ padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
              {name}
            </p>
          ))
        ) : (
          <p>No likes yet</p>
        )}
      </Modal>

      {/* Comments Modal */}
      <Modal
        title="All Comments"
        open={openComments.isOpen}
        onCancel={() => {
          setOpenComments({ isOpen: false, blogId: null });
          setCommentListData([]);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setOpenComments({ isOpen: false, blogId: null });
              setCommentListData([]);
            }}
          >
            Close
          </Button>,
        ]}
        bodyStyle={{ maxHeight: 420, overflowY: "auto" }}
      >
        {commentListData.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          commentListData.map((c, idx) => {
            const tokenData = safeParseToken();
            const viewerId = tokenData?._id;
            // comment may have userId as populated object or string id
            const commentUserId = c?.userId?._id || c?.userId || c?.userId?.id || null;
            const isOwner = viewerId && commentUserId && viewerId === commentUserId;

            return (
              <div
                key={c._id || idx}
                style={{
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: "1px solid #eee",
                }}
              >
                <p style={{ marginBottom: 6 }}>
                  <b>{c?.userId?.name || c?.name || "User"}:</b>{" "}
                  {!c.isEditing ? (
                    c?.text
                  ) : (
                    <input
                      value={c.editText}
                      onChange={(e) => {
                        const newList = [...commentListData];
                        newList[idx].editText = e.target.value;
                        setCommentListData(newList);
                      }}
                      className="comment-input"
                      style={{ width: "75%" }}
                    />
                  )}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <small style={{ color: "#888" }}>
                    {c?.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                  </small>

                  {isOwner && (
                    <div>
                      {!c.isEditing ? (
                        <>
                          <Button
                            type="link"
                            onClick={() => {
                              const newList = [...commentListData];
                              newList[idx].isEditing = true;
                              newList[idx].editText = c.text || "";
                              setCommentListData(newList);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            type="link"
                            danger
                            onClick={() => handleDeleteComment(openComments.blogId, c._id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="primary"
                            onClick={() => handleSaveEditedComment(openComments.blogId, idx)}
                          >
                            Save
                          </Button>

                          <Button
                            onClick={() => {
                              const newList = [...commentListData];
                              newList[idx].isEditing = false;
                              newList[idx].editText = "";
                              setCommentListData(newList);
                            }}
                            style={{ marginLeft: 8 }}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </Modal>
    </div>
  );
};

export default HomePage;
