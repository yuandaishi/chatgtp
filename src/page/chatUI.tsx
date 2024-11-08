import { useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Comment from '@mui/icons-material/Comment';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './chatui.scss';
import chatgtp from './../images/chatgpt.png';

function ChatUI({ resetApi, Div }: { resetApi: Function, Div: any }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [questionArr, setQuestionArr] = useState<any[]>([]);
    const [answerArr, setAnswerArr] = useState<any[]>([]);
    useEffect(() => {
        if (questionArr.length !== 0) {
            getData();
            window.scrollTo(0, document.body.scrollHeight);
        }
    }, [questionArr])
    useEffect(() => {
        window.addEventListener('keypress', keypress);
        return () => {
            window.removeEventListener('keypress', keypress);
        }
    }, [])
    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, [answerArr])
    let keypress = (e: KeyboardEvent) => {
        if (e.keyCode === 13) {
            handleClickSendMessage();
        }
    }
    let handleClickSendMessage = () => {
        if (inputRef.current?.value) {
            setQuestionArr((pre) => ([...pre, inputRef.current?.value]));
        }
    }
    let handleClickReset = () => {
        localStorage.removeItem('chatApiKey');
        resetApi(false)
    }
    let getData = async () => {
        let data = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('chatApiKey')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "mistralai/mistral-7b-instruct:free",
                "messages": questionArr.map(item => ({ role: "user", content: item })),
                // "stream": true,
                "transforms": ["middle-out"],
                // 'number': 5464654564n,
                "max_tokens": 0,
            })
        })
        if (data.status !== 200) {
            setAnswerArr([...answerArr, 'AI出现问题，请稍后询问']);
            return;
        }
        data.json().then((data) => {
            setAnswerArr([...answerArr, data.choices[0].message.content]);
        })
    }
    return (
        <div className="ChatUI">
            {Div}
            <div className='AI-box'>
                {
                    questionArr.map((item, key) => {
                        return (
                            <div key={`box-${key}`}>
                                <ListItem alignItems="flex-start" key={`question-${key}`} className='y-list'>
                                    <ListItemAvatar>
                                        <Avatar alt="Y" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="You"
                                        secondary={item}
                                    />
                                </ListItem>
                                {
                                    answerArr[key] ? <ListItem alignItems="flex-start" key={`answer-${key}`}>
                                        <ListItemAvatar>
                                            <Avatar alt="chat" src={chatgtp} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary="ChatGTP"
                                            secondary={answerArr[key]}
                                        />
                                    </ListItem> : <Box sx={{ display: 'flex', justifyContent: "center" }}>
                                        <CircularProgress />
                                    </Box>
                                }

                            </div>
                        )
                    })
                }
            </div>
            <div className='from-contain'>
                <FormControl sx={{ m: 1, width: '80vw' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Message</InputLabel>
                    <OutlinedInput
                        inputRef={inputRef}
                        id="outlined-adornment-password"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickSendMessage}
                                    edge="end"
                                >
                                    <Comment />
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Message ChatGTP..."
                    />
                </FormControl>
            </div>
            <Button variant="contained" onClick={handleClickReset} className='reset-api'>reset API key</Button>
        </div>
    )
}

export default ChatUI;