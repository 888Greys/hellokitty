import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { month: 'Jan', revenue: 32000 },
  { month: 'Feb', revenue: 39000 },
  { month: 'Mar', revenue: 42000 },
  { month: 'Apr', revenue: 51000 },
  { month: 'May', revenue: 59000 },
  { month: 'Jun', revenue: 64000 },
]

export function RevenueChart() {
  return (
    <div className="h-72 rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-headline text-lg font-bold text-onSurface">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbe7ff" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#0052cc" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
