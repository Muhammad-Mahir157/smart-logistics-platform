import React from './chart.scss'
import {
  AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";

const data = [
  { name: "January", Completed: 1200 , Canceled: 23},
  { name: "February", Completed: 2100 , Canceled: 10},
  { name: "March", Completed: 800 , Canceled: 28},
  { name: "April", Completed: 1600 , Canceled: 3},
  { name: "May", Completed: 900 , Canceled: 10},
  { name: "June", Completed: 1700 , Canceled: 7},
];

export const Chart = ({aspect, title}) => {
  return (
    <div className='chart'>
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Completed"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
          <Area
            type="monotone"
            dataKey="Canceled"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart
