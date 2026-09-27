import { useState } from 'react';
import Modal from './Modal';
import * as aiApi from '../api/ai';

const priorityLabels = {
  high: { text: 'High', color: 'text-priority-high' },
  medium: { text: 'Medium', color: 'text-priority-medium' },
  low: { text: 'Low', color: 'text-priority-low' },
};

const TaskDetailModal = ({ task, isOpen, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  if (!task) return null;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const result = await aiApi.analyzeTask(task._id);
      setAnalysis(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not analyze this issue right now.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClose = () => {
    setAnalysis(null);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={task.title}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-small font-medium ${priorityLabels[task.priority].color}`}>
          {priorityLabels[task.priority].text} priority
        </span>
        {task.assignee && (
          <span className="text-small text-text-tertiary">
            Assigned to {task.assignee.name}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-body text-text-primary mb-5">{task.description}</p>
      )}

      <div className="border-t border-border pt-4">
        {!analysis ? (
          <>
            <p className="text-small text-text-secondary mb-3">
              Get AI-suggested investigation areas and a task breakdown for this issue.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="border border-border text-text-primary text-body px-4 py-2
                         rounded-sm cursor-pointer hover:bg-surface-1 disabled:opacity-60"
            >
              {analyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
            {error && (
              <p className="text-small text-priority-high mt-2">{error}</p>
            )}
          </>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-small font-semibold text-text-primary mb-2">
                Investigation Areas
              </p>
              <ul className="flex flex-col gap-1.5">
                {analysis.investigationAreas.map((area, i) => (
                  <li key={i} className="text-body text-text-primary flex gap-2">
                    <span className="text-text-tertiary">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-small font-semibold text-text-primary mb-2">
                Suggested Tasks
              </p>
              <ul className="flex flex-col gap-1.5">
                {analysis.suggestedTasks.map((taskSuggestion, i) => (
                  <li key={i} className="text-body text-text-primary flex gap-2">
                    <span className="text-text-tertiary">□</span>
                    {taskSuggestion}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="text-small text-accent mt-4 cursor-pointer hover:underline disabled:opacity-60"
            >
              {analyzing ? 'Re-analyzing...' : 'Re-analyze'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TaskDetailModal;