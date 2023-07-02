import { useState } from "react";

const usePaginationContact = (index, data) => {
	const [currentPage, setCurrentPage] = useState(0);

	const nextPage = () => {
		if (currentPage + index <= data.length) setCurrentPage(currentPage + index);
	};

	const prevPage = () => {
		currentPage > 0 ? setCurrentPage(currentPage - index) : setCurrentPage(0);
	};

	const backToFirstPage = () => {
		if (currentPage > 0) setCurrentPage(0);
	};

	return { currentPage, nextPage, prevPage, backToFirstPage };
};

export default usePaginationContact;
