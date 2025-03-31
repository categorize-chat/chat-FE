import { Input, Sheet, Typography } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { searchApi } from '@/api/search/api';
import { TChannelProps } from '@/types';
import ChannelListItem from '@/components/search/ChannelListItem';
import { debounce } from '@/utils/common/time';
import { useQuery } from 'react-query';
import { searchAllRoomsQuery } from '@/api/search/query';
import ToggleSidebarButton from '@/components/common/header/ToggleSidebarButton';

const SearchPage = () => {
  // 검색어 입력창 ref
  const searchInputRef = useRef<HTMLInputElement>(null);

  // States
  const [searchedChannels, setSearchedChannels] = useState<TChannelProps[]>([]);

  // debounce 처리된 검색어 입력 핸들러
  const handleSearchChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    if (!searchInputRef.current) {
      return;
    }

    searchInputRef.current.value = e.target.value;

    sendSearchRequest(e.target.value);
  }, 500);

  const { data: allRooms } = useQuery({
    ...searchAllRoomsQuery(),
  });

  const sendSearchRequest = async (keyword: string) => {
    if (!keyword || keyword.length < 1) {
      // 없으면 최신의 채팅방 목록을 보여줌
      setSearchedChannels(allRooms?.channels || []);
      return;
    }

    const { channels } = await searchApi.searchGeneralRooms(keyword);
    setSearchedChannels(channels);
  };

  useEffect(() => {
    if (allRooms) {
      setSearchedChannels(allRooms.channels || []);
    }
  }, [allRooms]);

  return (
    <>
      <ToggleSidebarButton float />

      <Sheet
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
          padding: 2,
          height: '100dvh',
        }}
      >
        <Sheet
          sx={{
            msHyphenateLimitChars: 4,
            textAlign: 'center',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography level="h2">채팅방 검색</Typography>

          <Input
            placeholder="원하는 채팅방을 검색해서 찾아보세요! (이름, 키워드...)"
            sx={{
              '--Input-radius': '100px',
              width: { xs: '100%', sm: '500px' },
              margin: '0 auto',
            }}
            endDecorator={<SearchIcon />}
            onChange={handleSearchChange}
            ref={searchInputRef}
          />
        </Sheet>

        {/* channel 목록들 */}
        <Sheet
          sx={{
            maxHeight: '100%',
            overflowY: 'auto',
          }}
        >
          {searchedChannels &&
            searchedChannels.map(channel => (
              <ChannelListItem key={channel.channelName} channel={channel} />
            ))}
        </Sheet>
      </Sheet>
    </>
  );
};

export default SearchPage;
