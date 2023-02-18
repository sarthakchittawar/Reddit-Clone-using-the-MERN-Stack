import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, CardContent, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import logo from './logo.png'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedditIcon from '@mui/icons-material/Reddit';

function OpenSubGreddiit({loginstatus, setLoginStatus, creds, setCreds}) {
    
    const [buttonFlag, setButtonFlag] = useState(0);
    const [searchtext, setSearchText] = useState("");
    const [joinedlist, setJoinedList] = useState([]);
    const [notjoinedlist, setNotJoinedList] = useState([]);
    const [joinedprintlist, setJoinedPrintList] = useState([]);
    const [notjoinedprintlist, setNotJoinedPrintList] = useState([]);
    const [leaveflag, setLeaveFlag] = useState(0)

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

    const changeHandler = (val) => {
        // setValues({...values, [val.target.name]: val.target.value})
        setSearchText(val.target.value)
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

    const search = async () => {
        try {
        const search = await fetch("http://localhost:5000/subgreddiits/search", {
            method: 'POST',
            body: JSON.stringify({'search': searchtext, 'uname': creds.uname}),
            headers: {
            'Content-Type': 'application/json',
            }
        })
        console.log("search")
        const arr = await search.json();
        if (search.ok){
            setJoinedList(arr[0])
            setNotJoinedList(arr[1])
        }

        } catch (error) {
        console.error(error);
        }
    }

    const leaveSubGreddiit = async (title) => {
        try {
        const search = await fetch("http://localhost:5000/subgreddiits/leave", {
            method: 'POST',
            body: JSON.stringify({'title': title, 'uname': creds.uname}),
            headers: {
            'Content-Type': 'application/json',
            }
        })
        setLeaveFlag(1);

        } catch (error) {
        console.error(error);
        }
    }

    const joinSubGreddiit = async (title) => {
        try {
        const request = await fetch("http://localhost:5000/subgreddiits/request", {
            method: 'POST',
            body: JSON.stringify({'title': title, 'uname': creds.uname}),
            headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem("jwt")
            }
        })
        if (request.ok) console.log("Requested to join");
        else console.log("Can't request to join")

        } catch (error) {
        console.error(error);
        }
    }

    useEffect(() => {
        getCreds();
    }, [])

    useEffect(() => {
        if (leaveflag === 1)
        {
            search();
            setLeaveFlag(0);
        }
    }, [leaveflag])

    useEffect(() => {
        if (creds.uname !== "")
            search();
    }, [creds])

    useEffect(() => {
        if (Array.isArray(joinedlist))
            setJoinedPrintList(joinedlist.map((subg) => (
                <Card sx={{maxWidth: 400, ml: 2, mt: 2}}>
                    <CardContent>
                        <Typography variant="h3">Title: {subg.title}</Typography>
                        <Typography variant="h5">Description: {subg.desc}</Typography>
                        <Typography variant="h6">Followers: {subg.followers.length}</Typography>
                        <Typography variant="h6">No. of Posts: {subg.posts.length}</Typography>
                        <Typography variant="h6">Banned Keywords: {subg.banned.join(', ')}</Typography>
                    </CardContent>
                    <Button disabled={(subg.mod === creds.uname)} onClick={() => {leaveSubGreddiit(subg.title)}}>Leave</Button>
                    {/* <Button sx={{ml: 8}} onClick={() => {viewSubGreddiit(subg.title)}}>View</Button> */}
                </Card>
            )))
    }, [joinedlist])

    useEffect(() => {
        if (Array.isArray(notjoinedlist))
            setNotJoinedPrintList(notjoinedlist.map((subg) => (
                <Card sx={{maxWidth: 400, ml: 2, mt: 2}}>
                    <CardContent>
                        <Typography variant="h3">Title: {subg.title}</Typography>
                        <Typography variant="h5">Description: {subg.desc}</Typography>
                        <Typography variant="h6">Followers: {subg.followers.length}</Typography>
                        <Typography variant="h6">No. of Posts: {subg.posts.length}</Typography>
                        <Typography variant="h6">Banned Keywords: {subg.banned.join(', ')}</Typography>
                    </CardContent>
                    <Button onClick={() => {joinSubGreddiit(subg.title)}}>Request to Join</Button>
                    {/* <Button sx={{ml: 8}} onClick={() => {viewSubGreddiit(subg.title)}}>View SubGreddiit</Button> */}
                </Card>
            )))
    }, [notjoinedlist])

    return (
        <>
            <Box justifyContent="space-between" sx={{display: 'flex', flexDirection: 'row', alignItems: 'left', p: 1, backgroundColor: '#ba000d'}}>
                <Avatar variant='rounded' src={logo} sx={{width: 50, height: 50, '&:hover': {cursor: 'pointer'}}} onClick={() => navigate("/dashboard")} />
                <IconButton sx={{display: 'flex', flexDirection: 'column', ml: 100}} onClick={() => navigate("/profile")}>
                    <AccountBoxIcon sx={{fontSize: 40, color: 'yellow'}}/>
                    {/* <Typography variant="h5">My Profile</Typography> */}
                </IconButton>
                <IconButton sx={{display: 'flex', flexDirection: 'column'}} onClick={() => navigate("/mysubgreddiits")}>
                    <RedditIcon sx={{fontSize: 40, color: 'orange'}}/>
                    {/* <Typography variant="h5">My SubGreddiits</Typography> */}
                </IconButton>
                <IconButton sx={{display: 'flex', flexDirection: 'column'}} onClick={() => navigate("/subgreddiits")}>
                    <RedditIcon sx={{fontSize: 40, color: 'purple'}}/>
                    {/* <Typography variant="h5">All SubGreddiits</Typography> */}
                </IconButton>
                <Button type="submit" variant="contained" sx={{alignItems: 'center', mt: 1, height: 30, width: 80}} onClick={() => {localStorage.clear(); setCreds({uname: "", passwd: "", fname: "", lname: "", email: "", age: "", contact: "", passwd2: ""}); setButtonFlag(1)}}>Logout</Button>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', mt: 5, alignItems: 'center'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Typography variant="h2">Welcome to Greddiit !!</Typography>
                </Box>
            </Box>
            {/* add stuff here */}
            <Box>
                <TextField name="searchtext" value={searchtext} type='text' onChange={changeHandler}/><Button variant='contained' onClick={() => search()}>Search</Button>
            </Box>
            <br></br>
            <Typography variant="h4">Joined SubGreddiits:</Typography>
            <ul>
                {joinedprintlist}
            </ul>
            {(joinedprintlist.length === 0) ? <Typography variant='h5'>No such joined SubGreddiits</Typography> : <></>}

            <br></br>
            <br></br>
            <Typography variant="h4">Unjoined SubGreddiits:</Typography>
            <ul>
                {notjoinedprintlist}
            </ul>
            {(notjoinedprintlist.length === 0) ? <Typography variant='h5'>No such unjoined SubGreddiits</Typography> : <></>}
        </>
    )
}

export default OpenSubGreddiit;