const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-20"
      onClick={onClose}
    >
      <div
        className="bg-surface-0 border border-border rounded-md shadow-sm w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-section-heading font-semibold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary cursor-pointer text-body"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;