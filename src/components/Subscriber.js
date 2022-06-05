import React, { useContext } from 'react';
import { Card, Form, Row, Col, Button, Typography } from 'antd';
import { QosOption } from './index';

const { Text } = Typography;

const Subscriber = ({ sub, unSub, showUnsub }) => {
  const [form] = Form.useForm();

  const record = {
    topic: 'emulador/#',
    qos: 0,
  };

  const onFinish = (values) => {
    sub(values);
  };

  const handleUnsub = () => {
    const values = form.getFieldsValue();
    unSub(values);
  };

  const SubForm = (
    <Form
      layout="vertical"
      name="basic"
      form={form}
      initialValues={record}
      onFinish={onFinish}
    >
      <Row gutter={20}>        
        <Col span={12}>
          <Text strong>Topic: </Text>
          <Text>{record.topic}</Text>
        </Col>
        <Col span={12}>
          <Text strong>QoS: </Text>
          <Text>{record.qos}</Text>
        </Col>
        <Col span={8} offset={16} style={{ textAlign: 'right' }}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Subscribe
            </Button>
            {
              showUnsub ?
                <Button type="danger" style={{ marginLeft: '10px' }} onClick={handleUnsub}>
                  Unsubscribe
                </Button>
                : null
            }
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Card
      title="Recibir información"
    >
      {SubForm}
    </Card>
  );
}

export default Subscriber;