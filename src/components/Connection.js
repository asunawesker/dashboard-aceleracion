import React from 'react';
import { Card, Button } from 'antd';

const Connection = ({ connect, disconnect, connectBtn }) => {
      
  const onFinish = () => {
    const url = `ws://34.125.103.25:8083/mqtt`;
    const options = {
      keepalive: 30,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'Connection Will',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
      },
      rejectUnauthorized: false
    };
    connect(url, options);
  };

  const handleConnect = () => {
    onFinish()
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Card
      title="Conexión a servidor mqtt"
    > 
      <Button type="primary" onClick={handleConnect}>{connectBtn}</Button>
      <Button danger onClick={handleDisconnect}>Desconectar</Button>
    </Card>
  );
}

export default Connection;