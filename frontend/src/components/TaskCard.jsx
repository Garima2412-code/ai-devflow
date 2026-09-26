const priorityColors = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
};

const TaskCard = ({ task, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      className="border border-border rounded-sm bg-surface-0 cursor-grab active:cursor-grabbing
                 hover:border-text-tertiary transition-colors overflow-hidden"
    >
      <div className="flex">
        <div className={`w-1 shrink-0 ${priorityColors[task.priority]}`} />
        <div className="p-3 flex-1">
          <p className="text-body text-text-primary">{task.title}</p>
          {task.assignee && (
            <p className="text-small text-text-tertiary mt-2">
              {task.assignee.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;