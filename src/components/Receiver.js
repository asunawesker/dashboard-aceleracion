import React, { useEffect, useState } from 'react';
import { Card, List, Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
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
                title = 'Aceleración'
                description = {item.acceleration}
            />
        </List.Item>
    )

    const cleanData = () => {
        setMessages([]);
    }

    return (        
        <Card
            title="Receiver"
        >   
            <LineChart width={ 700 } height={ 500 } data={ messages }>
                <XAxis                   
                    dataKey="pointPlotted"/>
                <YAxis 
                    label={{ value: 'Aceleración', angle: -90, position: 'insideLeft' }} />
                <Line dataKey="acceleration" />
            </LineChart>
            <div
                id="scrollableDiv"
                style={{
                    height: 400,
                    overflow: 'auto',
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
            >
                <InfiniteScroll
                    dataLength={messages.length}
                    next={payload}
                    hasMore={messages.length < 50}
                    scrollableTarget="scrollableDiv"
                >
                    <List                
                        bodyStyle={{overflowX: 'scroll'}}
                        size="large"
                        bordered
                        dataSource={messages}
                        renderItem={renderListItem}
                    />  
                </InfiniteScroll>    
            </div>    
            <Button type="primary" onClick={cleanData}>Limpiar datos</Button>                
        </Card>
    );
}

export default Receiver;