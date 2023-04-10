// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import { Paper, Container, Button } from "@mui/material";
// import TreeView from '@mui/lab/TreeView';
// import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
// import Typography from '@mui/material/Typography';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';
// import Checkbox from '@mui/material/Checkbox';
// import Chip from '@mui/material/Chip';
// import Grid from '@mui/material/Grid';
// import ChipsList from './ChipsList';
// import Tree from "./Tree/Tree"


// const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
//   color: theme.palette.text.secondary,
//   [`& .${treeItemClasses.content}`]: {
//     color: "black",
//     borderTopRightRadius: theme.spacing(2),
//     borderBottomRightRadius: theme.spacing(2),
//     paddingRight: theme.spacing(1),
//     fontWeight: theme.typography.fontWeightMedium,
//     '&.Mui-expanded': {
//       fontWeight: theme.typography.fontWeightRegular,
//     },
//     '&:hover': {
//       backgroundColor: "rgba(208, 60, 49, 0.25)",
//     },
//     '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
//       backgroundColor: "rgba(208, 60, 49, 0.45)",
//       color: 'var(--tree-view-color)',
//     },
//     [`& .${treeItemClasses.label}`]: {
//       fontWeight: 'inherit',
//       color: 'inherit',
//     },
//   },
//   [`& .${treeItemClasses.group}`]: {
//     marginLeft: 0,
//     [`& .${treeItemClasses.content}`]: {
//       paddingLeft: theme.spacing(0),
//     },
//   },
// }));

// function StyledTreeItem(props) {
//   const {
//     bgColor,
//     color,
//     labelIcon: LabelIcon,
//     endRight,
//     labelText,
//     ...other
//   } = props;

//   return (
//     <StyledTreeItemRoot
//       label={
//         <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
//           <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
//           <Typography variant="body1" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
//             {labelText}
//           </Typography>
//           <Box>
//             {endRight}
//           </Box>

//         </Box>
//       }
//       style={{
//         '--tree-view-color': color,
//         '--tree-view-bg-color': bgColor,
//       }}
//       {...other}
//     />
//   );
// }

// StyledTreeItem.propTypes = {
//   bgColor: PropTypes.string,
//   color: PropTypes.string,
//   labelIcon: PropTypes.elementType.isRequired,
//   endRight: PropTypes.string,
//   labelText: PropTypes.string.isRequired,
// };

// const array = [
//   {
//     id: 0,
//     label: "Casino Mar del Plata",
//     childs: [
//       {
//         id: 1,
//         label: "Planta Baja",
//         childs: [
//           {
//             id: 2,
//             label: "Recepcion",
//             childs: [
//               {
//                 id: 3,
//                 label: "Terminal",
//                 childs: []
//               },
//             ]
//           },
//           {
//             id: 4,
//             label: "Cafeteria",
//             childs: [
//               {
//                 id: 5,
//                 label: "Terminal",
//                 childs: []
//               },
//             ]
//           },
//         ]
//       },
//       {
//         id: 6,
//         label: "Primer Piso",
//         childs: [
//           {
//             id: 7,
//             label: "Restaurante",
//             childs: []
//           },
//         ]
//       },
//       {
//         id: 8,
//         label: "Segundo Piso",
//         childs: [
//           {
//             id: 9,
//             label: "Sector Fumadores",
//             childs: []
//           },
//         ]
//       },
//       {
//         id: 10,
//         label: "Tercer Piso",
//         childs: [
//           {
//             id: 11,
//             label: "Terraza",
//             childs: [
//               {
//                 id: 12,
//                 label: "Sector Fumadores",
//                 childs: []
//               },
//             ]
//           },
//         ]
//       },
//       {
//         id: 13,
//         label: "Terraza",
//         childs: [
//           {
//             id: 14,
//             label: "Sector Fumadores",
//             childs: []
//           },
//         ]
//       },
//     ]
//   }
// ]

// // Cant have same id

// const nodeIdCollector = (item) => {
//   let childIds = (item.childs || item).map(nodeIdCollector);
//   childIds.push(item.id);

//   return childIds;
// }


// export default function TreeViewModal() {
//   const [expanded, setExpanded] = useState(nodeIdCollector(array).flat(1000));
//   const [selected, setSelected] = useState([]);
//   const [physicalPermissions, setPhysicalPermissions] = useState([])
//   const [terminalPermissions, setTerminalPermissions] = useState([])
//   const [thirdPermissions, setThirdPermissions] = useState([])



//   // Open/Closes section -> Expanded
//   const handleToggle = (event, nodeIds) => {
//     setExpanded(nodeIds)
//   };

//   // BUTTONS
//   const handleExpandClick = () => {
//     setExpanded(nodeIdCollector(array).flat(1000))
//   };

//   const handleDeletePhysicalChip = (chipToDelete) => {
//     setPhysicalPermissions(physicalPermissions.filter(area => area.key !== chipToDelete.key));
//   };

//   const handleDeleteTerminalChip = (chipToDelete) => {
//     setTerminalPermissions(terminalPermissions.filter(area => area.key !== chipToDelete.key));
//   };

