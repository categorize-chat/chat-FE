import { Input, Sheet } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import { ChangeEvent, useRef, useState } from 'react';
import { searchApi } from '../../utils/search/api';
import { TChannelProps } from '../../utils/chat/type';
import ChannelListItem from '../../components/search/ChannelListItem';
import { debounce } from '../../utils/common/time';

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

  const sendSearchRequest = async (keyword: string) => {
    if (!keyword || keyword.length < 1) {
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
              <ChannelListItem key={channel.channelName} channel={channel} />
            ))}
        </Sheet>
      </Sheet>
    </>
  );
};

export default SearchPage;
