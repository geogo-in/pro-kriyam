import { useGetProjectIssuesStatusesQuery } from "@redux/services/issueApi"
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { useRef } from "react"
import { Doughnut } from 'react-chartjs-2'
import { useNavigate, useParams } from "react-router-dom"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function StatusChart({ issues, projectId }){

  const { project_id, sprint_id } = useParams()
  const navigate = useNavigate()
  const chartRef = useRef(null)
  const { data: sprintColumns } = useGetProjectIssuesStatusesQuery(projectId)
  const statusData = (sprintColumns ?? []).reduce((acc,column) => {
    acc[column.name] = 0
    return acc
  },{})

  if (statusData && issues?.issues) {
    issues.issues.forEach((issue) => {
      const status = issue?.status.name
      statusData[status]++
    })
  }

  const labels = sprintColumns?.map(status => status.name) || []

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'No. of issues',
        data: labels.map(label => statusData[label]),
        backgroundColor: issues?.issues.map(issue => {
          const sprint = sprintColumns?.find(
            column => column.name === issue?.status.name
          )
          return sprint ? sprint.color_code : 'rgba(255, 99, 132, 0.7)'
        }),
        borderColor: 'transparent',
        offset: 5,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '70%',
    onClick: (event) => {
      const chart = chartRef.current
      if (!chart) return

      const points = chart.getElementsAtEventForMode(event,'nearest', { intersect: true }, true )

      if (points.length) {
        const label = chart.data.labels[points[0].index]
        navigate(`/account/projects/${project_id}/report-issues/${sprint_id}?status=${encodeURIComponent(label)}`)
      }
    },
  }

  return (
    <div>
      <Doughnut height={300} width={300} ref={chartRef} data={data} options={options} />
    </div>
  )
}