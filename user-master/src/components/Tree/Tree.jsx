import * as React from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import { useEffect } from "react";

import { Box, styled, Tooltip, Typography, useTheme } from "@mui/material";

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
	color: theme.palette.text.secondary,
	[`& .${treeItemClasses.content}`]: {
		borderTopRightRadius: theme.spacing(2),
		borderBottomRightRadius: theme.spacing(2),
		fontWeight: theme.typography.fontWeightMedium,
		"&.Mui-expanded": {
			fontWeight: theme.typography.fontWeightRegular,
		},
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
		"&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
			backgroundColor: `neutral`,
			color: "var(--tree-view-color)",
			[`& .${treeItemClasses.label}`]: {
				fontWeight: 700,
				color: "inherit",
			},
		},
	},
	[`& .${treeItemClasses.group}`]: {
		marginLeft: 0,
		[`& .${treeItemClasses.content}`]: {
			paddingLeft: theme.spacing(2),
		},
	},
}));

const nodeIdCollector = (item) => {
	const nodeIds = [item.ID];

	if (item.Childs) {
		for (const child of item.Childs) {
			nodeIds.push(...nodeIdCollector(child));
		}
	}

	return nodeIds;
};

export default function RichObjectTreeView(props) {
	const theme = useTheme();
	const [expanded, setExpanded] = React.useState(nodeIdCollector(props.data));

	useEffect(() => {
		setExpanded(nodeIdCollector(props.data).flat(1000));
	}, [props.data]);

	const renderTree = (item, depth = 0, idx = 0) => {
		if (item && item.ID) {
			return (
				<StyledTreeItemRoot
					key={item.ID}
					nodeId={item.ID}
					sx={{
						borderTopRightRadius: theme.spacing(2),
						borderBottomRightRadius: theme.spacing(2),
						paddingLeft: 1,
						color: "black",
					}}
					label={
						<Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
							<Tooltip title={item.Name}>
								<Typography
									variant="body1"
									sx={{ fontWeight: "inherit", flexGrow: 1 }}
								>
									{item.Name}
								</Typography>
							</Tooltip>
							<Box>
								<props.rightActions
									item={item}
									depth={depth}
									idx={idx}
									{...props}
								/>
							</Box>
						</Box>
					}
				>
					{Array.isArray(item.Childs)
						? item.Childs.map((itm, i) => renderTree(itm, depth + 1, i))
						: null}
				</StyledTreeItemRoot>
			);
		} else {
			return null;
		}
	};

	return (
		<TreeView
			aria-label="rich object"
			defaultCollapseIcon={<ExpandMoreIcon />}
			defaultExpanded={["root"]}
			multiSelect={false}
			expanded={expanded}
			defaultExpandIcon={<ChevronRightIcon />}
			defaultEndIcon={<div style={{ width: 24 }} />}
			sx={{
				height: "fit-content",
				flexGrow: 1,
				minWidth: "100%",
				width: "fit-content",
				overflowY: "auto",
			}}
		>
			{renderTree(props.data)}
		</TreeView>
	);
}
