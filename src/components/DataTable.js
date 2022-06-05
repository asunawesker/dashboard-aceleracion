import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Table, Divider, Tag } from 'antd';

function DataTable() {
    const [list, setList] = useState([]);
    
    useEffect(() => {
        Axios({
        url: 'https://Alert-mqtt.asunawesker.repl.co/mqtt',
        })
        .then((response) => {
            setList(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [setList]);

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
        <div>
            <Table columns={columns} dataSource={list} />
        </div>
    );
}

export default DataTable;