import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCategory,
  updateCategory,
  createCategory,
  deleteCategory,
} from '../redux/slice/categorySlice';
import {
  Table,
  Tag,
  Modal,
  Drawer,
  Form,
  Input,
  Switch,
  Button,
  Space,
  Popconfirm
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const GetCategoryBlog = () => {
  const dispatch = useDispatch();
  const getData = useSelector((state) => state.category);
  console.log(getData);
  

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionType, setActionType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const openDrawer = (record,actionType) => {
    setActionType(actionType);
    form.resetFields();

    if (actionType === 'update') {
      setEditingId(record._id);
      form.setFieldsValue({
        name: record.name,
        status: record.status,
      });
    }

    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (actionType === 'update') {
      dispatch(updateCategory({ ...values, _id: editingId })).then(() => {
        dispatch(getCategory());
        closeDrawer();
      });
    } else {
      dispatch(createCategory(values)).then(() => {
        dispatch(getCategory());
        closeDrawer();
      });
    }
  };

  const handleDelete=(id)=>{
    dispatch(deleteCategory(id))
    
  }

  const columns = [
    {
      title: 'Sr no',
      dataIndex: 'sr',
      key: 'sr',
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'createdAt',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        status ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <a onClick={() => {
            setSelectedRecord(record);
            setIsModalOpen(true);
          }}>View</a>
          <a onClick={() => openDrawer(record, 'update')} style={{ color: '#fa8c16' }}>
            Update
          </a>
           <Popconfirm
              title="Category"
              description="Are you sure to delete "
           
            onConfirm={() => handleDelete(record._id)}

              onOpenChange={() => console.log("open change")}
            >
              <button className="btn btn-outline-primary btn-sm col-xs-2"> delete</button> 
            </Popconfirm>
        </Space>
      ),
    },
  ];

  const tableData =
    getData?.data?.data?.map((item, index) => ({
      sr: index + 1,
      _id: item._id,
      name: item.name,
      createdAt:item.createdAt,
      status: item.status,
      key: item._id,
    })) || [];

  return (
    <>

    <Button
    type="primary"
    icon={<PlusOutlined />}
    size="middle"
    onClick={() => openDrawer('create')}
 / > 

 <Table columns={columns} dataSource={tableData} />
     

      {/* View Modal */}
      <Modal
        title="Category Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedRecord && (
          <>
            <p><strong>Sr No:</strong> {selectedRecord.sr}</p>
            <p><strong>Name:</strong> {selectedRecord.name}</p>
            <p><strong>Status:</strong> {selectedRecord.status ? 'Active' : 'Inactive'}</p>
            <p><strong>ID:</strong> {selectedRecord._id}</p>
          </>
        )}
      </Modal>

     
   <Drawer
  title={actionType === 'update' ? 'Update Category' : 'Create Category'}
  open={open}
  onClose={closeDrawer}
 
>
  {actionType === 'update' ? (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </>
  ) : (
    <>
     <Form
  form={form}
  layout="vertical"
  onFinish={onFinish}
>
  <Form.Item
    name="name"
    label="Category Name"
    rules={[{ required: true, message: 'Please enter category name' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    name="status"
    label="Status (active / inactive)"
    rules={[{ required: true, message: 'Please enter status as true or false' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit">
      Create
    </Button>
  </Form.Item>
</Form>

    </>
  )}
</Drawer>
    </>
  )
}

export default GetCategoryBlog;
