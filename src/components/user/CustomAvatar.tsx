import { Box } from '@mui/joy';
import { calculateColor } from '../../utils/common/function';

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
