import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import { IconButton, Stack } from '@mui/joy';

import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import StrikethroughSRoundedIcon from '@mui/icons-material/StrikethroughSRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useState } from 'react';

export type MessageInputProps = {
  onSubmit: (inputMessage: string) => void;
};

export default function MessageInput(props: MessageInputProps) {
  const { onSubmit } = props;

  const [textAreaValue, setTextAreaValue] = useState('');

  const handleClick = () => {
    if (textAreaValue.trim() === '') return;

    onSubmit(textAreaValue);
    setTextAreaValue('');
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl>
        <Textarea
          placeholder="보낼 메세지를 입력해주세요..."
          aria-label="Message"
          value={textAreaValue}
          onChange={e => {
            setTextAreaValue(e.target.value);
          }}
          minRows={3}
          maxRows={10}
          endDecorator={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              sx={{
                py: 1,
                pr: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <div>
                <IconButton size="sm" variant="plain" color="neutral">
                  <FormatBoldRoundedIcon />
                </IconButton>
                <IconButton size="sm" variant="plain" color="neutral">
                  <FormatItalicRoundedIcon />
                </IconButton>
                <IconButton size="sm" variant="plain" color="neutral">
                  <StrikethroughSRoundedIcon />
                </IconButton>
                <IconButton size="sm" variant="plain" color="neutral">
                  <FormatListBulletedRoundedIcon />
                </IconButton>
              </div>
              <Button
                size="sm"
                color="primary"
                sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                endDecorator={<SendRoundedIcon />}
                onClick={handleClick}
              >
                보내기
              </Button>
            </Stack>
          }
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleClick();
            }
          }}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 72,
            },
          }}
        />
      </FormControl>
    </Box>
  );
}
