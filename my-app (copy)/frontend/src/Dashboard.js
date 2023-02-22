import React, { useEffect, useState } from "react";
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedditIcon from '@mui/icons-material/Reddit';
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import logo from './logo.png'
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import LogoutIcon from '@mui/icons-material/Logout';

function Dashboard({loginstatus, setLoginStatus, creds, setCreds}) {
    
    const [buttonFlag, setButtonFlag] = useState(0);

    const navigate = useNavigate();
    
    useEffect(() => {
        if (loginstatus === -2 || loginstatus === -3)
            navigate("/");
    }, [loginstatus])
    
    if (loginstatus === 1 && buttonFlag === 1)
    {
        setLoginStatus(-3);
    }
    else if (loginstatus !== 1 && buttonFlag === 0)
    {
        setLoginStatus(-2);
    }

    return (
        <>
            <Box justifyContent="space-between" sx={{display: 'flex', flexDirection: 'row', alignItems: 'left', p: 1, backgroundColor: '#ba000d'}}>
                <Avatar variant='rounded' src={logo} sx={{width: 50, height: 50, '&:hover': {cursor: 'pointer'}}} onClick={() => navigate("/dashboard")} />
                <Button type="submit" variant="contained" sx={{alignItems: 'center', mt: 1, height: 40, width: 100}} onClick={() => {localStorage.clear(); setCreds({uname: "", passwd: "", fname: "", lname: "", email: "", age: "", contact: "", passwd2: ""}); setButtonFlag(1)}}>Logout<LogoutIcon/></Button>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', mt: 5, alignItems: 'center'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Typography variant="h2">Welcome to Greddiit !!</Typography>
                </Box>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', mt: 10}}>
                <IconButton sx={{display: 'flex', flexDirection: 'column', width: 1/4}} onClick={() => navigate("/profile")}>
                    <AccountBoxIcon sx={{fontSize: 300, color: 'brown'}}/>
                    <Typography variant="h5">My Profile</Typography>
                </IconButton>
                <IconButton sx={{display: 'flex', flexDirection: 'column', width: 1/4}} onClick={() => navigate("/mysubgreddiits")}>
                    <RedditIcon sx={{fontSize: 300, color: 'orange'}}/>
                    <Typography variant="h5">My SubGreddiits</Typography>
                </IconButton>
                <IconButton sx={{display: 'flex', flexDirection: 'column', width: 1/4}} onClick={() => navigate("/subgreddiits")}>
                    <RedditIcon sx={{fontSize: 300, color: 'red'}}/>
                    <Typography variant="h5">All SubGreddiits</Typography>
                </IconButton>
                <IconButton sx={{display: 'flex', flexDirection: 'column', width: 1/4}} onClick={() => navigate("/savedposts")}>
                    <BookmarksIcon sx={{fontSize: 300, color: 'black'}}/>
                    <Typography variant="h5">Saved Posts</Typography>
                </IconButton>
                
            </Box>
        </>
    )
}

export default Dashboard;