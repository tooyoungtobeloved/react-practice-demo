import ModalDialog from "../components/Dialog/ModalDialog";
import { useState } from "react";
export default function DialogDemo() {
  const [title, setTitle] = useState("Modal Dialog");
  const [isOpen, setIsOpen] = useState(false);
  function onClose() {
    setIsOpen(false);
  }
  return (
    <>
      <ModalDialog isOpen={isOpen} onClose={onClose} title={title}>
        One morning, when Gregor Samsa woke from troubled dreams, he found
        himself transformed in his bed into a horrible vermin. He lay on his
        armour-like back, and if he lifted his head a little he could see his
        brown belly, slightly domed and divided by arches into stiff sections.
      </ModalDialog>
      <button onClick={() => setIsOpen(true)}>showModal</button>
    </>
  );
}
