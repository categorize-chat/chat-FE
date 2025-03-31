import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightMode';

type TColorSchemeToggleProps = {
  float?: boolean;
} & IconButtonProps;

export default function ColorSchemeToggle(props: TColorSchemeToggleProps) {
  const { onClick, sx, float = false, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <IconButton
        size="sm"
        variant="outlined"
        color="neutral"
        {...other}
        sx={sx}
        disabled
      />
    );
  }
  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      {...other}
      onClick={event => {
        if (mode === 'light') {
          setMode('dark');
        } else {
          setMode('light');
        }
        onClick?.(event);
      }}
      sx={[
        {
          '& > *:first-of-type': {
            display: mode === 'dark' ? 'none' : 'initial',
          },
          '& > *:last-of-type': {
            display: mode === 'light' ? 'none' : 'initial',
          },
          ...(float && {
            position: 'fixed',
            top: 10,
            right: 10,
            zIndex: 1000,
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <DarkModeRoundedIcon />
      <LightModeIcon />
    </IconButton>
  );
}
