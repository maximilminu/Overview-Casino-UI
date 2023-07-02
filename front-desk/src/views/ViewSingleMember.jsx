import { useLayoutEffect, useContext, useState } from "react";
import { Backdrop, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useLocation, useOutlet, useParams } from "react-router-dom";
import UserInformationTab from "../components/UserInformationTab";
import ListActivityMember from "../components/ListActivityMember";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import Roulette from "../components/Spinner/Roulette";

const ViewMemberActivity = () => {
  const theme = useTheme();
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams();
  const NotifyUser = useContext(NotifyUserContext);
  const { Get } = useContext(ApiContext);
  const [visits, setVisits] = useState();
  const [img, setImg] = useState();
  const ifOutlet = useOutlet();
  const [isUnauthorize, setIsUnauthorize] = useState(false);
  const [member, setMember] = useState({});
  const url = useLocation()
  useLayoutEffect(() => {
    if (id) {
      Get(`/member/v1/by-id/${id}`)
        .then(({ data }) => {
          setMember(data);
        })
        .catch((error) => {
          NotifyUser.Warning(
            `Error para obtener los datos del usuario, (${error.request.status})`
          );
        });
      Get(`/visit/v1/status/?MemberID=${id}&TestMode=true`)
        .then(({ data }) => {
          setIsUnauthorize(false);
          if (
            data.Response &&
            (data.Response.AlreadyReported ||
              data.Response.Banned ||
              data.Response.UnderAge)
          ) {
            setIsUnauthorize(data.Response);
          } else {
            setIsUnauthorize(false);
          }
        })
        .catch((error) => {
          NotifyUser.Warning(`Error para obtener los datos del usuario.`);
          console.log("Get(/visit/v1/status/?MemberID) ERROR:", error);
        });
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
  }, [url]);

  return ifOutlet ? (
    <Outlet context={{ member, setMember, isUnauthorize, setIsUnauthorize }} />
  ) : (
    <>
      {member.Name ? (
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
            <UserInformationTab
              user={member}
              img={img}
              isUnauthorize={isUnauthorize}
            />
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
