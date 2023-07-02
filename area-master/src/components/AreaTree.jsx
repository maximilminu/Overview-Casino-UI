import * as React from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import { useEffect } from "react";
import { useState } from "react";
import { Box, styled,  Typography, useTheme } from "@mui/material";

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    borderTopRightRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: theme.palette.error.light,
      color: "var(--tree-view-color)",
      [`& .${treeItemClasses.label}`]: {
        fontWeight: 600,
        color: "inherit",
      },
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      // paddingLeft: theme.spacing(1),
    },
  },
}));

const nodeIdCollector = (item) => {
  let nodeIds = [];
  if (Array.isArray(item?.Childs)) {
    nodeIds = item?.Childs.map((child) => {
      return nodeIdCollector(child);
    });
    nodeIds.push(item.ID);
  }
  return nodeIds;
};


const filtering = (original, filter) => {
  const filterChilds = (item) => {
    if(item.Childs) {
      return { ID: item.ID, Name: item.Name, Childs: item.Childs.map(child => filterChilds(child)).filter(Boolean)}
    };
    if (filter.includes(item.ID)) {
      return item;
    };
    return false;
  };
  let data = filterChilds(original);
  let find = true;
  const filterParents = (item) => {
    if(item.Childs && item.Childs.length > 0) {
      return { ID: item.ID, Name: item.Name, Childs: item.Childs.map(child => filterParents(child)).filter(Boolean)}
    };
    if (filter.includes(item.ID)) {
      return { ID: item.ID, Name: item.Name };
    };
    find = true;
    return false;
  };
  while (find) {
    find = false;
    data = filterParents(data);
  };
  return data;
};

export default function RichObjectTreeView(props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState([]);
  const [ tree, setTree ] = useState({})

  useEffect(() => {
    if(props.data) {
      if (props.filter) {
        setTree(filtering(props.data, props.filter));
      } else {
        setTree(props.data);
      };
    };
  }, [props.data, props.filter]);

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
            height: "inherit",
          }}
          onClick={() => {
            props.onNavigate(item.ID)
          }}
          label={
            <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "inherit", flexGrow: 1 }}
              >
                {item.Name}
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
        multiSelect
        selected={props.id}
        expanded={expanded}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ width: "100%", height: "inherit" }}
      >
        {renderTree(tree)}
      </TreeView>
  );
}
