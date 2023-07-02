import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLayoutEffect, useRef } from "react";
import { Box } from "@mui/system";
import { useState } from "react";
import { ApiContext } from "@oc/api-context";
import { useContext } from "react";
import { NotifyUserContext } from "@oc/notify-user-context";

const findOnTree = (item, nameFilter, idFilter) => {
  if (item.Childs) {
    let ret = [];
    for (let i = 0; i < item.Childs.length; i++) {
      const res = findOnTree(item.Childs[i], nameFilter, idFilter);
      if (res !== false) {
        ret.push(res);
      }
    }
    ret = ret.flat();
    for (let w = 0; w < ret.length; w++) {
      ret[w].Parents.push(item.Name);
    }
    if (idFilter === item.ID) {
      return { ID: item.ID, Name: item.Name, Parents: [] };
    }
    if ((nameFilter === undefined) || (nameFilter && item.Name?.toLowerCase().indexOf(nameFilter.toLowerCase()) > -1)) {
      ret.push({ ID: item.ID, Name: item.Name, Parents: [] });
    }
    return ret;
  }
  if (idFilter === item.ID) {
    return { ID: item.ID, Name: item.Name, Parents: [] };
  }
  if ((nameFilter === undefined) || (nameFilter && item.Name?.toLowerCase()?.indexOf(nameFilter.toLowerCase()) > -1)) {
    return { ID: item.ID, Name: item.Name, Parents: [] };
  }
  return false;
};

function Home() {
  const buttonsRef = useRef([]);
  const matches = useMatches();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  // eslint-disable-next-line
  const [disable, setDisable] = useState();
  const { Get } = useContext(ApiContext);
  const areasTree = useRef(false);
  const [loadingPage, setLoadingPage] = useState();
  const NotifyUser = useContext(NotifyUserContext);
  const [ filteredTreeBySearch, setFilteredTreeBySearch ] = useState(false);
  const navigate = useNavigate();
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [ areasByFindOnOnTreeFunction, setAreasByFindOnTreeFunction ] = useState([]);
  const url = useLocation().pathname;
  useLayoutEffect(() => {
    setLoadingPage(true);
    getAllAreas();
    // eslint-disable-next-line
  }, []);

  const getAllAreas = () => {
    Get("/area/v1/tree").then(({ data }) => {
      const findOnTreeData = findOnTree(data);
      areasTree.current = data;
      setLoadingPage(false);
      setAreasByFindOnTreeFunction(findOnTreeData);
      setFilteredAreas(findOnTreeData);
    })
    .catch((err) => {
      navigate("/area-managment");
      setLoadingPage(false);
      NotifyUser.Warning("No se pueden obtener todas las áreas. Intente más tarde.");
    });
  };
 

  const onSearch = (data) => {
    const findOnTreeData = findOnTree(areasTree.current, data, "");
    if(findOnTreeData.length === 0 ) {
      return;
    }
    if(findOnTreeData.length > 0 ) {
      if(!url.includes("/all-areas")) {
        navigate("all-areas/:id")
      }
    }
    setFilteredTreeBySearch(findOnTreeData.map(i => i.ID));
  };

  const onEmpty = (to) => {
    setFilteredTreeBySearch(false);
  };

  return (
    <>
      <Navbar 
        onHeightChange={setHeaderHeight} 
        buttonsRef={buttonsRef} 
        onSearch={onSearch}
        onEmpty={onEmpty}
      />
      <Box
        component="main"
        sx={{
          position: "fixed",
          top: headerHeight,
          bottom: footerHeight,
          left: 0,
          right: 0,
          backgroundColor: matches.length > 1 && "#eeeeeeb0",
        }}
      >
        <Outlet 
          context={{ 
          findOnTree, getAllAreas, areasTree: areasTree.current, setLoadingPage, loadingPage, filteredTreeBySearch, setFilteredAreas, filteredAreas, areasByFindOnOnTreeFunction
          }}
        />
      </Box>
      <Footer disable={disable} onHeightChange={setFooterHeight} />
    </>
  );
}

export default Home;
