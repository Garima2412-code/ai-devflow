import { useState } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  Copy, 
  Check, 
  RefreshCw,
  Tag,
  ArrowRight
} from 'lucide-react';
import Modal from './Modal';
import * as aiApi from '../api/ai';

const priorityConfig = {
  high: { text: 'High', icon: AlertCircle, color: 'text-priority-high bg-priority-high/10 border-priority-high/20' },
  medium: { text: 'Medium', icon: Clock, color: 'text-priority-medium bg-priority-medium/10 border-priority-medium/20' },
  low: { text: 'Low', icon: CheckCircle2, color: 'text-priority-low bg-priority-low/10 border-priority-low/20' },
};

const statusLabels = {
  todo: { text: 'Todo', color: 'bg-slate-400' },
  in_progress: { text: 'In Progress', color: 'bg-accent' },
  review: { text: 'In Review', color: 'bg-violet-500' },
  done: { text: 'Done', color: 'bg-emerald-500' },
};

const TaskDetailModal = ({ task, isOpen, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [completedSubtasks, setCompletedSubtasks] = useState({});
  const [copied, setCopied] = useState(false);

  if (!task) return null;

  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const PriorityIcon = priority.icon;
  const shortId = task._id ? task._id.slice(-4).toUpperCase() : 'TK';

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
    setCompletedSubtasks({});
    onClose();
  };

  const toggleSubtask = (index) => {
    setCompletedSubtasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCopyMarkdown = () => {
    if (!analysis) return;
    const areas = (analysis.investigationAreas || [])
      .map((a) => `- ${a}`)
      .join('\n');
    const subtasks = (analysis.suggestedTasks || [])
      .map((t) => `- [ ] ${t}`)
      .join('\n');

    const text = `### Issue: ${task.title}\n\n#### Investigation Areas\n${areas}\n\n#### Suggested Subtasks\n${subtasks}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={task.title}
      subtitle={`Ticket #${shortId} • Grounded in workspace context`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-border/80 text-xs">
          {/* Priority Pill */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium border ${priority.color}`}
          >
            <PriorityIcon size={12} />
            <span>{priority.text} Priority</span>
          </span>

          {/* Status Pill */}
          {task.status && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 border border-border text-text-primary font-medium">
              <span
                className={`w-2 h-2 rounded-full ${statusLabels[task.status]?.color || 'bg-slate-400'}`}
              />
              <span>{statusLabels[task.status]?.text || task.status}</span>
            </span>
          )}

          {/* Assignee */}
          <div className="flex items-center gap-1.5 text-text-secondary ml-auto">
            {task.assignee ? (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-accent/20 text-accent font-semibold text-[10px] flex items-center justify-center">
                  {task.assignee.name?.charAt(0).toUpperCase()}
                </div>
                <span>Assigned to <strong className="text-text-primary">{task.assignee.name}</strong></span>
              </div>
            ) : (
              <span className="text-text-tertiary">Unassigned</span>
            )}
          </div>
        </div>

        {/* Task Description */}
        <div>
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            Description
          </h4>
          {task.description ? (
            <div className="p-3.5 rounded-lg bg-surface-1/50 border border-border/70 text-xs sm:text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
              {task.description}
            </div>
          ) : (
            <p className="text-xs text-text-tertiary italic">No detailed description provided.</p>
          )}
        </div>

        {/* Gemini AI Copilot Section */}
        <div className="rounded-xl border border-border/80 bg-surface-1/40 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-accent text-white flex items-center justify-center shadow-xs">
                <Sparkles size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <span>Gemini Issue Triage Copilot</span>
                  <span className="px-1.5 py-0.2 rounded text-[9.5px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    AI 2.5
                  </span>
                </h4>
                <p className="text-[11px] text-text-secondary">
                  Automated investigation hypotheses and actionable checklist
                </p>
              </div>
            </div>

            {analysis && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-2.5 py-1 rounded-md border border-border bg-surface-0 hover:bg-surface-2 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  aria-label="Re-analyze task"
                  title="Re-run AI analysis"
                  className="p-1 rounded-md border border-border bg-surface-0 hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={13} className={analyzing ? 'animate-spin' : ''} />
                </button>
              </div>
            )}
          </div>

          {!analysis ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-surface-0 border border-border shadow-xs">
              <div>
                <p className="text-xs font-medium text-text-primary">
                  Synthesize root causes &amp; plan implementation
                </p>
                <p className="text-[11.5px] text-text-secondary mt-0.5 max-w-md">
                  Gemini analyzes the issue description, potential codebase dependencies, and outputs diagnostic suggestions.
                </p>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60 shrink-0"
              >
                <Sparkles size={13} className={analyzing ? 'animate-spin' : ''} />
                <span>{analyzing ? 'Analyzing with Gemini...' : 'Analyze with AI'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Investigation Areas */}
              {analysis.investigationAreas?.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle size={13} className="text-priority-high" />
                    <span>Potential Root Causes &amp; Investigation Areas</span>
                  </h5>
                  <div className="grid gap-2">
                    {analysis.investigationAreas.map((area, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-0 border border-border/80 text-xs text-text-primary"
                      >
                        <span className="w-5 h-5 rounded-full bg-accent/10 text-accent font-mono font-bold text-[10.5px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Subtasks with interactive checks */}
              {analysis.suggestedTasks?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <h5 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Suggested Action Checklist</span>
                  </h5>
                  <div className="space-y-1.5">
                    {analysis.suggestedTasks.map((taskItem, i) => {
                      const isDone = !!completedSubtasks[i];
                      return (
                        <div
                          key={i}
                          onClick={() => toggleSubtask(i)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none text-xs ${
                            isDone
                              ? 'bg-surface-2/40 border-border/60 text-text-tertiary'
                              : 'bg-surface-0 border-border hover:border-accent/40 text-text-primary'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}} // handled by parent div onClick
                            className="mt-0.5 rounded text-accent cursor-pointer"
                          />
                          <span className={`leading-relaxed ${isDone ? 'line-through' : ''}`}>
                            {taskItem}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-priority-high/10 border border-priority-high/30 text-priority-high text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;