import React from 'react';

interface Props {
  handleClickCancel(): void;
  handleConfirmDelete(): void;
}

const ModalConfirmDelete = (props: Props) => {
  const { handleClickCancel, handleConfirmDelete } = props;
  return (
    <div className="modal" tabIndex={-1} role="dialog" id="DeleteModal-@customer.customer_id">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Confirmation</h5>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this item ?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={() => {
                // console.log(item);
                handleClickCancel();
              }}
            >
              No
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              onClick={() => {
                handleConfirmDelete();
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
