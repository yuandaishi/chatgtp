import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ChatUI from './page/chatUI';
import './App.css';

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showChat, changeChatCon] = useState<string | null | boolean>(localStorage.getItem('chatApiKey'));
  const [inputError, changeinputError] = useState(false);
  let handleFocus = () => {
    changeinputError(false);
  }
  let handleClick = () => {
    if (inputRef.current?.value) {
      localStorage.setItem('chatApiKey', inputRef.current.value);
      changeChatCon(true);
    } else {
      changeinputError(true);
    }
  }
  if (showChat) {
    return (
      <ChatUI resetApi={changeChatCon} />
    )
  }
  return (
    <div className="API-key-box">
      <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
        欢迎使用OpenRoute，请在下方输入您的OpenRouter API key
      </Box >
      <TextField required error={inputError} id="outlined-basic" label="API key" variant="outlined" margin="dense" inputRef={inputRef} onFocus={handleFocus} />
      <Button variant="contained" onClick={handleClick}>确认</Button>
    </div >
  );
}

export default App;
