import {
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
} from '@mui/joy';

type TTabItemProps = {
  isSelected?: boolean;
  name: string;
  onClick?: () => void;
  icon: React.ReactNode;
  children?: React.ReactNode;
};

const TabItem = ({
  isSelected,
  onClick,
  name,
  icon,
  children,
}: TTabItemProps) => {
  return (
    <ListItem>
      <ListItemButton selected={!!isSelected} onClick={onClick}>
        {icon}
        <ListItemContent>
          <Typography level="title-sm">{name}</Typography>
        </ListItemContent>
        {children}
      </ListItemButton>
    </ListItem>
  );
};

export default TabItem;
