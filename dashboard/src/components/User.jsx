import React, { useEffect, useState } from 'react'
import { Space, Table, Tag,Button, Modal,Form,Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/slice/userSlice';
import moment from 'moment';

const User = () => {
    const dispatch=useDispatch()
    const getData=useSelector((state)=>state.user)
    console.log(getData,"getUSerrrr")
   const [form] = Form.useForm();
const [id,setId]=useState(null)

    useEffect(()=>{
        dispatch(getUser())
    },[])


     const [isModalOpen, setIsModalOpen] = useState(false);

       const showModal = (record) => {
    setIsModalOpen(true);
    setId(record._id)
    form.setFieldsValue(
        {
            name:record.name,
            email:record.email,
            address:record.address,
            gender:record.gender,
            createdAt:record.createdAt
        }
    )
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


    const columns = [
  {
    title: 'SrNo',
    dataIndex: 'sn',
    key: 'sn',
    render: text => <a>{text}</a>,
  },
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'gender',
    dataIndex: 'gender',
    key: 'address',
  },
  {
    title: 'createdAt',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
 
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a  onClick={()=>showModal(record)}>view</a>
        <a>update</a>
        <a>Delete</a>
      </Space>
    ),
  },
];


const arr = getData?.userInfo?.data?.map((item, index) => ({
  sn: index + 1,
  name: item.name,
  email: item.email,
  gender:item.gender,
  address: item.address,
  createdAt: moment(item.createdAt).format('DD-MM-YYYY'),
})) || [];
  return (
   <>
   <Table columns={columns} dataSource={arr} />;

   <Modal
        title="View user"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="User Name">
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
          <Form.Item name="address" label=" Address">
            <Input disabled />
          </Form.Item>
          <Form.Item name="gender" label=" Gender">
            <Input disabled />
          </Form.Item>
          <Form.Item name="createdAt" label=" CreatedAt">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
   </>
  )
}

export default User