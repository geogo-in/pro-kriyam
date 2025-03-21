// import { useGetIssuesQuery } from "@redux/services/issueApi"
import { useTheme } from "@mui/material"
import { useGetIssueTypeQuery } from "@redux/services/issueApi"
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { useRef } from "react"
import { Bar } from 'react-chartjs-2'
import { useNavigate, useParams } from "react-router-dom"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function TrackerChart({ issues }) {
  const theme = useTheme()
  const { project_id, sprint_id } = useParams()
  const navigate = useNavigate()
  const chartRef = useRef(null)
  const { data: trackers } = useGetIssueTypeQuery()
  const trackerData = (trackers ?? []).reduce((acc,tracker) => {
    acc[tracker.name] = 0
    return acc
  },{})

  if (trackerData && issues?.issues) {
    issues.issues.forEach((issue) => {
      const tracker = issue?.tracker.name
      trackerData[tracker]++
    })
  }

  const labels = trackers?.map(tracker => tracker.name) || []

  const data = {
    labels: trackers?.map(tracker => tracker.name),
    datasets: [
      {
        label: 'No. of issues',
        data: trackerData,
        maxBarThickness: 35,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    indexAxis: 'y',
    datasets: {
      bar: {
        sort: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: false,
          color: theme.palette.mode === "light" ? "" : '',
        },
        ticks: {
          color: theme.palette.mode === "light" ? "" : '#FFFFFF',
        },
        border: {
          display: true,
          color: theme.palette.mode === "light" ? "" : '#FFFFFF',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
          color: theme.palette.mode === "light" ? "" : '',
        },
        ticks: {
          color: theme.palette.mode === "light" ? "" : '#FFFFFF',
          stepSize: 2,
        },
        border: {
          display: true,
          color: theme.palette.mode === "light" ? "" : '#FFFFFF',
        },
      },
    },
    onClick: (event) => {
      const chart = chartRef.current
      if (!chart) return

      const points = chart.getElementsAtEventForMode(event,'nearest', { intersect: true }, true )

      if (points.length) {
        const label = chart.data.labels[points[0].index]
        navigate(`/account/projects/${project_id}/report-issues/${sprint_id}?tracker=${encodeURIComponent(label)}`)
      }
    },
  }

  return (
    <Bar ref={chartRef} data={data} options={options} />
  )
}