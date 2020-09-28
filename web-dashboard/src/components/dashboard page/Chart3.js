import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../Title';
import {HorizontalBar} from 'react-chartjs-2';

export default function Chart3(param) {
    const theme = useTheme();

    let dataBar = {
        labels: param.location.label,
        datasets: [
          {
            label: 'Kota',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: param.location.count
          }
        ]
    };
    

    return (
        <React.Fragment>
            <Title>Persebaran Lokasi Unit Meteran</Title>
            <ResponsiveContainer>
                <HorizontalBar data={dataBar} />
            </ResponsiveContainer>
        </React.Fragment>
    );
}