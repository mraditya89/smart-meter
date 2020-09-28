import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../Title';

// Generate Sales Data
// function createData(time, amount) {
//   return { time, amount };
// }

// const data = [
//   createData('Jan', 0),
//   createData('Feb', 300),
//   createData('Mar', 600),
//   createData('Apr', 800),
//   createData('Mei', 1500),
//   createData('Jun', 2000),
//   createData('Jul', 2400),
//   createData('Agust', 2400),
//   createData('Sept', undefined),
//   createData('Okt', undefined),
//   createData('Nov', undefined),
//   createData('Des', undefined),
// ];

export default function Chart2(param) {
    const theme = useTheme();
    let dt = new Date();
    let chart_data = [];
    let data = [];
    data = param.datas;

    function CreateData(date, daya) {
        switch (date) {
            case 1: return { bulan: "Januari", daya: daya };
            case 2: return { bulan: "Februari", daya: daya };
            case 3: return { bulan: "Maret", daya: daya };
            case 4: return { bulan: "April", daya: daya };
            case 5: return { bulan: "Mei", daya: daya };
            case 6: return { bulan: "Juni", daya: daya };
            case 7: return { bulan: "Juli", daya: daya };
            case 8: return { bulan: "Agustus", daya: daya };
            case 9: return { bulan: "September", daya: daya };
            case 10: return { bulan: "Oktober", daya: daya };
            case 11: return { bulan: "November", daya: daya };
            case 12: return { bulan: "Desember", daya: daya };
        }
    }

    if (data.length >= 0) {
        for (let i = 0; i < 12; i++) {
            chart_data.push(CreateData(i + 1, data[i]));
        }
    } else {
        for (let i = 0; i < 12; i++) {
            chart_data.push(CreateData(i + 1, 0));
        }
    }

    return (
        <React.Fragment>
            <Title>Data Penggunaan Listrik {param.year}</Title>
            <ResponsiveContainer>
                <LineChart
                    data={chart_data}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis dataKey="bulan" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary}>
                        <Label
                            angle={270}
                            position="left"
                            style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
                        >
                            Daya (kWh)
            </Label>
                    </YAxis>
                    <Line type="monotone" dataKey="daya" stroke={theme.palette.primary.main} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}