//   const renderTree = (item, depth = 0, idx = 0) => {
//     // console.log("DEPTH", depth, "INDEX", idx, "AREA", item.label)
//     return (
//       <StyledTreeItem
//         nodeId={item.id}
//         labelText={item.label}
//         labelIcon={""}
//         sx={{
//           paddingLeft: 5,
//           color: "black",
//           //backgroundColor: "blue",
//           // '&:hover': {
//           //   backgroundColor: depth === 1 ? (idx % 2 ?  "white" : "rgba(208, 60, 49, 0.04)") : undefined,
//           // },
//           "&.MuiTreeItem-content:hover": {
//             backgroundColor: depth === 1 ? (idx % 2 ? "white" : "rgba(208, 60, 49, 0.04)") : undefined,
//           },
//         }}
//         endRight={
//         <Box
//           sx={{}}
//         >
//           <Checkbox
//             id={item.id}
//             {...item.label}
//             sx={{ color: "#d03c31" }}
//             checked={physicalPermissions.filter(p => p.key === item.id).length > 0}
//             onClick={(event) => {
//               event.stopPropagation()
//               if (event.target.checked) {
//                 setPhysicalPermissions([...physicalPermissions, {
//                   key: item.id,
//                   label: item.label
//                 }]);
//               } else {
//                 setPhysicalPermissions(physicalPermissions.filter(area => area.label !== item.label));
//               }
//             }}
//           />
//           <Checkbox
//             id={item.id}
//             {...item.label}
//             sx={{ color: "black", "&.Mui-checked": { color: "black" } }}
//             checked={terminalPermissions.filter(p => p.key === item.id).length > 0}
//             onClick={(event) => {
//               event.stopPropagation()
//               if (event.target.checked) {
//                 setTerminalPermissions([...terminalPermissions, {
//                   key: item.id,
//                   label: item.label
//                 }]);
//               } else {
//                 setTerminalPermissions(terminalPermissions.filter(area => area.label !== item.label));
//               }
//             }}
//           />
//           <Checkbox
//             id={item.id}
//             {...item.label}
//             sx={{ color: "#d03c31" }}
//             checked={thirdPermissions.filter(p => p.key === item.id).length > 0}
//             onClick={(event) => {
//               event.stopPropagation()
//               if (event.target.checked) {
//                 setThirdPermissions([...thirdPermissions, {
//                   key: item.id,
//                   label: item.label
//                 }]);
//               } else {
//                 setThirdPermissions(thirdPermissions.filter(area => area.label !== item.label));
//               }
//             }}
//           />
//         </Box>}
//       >
//         {item.childs.length >= 1 && item.childs.map((c, i) => renderTree(c, depth + 1, i))}
//       </StyledTreeItem>

//     )
//   }





//   return (
//     <>
//     {/* <Tree
//       data={array}
// 		/> */}
//       {/* TREE */}
//       <Paper sx={style.paper}>
//         <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", width: "100%" }}>
//           <Typography variant="h5" sx={{}}>
//             Permisos de Usuario
//           </Typography>
//           <Box>
//             <Button onClick={handleExpandClick}>
//               {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
//             </Button>
//           </Box>
//         </Box>
//         <Box sx={{ alignSelf: "flex-end", display: "flex" }}>
//           <Typography variant="body4" sx={{ color: "#d03c31", paddingRight: "4px" }}>INGRESO</Typography><Typography variant="body4" sx={{ color: "black" }}> / TERMINAL /</Typography><Typography variant="body4" sx={{ color: "#d03c31", paddingLeft: "4px" }}>THIRD</Typography>
//         </Box>
//         <TreeView
//           aria-label="controlled"
//           defaultExpanded={nodeIdCollector(array).flat(1000)}
//           expanded={expanded}
//           selected={selected}
//           onNodeToggle={handleToggle}
//           // onNodeSelect={handleSelect}

//           multiSelect
//           defaultCollapseIcon={<ArrowDropDownIcon />}
//           defaultExpandIcon={<ArrowRightIcon />}
//           defaultEndIcon={<div style={{ width: 24 }} />}
//           sx={{ height: "fit-content", flexGrow: 1, minWidth: "100%", width: "fit-content", }}
//         >
//           {array.map(renderTree)}
//         </TreeView>
//       </Paper>
//     </>
//   );
// }

// // Estilos
// const style = {
//   paper: {
//     display: "flex",
//     justifyContent: "center",
//     flexDirection: "column",
//     alignItems: "flex-start",
//     padding: "3rem",
//     gap: "1rem",
//     backgroundColor: "third.main",
//     marginBottom: "20px",
//     marginTop: "20px",
//     height: "100%",
//     // minWidth: "45vw",
//     // width: "100%",
//     // minHeight: "fit-content",
//     borderRadius: "1rem",
    
//   },
//   paperRight: {
//     display: "flex",
//     justifyContent: "flex-start",
//     flexDirection: "column",
//     alignItems: "flex-start",
//     padding: "3rem",
//     gap: "1rem",
//     backgroundColor: "third.main",
//     marginBottom: "20px",
//     marginTop: "20px",
//     // minWidth: "45vw",
//     width: "100%",
//     // minHeight: "fit-content",
//     borderRadius: "1rem"
//   },
// };