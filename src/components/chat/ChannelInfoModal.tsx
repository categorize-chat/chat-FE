import { Box, FormControl, FormLabel, Modal } from '@mui/joy';
import React from 'react';
import ModalBase from '../common/ModalBase';
import { Typography } from '@mui/material';
import { TChannelProps } from '../../utils/chat/type';

type TChannelInfoModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  channelInfo: TChannelProps;
};

const ChannelInfoModal = ({
  open,
  setOpen,
  channelInfo,
}: TChannelInfoModalProps) => {
  const { channelName, description } = channelInfo;

  return (
    <ModalBase open={open} setOpen={setOpen}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {channelName}
      </Typography>
      <Typography id="modal-modal-description">{description}</Typography>
    </ModalBase>
  );
};

export default ChannelInfoModal;
