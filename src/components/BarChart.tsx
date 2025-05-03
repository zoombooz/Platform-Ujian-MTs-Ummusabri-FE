import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts'

interface BarChartType {
    data: {name: string, data: number[]}[],
    categories: string[],
    minValueHeight: number,
    title: string
}

export function BarChart({categories, data, minValueHeight, title}: BarChartType) {

    const dataPlaceholder = [
        {
            name: 'Score',
            data: [85, 78, 92],
        },
    ]

    const chartOptions: ApexOptions = {
        series: data.length ? data : dataPlaceholder,
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        xaxis: {
            categories: categories,
        },
        tooltip: {
            enabled: true,
            followCursor: true
        },
        yaxis: {
            max: (max) => {
                return max > minValueHeight ? max : minValueHeight
            }
        },
        title: {
            text: title,
            align: 'center'
        }
    };

    return (
        <Chart
            options={chartOptions}
            series={chartOptions.series}
            type='bar'
        ></Chart>
    )

}