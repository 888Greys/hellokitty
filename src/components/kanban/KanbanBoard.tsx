import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

type Task = {
  id: string
  title: string
  status: 'todo' | 'progress' | 'done'
}

const initialTasks: Task[] = [
  { id: 'task-1', title: 'Cloud migration phase 2', status: 'todo' },
  { id: 'task-2', title: 'Audit security controls', status: 'progress' },
  { id: 'task-3', title: 'Launch ERP billing module', status: 'done' },
]

const columns: Array<{ key: Task['status']; label: string }> = [
  { key: 'todo', label: 'Backlog' },
  { key: 'progress', label: 'In Progress' },
  { key: 'done', label: 'Completed' },
]

function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-md border border-blue-100 bg-white p-3 text-sm font-semibold text-onSurface shadow-sm"
    >
      {task.title}
    </div>
  )
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    setTasks((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id)
      const newIndex = current.findIndex((item) => item.id === over.id)

      if (oldIndex < 0 || newIndex < 0) {
        return current
      }

      const reordered = arrayMove(current, oldIndex, newIndex)
      const targetStatus = reordered[newIndex]?.status

      return reordered.map((item, index) =>
        index === newIndex && targetStatus
          ? { ...item, status: targetStatus }
          : item,
      )
    })
  }

  return (
    <section className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-headline text-lg font-bold text-onSurface">Delivery Kanban</h3>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((column) => {
            const items = tasks.filter((task) => task.status === column.key)
            return (
              <article key={column.key} className="rounded-lg bg-surfaceContainerLow p-3">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
                  {column.label}
                </h4>
                <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
                  <div className="space-y-2">
                    {items.length === 0 && (
                      <p className="rounded border border-dashed border-blue-200 p-2 text-xs text-onSurfaceVariant">
                        Drop a card here
                      </p>
                    )}
                    {items.map((item) => (
                      <SortableTask key={item.id} task={item} />
                    ))}
                  </div>
                </SortableContext>
              </article>
            )
          })}
        </div>
      </DndContext>
    </section>
  )
}
