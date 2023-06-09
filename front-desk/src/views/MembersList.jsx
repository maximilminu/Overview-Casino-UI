import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import {
  Backdrop,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Box,
  Button,
  styled,
  tableCellClasses,
  Grid,
} from "@mui/material";
import { NotifyUserContext } from "@oc/notify-user-context";
import { ApiContext } from "@oc/api-context";
import usePaginationContact from "../hook/usePaginationContact";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Roulette from "../components/Spinner/Roulette";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
} from "react-router-dom";
import Avatar from "../components/Avatar";
import { useOutletContext } from "react-router-dom";
import { MemberContext } from "../context/MemberContext";

const style = {
  tableCell: {
    fontWeight: "700",
    color: "rgb(123, 128, 154)",
    textTransform: "uppercase",
  },
  avatar: {
    backgroundColor: "grey",
    width: 40,
    height: 40,
    fontSize: "15px",
  },
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    height: "50px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function MembersList() {
  const { onNavbarSearchListener } = useOutletContext();
  const [client, setClient] = useState({});
  const { Get } = useContext(ApiContext);
  const [memberSearch, setMemberSearch] = useState(false);
  const { memberSearchText } = useParams();
  const navigate = useNavigate();
  const ifOutlet = useOutlet();
  const NotifyUser = useContext(NotifyUserContext);
  const location = useLocation();
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, nextPage, prevPage } = usePaginationContact(
    10,
    memberSearch
  );

  const { setMember } = useContext(MemberContext);

  useEffect(() => {
    if (ifOutlet) {
      return;
    }
    let memberSearch;
    if (memberSearchText === "") {
      navigate("/front-desk");
      return;
    }

    if (location.pathname.includes("%20"))
      memberSearch = location.pathname.slice(24);
    if (
      location.pathname.match(`/${memberSearchText}$`) ||
      location.pathname.match(`/${memberSearch}$`)
    ) {
      doGet(memberSearchText);
    }
    // eslint-disable-next-line
  }, [memberSearchText, location]);

  useLayoutEffect(() => {
    return onNavbarSearchListener((data) => {
      if (!ifOutlet && location.pathname.match(`/${memberSearchText}$`)) {
        doGet(data);
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!ifOutlet && client.LegalID) {
      Get(`/member/v1/search/${client.LegalID}`)
        .then(({ data }) => {
          if (data.length === 0) {
            const info = new URLSearchParams(client).toString();
            setClient({});
            navigate(`/front-desk/add-member/${info}`);
          } else if (
            client.Birthdate === undefined ||
            client.LegalID === undefined
          ) {
            NotifyUser.Warning(
              "No se pudo escanear el documento, intente nuevamente por favor"
            );
            navigate(`/front-desk/check-in`);
          } else {
            setClient({});
            setMember(data[0]);
            navigate(`/front-desk/check-in/confirm`);
          }
        })
        .catch((err) => {
          NotifyUser.Error(
            `Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${err?.request.status}).`
          );
        });
    }
    // eslint-disable-next-line
  }, [client]);

  const doGet = (p) => {
    Get(`/member/v1/search/${p}`)
      .then(({ data }) => {
        if (data?.length === 1 && memberSearch === false) {
          navigate(
            `/front-desk/member-list/${p}/view-single-member/${data[0].ID}`
          );
          return;
        }
        setMemberSearch(data);
      })
      .catch(async (err) => {
        NotifyUser.Error(
          `Problemas con la lista de miembros. Notifique al servicio técnicos.`
        );
      });
  };

  const handleClick = (id) => {
    navigate(`view-single-member/${id}`);
  };

  const filteredMemberSearch = () => {
    if (memberSearch) {
      if (memberSearch?.length <= 10) return memberSearch.slice(0, 10);
      return memberSearch.slice(currentPage, currentPage + 10);
    }
  };

  const capitalizer = (word) => {
    const result = word.split(" ").map((singleWord) => {
      return (
        singleWord.charAt(0).toUpperCase() + singleWord.slice(1).toLowerCase()
      );
    });
    return result.join(" ");
  };

  return ifOutlet ? (
    <Outlet />
  ) : (
    <>
      {memberSearch ? (
        <Grid
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <TableContainer
            sx={{
              width: "80%",
              maxHeight: "95%",
              marginTop: "15px",
              overflow: "auto",
            }}
            component={Paper}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={style.tableCell}>Foto</StyledTableCell>
                  <StyledTableCell sx={style.tableCell}>
                    Nombre y Apellido
                  </StyledTableCell>
                  <StyledTableCell sx={style.tableCell}>Dni</StyledTableCell>
                  <StyledTableCell sx={style.tableCell}>Área</StyledTableCell>
                  {/* <TableCell sx={style.tableCell}>Info</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMemberSearch()?.map((currentMember, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      " &:hover": {
                        backgroundColor: "#e5e5e5",
                      },
                      cursor: "pointer",
                      transition: "all .2s ease-in",
                    }}
                    onClick={() => {
                      handleClick(currentMember.ID);
                    }}
                  >
                    {/* <Link> */}
                    <TableCell align="left" component="th" scope="row">
                      {/* <Avatar src={currentMember.Avatar} sx={style.avatar}>
                    {currentMember.Name.slice(0, 1)}
                    {currentMember.Lastname.slice(0, 1)}
                  </Avatar> */}
                      <Avatar
                        size={50}
                        sx={{ width: 50, height: 50 }}
                        subject={currentMember}
                      />
                    </TableCell>
                    <TableCell align="left" component="th" scope="row">
                      {capitalizer(currentMember.Name)}{" "}
                      {capitalizer(currentMember.Lastname)}
                    </TableCell>
                    <TableCell align="left" component="th" scope="row">
                      {currentMember.LegalID}
                    </TableCell>
                    <TableCell align="left" component="th" scope="row">
                      {currentMember.Address && currentMember.Area
                        ? capitalizer(currentMember.Address.Area)
                        : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button onClick={prevPage}>
                <ArrowBackIosIcon fontSize="small" />
              </Button>
              <Button onClick={nextPage}>
                <ArrowForwardIosIcon fontSize="small" />
              </Button>
            </Box>
          </TableContainer>
        </Grid>
      ) : (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: 0,
          }}
          open={true}
        >
          <Roulette />
        </Backdrop>
      )}
    </>
  );
}
