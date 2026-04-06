"use client";

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

export type ModalType = "error" | "success" | "info" | "warning";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  onConfirm?: () => void;
}

const modalStyles = {
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
    iconColor: "text-red-600",
    button: "bg-red-600 hover:bg-red-700",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: CheckCircle,
    iconColor: "text-green-600",
    button: "bg-green-600 hover:bg-green-700",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: Info,
    iconColor: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    button: "bg-yellow-600 hover:bg-yellow-700",
  },
};

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  onConfirm,
}: ModalProps) {
  if (!isOpen) return null;

  const styles = modalStyles[type];

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative max-w-md w-full mx-4 ${styles.bg} border ${styles.border} rounded-xl shadow-2xl transform transition-all`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <styles.icon className={`w-6 h-6 mr-3 ${styles.iconColor}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          {/* Message */}
          <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleConfirm}
              className={`px-6 py-2 text-white font-semibold rounded-lg transition-colors ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
