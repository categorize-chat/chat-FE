import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import { listItemButtonClasses } from '@mui/joy/ListItemButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import ColorSchemeToggle from './ColorSchemeToggle';
import { useChatStore } from '../../state/chat';
import { useLocation, useNavigate } from 'react-router-dom';
import { Paths } from '../../routes/paths';
import TabItem from './sidebar/TabItem';
import UserStats from './sidebar/UserStats';
import { useMemo } from 'react';
import { useUIStore } from '../../state/ui';

export default function Sidebar() {
  const { chats } = useChatStore();
  const { pathname } = useLocation();
  const { isSidebarOpen, closeSidebar } = useUIStore();

  const navigate = useNavigate();
  const parsedPath = pathname.split('/')[1];

  const handleGoHome = () => {
    navigate(Paths.chat.base());
  };
  const handleGoSearch = () => {
    navigate(Paths.search.base());
  };
  const handleGoSetting = () => {
    navigate(Paths.user.settings());
  };
  const handleGoFriends = () => {
    alert('준비중입니다.');
  };

  const unreadCount = useMemo(() => {
    return chats?.reduce((acc, chat) => {
      return acc + chat.unreadCount;
    }, 0);
  }, [chats]);

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={theme => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      {isSidebarOpen && (
        <Box
          className="Sidebar-overlay"
          sx={{
            position: 'fixed',
            zIndex: 9998,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'var(--joy-palette-background-backdrop)',
            transition: 'opacity 0.4s',
            display: { xs: 'block', md: 'none' },
          }}
          onClick={closeSidebar}
        />
      )}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-lg">Chat</Typography>
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>
      {/* <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" /> */}
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': theme => theme.vars.radius.sm,
          }}
        >
          <TabItem
            isSelected={false}
            name="홈"
            icon={<HomeRoundedIcon />}
            onClick={handleGoHome}
          />

          <TabItem
            isSelected={parsedPath === 'chat'}
            name="채팅"
            icon={<QuestionAnswerRoundedIcon />}
            onClick={handleGoHome}
          >
            {unreadCount > 0 && (
              <Chip size="sm" color="primary" variant="solid">
                {unreadCount}
              </Chip>
            )}
          </TabItem>

          <TabItem
            isSelected={parsedPath === 'search'}
            name="검색"
            icon={<SearchIcon />}
            onClick={handleGoSearch}
          />

          <TabItem
            name="친구"
            icon={<GroupRoundedIcon />}
            onClick={handleGoFriends}
          />
        </List>
        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': theme => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >
          <TabItem
            name="문의"
            icon={<SupportRoundedIcon />}
            onClick={() =>
              (window.location.href = `mailto:${import.meta.env.VITE_EMAIL_SUPPORT}`)
            }
          />

          <TabItem
            name="설정"
            icon={<SettingsRoundedIcon />}
            onClick={handleGoSetting}
          />
        </List>
      </Box>
      <Divider />
      <UserStats />
    </Sheet>
  );
}
