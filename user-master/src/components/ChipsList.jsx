import React from 'react'
import { Chip, Paper, styled, Tooltip, Zoom } from '@mui/material';

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

function ChipsList({ mappingArray, handleDelete, sxObject, completeArray }) {
    console.log(mappingArray, completeArray)

    const restOfPermissions = completeArray.length - mappingArray.length

    return (
        <Paper
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                width: "100%",
                borderRadius: "1rem",
                backgroundColor: "transparent",
                p: 0.5,
                m: 0,
            }}
            elevation={0}
            component="ul"
        >
            {mappingArray.map((chip, index) => {
                return (
                    <ListItem key={index}>
                        {/* ULTIMA AREA de chip, onHover muestra TODA la tira */}
                        <Tooltip TransitionComponent={Zoom} title={chip.Name ? chip.Name : chip}>
                            <Chip
                                label={chip.Name ? chip.Name : chip}
                                variant="outlined"
                                size={"small"}
                                sx={sxObject}
                                onDelete={handleDelete ? (() => handleDelete(chip)) : null}
                            />
                        </Tooltip>

                    </ListItem>
                )
            })}
            {restOfPermissions > 0 ? 
                <Chip
                    label={`+${restOfPermissions}`}
                    variant="outlined"
                    size={"small"}
                    sx={{ margin: 0.5, borderColor: "#d03c31", color: "#d03c31"}}
                /> : <></>
            }
        </Paper>
    )
}

export default ChipsList