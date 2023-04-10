import React from 'react'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Checkbox, Tooltip, Zoom } from '@mui/material';

import NoMeetingRoomIcon from '@mui/icons-material/NoMeetingRoom';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

import PhonelinkOffIcon from '@mui/icons-material/PhonelinkOff';
import DevicesIcon from '@mui/icons-material/Devices';


function Checkboxes({
  item,
  abledCheckFinder,
  entryCheckFinder,
  terminalCheckFinder,
  onToggleFirstCheckbox,
  onToggleSecondCheckbox,
  onToggleThirdCheckbox,
  disabledClick,
}) {

  return (
    <>
      <Tooltip TransitionComponent={Zoom} title={abledCheckFinder ? "Relación con Area" : "No hay relacion con el area"}>
        <Checkbox
          id={item.id}
          {...item.label}
          checked={abledCheckFinder}
          icon={<CloseIcon sx={{ color: "#E74242" }} />}
          checkedIcon={<CheckIcon sx={{ color: "#52E34E" }} />}
          onClick={onToggleFirstCheckbox}
        />
      </Tooltip>
      {abledCheckFinder === false ?
        (
          <>
            <Checkbox
              id={item.id}
              {...item.label}
              icon={<NoMeetingRoomIcon sx={{ color: "grey" }} />}
              disabled={true}
              onClick={disabledClick}
            />
            <Checkbox
              id={item.id}
              {...item.label}
              icon={<PhonelinkOffIcon sx={{ color: "grey" }} />}
              disabled={true}
              onClick={(e) => e.stopPropagation()}
            />
          </>
        ) : (
          <>
            <Tooltip TransitionComponent={Zoom} title={entryCheckFinder ? "Acceso a Puerta del Area" : "Sin acceso a Puerta del Area"}>
              <Checkbox
                id={item.id}
                {...item.label}
                checked={entryCheckFinder}
                icon={<NoMeetingRoomIcon sx={{ color: "#E74242" }} />}
                checkedIcon={<MeetingRoomIcon sx={{ color: "#52E34E" }} />}
                onClick={onToggleSecondCheckbox}
              />
            </Tooltip>

            <Tooltip TransitionComponent={Zoom} title={terminalCheckFinder ? "Acceso a Terminal del Area" : "Sin acceso a Terminal del Area"}>
              <Checkbox
                id={item.id}
                {...item.label}
                checked={terminalCheckFinder}
                icon={<PhonelinkOffIcon sx={{ color: "#E74242" }} />}
                checkedIcon={<DevicesIcon sx={{ color: "#52E34E" }} />}
                onClick={onToggleThirdCheckbox}
              />
            </Tooltip>
          </>
        )}
    </>
  )
}

export default Checkboxes