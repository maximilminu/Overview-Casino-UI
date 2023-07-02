import { Chip, List, ListItem, ListItemButton } from "@mui/material";
import React, { useState } from "react";

const WithMoreList = (props) => {
	const [showAll, setShowAll] = useState(false);
	let items, itemsToShow, Component, ShowMoreButton, ShowLessButton;

	if (props.items) {
		items = props.items;
	} else {
		items = props.children;
	}

	if (!props.itemsToShow) {
		itemsToShow = 3;
	} else {
		itemsToShow = props.itemsToShow;
	}

	if (!props.component) {
		Component = (p) => <Chip label={p.item}></Chip>;
	} else {
		Component = props.component;
	}

	if (!props.showMoreButtonComponent) {
		ShowMoreButton = (p) => <ListItemButton {...p}>...</ListItemButton>;
	} else {
		ShowMoreButton = props.showMoreButtonComponent;
	}

	if (!props.showLessButtonComponent) {
		ShowLessButton = (p) => <ListItemButton {...p}>X</ListItemButton>;
	} else {
		ShowLessButton = props.showLessButtonComponent;
	}

	const handleShowAll = (e) => {
		e.stopPropagation();
		setShowAll(true);
	};

	const handleShowLess = (e) => {
		e.stopPropagation();
		setShowAll(false);
	};

	return (
		<List sx={props.sx}>
			{items &&
				items.map((item, index) => {
					if (showAll || index < itemsToShow) {
						return (
							<ListItem sx={props.itemsSx} key={index}>
								<Component item={item} index={index} />
							</ListItem>
						);
					} else {
						return false;
					}
				})}

			{!showAll && itemsToShow < items.length && (
				<ListItem sx={props.itemsSx}>
					<ShowMoreButton item={items} onClick={handleShowAll} />
				</ListItem>
			)}
			{showAll && (
				<ListItem sx={props.itemsSx}>
					<ShowLessButton onClick={handleShowLess} />
				</ListItem>
			)}
		</List>
	);
};

export default WithMoreList;
