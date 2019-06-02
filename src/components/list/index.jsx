import React from 'react';
import Empty from '@components/empty';
import './index.pcss';

const List = ({ columns, data, loading }) => {
    return (
        <div className="list-wrapper">
            <div className="header">
                {columns.map(({ dataIndex, title }) => (<div key={dataIndex}>{title}</div>))}
            </div>
            <div className="body">
                {data.length === 0 ? <Empty /> : data.map((item, i) => (
                    <div className="row" key={i}>
                        {columns.map(({ dataIndex, render }) => (<div key={dataIndex}>{render ? render(item[dataIndex], item, i) : item[dataIndex]}</div>))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default List;
