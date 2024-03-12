'use client';
import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, Tooltip, Legend, ArcElement, Title } from 'chart.js';
Chart.register(Tooltip, Legend, ArcElement, Title);

const PieChart = () => {
  const data = {
    datasets: [
      {
        label: '100% wif Community',
        data: [1000000000],
        backgroundColor: ['rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}% of tokens in circulation`;
          },
          afterLabel: function() {
            return 'Absolutely everything!';
          }
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
        bodySpacing: 4,
        mode: 'index',
        intersect: true,
      },
      title: {
        display: true,
        text: 'Token Supply Chart',
        position: 'top', // Ensure this is explicitly one of "top", "left", "bottom", "right"
        color: 'rgba(255, 99, 132)',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
    animation: {
      animateScale: true,
    },
    maintainAspectRatio: false,
  };
  

  return (
    <div style={{ height: '400px', width: '400px' }}>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
