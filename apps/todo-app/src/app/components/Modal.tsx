import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Modal = ({ open }: { open: boolean }) => {
  const navigate = useNavigate();
  return (
    <dialog
      id="my_modal_5"
      className="modal modal-bottom sm:modal-middle"
      open={open}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Oops!</h3>
        <p className="py-4">
          You're no longer authenticated. Please sign in again.
        </p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" onClick={() => navigate('/')}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
export default Modal;
