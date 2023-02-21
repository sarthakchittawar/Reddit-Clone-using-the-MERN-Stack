import React, { useEffect, useState } from "react";
import { Alert, Avatar, Button, Card, CardActions, CardContent, CardMedia, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import logo from './logo.png'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedditIcon from '@mui/icons-material/Reddit';
import subgimage from './subg.jpg'

function OpenSubGreddiit({loginstatus, setLoginStatus, creds, setCreds}) {
    
    const [buttonFlag, setButtonFlag] = useState(0);
    const [currentsubg, setCurrentSubgG] = useState([])
    const [postflag, setPostFlag] = useState(false)
    const [bodytext, setBodyText] = useState("");
    const [postlist, setPostList] = useState([])
    const [postprintlist, setPostPrintList] = useState([])
    const [errorstate, setErrorState] = useState(0)
    const [errortext, setErrorText] = useState("Error 500");
    const [errorpost, setErrorPost] = useState("")

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
    // console.log(title)

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
            const arr = await check.json()
    
            if (!check.ok) navigate("/subgreddiits");
            else{
                setCurrentSubgG(arr)
                console.log(arr)
            }
    
            } catch (error) {
            console.error(error);
            }
    }

    const checkJoin = async (title) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/checkjoin", {
                method: 'POST',
                body: JSON.stringify({'title': title, 'uname': creds.uname}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
    
            if (!check.ok) navigate("/subgreddiits");
    
            } catch (error) {
            console.error(error);
            }
    }

    const createPost = async (title, text) => {
        try {
            console.log(creds.uname)
            const check = await fetch("http://localhost:5000/subgreddiits/createpost", {
                method: 'POST',
                body: JSON.stringify({'title': title, 'uname': creds.uname, 'text': text}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
            await check.json();
    
            if (!check.ok) console.log("could not create post")
            else getAllPosts();
    
            } catch (error) {
            console.error(error);
            }
    }

    const getAllPosts = async () => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/getallposts", {
                method: 'POST',
                body: JSON.stringify({'title': title, 'uname': creds.uname}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
    
            if (!check.ok) console.log("could not get posts")
            const arr = await check.json()
            setPostList(arr);
    
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
            getAllPosts()
    
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
            getAllPosts()
    
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
            getAllPosts()
    
            } catch (error) {
            console.error(error);
            }
    }

    const changeHandler = (val) => {
        setBodyText(val.target.value)
    }

    useEffect(() => {
        getCreds();
    }, [])

    useEffect(() => {
        if (creds.uname!=="" && title)
        {
            checkSubG(title)
            checkJoin(title)
        }
    }, [title, creds])

    useEffect(() => {
        if (currentsubg !== "")
            getAllPosts()
    }, [currentsubg])

    useEffect(() => {
        if (Array.isArray(postlist))
            setPostPrintList(postlist.map((post) => (
                <Card sx={{maxWidth: 400, ml: 2, mt: 2}}>
                    <CardContent>
                        <Typography variant="h3">{post.text}</Typography>
                        <Typography variant="h5">Posted By: {post.user}</Typography>
                        <Typography variant="h5">Upvotes: {post.upvotes.length}</Typography>
                        <Typography variant="h5">Downvotes: {post.downvotes.length}</Typography>
                        {/* <Typography variant="h5">Description: {subg.desc}</Typography>
                        <Typography variant="h6">Followers: {subg.followers.length}</Typography>
                        <Typography variant="h6">No. of Posts: {subg.posts.length}</Typography>
                        <Typography variant="h6">Banned Keywords: {subg.banned.join(', ')}</Typography> */}
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => {upvotePost(post._id)}}>Upvote</Button>
                        <Button onClick={() => {downvotePost(post._id)}}>Downvote</Button>
                        <Button disabled={post.user === creds.uname} onClick={() => {followUser(post._id, post.user)}}>Follow User</Button>
                        <Button onClick={() => {}}>Save Post</Button>
                    </CardActions>
                    {/* <Button disabled={(subg.mod === creds.uname)} onClick={() => {leaveSubGreddiit(subg.title)}}>Leave</Button>
                    <Button sx={{ml: 8}} onClick={() => {viewSubGreddiit(subg.title)}}>View SubGreddiit</Button> */}
                    {(errorstate === 1 && errorpost === post._id) ? <Alert onClose={() => {setErrorState(0); setErrorText(""); getAllPosts()}} variant='filled' severity='error'>{errortext}</Alert> : <></>}
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
                <Button type="submit" variant="contained" sx={{alignItems: 'center', mt: 1, height: 30, width: 80}} onClick={() => {localStorage.clear(); setCreds({uname: "", passwd: "", fname: "", lname: "", email: "", age: "", contact: "", passwd2: ""}); setButtonFlag(1)}}>Logout</Button>
            </Box>
            {/* <Box sx={{display: 'flex', flexDirection: 'column', mt: 5, alignItems: 'center'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Typography variant="h2">Welcome to Greddiit !!</Typography>
                </Box>
            </Box> */}
            {/* add stuff here */}
            <Box sx={{display: 'flex', flexDirection: 'row', border: 'black', borderWidth: 1, overflow: 'hidden'}}>
                <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, alignItems: 'center', width: '50%'}}>
                    {/* <Avatar src={subgimage} variant="square" style={{width: '50%', height: 716, position: 'unset'}}>
                    <Typography variant="h2">{currentsubg.title}</Typography>
                    <Typography variant="h4">{currentsubg.desc}</Typography>
                    </Avatar> */}
                    <Typography variant="h2" color='black' backgroundColor='orange' sx={{borderRadius: 1, p: 0.5, mt: 1}}>Name: {currentsubg.title}</Typography>
                    <Typography variant="h5" color='black' backgroundColor='orange' sx={{borderRadius: 1, p: 0.5, mt: 1}}>Description: {currentsubg.desc}</Typography>
                    <Card style={{height: '572px', width: '100%', alignItems: 'center'}} sx={{mt: 1}}>
                        <CardMedia style={{height: '572px', width: '100%'}} component='img' image={subgimage} alt='DP'/>
                        {/* <Typography variant="h4" position='absolute'>{currentsubg.desc}</Typography> */}
                    </Card>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, alignItems: 'center', width: '50%', overflow: 'hidden', overflowY: 'scroll'}}>
                    <Button type="submit" variant="contained" sx={{mt: 7}} onClick={() => {setPostFlag(true)}}>Add Post</Button>
                    <Modal sx={{height: '50%', width: '50%', mt: '20%', ml: '20%', alignItems: 'center'}} open={postflag} onClose={() => {setPostFlag(false);}}>
                        <Box sx={{backgroundColor: 'white', alignContent: 'center', borderRadius: 5}}>
                            {/* <Typography variant="h3" sx={{ml: 2}}>Form</Typography>
                            <TextField required autoFocus name='title' label='Title' type='text' value={values.title} onChange={changeHandler} sx={{width:150}}/>
                            <TextField required name='desc' label='Description' type='text' value={values.desc} onChange={changeHandler} sx={{ml: 2, width:150}}/>
                            <TextField name='tags' label='Tags' type='text' value={values.tags} onChange={changeHandler} sx={{ml: 2, width:150}}/>
                            <TextField name='banned' label='Banned Keywords' type='text' value={values.banned} onChange={changeHandler} sx={{mt: 2, width:200}}/>
                            <Button type='submit' variant='contained' disabled={checkEmpty()} onClick={submitForm} name='submitform' sx={{mt: 3, ml: 2}}>Submit</Button>
                            { errorState === 1 ? <Alert onClose={() => {setErrorState(0)}} variant='filled' severity='success' sx={{mt: 2}}>SubGreddiit created successfully!</Alert> : <></> }
                            { errorState === 2 ? <Alert onClose={() => {setErrorState(0)}} variant='filled' severity='error' sx={{mt: 2}}>{errortext}</Alert> : <></> } */}
                            <Typography variant="h1" sx={{ml: 2}}>Create Post</Typography>
                            <TextField required autoFocus multiline maxRows={4} name='text' label='Text' type='text' value={bodytext} onChange={changeHandler} sx={{width: 600, height: 150, ml: 5}}/>
                            <Button type='submit' variant='contained' disabled={(bodytext === "")} onClick={() => {createPost(title, bodytext)}} name='submitpost' sx={{mb: 2, ml: 35}}>Submit</Button>
                        </Box>
                    </Modal>
                    <ul>
                        {postprintlist}
                    </ul>
                </Box>
            </Box>
        </>
    )
}

export default OpenSubGreddiit;