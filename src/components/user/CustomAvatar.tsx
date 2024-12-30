import { Box } from '@mui/joy';
import { TUserProps } from '../../utils/user/type';

interface ICustomAvatarProps {
  user: TUserProps | null;
}

const CustomAvatar = ({ user }: ICustomAvatarProps) => {
  return (
    <Box
      sx={{
        width: '30px',
        height: '30px',
      }}
    >
      {user && (
        <img
          src={user.profileUrl}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '100px',
          }}
        />
      )}
    </Box>
  );
};

export default CustomAvatar;
