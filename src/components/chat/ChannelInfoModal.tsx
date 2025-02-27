import React from 'react';
import ModalBase from '../common/ModalBase';
import { Typography } from '@mui/material';
import { TChannelProps } from '../../api/chat/type';
import SubsButton from '../search/SubsButton';
import { useNavigate } from 'react-router-dom';
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
  const {
    channelName,
    description,
    channelId,
    _id: channelIdSub,
  } = channelInfo;

  const navigate = useNavigate();

  const goChatHome = () => {
    navigate('/chat');
  };

  return (
    <ModalBase open={open} setOpen={setOpen}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        {channelName}
      </Typography>
      <Typography id="modal-modal-description">{description}</Typography>
      <SubsButton
        channelId={channelId || channelIdSub!}
        callbackFn={() => {
          goChatHome();
          window.location.reload();
          // TODO: reload 가 과연 최선인지?
        }}
      />
    </ModalBase>
  );
};

export default ChannelInfoModal;
