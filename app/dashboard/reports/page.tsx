//app/dashboard/reports/page.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ReportsPage() {
  const reports = [
    { title: 'Movement summary', period: 'Last 7 days', desc: 'Distance traveled per animal' },
    { title: 'Alert history', period: 'Last 30 days', desc: 'All alerts, filterable by type' },
    { title: 'Battery health', period: 'Last 30 days', desc: 'Collar battery trends' },
    { title: 'Geofence activity', period: 'Last 30 days', desc: 'Zone entries and exits' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Export data for records, insurance, or audits.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((r) => (
          <Card key={r.title}>
            <CardContent className="p-6">
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{r.desc}</p>
              <p className="text-xs text-gray-400 mt-3">{r.period}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">View</Button>
                <Button variant="outline" size="sm">Export CSV</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}