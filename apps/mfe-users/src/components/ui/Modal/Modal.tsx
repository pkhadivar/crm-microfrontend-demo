import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="
       fixed
       inset-0
       z-50
       flex 
       items-center
       justify-center 
       bg-black/40
       "
      onClick={onClose}
    >
      <div
        className="
        w-full
        max-w-lg
        rounded-2xl
        bg-white
        p-6 
        shadow-xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>

          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
