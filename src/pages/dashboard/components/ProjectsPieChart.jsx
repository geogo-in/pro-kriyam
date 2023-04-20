import { PureComponent } from "react"
import PieChart from "recharts/src/chart/PieChart"
import Cell from "recharts/src/component/Cell"
import ResponsiveContainer from "recharts/src/component/ResponsiveContainer"
import Pie from "recharts/src/polar/Pie"

const COLORS = ["#0088FE", "#4bb56a", "#FFBB28"]

class ExpenseChart extends PureComponent {
  render() {
    const { analytics } = this.props
    const data = [
      { name: "Active", value: analytics.current_fy_total_earnings },
      { name: "Inactive", value: analytics.current_fy_total_reimbursements },
      { name: "Deductions", value: analytics.current_fy_total_deductions },
    ]
    return (
      <>
        <h2 className="page-heading">
          <i className="material-icons left">donut_large</i>
          Payments
          <div className="flexgorw" />
          <span className="extendex-text">For FY {analytics.current_fy_range} in INR</span>
        </h2>
        <div className="row">
          <div className="col s6 l4">
            <span className="font14 text-grey text-darken-1">Payment made in FY</span>
            <h4 className="grey-text text-darken-2 mt10">{analytics.current_fy_net_payment}</h4>
            {/* <br />
            <span className="font14 text-grey text-darken-1">Payment made in this month</span>
            <h4 className="grey-text text-darken-2 mt10">
              {analytics.current_month_net_payment}
            </h4> */}
          </div>
          <div className="col s6 l3">
            <div className="legends">
              <span className="legend-color lab1"></span>
              <span className="font12 grey-text">Employee's earnings</span>
              <h3>{analytics.current_fy_total_earnings}</h3>
            </div>
            <div className="legends">
              <span className="legend-color lab2"></span>
              <span className="font12 grey-text">Reimbursements</span>
              <h3>{analytics.current_fy_total_reimbursements}</h3>
            </div>
            <div className="legends">
              <span className="legend-color lab3"></span>
              <span className="font12 grey-text">Deductions made</span>
              <h3>{analytics.current_fy_total_deductions}</h3>
            </div>
          </div>
          <div className="col s12 l5">
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data} cx={130} cy={100} innerRadius={65} outerRadius={100} fill="#8884d8" paddingAngle={2} dataKey="value">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default ExpenseChart
