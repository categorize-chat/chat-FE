export const Paths = {
  base: () => '/',
  user: {
    base: () => '/user',
    join: () => '/join',
    login: () => '/login',
    settings: () => '/settings',
    oauth: {
      kakao: () => '/user/oauth/kakao',
    },
  },
  chat: {
    base: () => '/chat',
    room: (id: string) => `/chat/${id}`,
  },
  search: {
    base: () => '/search',
  },
} as const;
