import { Input, Sheet } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import { ChangeEvent, useRef, useState } from 'react';
import { searchApi } from '../../utils/search/api';
import { TChannelProps } from '../../utils/chat/type';
import ChannelListItem from '../../components/search/ChannelListItem';

const SearchPage = () => {
  // 검색어 입력창 ref
  const searchInputRef = useRef<HTMLInputElement>(null);

  // States
  const [searchedChannels, setSearchedChannels] = useState<TChannelProps[]>([]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!searchInputRef.current) {
      return;
    }

    searchInputRef.current.value = e.target.value;

    // 바로 검색 요청
    sendSearchRequest(e.target.value);
  };

  const sendSearchRequest = async (keyword: string) => {
    if (!keyword || keyword.length < 2) {
      setSearchedChannels([]);
      return;
    }

    const { channels } = await searchApi.searchGeneralRooms(keyword);
    setSearchedChannels(channels);
  };

  return (
    <>
      <Sheet
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateRows: '1fr 3fr',
        }}
      >
        <Sheet sx={{ textAlign: 'center', width: '100%' }}>
          <h1>채팅방 검색</h1>

          <Input
            size="lg"
            placeholder="원하는 채팅방을 검색해서 찾아보세요! (이름, 키워드...)"
            sx={{
              '--Input-radius': '100px',
              width: '500px',
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
            gap: 2,
            flexWrap: 'wrap',
            display: 'flex',
            flexDirection: 'row',
            padding: 2,
          }}
        >
          {searchedChannels &&
            searchedChannels.map(channel => (
              <ChannelListItem key={channel.channelId} channel={channel} />
            ))}
        </Sheet>
      </Sheet>
    </>
  );
};

export default SearchPage;
