import 'flatpickr/dist/themes/material_green.css';
import { IFilterUser } from 'models/user';
import 'modules/home/pages/HomePage.scss';
import ReactPaginate from 'react-paginate';
import React from 'react';

interface Props {
  setPage(page: number): void;
  numberPage: number | undefined;
}

const Pagination = (props: Props) => {
  const { setPage, numberPage } = props;

  return (
    <ReactPaginate
      className="pagination"
      breakLabel="..."
      nextLabel=">>"
      onPageChange={(e) => {
        setPage(e.selected + 1);
      }}
      pageRangeDisplayed={3}
      pageCount={numberPage || 0}
      previousLabel="<<"
    />
  );
};

export default Pagination;
