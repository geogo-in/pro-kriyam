import ReactEcharts from "echarts-for-react"

const Echart = ({ option, opts = {}, height = "100%", width = "100%" }) => {
  return (
    <ReactEcharts
      option={option}
      opts={opts}
      style={{
        height,
        width,
      }}
    />
  )
}
export default Echart
