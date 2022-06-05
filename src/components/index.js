import React, { createContext, useEffect, useState } from 'react';
import mqtt from 'mqtt/dist/mqtt';
import Swal from 'sweetalert2'

import Connection from './Connection';
import Subscriber from './Subscriber';
import Receiver from './Receiver';
import DataTable from './DataTable';

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
    let acceleration;
    let step;
    let data = 1;

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

                if (topic === 'emulador/pasos') {
                    step = JSON.parse(message);
                }
                
                if (topic === 'emulador/aceleracion') {
                    acceleration = JSON.parse(message);
                }
                
                if(data ==2){
                    console.log(step);
                    console.log(acceleration);
                    data = 0;

                    if(acceleration.aceleracion>=25){
                        alertCrashCar();
                    }

                    const payload = { topic, message: message.toString(), acceleration: acceleration.aceleracion, pointPlotted: step.pointsPlotted };
                    setPayload(payload);
                } else {
                    data++;
                }
                
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

    const mqttPublish = (value) => {
        if (client) {
            const topic = "cliente/respuesta";
            const payload = value;
            
            client.publish(topic, payload, 0, error => {
                if (error) {
                    console.log('Publish error: ', error);
                }
            });
        }
    };

    const alertCrashCar = () =>{
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
                return '¡Necesitas escribir un mensaje!'
              }
              mqttPublish(value);
            }
        })
        .then((willDelete) => {
            if (willDelete) {
                Swal.fire({
                    title:"Se ha emitido una notificación de rescate a tu cliente",
                    icon: "success",
                });                
            } else {
                Swal.fire({
                    inputLabel:"No se emitió señal de rescate a tu cliente",
                    icon: "error",
                }); 
            }
        });
    }

    return (
        <>
            <Connection connect={mqttConnect} disconnect={mqttDisconnect} connectBtn={connectStatus} />
            <QosOption.Provider value={qosOption}>
                <Subscriber sub={mqttSub} unSub={mqttUnSub} showUnsub={isSubed} />
            </QosOption.Provider>
            <Receiver payload={payload}/>
            <DataTable/>
        </>
    );
}

export default HookMqtt;