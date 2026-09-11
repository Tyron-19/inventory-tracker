import { Modal, Form, Input, InputNumber } from 'antd';
import { useEffect } from 'react';
import api from '../api';

export default function ProductForm({ open, editing, onClose, onSaved }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(
      editing || { sku: '', name: '', category: '', quantity: 0, reorderLevel: 5, unitPrice: 0 }
    );
  }, [editing, open]);

  const handleOk = async () => {
    const values = await form.validateFields();
    if (editing) {
      await api.put(`/products/${editing.Id}`, values);
    } else {
      await api.post('/products', values);
    }
    onSaved();
    onClose();
  };

  return (
    <Modal title={editing ? 'Edit product' : 'Add product'} open={open} onOk={handleOk} onCancel={onClose}>
      <Form form={form} layout="vertical">
        <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="reorderLevel" label="Reorder level">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="unitPrice" label="Unit price">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}