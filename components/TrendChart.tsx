
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { TrendData } from '../types';
import { ChartBarIcon } from './icons/AllIcons';

interface TrendChartProps {
    data: TrendData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700/80 backdrop-blur-sm p-3 rounded-lg border border-gray-600">
        <p className="text-sm font-bold text-gray-200">{`${label}`}</p>
        <p className="text-sm text-cyan-300">{`Trend Score: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex-shrink-0">
            <h2 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2"/>
              Top 5 Trends
            </h2>
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                        <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={{stroke: '#4b5563'}}/>
                        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={{stroke: '#4b5563'}}/>
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(107, 114, 128, 0.1)'}}/>
                        <Bar dataKey="trend" fill="rgba(34, 211, 238, 0.6)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrendChart;
