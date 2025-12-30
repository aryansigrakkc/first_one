import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Typography, Input,Modal  } from "antd";
import { LikeOutlined, CommentOutlined } from "@ant-design/icons";

import { getBlog, likeBlog, addComment } from "../redux/slice/blogSlice";
import { getCategory } from "../redux/slice/categorySlice";

const { Title, Text } = Typography;

const HomeBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const category = useSelector((state) => state.category);
  const blogState = useSelector((state) => state.blog);
  const [commentText, setCommentText] = useState({});
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedBlog, setSelectedBlog] = useState(null);

 
  const openCommentModal = (blog) => {
  setSelectedBlog(blog);
  setIsModalOpen(true);
};


  useEffect(() => {
    dispatch(getCategory());
    dispatch(getBlog());
  }, [dispatch]);

  // 👍 LIKE
  const handleLike = async (blogId) => {
    await dispatch(likeBlog(blogId));
    dispatch(getBlog());
  };

  // 💬 COMMENT
  const handleComment = async (blogId) => {
    if (!commentText[blogId]) return;

    await dispatch(
      addComment({
        blogId,
        text: commentText[blogId],
      })
    );

    setCommentText({ ...commentText, [blogId]: "" });
    dispatch(getBlog());
  };

  return (
    <div style={{ padding: "20px" }}>
      {category?.data?.data?.map((cat) => {
        const relatedBlogs = blogState?.blogs?.filter(
          (blog) => blog.category === cat._id
        );

        return (
          <div key={cat._id} style={{ marginBottom: "40px" }}>
            <Title level={3}>{cat.name}</Title>

            <Row gutter={[16, 16]}>
              {relatedBlogs?.slice(0, 3).map((blog) => (
                <Col xs={24} sm={12} md={8} key={blog._id}>
                  <Card
                    hoverable
                    title={blog.title}
                    cover={
                      blog.image && (
                        <img
                          alt={blog.title}
                          src={`http://localhost:9006/images/${blog.image}`}
                          style={{
                            height: "180px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )
                    }
                  >
                    <Text type="secondary">{blog.short_desc}</Text>
                    <br />
                    <Text type="secondary">{blog.long_desc}</Text>

                    {/* LIKE & COMMENT ICON */}
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        marginTop: "12px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        onClick={() => handleLike(blog._id)}
                        style={{ cursor: "pointer" }}
                      >
                        <LikeOutlined /> {blog.likes?.length || 0}
                      </span>

                     <span
  style={{ cursor: "pointer" }}
  onClick={() => openCommentModal(blog)}
>
  <CommentOutlined /> {blog.comments?.length || 0}
</span>
                    </div>

                    {/* COMMENT INPUT */}
                    <Input
                      placeholder="Write a comment..."
                      value={commentText[blog._id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [blog._id]: e.target.value,
                        })
                      }
                      style={{ marginTop: "10px" }}
                    />

                    <Button
                      type="primary"
                      size="small"
                      style={{ marginTop: "8px" }}
                      onClick={() => handleComment(blog._id)}
                    >
                      Post
                    </Button>

                    {/* COMMENT LIST */}
                  
                  </Card>
                </Col>
              ))}
            </Row>

            {relatedBlogs?.length > 3 && (
              <div style={{ marginTop: "15px", textAlign: "right" }}>
                <Button
                  type="primary"
                  onClick={() => navigate(`/category/${cat._id}`)}
                >
                  View More
                </Button>
              </div>
            )}
          </div>
        );
      })}
      <Modal
  title="Comments"
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={null}
>
  {/* COMMENT LIST */}
  {selectedBlog?.comments?.length > 0 ? (
    selectedBlog.comments.map((c) => (
      <p key={c._id}>
        <b>{c.userId?.name}</b>: {c.text}
      </p>
    ))
  ) : (
    <Text type="secondary">No comments yet</Text>
  )}

  {/* COMMENT INPUT */}
  <Input
    placeholder="Write a comment..."
    value={commentText[selectedBlog?._id] || ""}
    onChange={(e) =>
      setCommentText({
        ...commentText,
        [selectedBlog?._id]: e.target.value,
      })
    }
    style={{ marginTop: "10px" }}
  />

  <Button
    type="primary"
    size="small"
    style={{ marginTop: "8px" }}
    onClick={() => handleComment(selectedBlog._id)}
  >
    Post
  </Button>
</Modal>

    </div>
  );
};

export default HomeBlog;
