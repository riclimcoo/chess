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
            className="p-0 size-5 bg-red-500 rounded-full text-white shadow-md relative top-2 right-2"
            onClick={closeModal as any}
          >
            <XMarkIcon />
          </button>
        </div>
        <div
          ref={innardsRef}
          className="bg-slate-200 text-black pt-2 pb-4 px-6 rounded-md shadow-md flex flex-col "
        >
          <div className="flex flex-row-reverse"></div>
          {children}
        </div>
      </dialog>
    </>
  );
}
