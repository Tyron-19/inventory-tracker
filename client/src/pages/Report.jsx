import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import api from '../api';

export default function Report() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/reports/summary');
      setSummary(data);
    };
    load();
  }, []);

  if (!summary) return null;

  const columns = [
    { title: 'Category', dataIndex: 'Category' },
    { title: 'Items', dataIndex: 'items' },
    { title: 'Units', dataIndex: 'units' },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="Total items" value={summary.totalItems} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Total units" value={summary.totalUnits} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Total value" value={summary.totalValue} precision={2} prefix="₱" /></Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Low stock items"
              value={summary.lowStockCount}
              valueStyle={{ color: summary.lowStockCount > 0 ? '#cf1322' : undefined }}
            />
          </Card>
        </Col>
      </Row>
      <Table rowKey="Category" columns={columns} dataSource={summary.byCategory} pagination={false} />
    </div>
  );
}