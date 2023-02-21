import React, { useEffect, useState } from "react";
import { Avatar, BottomNavigation, BottomNavigationAction, Button, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import logo from './logo.png'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedditIcon from '@mui/icons-material/Reddit';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ReportIcon from '@mui/icons-material/Report';

function OpenMySubGreddiit({loginstatus, setLoginStatus, creds, setCreds, navState, setNavState}) {
    
    const [buttonFlag, setButtonFlag] = useState(0);
    const [value, setValue] = useState(0);
    const [users, setUsers] = useState([]);
    const [bannedusers, setBannedUsers] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [bannedusersList, setBannedUsersList] = useState([]);
    const [requests, setRequests] = useState([]);
    const [requestsList, setRequestsList] = useState([]);

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

    let url = window.location.href;
    let parts = url.split("/");

    const title = parts[parts.length - 1];

    const checkSubG = async (title) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/check", {
                method: 'POST',
                body: JSON.stringify({'title': title}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })

            const res = await check.json()
    
            if (!check.ok || res.mod !== creds.uname) navigate("/mysubgreddiits");
    
            } catch (error) {
            console.error(error);
            }
    }

    const getusers = async (title) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/getusers", {
                method: 'POST',
                body: JSON.stringify({'title': title}),
                headers: {
                'Content-Type': 'application/json'
                }
            })
            const arr = await check.json();
            const s = new Set(arr.blockedusers)
            setBannedUsers(arr.blockedusers);
            setUsers(arr.followers.filter((user) => {
                return !s.has(user)
            }));
            setRequests(arr.requests)
        
            } catch (error) {
            console.error(error);
            }
    }

    const acceptRequest = async (user) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/acceptrequest", {
                method: 'POST',
                body: JSON.stringify({'title': title, 'uname': user}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
            if (!check.ok) console.log("Could not accept request!")
            await getusers(title);
            var index = requests.indexOf(user)
            requests.splice(index, 1)
        
            } catch (error) {
            console.error(error);
            }
    }

    const rejectRequest = async (user) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/rejectrequest", {
                method: 'POST',
                body: JSON.stringify({'title': title, 'uname': user}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
            if (!check.ok) console.log("Could not reject request!")
            await getusers(title);
            var index = requests.indexOf(user)
            requests.splice(index, 1)
        
            } catch (error) {
            console.error(error);
            }
    }

    const getCreds = async () => {
        try {
            const checkAuth = await fetch("http://localhost:5000/getcreds", {
            method: 'GET',
            headers: {
            "x-auth-token": localStorage.getItem("jwt")
        }})
        const data = await checkAuth.json()
        console.log(data[0])
        await setCreds({fname: data[0].name.fname, lname: data[0].name.lname, uname: data[0].uname, email: data[0].email, age: data[0].age, contact: data[0].contact, passwd: data[0].passwd})
        }
        catch (error) {
            console.error(error);
        }
    }

    // const checkJoin = () => {
    //     const s1 = new Set(users)
    //     const s2 = new Set(bannedusers)

    //     if (s1.has(creds.uname) || s2.has(creds.uname)) return true;
    //     else return false;
    // }

    // const disableLeave = () => {

    //     if (mod === creds.uname || !checkJoin()) return true;
    //     else return false;
    // }

    useEffect(() => {
        getCreds();
    }, [])

    useEffect(() => {
        if (title !== "")
        {
            getusers(title)
        }
    }, [value])

    useEffect(() => {
        console.log("begin")
        if (creds && title)
            checkSubG(title)
    }, [title])

    useEffect(() => {
        if (Array.isArray(users))
            setUsersList((users).map((user) => <li>{user}</li>))
    }, [users])

    useEffect(() => {
        console.log(requests)
        if (Array.isArray(requests))
            setRequestsList((requests).map((user) => <li>{user}<Button color='success' variant='contained' onClick={() => acceptRequest(user)}>Accept</Button><Button color='warning' variant='contained' onClick={() => rejectRequest(user)}>Reject</Button></li>))
    }, [requests])

    useEffect(() => {
        if (Array.isArray(bannedusers))
            setBannedUsersList(bannedusers.map((user) => <li>{user}</li>))
    }, [bannedusers])


    return (
        <>
            <Box justifyContent="space-between" sx={{display: 'flex', flexDirection: 'row', alignItems: 'left', p: 1, backgroundColor: '#ba000d'}}>
                <Avatar variant='rounded' src={logo} sx={{width: 50, height: 50, '&:hover': {cursor: 'pointer'}}} onClick={() => navigate("/dashboard")} />
                <IconButton sx={{display: 'flex', flexDirection: 'column'}} onClick={() => navigate("/profile")}>
                    <AccountBoxIcon sx={{fontSize: 40, color: 'yellow'}}/>
                </IconButton>
                <IconButton sx={{display: 'flex', flexDirection: 'column'}} onClick={() => navigate("/mysubgreddiits")}>
                    <RedditIcon sx={{fontSize: 40, color: 'orange'}}/>
                </IconButton>
                <IconButton sx={{display: 'flex', flexDirection: 'column'}} onClick={() => navigate("/subgreddiits")}>
                    <RedditIcon sx={{fontSize: 40, color: 'purple'}}/>
                </IconButton>
                <Button type="submit" variant="contained" sx={{alignItems: 'center', mt: 1, height: 30, width: 80}} onClick={() => {localStorage.clear(); setCreds({uname: "", passwd: "", fname: "", lname: "", email: "", age: "", contact: "", passwd2: ""}); setButtonFlag(1)}}>Logout</Button>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', mt: 5, alignItems: 'center'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Typography variant="h2">{title}</Typography>
                </Box>
                {/* <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Button variant='contained' disabled={checkJoin()} color='success'>Request to Join</Button>
                    <Button variant='contained' disabled={disableLeave()} color='warning' sx={{ml: 2}}>Leave</Button>
                </Box> */}
            </Box>
            <Box>
                <BottomNavigation showLabels value={value} onChange={(e, newValue) => {setValue(newValue)}}>
                    <BottomNavigationAction label="Users" icon={<PeopleIcon />} />
                    <BottomNavigationAction label="Requests" icon={<GroupAddIcon />} />
                    <BottomNavigationAction label="Stats" icon={<QueryStatsIcon />} />
                    <BottomNavigationAction label="Reports" icon={<ReportIcon />} />
                </BottomNavigation>
            </Box>
            {(value === 0) ? (<Box><Typography variant="h5">Active Users:</Typography>
            <ul>
                {usersList}
            </ul>
            <br></br>
            <Typography variant="h5">Banned Users:</Typography>
            <ul>
                {bannedusersList}
            </ul></Box>) : <></>}
            {(value === 1) ? (<Box>
                <ul>
                    {requestsList}
                </ul>
            </Box>) : <></>}
            {(value === 1 && requests.length === 0)?(<Box><Typography variant='h4'>You have no requests</Typography></Box>):<></>}
        </>
    )
}

export default OpenMySubGreddiit;