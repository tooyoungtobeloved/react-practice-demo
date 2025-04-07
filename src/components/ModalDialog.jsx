import './dialog.css'
import { createPortal } from 'react-dom'
export default function ModalDialog({ children, title, isOpen, onClose }) {
  const renderNode = document.querySelector('body')
  return isOpen ? createPortal (
    <>
    <div className="modal-content">
      <div className="header">
        <h1>{title} </h1>
        <span onClick={onClose} className="closeBtn">x</span>
      </div>
      {children}
    </div>
    <div className="modal-mask"></div>
    </>
    ,
    renderNode
  ) : null;
}
