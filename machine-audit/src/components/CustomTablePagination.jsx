import { TablePagination, Typography } from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const CustomTablePagination = ({
	rowsPerPage,
	page,
	handleChangePage,
	handleChangeRowsPerPage,
	totalRows,
	selectColor,
	fontColor,
}) => {
	return (
		<TablePagination
			sx={{
				"& .MuiTablePagination-actions button": {
					color: fontColor,
				},
				"& .MuiTablePagination-selectIcon": {
					color: fontColor,
				},
			}}
			SelectProps={{
				IconComponent: KeyboardArrowDownIcon,
				sx: {
					color: selectColor,
				},
			}}
			component="div"
			rowsPerPageOptions={[20, 50, 100]}
			count={totalRows}
			rowsPerPage={rowsPerPage}
			page={page}
			onPageChange={handleChangePage}
			onRowsPerPageChange={handleChangeRowsPerPage}
			labelDisplayedRows={({ from, to, count }) => (
				<Typography sx={{ color: fontColor }}>
					{`${from}-${to} de ${count}`}
				</Typography>
			)}
			labelRowsPerPage={
				<Typography sx={{ color: fontColor, fontWeight: 700 }}>
					Resultados por página
				</Typography> // Cambia el color aquí
			}
			showFirstButton
			showLastButton
		/>
	);
};

export default CustomTablePagination;
