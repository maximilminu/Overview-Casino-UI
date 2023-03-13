import React from "react";
import Pagination from "@mui/material/Pagination";

const ContactMethodsPagination = ({
  totalPosts,
  postsPerPage,
  setCurrentPage,
  currentPage,
}) => {
  let pages = [];
  for (let i = 1; i < Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }

  const handleClick = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Pagination
        sx={{
          display: "flex",
          justifyContent: "center",
          marginInline: "auto",
          marginTop: "20px",
          paddingBottom: "20px",
        }}
        key={pages.length}
        count={pages.length}
        page={currentPage}
        onChange={handleClick}
      />
    </>
  );
};

export default ContactMethodsPagination;
