import { Avatar, Box } from '@mui/joy';
import { TUserProps } from '@/types';

interface TUserAvatarProps {
  user: TUserProps | null;
}

const UserAvatar = ({ user }: TUserAvatarProps) => {
  return (
    <Box
      sx={{
        width: '30px',
        height: '30px',
      }}
    >
      {user && (
        <Avatar
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

export default UserAvatar;
