import React from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

const SurveyPieChart = ({ data = [], title = "" }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="option"
                            outerRadius={100}
                            label={({ option, percent }) =>
                                `${option} ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}`, "Responses"]} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SurveyPieChart;