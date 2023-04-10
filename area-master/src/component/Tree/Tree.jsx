import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useNavigate } from "react-router";

const nodeIdCollector = (item) => {
  let childIds = (item.childs || item).map(nodeIdCollector);
  childIds.push(item.id);

  return childIds;
};

export default function Tree(props) {
  const theme = useTheme();
  console.log(theme, "theme");
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(
    nodeIdCollector(props.data).flat(1000)
  );

  // Open/Closes section -> Expanded
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const renderTree = (item, depth = 0, idx = 0) => {
    return (
      <>
        <TreeItem
          nodeId={item.id}
          onClick={() => {
            navigate(`single-area/${item.id}`);
          }}
          sx={{
            borderTopRightRadius: theme.spacing(2),
            borderBottomRightRadius: theme.spacing(2),
            "&:hover": {
              backgroundColor: depth === 2 && theme.palette.action.hover,
              backgroundColor: depth === 3 && theme.palette.primary.light,
            },
            paddingLeft: 1,
            color: "black",

            // "&:hover": {
            //   backgroundColor: depth === 1 && "primary.main",
            // },
          }}
          label={
            <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
              {/* <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} /> */}
              <Typography
                variant="body1"
                sx={{ fontWeight: "inherit", flexGrow: 1 }}
              >
                {item.label}
              </Typography>
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
          {item.childs.length >= 1 &&
            item.childs.map((c, i) => renderTree(c, depth + 1, i))}
        </TreeItem>
      </>
    );
  };

  return (
    <>
      <TreeView
        aria-label="controlled"
        defaultExpanded={nodeIdCollector(props.data).flat(1000)}
        expanded={expanded}
        multiSelect
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        sx={{
          height: "fit-content",
          flexGrow: 1,
          minWidth: "100%",
          width: "fit-content",
        }}
      >
        {props.data.map(renderTree)}
      </TreeView>
    </>
  );
}

// Estilos
const style = {
  paper: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "3rem",
    gap: "1rem",
    backgroundColor: "third.main",
    marginBottom: "20px",
    marginTop: "20px",
    height: "100%",
    // minWidth: "45vw",
    // width: "100%",
    // minHeight: "fit-content",
    borderRadius: "1rem",
  },
  paperRight: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "3rem",
    gap: "1rem",
    backgroundColor: "third.main",
    marginBottom: "20px",
    marginTop: "20px",
    // minWidth: "45vw",
    width: "100%",
    // minHeight: "fit-content",
    borderRadius: "1rem",
  },
};
