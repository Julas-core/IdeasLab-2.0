import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { TrendData } from '../types';

interface TrendChartProps {
    data: TrendData[];
    isDarkMode?: boolean;
}

const CustomTooltip = ({ active, payload, label, isDarkMode = true }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className={`p-3 rounded-lg border backdrop-blur-sm ${
                isDarkMode 
                    ? 'bg-gray-800/90 border-gray-700 text-gray-200' 
                    : 'bg-white/90 border-gray-200 text-gray-800'
            }`}>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-sm text-blue-500">{`Score: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const TrendChart: React.FC<TrendChartProps> = ({ data, isDarkMode = true }) => {
    const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
    const textColor = isDarkMode ? '#9ca3af' : '#6b7280';
    const barColor = isDarkMode ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.8)';

    return (
        <div style={{ width: '100%', height: 120 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.3} />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: textColor, fontSize: 10 }} 
                        tickLine={false} 
                        axisLine={{ stroke: gridColor }}
                    />
                    <YAxis 
                        tick={{ fill: textColor, fontSize: 10 }} 
                        tickLine={false} 
                        axisLine={{ stroke: gridColor }}
                    />
                    <Tooltip 
                        content={<CustomTooltip isDarkMode={isDarkMode} />} 
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    />
                    <Bar 
                        dataKey="trend" 
                        fill={barColor} 
                        radius={[2, 2, 0, 0]} 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendChart;