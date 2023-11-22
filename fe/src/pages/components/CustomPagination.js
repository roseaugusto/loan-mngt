import React from 'react';
import { Pagination } from 'react-bootstrap';

export default function CustomPagination({ total, current_page, fetchData }) {
  const populateItems = () => {
    let items = [];
    for (let number = 1; number <= Math.ceil(total / 10); number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === current_page}
          onClick={() => fetchData(number)}
          activeLabel=''
        >
          {number}
        </Pagination.Item>,
      );
    }

    return items;
  };

  return (
    <div>
      <Pagination>{populateItems()}</Pagination>
    </div>
  );
}
