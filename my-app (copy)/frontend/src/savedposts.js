import React, { useEffect, useState } from "react";
import { Alert, Avatar, Backdrop, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import logo from './logo.png'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedditIcon from '@mui/icons-material/Reddit';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';

function SavedPosts({loginstatus, setLoginStatus, creds, setCreds}) {
    
    const [buttonFlag, setButtonFlag] = useState(0);
    const [currentsubg, setCurrentSubgG] = useState([])
    const [postflag, setPostFlag] = useState(false)
    const [bodytext, setBodyText] = useState("");
    const [postlist, setPostList] = useState([])
    const [postprintlist, setPostPrintList] = useState([])
    const [errorstate, setErrorState] = useState(0)
    const [errortext, setErrorText] = useState("Error 500");
    const [errorpost, setErrorPost] = useState("")
    const [apiflag, setAPIFlag] = useState(0)

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

    const getSavedPosts = async () => {
        try {
            const check = await fetch("http://localhost:5000/getsavedposts", {
                method: 'POST',
                body: JSON.stringify({'uname': creds.uname}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
    
            if (!check.ok) console.log("could not get saved posts")
            const arr = await check.json()
            setPostList(arr);
            setAPIFlag(0)
    
            } catch (error) {
            console.error(error);
            }
    }

    const upvotePost = async (postid) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/upvotepost", {
                method: 'POST',
                body: JSON.stringify({'postid': postid, 'uname': creds.uname}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
    
            const arr = await check.json()
            if (!check.ok){
                console.log("could not upvote")
                setErrorState(1)
                setErrorText(arr.error)
                setErrorPost(postid)
            }
            else
            {
                console.log("upvoted")
                setErrorState(0)
                setErrorText("")
                setErrorPost("")
            }
            getSavedPosts()
    
            } catch (error) {
            console.error(error);
            }
    }

    const downvotePost = async (postid) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/downvotepost", {
                method: 'POST',
                body: JSON.stringify({'postid': postid, 'uname': creds.uname}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
    
            const arr = await check.json()
            if (!check.ok){
                console.log("could not downvote")
                setErrorState(1)
                setErrorText(arr.error)
                setErrorPost(postid)
            }
            else
            {
                console.log("downvoted")
                setErrorState(0)
                setErrorText("")
                setErrorPost("")
            }
            getSavedPosts()
    
            } catch (error) {
            console.error(error);
            }
    }

    const followUser = async (postid, user) => {
        try {
            const check = await fetch("http://localhost:5000/addfollowing", {
                method: 'POST',
                body: JSON.stringify({'funame': user, 'uname': creds.uname}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
    
            const arr = await check.json()
            if (!check.ok){
                console.log("could not follow")
                setErrorState(1)
                setErrorText(arr.error)
                setErrorPost(postid)
            }
            else
            {
                console.log("followed")
                setErrorState(0)
                setErrorText("")
                setErrorPost("")
            }
            getSavedPosts()
    
            } catch (error) {
            console.error(error);
            }
    }

    const unsavePost = async (postid) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/unsavepost", {
                method: 'POST',
                body: JSON.stringify({'postid': postid, 'uname': creds.uname}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
    
            const arr = await check.json()
            if (!check.ok){
                console.log("could not unsave")
                setErrorState(1)
                setErrorText(arr.error)
                setErrorPost(postid)
            }
            else
            {
                console.log("unsaved post")
                setErrorState(0)
                setErrorText("")
                setErrorPost("")
            }
            getSavedPosts()
    
            } catch (error) {
            console.error(error);
            }
    }

    useEffect(() => {
        getCreds();
    }, [])

    useEffect(() => {
        if (creds.uname !== "")
            getSavedPosts()
    }, [creds])

    useEffect(() => {
        if (Array.isArray(postlist))
            setPostPrintList(postlist.map((post) => (
                <Card sx={{maxWidth: 400, ml: 2, mt: 2}}>
                    <CardContent>
                        <Typography variant='body1' style={{whiteSpace: 'break-spaces'}}>{post.text}</Typography>
                        <br></br>
                        <Typography variant='body2'>Posted By: {post.user}</Typography>
                        <Typography variant='body2'>Posted In: {post.subgreddiit}</Typography>
                    </CardContent>
                    <CardActions>
                    <Button onClick={() => {setAPIFlag(1); upvotePost(post._id)}}><ArrowUpwardIcon/>{post.upvotes.length}</Button>
                    <Button onClick={() => {setAPIFlag(1); downvotePost(post._id)}}><ArrowDownwardIcon/>{post.downvotes.length}</Button>
                    <Button disabled={post.user === creds.uname} onClick={() => {setAPIFlag(1); followUser(post._id, post.user)}}><PersonAddIcon/></Button>
                    <Button onClick={() => {setAPIFlag(1); unsavePost(post._id)}}><DeleteIcon/></Button>
                    
                    </CardActions>
                    {/* <Button disabled={(subg.mod === creds.uname)} onClick={() => {leaveSubGreddiit(subg.title)}}>Leave</Button>
                    <Button sx={{ml: 8}} onClick={() => {viewSubGreddiit(subg.title)}}>View SubGreddiit</Button> */}
                    {(errorstate === 1 && errorpost === post._id) ? <Alert onClose={() => {setErrorState(0); setAPIFlag(1); setErrorText(""); getSavedPosts()}} variant='filled' severity='error'>{errortext}</Alert> : <></>}
                </Card>
            )))
    }, [postlist])

    return (
        <>
            <Box justifyContent="space-between" sx={{display: 'flex', flexDirection: 'row', alignItems: 'left', p: 1, backgroundColor: '#ba000d'}}>
                <Avatar variant='rounded' src={logo} sx={{width: 50, height: 50, '&:hover': {cursor: 'pointer'}}} onClick={() => navigate("/dashboard")} />
                <IconButton sx={{display: 'flex', flexDirection: 'column'}} onClick={() => navigate("/profile")}>
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
                <IconButton sx={{display: 'flex', flexDirection: 'column'}} onClick={() => navigate("/savedposts")}>
                    <BookmarksIcon sx={{fontSize: 40, color: 'yellow'}}/>
                </IconButton>
                <Button type="submit" variant="contained" sx={{alignItems: 'center', mt: 1, height: 40, width: 100}} onClick={() => {localStorage.clear(); setCreds({uname: "", passwd: "", fname: "", lname: "", email: "", age: "", contact: "", passwd2: ""}); setButtonFlag(1)}}>Logout<LogoutIcon/></Button>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', mt: 5, alignItems: 'center'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Typography variant="h2">Welcome to Greddiit !!</Typography>
                </Box>
            </Box>
            {/* add stuff here */}
            {(postlist.length === 0)?(
                <Typography variant="h3" sx={{mt: 5, ml: 5}}>No Saved Posts</Typography>
            ): <Typography variant="h3" sx={{mt: 5, ml: 5}}>Saved Posts:</Typography>}
            <br></br>
            <ul>
                {postprintlist}
            </ul>
            <Backdrop open={apiflag} onClose={() => setAPIFlag(0)}>
                <CircularProgress/>
            </Backdrop>
        </>
    )
}

export default SavedPosts;