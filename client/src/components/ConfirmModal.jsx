import { motion, AnimatePresence } from "motion/react";
import Button from "./ui/Button";

const ConfirmModal = ({
  show,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onClose,
  onConfirm,
  danger = false,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-neutral-200 dark:border-neutral-800"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 text-center">
              {title}
            </h3>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              {message}
            </p>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose} className="flex-1">
                {cancelText}
              </Button>

              <Button variant="danger" onClick={onConfirm} className="flex-1">
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
