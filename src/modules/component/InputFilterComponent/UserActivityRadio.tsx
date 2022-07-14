import { IFilterUser } from 'models/user';
import React from 'react';

interface Props {
  setFilterUser(filterUser: IFilterUser): void;
  filterUser: IFilterUser;
}

const UserActivityRadio = (props: Props) => {
  const { setFilterUser, filterUser } = props;

  return (
    <>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="flexRadioDefault1"
          value="R"
          onChange={(e) => {
            if (e.target.checked) {
              setFilterUser({ ...filterUser, date_type: e.target.value });
            }
          }}
          checked={filterUser.date_type === 'R'}
        />
        <label className="form-check-label">Register</label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="flexRadioDefault2"
          onChange={(e) => {
            if (e.target.checked) {
              setFilterUser({ ...filterUser, date_type: e.target.value });
            }
          }}
          value="L"
        />
        <label className="form-check-label">Last logged in</label>
      </div>
    </>
  );
};

export default UserActivityRadio;
