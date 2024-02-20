import { Bar } from 'react-chartjs-2';
import {CategoryScale, LinearScale, Chart, Legend, BarElement, Title, Tooltip} from "chart.js";
import {useEffect, useState} from "react";
import './Statistics.css'

const scorePattern = /\d+:.+/
function Statistics() {

    Chart.register(  CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend);

    const [scoreMap, setScoreMap] = useState<Map<number, number>>(new Map);

    useEffect(() => {
        const newScoreMap = new Map;
        for (let i = 0; i <= 15; i++) {
            newScoreMap.set(i, 0);
        }
        const localStorageKeys = Object.keys(localStorage);
        localStorageKeys.forEach(key => {
            if (!key.startsWith('game')) {
                return;
            }
            const value = localStorage.getItem(key);
            if (!value || !scorePattern.test(value)) {
                return;
            }
            const score = parseInt(value.split(':')[0]);
            const occurrences = newScoreMap.get(score) ?? 0;
            newScoreMap.set(score, occurrences+1)
        })
        setScoreMap(newScoreMap);
    }, []);

    console.log(scoreMap)
    const scores = Array.from(scoreMap.keys());
    const occurrences = Array.from(scoreMap.values());
    console.log(occurrences);

    // Data for the bar graph
    const data = {
        labels: scores,
        datasets: [
            {
                label: 'Scores',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.4)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: occurrences,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Statistics',
            },
        },
    };

    return <div className={'statistics'}>
        <Bar className={'statistics-inner'} data={data} options={options} />
    </div>;
}

export default Statistics