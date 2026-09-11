import { useEffect, useState } from 'react';
import { Table, Input, Button, Tag, Space, Popconfirm } from 'antd';
import api from '../api';

export default function ProductList({ onEdit, onCreate, reloadKey }) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const load = async () => {
    const { data } = await api.get('/products', { params: { search } });
    setData(data);
  };

  useEffect(() => { load(); }, [search, reloadKey]);

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  const columns = [
    { title: 'SKU', dataIndex: 'SKU' },
    { title: 'Name', dataIndex: 'Name' },
    { title: 'Category', dataIndex: 'Category' },
    {
      title: 'Stock', dataIndex: 'Quantity',
      render: (qty, row) => (
        <Tag color={qty <= row.ReorderLevel ? 'gold' : 'green'}>{qty}</Tag>
      )
    },
    { title: 'Unit Price', dataIndex: 'UnitPrice', render: (v) => `₱${Number(v).toFixed(2)}` },
    {
      title: 'Actions',
      render: (_, row) => (
        <Space>
          <Button size="small" onClick={() => onEdit(row)}>Edit</Button>
          <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(row.Id)}>
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Search SKU or name" onSearch={setSearch} allowClear />
        <Button type="primary" onClick={onCreate}>Add product</Button>
      </Space>
      <Table rowKey="Id" columns={columns} dataSource={data} />
    </>
  );
}