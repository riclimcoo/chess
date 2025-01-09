import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef } from "react";

export function Modal({ children, modalRef }: any) {
  const innardsRef = useRef<HTMLDivElement>(null);
  function closeModal(_e?: Event) {
    modalRef.current?.close();
  }

  // Close modal on click outside.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!innardsRef.current?.contains(e.target as Node)) {
        modalRef.current?.close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close modal on ESC.
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.code === "Escape") {
        modalRef.current?.close();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  return (
    <>
      <dialog ref={modalRef} className="bg-transparent">
        <div className="flex flex-row-reverse">
          <button
            className="relative right-2 top-2 size-5 rounded-full bg-red-500 p-0 text-white shadow-md"
            onClick={closeModal as any}
          >
            <XMarkIcon />
          </button>
        </div>
        <div
          ref={innardsRef}
          className="flex flex-col rounded-md bg-slate-200 px-6 pb-4 pt-2 text-black shadow-md"
        >
          <div className="flex flex-row-reverse"></div>
          {children}
        </div>
      </dialog>
    </>
  );
}
