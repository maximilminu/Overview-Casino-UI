// crear el contexto para la actualizacion de los devices
import { createContext, useState } from "react";

export const MemberContext = createContext();

const MemberProvider = ({ children }) => {
  const [member, setMember] = useState();
  
  return (
    <MemberContext.Provider value={{member,setMember}}>
      {children}
    </MemberContext.Provider>
  );
};

export default MemberProvider;
