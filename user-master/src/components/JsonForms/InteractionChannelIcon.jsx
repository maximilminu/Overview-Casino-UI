import {
  Facebook,
  Instagram,
  Message,
  Phone,
  PhoneAndroid,
  Telegram,
  WhatsApp,
  Error,
} from "@mui/icons-material";
import { memo } from "react";

const InteractionChannelIcon = memo((props) => {
  const media =
    (props["interaction-channel"] && props["interaction-channel"].Media) ||
    props.media;
  const isMobile =
    props["interaction-channel"] && props["interaction-channel"].Data
      ? props["interaction-channel"].Data.IsMobile
      : props.mobile;
  switch (media) {
    case "phone":
      if (isMobile) {
        return <PhoneAndroid {...props} />;
      } else {
        return <Phone {...props} />;
      }
    case "landphone":
      return <Phone {...props} />;
    case "cellphone":
      return <PhoneAndroid {...props} />;
    case "Messenger":
      return <Message {...props} />;
    case "Telegram":
      return <Telegram {...props} />;
    case "WhatsApp":
      return <WhatsApp {...props} />;
    case "Instagram":
      return <Instagram {...props} />;
    case "Facebook":
      return <Facebook {...props} />;
    default:
      console.warn("UNKNOWN MEDIA", media);
      return <Error {...props} />;
  }
});

export const KnownInteractionChannelIcons = [
  "landphone",
  "cellphone",
  "WhatsApp",
  "Telegram",
  "Instagram",
  "Facebook",
];

export const KnownInteractionChannelIconsForTexting = [
  "WhatsApp",
  "Telegram",
  "Instagram",
  "Facebook",
];

export default InteractionChannelIcon;
