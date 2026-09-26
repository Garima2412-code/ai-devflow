import TaskCard from './TaskCard';

const KanbanColumn = ({ title, status, tasks, onDragStart, onDrop }) => {
  const handleDragOver = (e) => {
    e.preventDefault(); // required — without this, onDrop never fires
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onDrop(taskId, status);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-1 min-w-[260px] border-l border-border first:border-l-0 px-3"
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <h3 className="text-section-heading font-semibold text-text-primary">
          {title}
        </h3>
        <span className="text-small text-text-tertiary">{tasks.length}</span>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;