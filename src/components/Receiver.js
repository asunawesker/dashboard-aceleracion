import React, { useEffect, useState } from 'react';
import { Card, List } from 'antd';
import {
    Line,
    LineChart,
    XAxis,
    YAxis,
  } from 'recharts';

const Receiver = ({ payload }) => {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (payload.topic) {            
            setMessages(messages => [...messages, payload])
        }
    }, [payload]);
      
    const renderListItem = (item) => (
        <List.Item>
            <List.Item.Meta
                title={item.topic}
                description={item.acceleration}
            />
        </List.Item>
    )

    return (
        <Card
            title="Receiver"
        >   
            <LineChart width={5000} height={500} data={messages}>
                <XAxis dataKey="pointPlotted"/>
                <YAxis />
                <Line dataKey="acceleration" />
            </LineChart>
            <List
                size="small"
                bordered
                dataSource={messages}
                renderItem={renderListItem}
            />  
        </Card>
        
        
    );
}

export default Receiver;