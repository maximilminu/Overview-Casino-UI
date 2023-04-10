import React, { useContext, useEffect, useState } from "react";
import {
    Container,
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
    Chip,
} from "@mui/material";

import { NotifyUserContext } from "@oc/notify-user-context";
import { ApiContext } from "@oc/api-context";
import usePaginationContact from "../hook/usePaginationContact";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Roulette from "../components/Spinner/Roulette";
import { useLayoutEffect } from "react";
import { UserContext } from "@oc/user-context";
import { BarcodeReaderContext } from "@oc/barcode-reader-context";
import { Outlet, useNavigate, useOutlet, useParams } from "react-router-dom";
import Avatar from "../components/Avatar";
import { useLocation } from "react-router-dom";
import ChipsList from "../components/ChipsList";

const style = {
    tableCell: {
        fontWeight: "700",
        color: "rgb(123, 128, 154)",
        textTransform: "uppercase",
        textAlign: "center",
    },
    avatar: {
        backgroundColor: "grey",
        width: 40,
        height: 40,
        fontSize: "15px",
    },
};

export default function UsersList() {
    const [client, setClient] = useState();
    const { BarcodeReader } = useContext(BarcodeReaderContext);
    const { Get } = useContext(ApiContext);
    const [userSearch, setUserSearch] = useState();
    // const { setUser } = useContext(UserContext);
    const { param } = useParams();
    const navigate = useNavigate();
    const ifOutlet = useOutlet();
    const NotifyUser = useContext(NotifyUserContext);
    const currentRouter = useLocation().pathname;
    const arrUrl = currentRouter.split("/");
    const { currentPage, nextPage, prevPage } = usePaginationContact(
        10,
        userSearch
    );


    // useEffect(() => {
    //     if (null) {
    //         Get(`/user/v1/search/${param}`)
    //             .then(({ data }) => {
    //                 if (data?.length === 1) {
    //                     navigate(
    //                         `/front-desk/member-list/${param}/view-single-member/${data[0].ID}`
    //                     );
    //                     return;
    //                 }
    //                 setUserSearch(data);
    //             })
    //             .catch(async (err) => {
    //                 NotifyUser.Error(
    //                     `Problemas con la lista de miembros. Notifique al servicio técnicos (${err.request.status}).`
    //                 );
    //             });
    //     }
    //     // eslint-disable-next-line
    // }, [param]);



    const mock = [
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },

            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Lorem Ipsum"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Techo"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Palabra Random"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Centro de Estudiantes"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Avenida Libertador"
                },

            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Techo"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Lorem Ipsum"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Palabra Random"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Centro de Estudiantes"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Avenida Libertador"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Centro de Trabajadores"
                },
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Otro nombre para no aburrirnos largo"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Techo"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Jejeje otra"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Palabra Random"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Centro de Estudiantes"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Avenida Libertador"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Centro de Trabajadores"
                },
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Lorem Ipsum"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Techo"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Palabra Random"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Centro de Estudiantes"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Avenida Libertador"
                },
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Palabra Random"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Centro de Estudiantes"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Avenida Libertador"
                },
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Lorem Ipsum"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Techo"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Palabra Random"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Centro de Estudiantes"
                },
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Avenida Libertador"
                },
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
        {
            Name: "Fausto",
            LastName: "Rossi",
            Email: "frossi@test.com",
            ID: "47084357",
            Password: "Pass123!",
            AccessTo: "*",
            DefaultUrlPath: "/front-desk",
            Area: [
                {
                    ID: "sad5548ad-894984asd-484ad",
                    Name: "Casino Central"
                }
            ]
        },
    ]
    
    useLayoutEffect(() => {
        setUserSearch(mock)
    }, [])

    const filteredUserSearch = () => {
        if (userSearch) {
            if (userSearch?.length <= 10) return userSearch.slice(0, 10);
            return userSearch.slice(currentPage, currentPage + 10);
        }
    };

    // useEffect(() => {
    // 	if (param === "") {
    // 		navigate("/front-desk");
    // 		return;
    // 	}
    // 	Get(`/member/v1/search/${param}`)
    // 		.then(({ data }) => {
    // 			if (data?.length === 1) {
    // 				navigate(
    // 					`/front-desk/member-list/${param}/view-single-member/${data[0].ID}`
    // 				);
    // 				return;
    // 			}
    // 			setUserSearch(data);
    // 		})
    // 		.catch(async (err) => {
    // 			NotifyUser.Error(
    // 				`Problemas con la lista de miembros. Notifique al servicio técnicos (${err.request.status}).`
    // 			);
    // 		});
    // 	// eslint-disable-next-line
    // }, [param]);

    const handleClick = (id) => {
        navigate(`view-user/${id}`);
    };

    // useEffect(() => {
    // 	if (client?.LegalID) {
    // 		Get(`/member/v1/search/${client?.LegalID}`)
    // 			.then(({ data }) => {
    // 				if (data.length === 0) {
    // 					const info = new URLSearchParams(client).toString();
    // 					setClient({});
    // 					navigate(`/front-desk/add-user/${info}`);
    // 				} else if (
    // 					client.Birthdate === undefined ||
    // 					client.LegalID === undefined
    // 				) {
    // 					NotifyUser.Warning(
    // 						"No se pudo escanear el documento, intente nuevamente por favor"
    // 					);
    // 					navigate(`/front-desk/check-in`);
    // 				} else {
    // 					setClient({});
    // 					setUser(data[0]);
    // 					navigate(`/front-desk/confirm-check-in/`);
    // 				}
    // 			})
    // 			.catch((err) => {
    // 				NotifyUser.Error(
    // 					`Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${err?.request.status}).`
    // 				);
    // 			});
    // 	}
    // 	// eslint-disable-next-line
    // }, [client]);

    let currentPermissions = [];

    return ifOutlet ? (
        <Outlet />
    ) : (
        <>
            {/* {userSearch ? ( */}
            {true ? (
                <Container
                    sx={{
                        marginTop: "30px",
                        padding: ".7rem",
                        width: "100%",
                    }}
                >
                    <TableContainer
                        component={Paper}
                        sx={{ padding: "1rem", marginBottom: "20px", borderRadius: "1rem" }}
                    >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            fontWeight: "700",
                                            color: "rgb(123, 128, 154)",
                                            textTransform: "uppercase",
                                            textAlign: "flex-start",
                                            maxWidth: "75px"
                                        }}>
                                        Foto
                                    </TableCell>
                                    <TableCell sx={style.tableCell}>Nombre</TableCell>
                                    {/* <TableCell sx={style.tableCell}>Email</TableCell> */}
                                    <TableCell sx={style.tableCell}>Rol</TableCell>
                                    <TableCell sx={style.tableCell}>Permisos</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUserSearch()?.map((currentUser, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                            " &:hover": {
                                                backgroundColor: "#e5e5e5",
                                            },
                                            // borderRadius: "1rem",
                                            cursor: "pointer",
                                            transition: "all .2s ease-in",
                                        }}
                                    // onClick={() => handleClick(currentUser.ID)}
                                    >
                                        {/* <Link> */}
                                        <TableCell align="center" component="th" scope="row" sx={{ maxWidth: "75px" }}>
                                            {/* <Avatar src={currentUser.Avatar} sx={style.avatar}>
                    {currentUser.Name.slice(0, 1)}
                    {currentUser.Lastname.slice(0, 1)}
                  </Avatar> */}
                                            <Avatar
                                                sx={{ width: 50, height: 50 }}
                                                subject={currentUser}
                                            />
                                        </TableCell>
                                        <TableCell align="center" component="th" scope="row">
                                            {currentUser.Name} {currentUser.LastName} <br />
                                            {currentUser.ID}

                                        </TableCell>
                                        {/* <TableCell align="center" component="th" scope="row">
											{currentUser.Email}
										</TableCell> */}
                                        <TableCell align="center" component="th" scope="row">
                                            {/* {currentUser.Area} */}
                                            PRUEBA
                                        </TableCell>
                                        <TableCell align="center" component="th" scope="row" sx={{ justifyContent: "center", maxWidth: "300px" }}>
                                            {console.log(currentUser.Area.length - currentPermissions.length)}
                                            <ChipsList
                                                completeArray={currentUser.Area}
                                                mappingArray={currentUser.Area.slice(0, 5)}
                                                sxObject={{ backgroundColor: "#d03c31", color: "white", }}
                                            />

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
                </Container>
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
