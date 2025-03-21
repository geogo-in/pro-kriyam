// import { useGetIssuesQuery } from "@redux/services/issueApi"
import { useTheme } from '@mui/material'
import { useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import { useNavigate, useParams } from 'react-router-dom'

export default function AssigneeChart({ issues }) {

  const theme = useTheme()
  const team = {}
  const chartRef = useRef(null)
  const { project_id, sprint_id } = useParams()
  const navigate = useNavigate()

  issues?.issues.forEach(issue => {
    const assignee = issue.assigned_to?.name || 'Unassigned'
    if (team[assignee]) {
      team[assignee] += 1
    } else {
      team[assignee] = 1
    }
  })

  const teamLabel = Object.keys(team)
  const teamData = Object.values(team)

  const data = {
    labels: teamLabel,
    datasets: [
      {
        label: 'No. of issues',
        data: teamData,
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
        navigate(`/account/projects/${project_id}/report-issues/${sprint_id}?assignee=${encodeURIComponent(label)}`)
      }
    },
  }

  return (
    <Bar ref={chartRef} data={data} options={options} />
  )
}