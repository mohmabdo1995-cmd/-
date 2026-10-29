import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export type ModalMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: ModalMaxWidth;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showHeader?: boolean;
  className?: string;
  bodyClassName?: string;
  dir?: 'rtl' | 'ltr';
}

const MAX_WIDTH_MAP: Record<ModalMaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  headerActions,
  children,
  footer,
  maxWidth = 'lg',
  closeOnBackdrop = true,
  closeOnEsc = true,
  showHeader = true,
  className = '',
  bodyClassName = '',
  dir = 'rtl',
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Calculate scrollbar width to prevent layout shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === backdropRef.current) {
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={backdropRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 dark:bg-black/75 backdrop-blur-sm overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain transition-all"
          dir={dir}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320, duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${MAX_WIDTH_MAP[maxWidth]} my-auto bg-white dark:bg-[#071A3D] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-[#16958E]/30 flex flex-col max-h-[min(90vh,calc(100dvh-2rem))] overflow-hidden transition-all ${className}`}
          >
            {/* Modal Header */}
            {showHeader && (
              <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100 dark:border-[#16958E]/20 flex items-center justify-between gap-4 bg-white dark:bg-[#071A3D]">
                <div className="flex items-center gap-3 min-w-0">
                  {icon && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#16958E]/15 text-[#16958E] dark:text-[#BCEBFF] flex items-center justify-center border border-[#16958E]/20">
                      {icon}
                    </div>
                  )}
                  <div className="min-w-0">
                    {title && (
                      <h3 className="text-base sm:text-lg font-extrabold font-tajawal text-[#071A3D] dark:text-white truncate">
                        {title}
                      </h3>
                    )}
                    {subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {headerActions}
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 dark:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#16958E]"
                    aria-label="إغلاق النافذة"
                    title="إغلاق"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Modal Scrollable Body */}
            <div className={`flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 overscroll-contain ${bodyClassName}`}>
              {children}
            </div>

            {/* Modal Footer (Pinned when provided) */}
            {footer && (
              <div className="flex-shrink-0 px-6 py-4 bg-slate-50/80 dark:bg-[#051430]/90 border-t border-slate-100 dark:border-[#16958E]/20 flex items-center justify-end gap-3 backdrop-blur-xs">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
};
