import { Email, Facebook, Instagram, Message, Phone, PhoneAndroid, Telegram, WhatsApp, Error } from '@mui/icons-material';
import { memo } from 'react';

const InteractionChannelIcon = memo((props) => {
  const media = (props["interaction-channel"] && props["interaction-channel"].Media) || props.media;
  const isMobile = (props["interaction-channel"] && props["interaction-channel"].Data) ? props["interaction-channel"].Data.IsMobile : props.mobile
  switch (media) {
    case 'phone':
      if (isMobile) {
        return <PhoneAndroid {...props} />
      } else {
        return <Phone {...props} />
      }
    case 'landphone':
      return <Phone {...props} />
    case 'cellphone':
      return <PhoneAndroid {...props} />
    case 'email':
      return <Email {...props}/>
    case 'messenger':
      return <Message {...props}/>
    case 'telegram':
      return <Telegram {...props}/>
    case 'whatsapp':
      return <WhatsApp {...props}/>
    case 'instagram':
      return <Instagram {...props}/>
    case 'facebook':
      return <Facebook {...props}/>
    default:
      console.warn('UNKNOWN MEDIA', media);
      return <Error {...props}/>
  }
})

export const KnownInteractionChannelIcons = [
  'landphone', 'cellphone', 'email', 'whatsapp', 'telegram', 'instagram', 'facebook'
]

export const KnownInteractionChannelIconsForTexting = [
  'email', 'whatsapp', 'telegram', 'instagram', 'facebook'
]


export default InteractionChannelIcon;