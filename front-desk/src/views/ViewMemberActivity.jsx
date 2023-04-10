import { useLayoutEffect, useContext, useState } from "react";
import { Backdrop, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useOutlet, useParams } from "react-router-dom";
import UserInformationTab from "../components/UserInformationTab";
import ListActivityMember from "../components/ListActivityMember";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import Roulette from "../components/Spinner/Roulette";

const ViewMemberActivity = () => {
  const theme = useTheme();
  const [user, setUser] = useState({});
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams();
  const NotifyUser = useContext(NotifyUserContext);
  const { Get } = useContext(ApiContext);
  const [visits, setVisits] = useState();
  const [img, setImg] = useState();
  const ifOutlet = useOutlet();

  useLayoutEffect(() => {
    if (id) {
      Get(`/member/v1/by-id/${id}`)
        .then(({ data }) => {
          const dateConvert = new Date(data.Birthdate)
            .toLocaleString("es-AR")
            .split(",")[0];

          data.Birthdate = dateConvert;

          setUser(data);
        })
        .catch((error) => {
          NotifyUser.Warning(
            `Error para obtener los datos del usuario, (${error.request.status})`
          );
        });

      // eslint-disable-next-line
      Get(`/visit/v1/by-memberID/${id}`)
        .then(({ data }) => {
          setVisits(data);
        })
        .catch((error) => {
          NotifyUser.Warning(
            `Error para obtener los datos del usuario, (${error.request.status})`
          );
        });

      Get(`/storage/avatar/${id}/1000?t=${Date.now()}`).then(({ data }) => {
        setImg(data);
      });
    }
    // eslint-disable-next-line
  }, [id]);

  return ifOutlet ? (
    <Outlet />
  ) : (
    <>
      {user.Name ? (
        <Grid
          container
          spacing={0.5}
          sx={{
            marginTop: "2%",
            justifyContent: "space-around",
            height: "95%",
          }}
        >
          <Grid item xs={12} md={4} xl={3} sx={{ height: "100%" }}>
            <UserInformationTab user={user} img={img} />
          </Grid>
          <Grid
            item
            sx={{ height: "100%", marginTop: down600px && "-70px" }}
            xs={12}
            md={7}
            xl={8}
          >
            <ListActivityMember visits={visits} />
          </Grid>
        </Grid>
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
          open={true}
        >
          <Roulette />
        </Backdrop>
      )}
    </>
  );
};

export default ViewMemberActivity;
