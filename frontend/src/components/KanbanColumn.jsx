import { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const statusDotColors = {
  todo: 'bg-slate-400',
  in_progress: 'bg-accent',
  review: 'bg-violet-500',
  done: 'bg-emerald-500',
};

const KanbanColumn = ({
  title,
  status,
  tasks,
  onDragStart,
  onDrop,
  onTaskClick,
  onQuickAdd,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only reset if moving outside this container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onDrop(taskId, status);
    }
  };

  const dotColor = statusDotColors[status] || 'bg-slate-400';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-w-[280px] max-w-[340px] rounded-xl flex flex-col p-3 transition-colors duration-150 ${
        isDragOver
          ? 'bg-accent/5 ring-2 ring-accent/30 border border-accent/40'
          : 'bg-surface-1/40 border border-border/60'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-1.5 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
            {title}
          </h3>
          <span className="text-[11px] font-mono font-medium text-text-tertiary px-1.5 py-0.2 rounded-full bg-surface-2 border border-border/80">
            {tasks.length}
          </span>
        </div>

        {onQuickAdd && (
          <button
            onClick={() => onQuickAdd(status)}
            aria-label={`Add task to ${title}`}
            title={`Add task to ${title}`}
            className="w-6 h-6 rounded flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {/* Task List / Drop Zone */}
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto min-h-[180px]">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border/80 rounded-lg p-6 text-center select-none">
            <p className="text-xs text-text-tertiary">No tasks in {title.toLowerCase()}</p>
            <p className="text-[10px] text-text-tertiary/70 mt-0.5">Drag tickets here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDragStart={onDragStart}
              onClick={() => onTaskClick(task)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;