import React, { useState } from 'react';
import { Paper } from "@mui/material";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Tree from "../components/Tree/Tree"
import Form from "../components/Form"
import Checkboxes from "../components/Tree/Checkboxes"

// Estilos
const style = {
  paper: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "3rem 0rem 0.5rem 3rem",
    gap: "1rem",
    backgroundColor: "third.main",
    marginTop: "20px",
    maxHeight: "80vh", 
    
    borderRadius: "1rem",
    
  },
};

// eslint-disable-next-line
const nodeIdCollector = (item) => {
  let childIds = (item.childs || item).map(nodeIdCollector);
  childIds.push(item.id);

  return childIds;
}

const areas = [
  {
    id: 0,
    label: "Casino Mar del Plata",
    childs: [
      {
        id: 1,
        label: "Planta Baja",
        childs: [
          {
            id: 2,
            label: "Recepcion",
            childs: [
              {
                id: 3,
                label: "Terminal",
                childs: []
              },
            ]
          },
          {
            id: 4,
            label: "Cafeteria",
            childs: [
              {
                id: 5,
                label: "Terminal",
                childs: []
              },
            ]
          },
        ]
      },
      {
        id: 6,
        label: "Primer Piso",
        childs: [
          {
            id: 7,
            label: "Restaurante",
            childs: []
          },
        ]
      },
      {
        id: 8,
        label: "Segundo Piso",
        childs: [
          {
            id: 9,
            label: "Sector Fumadores",
            childs: []
          },
        ]
      },
      {
        id: 10,
        label: "Tercer Piso",
        childs: [
          {
            id: 11,
            label: "Terraza",
            childs: [
              {
                id: 12,
                label: "Sector Fumadores",
                childs: []
              },
            ]
          },
        ]
      },
      {
        id: 13,
        label: "Terraza",
        childs: [
          {
            id: 14,
            label: "Sector Fumadores",
            childs: []
          },
        ]
      },
    ]
  }
]

function AddNewUser() {
  const [abledPermissions, setAbledPermissions] = useState([]);
  const [entryPermissions, setEntryPermissions] = useState([]);
  const [terminalPermissions, setTerminalPermissions] = useState([]);

  const onToggleFirstCheckbox = (event, item) => {
    event.stopPropagation();
    if (abledPermissions.some(area => area.key === item.id)) {
      setEntryPermissions(entryPermissions.filter(area => area.key !== item.id));
      setTerminalPermissions(terminalPermissions.filter(area => area.key !== item.id));
    } 
    if (event.target.checked) {
      setAbledPermissions([...abledPermissions, {
        key: item.id,
        label: item.label
      }]);
    } else {
      setAbledPermissions(abledPermissions.filter(area => area.key !== item.id));
    }    
  }

  const onToggleSecondCheckbox = (event, item) => {
    event.stopPropagation();
    if (event.target.checked) {
      setEntryPermissions([...entryPermissions, {
        key: item.id,
        label: item.label
      }]);
    } else {
      setEntryPermissions(entryPermissions.filter(area => area.key !== item.id));
    }
  }

  
  const onToggleThirdCheckbox = (event, item) => {
    event.stopPropagation();
    if (event.target.checked) {
      setTerminalPermissions([...terminalPermissions, {
        key: item.id,
        label: item.label
      }]);
    } else {
      setTerminalPermissions(terminalPermissions.filter(area => area.key !== item.id));
    }
  }

  const abledCheckFinder = (item) => {
    return abledPermissions.filter(p => p.key === item.id).length > 0;
  }

  const entryCheckFinder = (item) => {
    return entryPermissions.filter(p => p.key === item.id).length > 0;
  }

  const terminalCheckFinder = (item) => {
    return terminalPermissions.filter(p => p.key === item.id).length > 0;
  }


  const ItemActions = ({item, depth, idx, data}) => {
    return <> 
      <Checkboxes
        item={item}
        abledCheckFinder={abledCheckFinder(item)}
        entryCheckFinder={entryCheckFinder(item)}
        terminalCheckFinder={terminalCheckFinder(item)}
        onToggleFirstCheckbox={(e) => onToggleFirstCheckbox(e, item)} 
        onToggleSecondCheckbox={(e) => onToggleSecondCheckbox(e, item)}
        onToggleThirdCheckbox={(e) => onToggleThirdCheckbox(e, item)}
        disabledClick={(e) => e.stopPropagation()}
      />
    </>
  }



  return (
    <Grid sx={{ flexGrow: 1, height: "100%", width: "100%" }} container spacing={2} >

			<Grid item xs={12} md={5} sx={{ maxHeight: "80vh", "&.MuiGrid-item": { padding: "1rem 1rem 2rem 7rem" } }} >
        {/*                CHECK!!!!         */}
        <Form permissions={{ areas }}/>
      </Grid>

      <Grid item xs={12} md={7} sx={{ "&.MuiGrid-item": { padding: "1rem 6rem 0 1rem" } }} >
        <Paper sx={style.paper}>
          <Typography variant="h5" sx={{}}>
              Permisos de Usuario
          </Typography>
          <Tree 
            data={areas} 
            onOpenCloseAll={null} 
            rightActions={ItemActions}        
          />
        </Paper>
			</Grid>

		</Grid>
  )
}

export default AddNewUser