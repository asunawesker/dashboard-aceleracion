import React, { createContext, useEffect, useState } from 'react';
import mqtt from 'mqtt/dist/mqtt';

import Connection from './Connection';
import Subscriber from './Subscriber';
import Receiver from './Receiver';

export const QosOption = createContext([])
const qosOption = [
  {
    label: '0',
    value: 0,
  }, {
    label: '1',
    value: 1,
  }, {
    label: '2',
    value: 2,
  },
];

const HookMqtt = () => {
    const [client, setClient] = useState(null);
    const [isSubed, setIsSub] = useState(false);
    const [payload, setPayload] = useState({});
    const [connectStatus, setConnectStatus] = useState('Connect');

    const mqttConnect = (host) => {
        setConnectStatus('Connecting');
        setClient(mqtt.connect(host));
    };

    useEffect(() => {
        if (client) {
            client.on('connect', () => {
                setConnectStatus('Connected');
                console.info('Conectado');
            });
            client.on('error', (err) => {                
                client.end();
                console.error('Connection error: ', err);
            });
            client.on('reconnect', () => {
                setConnectStatus('Reconnecting');
            });
            client.on('message', (topic, message) => {
                let jsonMessage = JSON.parse(message);
                const payload = { topic, message: message.toString(), acceleration: jsonMessage.aceleracion, pointPlotted: jsonMessage.pointsPlotted };
                setPayload(payload);
            });
        }
    }, [client]);

    const mqttDisconnect = () => {
        if (client) {
            client.end(() => {
                setConnectStatus('Connect');
            });
        }
    }
    
    const mqttSub = (subscription) => {
        if (client) {
            const { topic, qos } = subscription;
            client.subscribe(topic, { qos }, (error) => {
                if (error) {
                    console.log('Subscribe to topics error', error)
                    return
                }
                setIsSub(true)
                console.info(`Subscribe to topic ${topic}`)
            });
        }
    };

    const mqttUnSub = (subscription) => {
        if (client) {
          const { topic } = subscription;
          client.unsubscribe(topic, error => {
            if (error) {
              console.log('Unsubscribe error', error)
              return
            }
            setIsSub(false);
          });
        }
      };

    return (
        <>
            <Connection connect={mqttConnect} disconnect={mqttDisconnect} connectBtn={connectStatus} />
            <QosOption.Provider value={qosOption}>
                <Subscriber sub={mqttSub} unSub={mqttUnSub} showUnsub={isSubed} />
            </QosOption.Provider>
            <Receiver payload={payload}/>
        </>
    );
}

export default HookMqtt;