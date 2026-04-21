import React from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

const COLORS = ["#10b981", "#e2e8f0"];

const SurveyDonutChart = ({ data = [], title = "" }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={3}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SurveyDonutChart;