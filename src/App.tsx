import { useRef, useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { Board } from "./Board";
import { Center } from "./Center";
import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import BoardModel from "./model/BoardModel";

function App() {
  const boardModel = useRef<BoardModel | null>(null);
  if (boardModel.current === null) {
    boardModel.current = new BoardModel();
  }

  return (
    <div>
      <Center>
        <Board boardModel={boardModel.current} />
        {/* <Modal /> */}
      </Center>
    </div>
  );
}

function Modal() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        Have I won yet?
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-slate-100 p-12 rounded-md shadow-md">
            <DialogTitle className="font-bold">No, not yet.</DialogTitle>
            <Description>You haven't checkmated the enemy yet.</Description>
            <div className="flex gap-4">
              <Button
                className="btn btn-primary"
                onClick={() => setIsOpen(false)}
              >
                Oh OK.
              </Button>
              <Button
                className="btn btn-ghost"
                onClick={() => setIsOpen(false)}
              >
                Sadge
              </Button>
              {/* <button onClick={() => setIsOpen(false)}>Awwwwww</button> */}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
export default App;
