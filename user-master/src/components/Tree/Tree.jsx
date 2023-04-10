import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useTheme } from '@mui/material/styles';


const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: "black",
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: "rgba(208, 60, 49, 0.25)",
            borderRadius: "1rem",
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            color: 'none',
            backgroundColor: "rgba(208, 60, 49, 0.10)",
            borderRadius: "1rem",
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(0),
        },
    },
}));

const nodeIdCollector = (item) => {
    let childIds = (item.childs || item).map(nodeIdCollector);
    childIds.push(item.id);

    return childIds;
}


export default function Tree(props) {
    const [expanded, setExpanded] = useState(nodeIdCollector(props.data).flat(1000));

    // eslint-disable-next-line
    const theme = useTheme()

    
    // Open/Closes section -> Expanded
    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds)
    };
    
    const renderTree = (item, depth = 0, idx = 0) => {
        
        console.log(depth === 1 ? (idx % 2 ? "UNO COLOR" : "DOS COLOR") : "Ninguno",)
        // console.log("DEPTH", depth, "INDEX", idx, "AREA", item)

        return (<StyledTreeItemRoot
            nodeId={item.id}
            sx={{
                paddingLeft: 5,
                color: "black",
                // '&:hover': {
                //   backgroundColor: depth === 1 ? (idx % 2 ?  "white" : "rgba(208, 60, 49, 0.04)") : undefined,
                // },
                "&:hover": {
                    // backgroundColor: depth === 1 ? (theme.palette.primary.main + "A8") : undefined,
                    // borderRadius: "1rem",
                   
                },
            }}
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    {/* <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} /> */}
                    <Typography variant="body1" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {item.label}
                    </Typography>
                    <Box>
                        <props.rightActions item={item} depth={depth} idx={idx} {...props} />
                    </Box>

                </Box>
            }
        >
            {item.childs.length >= 1 && item.childs.map((c, i) => renderTree(c, depth + 1, i))}
        </StyledTreeItemRoot>)

    }





    return (
        <>
            <TreeView
                aria-label="controlled"
                defaultExpanded={nodeIdCollector(props.data).flat(1000)}
                expanded={expanded}
                onNodeToggle={handleToggle}

                multiSelect
                defaultCollapseIcon={<ArrowDropDownIcon />}
                defaultExpandIcon={<ArrowRightIcon />}
                defaultEndIcon={<div style={{ width: 24 }} />}
                sx={{ 
                    height: "fit-content", 
                    flexGrow: 1, minWidth: "100%", 
                    width: "fit-content", 
                    overflowY: "scroll",
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        backgroundColor: '#F5F5F5',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        borderRadius: '10px',
                        boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                        backgroundColor: '#8E8E8E',
                    },
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#8E8E8E #F5F5F5',
                    paddingRight: "3rem",
                    
                }}
            >
                {props.data.map(renderTree)}
            </TreeView>
        </>
    );
}