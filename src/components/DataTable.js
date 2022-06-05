import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Table, Tag, Button, Card } from 'antd';

function DataTable() {
    const [list, setList] = useState([]);
    
    useEffect(() => {
        getDataMqttServer();
    }, [setList]);

    const getDataMqttServer = () => {
        Axios({
            url: 'https://Alert-mqtt.asunawesker.repl.co/mqtt',
        })
        .then((response) => {
            setList(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    let timestampToNormal = (timestamp) => {
        let a = new Date(timestamp * 1000);
        let months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        let month = months[a.getMonth()];
        let date = a.getDate();
        
        return date + ' ' + month;
    }

    let extractAcceleration = (acceleration) => {
        let jsonAcceleration = JSON.parse(acceleration);
        return jsonAcceleration.aceleracion;
    }

    let tag = (acceleration) => {
        let jsonAceleracion = extractAcceleration(acceleration)
        let accelerationColor = jsonAceleracion > 25 ? 'volcano' : 'green'
        return (
            <Tag color={accelerationColor} key={jsonAceleracion}>
                {jsonAceleracion}
            </Tag>
        );
    }

    const columns = [
        {
            title: 'Cliente',
            dataIndex: 'clientid',
            key: 'clientid',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Aceleracion',
            dataIndex: 'payload',
            key: 'payload',
            render: payload => (
                tag(payload) 
            )
        },
        {
            title: 'Fecha',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: timestamp => (
                timestampToNormal(timestamp)                
            )
        }
    ];

    return (
        <Card
            title="Información"
            >
            <Table columns={columns} dataSource={list} />
            <Button type="primary" onClick={getDataMqttServer}>Actualizar información</Button>
        </Card>
    );
}

export default DataTable;