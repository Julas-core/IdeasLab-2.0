import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChartIcon } from './icons/AllIcons';

interface CategoryData {
    name: string;
    value: number;
}

interface CategoryDistributionChartProps {
    data: CategoryData[];
}

const COLORS = [
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#f97316', // orange-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#6366f1', // indigo-500
    '#d946ef', // fuchsia-500,
    '#ef4444' // red-500
];

const CustomTooltip = ({ active, payload }: any) => {  
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700/80 backdrop-blur-sm p-3 rounded-lg border border-gray-600">
                <p className="text-sm font-bold text-gray-200">{`${payload[0].name}`}</p>
                <p className="text-sm text-cyan-300">{`Problems: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if ((percent * 100) < 5) {
        return null;
    }

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ data }) => {
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex-shrink-0">
            <h2 className="text-xl font-bold text-cyan-300 mb-4 flex items-center">
              <PieChartIcon className="w-6 h-6 mr-2"/>
              Problem Categories
            </h2>
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                            iconSize={10} 
                            layout="vertical" 
                            verticalAlign="middle" 
                            align="right"
                            wrapperStyle={{ fontSize: '12px', color: '#d1d5db', paddingLeft: '10px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CategoryDistributionChart;
