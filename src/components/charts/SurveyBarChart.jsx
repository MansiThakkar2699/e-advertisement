import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

const SurveyBarChart = ({ data = [], title = "" }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="option" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}`, "Responses"]} />
                        <Bar
                            dataKey="count"
                            name="Responses"
                            fill="#6366f1"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SurveyBarChart;