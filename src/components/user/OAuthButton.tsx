import { Button } from '@mui/joy';
import React from 'react';

interface IOAuthButtonProps {
  provider: string;
  buttonStyle: any;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
}

const OAuthButton = ({
  buttonStyle,
  icon,
  description,
  onClick,
}: IOAuthButtonProps) => {
  return (
    <Button
      type="button"
      sx={{
        ...buttonStyle,

        width: '100%',
        display: 'flex',
        gap: '8px',
      }}
      onClick={onClick}
    >
      {icon}
      {description}
    </Button>
  );
};

export default OAuthButton;
