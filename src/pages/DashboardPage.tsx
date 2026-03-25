import { RevenueChart } from '../components/charts/RevenueChart'
import { KanbanBoard } from '../components/kanban/KanbanBoard'

export function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-6">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-onSurfaceVariant">Quarter Revenue</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">$124,500</p>
        </article>
        <article className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-onSurfaceVariant">Active Clients</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">2,503</p>
        </article>
        <article className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-onSurfaceVariant">Compliance Score</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">98.7%</p>
        </article>
      </section>
      <RevenueChart />
      <KanbanBoard />
    </main>
  )
}
