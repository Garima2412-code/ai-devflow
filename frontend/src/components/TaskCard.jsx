import { AlertCircle, Clock, CheckCircle2, Sparkles, GripVertical, User } from 'lucide-react';

const priorityConfig = {
  high: {
    label: 'High',
    icon: AlertCircle,
    styles: 'text-priority-high bg-priority-high/10 border-priority-high/20',
  },
  medium: {
    label: 'Medium',
    icon: Clock,
    styles: 'text-priority-medium bg-priority-medium/10 border-priority-medium/20',
  },
  low: {
    label: 'Low',
    icon: CheckCircle2,
    styles: 'text-priority-low bg-priority-low/10 border-priority-low/20',
  },
};

const TaskCard = ({ task, onDragStart, onClick }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const PriorityIcon = priority.icon;
  const shortId = task._id ? task._id.slice(-4).toUpperCase() : 'TK';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      onClick={onClick}
      className="group relative rounded-lg bg-surface-0 border border-border/80 p-3.5 shadow-xs hover:shadow-md hover:border-accent/50 transition-all duration-150 cursor-grab active:cursor-grabbing active:scale-[0.99] select-none"
    >
      {/* Top Header: ID & Priority Chip */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-[10.5px] font-medium text-text-tertiary">
          #{shortId}
        </span>

        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${priority.styles}`}
        >
          <PriorityIcon size={10} />
          <span>{priority.label}</span>
        </span>
      </div>

      {/* Task Title */}
      <h4 className="text-xs sm:text-[13px] font-medium text-text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
        {task.title}
      </h4>

      {/* Description Snippet (if available) */}
      {task.description && (
        <p className="text-[11.5px] text-text-secondary line-clamp-2 mt-1.5 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Bottom Metadata & Assignee */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/60 text-[11px] text-text-tertiary">
        {task.assignee ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-accent/20 text-accent font-semibold text-[10px] flex items-center justify-center">
              {task.assignee.name ? task.assignee.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="truncate max-w-[110px]">{task.assignee.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-text-tertiary/70">
            <User size={12} />
            <span>Unassigned</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-text-tertiary/40 group-hover:text-text-tertiary transition-colors">
            <GripVertical size={13} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;