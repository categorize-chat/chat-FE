import { extendTheme } from '@mui/joy/styles';
import './index.css'; // Tailwind CSS 파일 임포트



const defaultFonts = `Pretendard, Inter -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif`

export const customTheme = extendTheme({
  fontFamily: {
    body: defaultFonts,
    display: defaultFonts,
  },
});
