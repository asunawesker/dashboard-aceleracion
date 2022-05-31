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
            console.log(messages);
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
            <LineChart width={ 700 } height={ 300 } data={ messages }>
                <XAxis dataKey="pointPlotted"/>
                <YAxis />
                <Line dataKey="acceleration" />
            </LineChart>
            <List
                size="large"
                bordered
                dataSource={messages}
                renderItem={renderListItem}
            />  
        </Card>
        
        
    );
}

export default Receiver;