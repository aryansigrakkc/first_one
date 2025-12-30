import React, { useEffect, useState } from 'react';
import { Space, Table, Button, Modal, Form, Input, Popconfirm, Drawer, Select, Upload } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, deleteBlog, getBlog, updateBlog } from '../redux/slice/blogSlice';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getCategory } from '../redux/slice/categorySlice';

const GetBlog = () => {
  const dispatch = useDispatch();
  const getData = useSelector((state) => state.blog);
  const getCategoryData = useSelector((state) => state.category);

  const [limit, setLimit] = useState(5); 
  const [page, setPage] = useState(1);
  const [actionType, setActionType] = useState('');
  const [id, setId] = useState(null);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view' or 'details'
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBlog({ page, limit }));
  }, [page, limit, dispatch]);

  const openDrawer = (record, type) => {
    setOpen(true);
    setActionType(type);
    if (type === 'update') {
      setId(record._id);
      form.setFieldsValue({
        name: record.name,
        category: record?.category?.name,
        short_desc: record.short_desc,
        long_desc: record.long_desc,
      });
    } else {
      form.resetFields();
      setId(null);
    }
  };

  const onClose = () => setOpen(false);

  const showModal = (record, type = 'view') => {
    console.log(record,"recorddd");
    
    setIsModalOpen(true);
    setModalType(type);
    setSelectedBlog(record);
    if (type === 'view') {
      form.setFieldsValue({
        name: record.name,
        category: record.category,
        short_desc: record.short_desc,
      });
    }
  };

  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const handleDelete = (id) => dispatch(deleteBlog(id));

  const dataSource = (getData?.blogs || []).map((item, index) => ({
    key: item._id || index,
    _id: item._id,
    sno: index + 1,
    name: item.name,
    image: `http://localhost:9006/images/${item.image}`,
    category: item.category,
    short_desc: item.short_desc,
    long_desc: item.long_desc,
    likesCount: item.likes?.length || 0,
    commentsCount: item.comments?.length || 0,
    likes: item.likes || [],
    comments: item.comments || [],
  }));

  const columns = [
    { title: 'SNo', dataIndex: 'sno', key: 'sno' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { 
      title: 'Image', 
      dataIndex: 'image', 
      key: 'image', 
      render: (_, record) => <img src={record.image} style={{ width: 50, height: 50 }} alt="blog" /> 
    },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Short_desc', dataIndex: 'short_desc', key: 'short_desc' },
    { title: 'Long_desc', dataIndex: 'long_desc', key: 'long_desc' },
    { title: 'Likes', dataIndex: 'likesCount', key: 'likesCount' },
    { title: 'Comments', dataIndex: 'commentsCount', key: 'commentsCount' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record, 'view')}>View</a>
          <a onClick={() => showModal(record, 'details')}>Details</a>
          <a onClick={() => openDrawer(record, 'update')}>Update</a>
          <Popconfirm title="Blog" description="Are you sure to delete?" onConfirm={() => handleDelete(record._id)}>
            <button className="btn btn-outline-primary btn-sm">Delete</button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    if (actionType === 'update') {
      dispatch(updateBlog({ ...values, _id: id })).then(() => {
        dispatch(getBlog());
        setOpen(false);
        form.resetFields();
      });
    } else {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('category', values.category);
      formData.append('short_desc', values.short_desc);
      formData.append('long_desc', values.long_desc);
      formData.append('image', values.image.originFileObj);
      dispatch(createBlog(formData)).then(() => {
        dispatch(getBlog());
        setOpen(false);
        form.resetFields();
      });
    }
  };

  const onSelectLimit = (value) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <>
      <div className="container mb-3 d-flex justify-content-end align-items-center">
        <Button type="primary" icon={<PlusOutlined />} size="middle" onClick={() => openDrawer(null, 'create')} />
        <Select defaultValue={limit} style={{ width: 120, marginLeft: 10 }} onChange={onSelectLimit}>
          <Select.Option value={5}>5</Select.Option>
          <Select.Option value={10}>10</Select.Option>
          <Select.Option value={20}>20</Select.Option>
          <Select.Option value={50}>50</Select.Option>
        </Select>
      </div>

      <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: limit }} />

      {/* View Blog Modal */}
      <Modal title="View Blog" open={isModalOpen && modalType === 'view'} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Blog Name"><Input disabled /></Form.Item>
          <Form.Item name="category" label="Category"><Input disabled /></Form.Item>
          <Form.Item name="short_desc" label="Short Description"><Input disabled /></Form.Item>
        </Form>
      </Modal>

      {/* Likes/Comments Details Modal */}
   {/* Likes/Comments Details Modal */}
<Modal
  title="Blog Details"
  open={isModalOpen && modalType === "details"}
  onOk={handleOk}
  onCancel={handleCancel}
  footer={null}
>
  {selectedBlog && (
    <div>

      {/* ========= LIKES SECTION ========== */}
      <h4>Likes ({selectedBlog.likesCount})</h4>

      <ul>
        {selectedBlog.likes.map((like, idx) => {
          return (
            <li key={idx}>
              {like?.userId?.name ||
                like?.userId?.email ||
                "Anonymous User"}
            </li>
          );
        })}
      </ul>

      {/* ========= COMMENTS SECTION ========== */}
      <h4>Comments ({selectedBlog.commentsCount})</h4>

      <ul>
        {selectedBlog.comments.map((c, idx) => {
          return (
            <li key={idx}>
              <strong>
                {c?.userId?.name || c?.userId?.email || "Unknown User"}:
              </strong>{" "}
              {c.text}
            </li>
          );
        })}
      </ul>

    </div>
  )}
</Modal>



      {/* Create/Update Drawer */}
      <Drawer title={actionType === 'update' ? 'Update Blog' : 'Create Blog'} onClose={onClose} open={open}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Blog Name" rules={[{ required: true, message: 'Please enter Blog name' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="short_desc" label="Short Description" rules={[{ required: true, message: 'Please enter short description' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="long_desc" label="Long Description" rules={[{ required: true, message: 'Please enter long description' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select Category' }]}>
            <Select placeholder="Select Category">
              {getCategoryData?.data?.data?.map((item) => (
                <Select.Option key={item._id} value={item._id}>{item?.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Image" name="image" valuePropName="file" getValueFromEvent={(e) => e.fileList[0]} rules={[{ required: true, message: 'Please upload an image!' }]}>
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">{actionType === 'update' ? 'Update' : 'Create'}</Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default GetBlog;
