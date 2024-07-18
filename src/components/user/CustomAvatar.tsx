import { Box } from '@mui/joy';
import { hashString } from '../../utils/common/function';

const calculateColor = (str: string) => {
  const hashedColor = `#${hashString(str, 0x000000, 0xffffff).toString(16)}`;
  return hashedColor;
};

interface ICustomAvatarProps {
  nickname: string;
}

const CustomAvatar = ({ nickname }: ICustomAvatarProps) => {
  return (
    <Box
      sx={{
        width: '30px',
        height: '30px',
        borderRadius: '100px',
        backgroundColor: calculateColor(nickname),
      }}
    ></Box>
  );
};

export default CustomAvatar;
