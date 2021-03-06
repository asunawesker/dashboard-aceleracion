import React, { useEffect, useState, createContext } from 'react';
import mqtt from 'mqtt/dist/mqtt';
import Swal from 'sweetalert2'
import { Typography } from 'antd';

import Connection from './Connection';
//import Subscriber from './Subscriber';
import Receiver from './Receiver';
import DataTable from './DataTable';

const { Title } = Typography;

/*
export const QosOption = createContext([]);
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
*/

const HookMqtt = () => {
    const [client, setClient] = useState(null);
    const [isSubed, setIsSub] = useState(false);
    const [payload, setPayload] = useState({});
    const [connectStatus, setConnectStatus] = useState('Conectar');   
    let acceleration;
    let step;

    const mqttConnect = (host) => {
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
            qos: 2,
            retain: false
          },
          rejectUnauthorized: false
        };

        setConnectStatus('Conectando');
        setClient(mqtt.connect(url, options));
    };

    useEffect(() => {
        mqttConnect();
    }, []);

    useEffect(() => {
        if (client) {
            client.on('connect', () => {
                setConnectStatus('Conectado');
                mqttSub();
            });
            client.on('error', (err) => {                
                client.end();
                console.error('Connection error: ', err);
            });
            client.on('reconnect', () => {
                setConnectStatus('Reconectando');
            });
            client.on('message', (topic, message) => {               

                if (topic.includes('pasos')) {
                    step = JSON.parse(message);
                }
                
                if (topic.includes('aceleracion')) {
                    acceleration = JSON.parse(message);
                }
                
                if(acceleration !== undefined && step !== undefined){
                    if(acceleration.aceleracion>=25){
                        alertCrashCar(extractClient(topic));
                    }
                    const payload = { 
                        topic, 
                        message: message.toString(), 
                        acceleration: acceleration.aceleracion, 
                        pointPlotted: step.pointsPlotted, 
                        client: extractClient(topic)
                    };
                    setPayload(payload);
                    step = undefined;
                    acceleration = undefined;
                }
                
            });
        }
    }, [client]);    
    
    const extractClient = (topic) => {
        return topic.substring(
            topic.indexOf("/") + 1, 
            topic.lastIndexOf("/")
        );
    }

    const mqttDisconnect = () => {
        if (client) {
            client.end(() => {
                setConnectStatus('Conectar');
                setIsSub(false);
            });
        }
    }
    
    const mqttSub = () => {
        if (client) {
            const topic = 'emulador/+/#'
            client.subscribe(topic, 0, (error) => {
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

    const mqttPublish = (value, clientid) => {
        if (client) {
            const topic = `cliente/${clientid}/respuesta`;
            const payload = value;
            
            client.publish(topic, payload, 0, error => {
                if (error) {
                    console.log('Publish error: ', error);
                }
            });
        }
    };

    const alertCrashCar = (clientid) => {
        Swal.fire({
            title: "ACABAN DE CHOCAR",
            input: 'text',
            inputLabel: 'TU CLIENTE ACABA DE CHOCAR',
            inputValue: "",
            icon: "warning",
            dangerMode: true,
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return '??Necesitas escribir un mensaje!'
              }
              mqttPublish(value, clientid);
            }
        })
        .then((willDelete) => {
            if (willDelete) {
                Swal.fire({
                    title:"Se ha emitido una notificaci??n de rescate a tu cliente",
                    icon: "success",
                });                
            } else {
                Swal.fire({
                    inputLabel:"No se emiti?? se??al de rescate a tu cliente",
                    icon: "error",
                }); 
            }
        });
    };

    return (
        <>
            <Title style={{color:'#FFFFFF', fontSize: '100px', padding: '0 50px'}}>Alerta Choque</Title>
            <Connection connect={mqttConnect} disconnect={mqttDisconnect} connectBtn={connectStatus} />
            {/*<QosOption.Provider value={qosOption}>
                <Subscriber sub={mqttSub} unSub={mqttUnSub} showUnsub={isSubed} />
            </QosOption.Provider>*/}
            <Receiver payload={payload}/>           
            <DataTable/>
        </>
    );
}

export default HookMqtt;