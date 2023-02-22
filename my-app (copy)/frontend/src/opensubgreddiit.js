import React, { useEffect, useState } from "react";
import { Alert, Avatar, Backdrop, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import logo from './logo.png'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedditIcon from '@mui/icons-material/Reddit';
import subgimage from './subg.jpg'
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import SaveIcon from '@mui/icons-material/Save';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentIcon from '@mui/icons-material/Comment';
import ReportIcon from '@mui/icons-material/Report';

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
    const [apiflag, setAPIFlag] = useState(1)
    const [commentflag, setCommentFlag] = useState(false);
    const [commentlist, setCommentList] = useState([])
    const [commenttext, setCommentText] = useState("")
    const [commentpostid, setCommentPostID] = useState("")
    const [commentprintlist, setCommentPrintList] = useState([])
    const [reportflag, setReportFlag] = useState(false);
    const [reporttext, setReportText] = useState("")
    const [reportpostid, setReportPostID] = useState("")

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
            const arr = await check.json();
            console.log(arr.error)
    
            if (!check.ok) console.log("could not create post")
            else
            {
                if (arr.error !== "")
                {
                    setErrorState(1)
                    setErrorText(arr.error)
                    setErrorPost("bannedkeywords")
                }
                else
                {
                    setErrorState(0)
                    setErrorText("")
                    setErrorPost("")
                }
                setAPIFlag(1)
                getAllPosts();
            }
    
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

    const savePost = async (postid) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/savepost", {
                method: 'POST',
                body: JSON.stringify({'postid': postid, 'uname': creds.uname}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
    
            const arr = await check.json()
            if (!check.ok){
                console.log("could not save")
                setErrorState(1)
                setErrorText(arr.error)
                setErrorPost(postid)
            }
            else
            {
                console.log("saved post")
                setErrorState(0)
                setErrorText("")
                setErrorPost("")
            }
            getAllPosts()
    
            } catch (error) {
            console.error(error);
            }
    }

    const viewComments = async (postid) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/posts/getcomments", {
                method: 'POST',
                body: JSON.stringify({'postid': postid}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
            console.log("hi")
    
            if (!check.ok) console.log("could not get comments")
            setCommentPostID(postid)
            const arr = await check.json()
            console.log(arr)
            setCommentList(arr);
            setCommentFlag(true);
    
            } catch (error) {
            console.error(error);
            }
    }

    const AddComment = async (postid, text) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/posts/addcomment", {
                method: 'POST',
                body: JSON.stringify({'postid': postid, 'text': text}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
    
            if (!check.ok) console.log("could not add comment")
            viewComments(postid)
            getAllPosts()
    
            } catch (error) {
            console.error(error);
            }
    }

    const addReport = async (postid, text) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/posts/addreport", {
                method: 'POST',
                body: JSON.stringify({'postid': postid, 'text': text}),
                headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
                }
            })
    
            if (!check.ok) console.log("could not add report")
            else console.log("added report")
            setReportFlag(false)
            // viewComments(postid)
    
            } catch (error) {
            console.error(error);
            }
    }


    const changeHandler = (val) => {
        setBodyText(val.target.value)
    }

    const commentChange = (val) => {
        setCommentText(val.target.value)
    }

    const reportChange = (val) => {
        setReportText(val.target.value)
    }

    useEffect(() => {
        getCreds();
    }, [])

    useEffect(() => {
        if (creds.uname!=="" && title)
        {
            setAPIFlag(1)
            checkSubG(title)
            checkJoin(title)
        }
    }, [title, creds])

    useEffect(() => {
        if (currentsubg !== "")
            getAllPosts()
    }, [currentsubg])

    useEffect(() => {
        console.log(commentlist)
        if (Array.isArray(commentlist))
        {
            setCommentPrintList(commentlist.map((comment) => (
                <li>
                    <Typography sx={{ml: 5}} variant="body1">{comment.text}</Typography>
                    <Typography sx={{ml: 5}} variant="body2">Posted By: {comment.user}</Typography>
                    <br></br>
                </li>
            )))
        }
    }, [commentlist])

    useEffect(() => {
        if (Array.isArray(postlist))
            setPostPrintList(postlist.map((post) => (
                <Card sx={{maxWidth: 500, ml: 2, mt: 2}}>
                    <CardContent>
                        <Typography variant='body1' style={{whiteSpace: 'break-spaces'}}>{post.text}</Typography>
                        <br></br>
                        <Typography variant='body2'>Posted By: {post.user}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => {setAPIFlag(1); upvotePost(post._id)}}><ArrowUpwardIcon/>{post.upvotes.length}</Button>
                        <Button onClick={() => {setAPIFlag(1); downvotePost(post._id)}}><ArrowDownwardIcon/>{post.downvotes.length}</Button>
                        <Button onClick={() => {viewComments(post._id)}}><CommentIcon/>{post.comments.length}</Button>
                        <Button onClick={() => {setReportFlag(true); setReportPostID(post._id)}}><ReportIcon/></Button>
                        <Button disabled={post.user === creds.uname} onClick={() => {setAPIFlag(1); followUser(post._id, post.user)}}><PersonAddIcon/></Button>
                        <Button onClick={() => {setAPIFlag(1); savePost(post._id)}}><SaveIcon/></Button>
                    </CardActions>
                    {(errorstate === 1 && errorpost === post._id) ? <Alert onClose={() => {setErrorState(0); setAPIFlag(1); setErrorText(""); getAllPosts()}} variant='filled' severity='error'>{errortext}</Alert> : <></>}
                </Card>
            )))
    }, [postlist])

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
                <IconButton sx={{display: 'flex', flexDirection: 'column'}} onClick={() => navigate("/savedposts")}>
                    <BookmarksIcon sx={{fontSize: 40, color: 'yellow'}}/>
                </IconButton>
                <Button type="submit" variant="contained" sx={{alignItems: 'center', mt: 1, height: 40, width: 100}} onClick={() => {localStorage.clear(); setCreds({uname: "", passwd: "", fname: "", lname: "", email: "", age: "", contact: "", passwd2: ""}); setButtonFlag(1)}}>Logout<LogoutIcon/></Button>
            </Box>
            {/* add stuff here */}
            <Box sx={{display: 'flex', flexDirection: 'row', border: 'black', borderWidth: 1}}>
                <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, alignItems: 'center', width: '50%'}}>
                    <Typography variant="h2" color='black' backgroundColor='orange' sx={{borderRadius: 1, p: 0.5, mt: 1}}>Name: {currentsubg.title}</Typography>
                    <Typography variant="body2" color='black' backgroundColor='orange' sx={{borderRadius: 1, p: 0.5, mt: 1}} style={{whiteSpace: 'break-spaces'}}>Description:<br></br>{currentsubg.desc}</Typography>
                    <Card style={{height: '572px', width: '100%', alignItems: 'center'}} sx={{mt: 1}}>
                        <CardMedia style={{height: '572px', width: '100%'}} component='img' image={subgimage} alt='DP'/>
                    </Card>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, alignItems: 'center', width: '50%', maxHeight: '710px', overflow: 'auto'}}>
                    <Button type="submit" variant="contained" sx={{mt: 7}} onClick={() => {setPostFlag(true)}}>Add Post</Button>
                    <Modal sx={{height: '50%', width: '50%', mt: '20%', ml: '20%', alignItems: 'center'}} open={postflag} onClose={() => {setPostFlag(false);}}>
                        <Box sx={{backgroundColor: 'white', alignContent: 'center', borderRadius: 5}}>
                            <Typography variant="h1" sx={{ml: 2}}>Create Post</Typography>
                            <TextField required autoFocus multiline maxRows={4} name='text' label='Text' type='text' value={bodytext} onChange={changeHandler} sx={{width: 600, height: 150, ml: 5}}/>
                            <Button type='submit' variant='contained' disabled={(bodytext === "")} onClick={() => {setPostFlag(false); createPost(title, bodytext)}} name='submitpost' sx={{mb: 2, ml: 35}}>Submit</Button>
                        </Box>
                    </Modal>
                    {(errorstate === 1 && errorpost === "bannedkeywords") ? <Alert onClose={() => {setErrorState(0); setErrorText(""); setErrorPost("");}} variant='filled' severity='error'>{errortext}</Alert> : <></>}
                    <ul>
                        {postprintlist}
                    </ul>
                    <Modal sx={{height: '50%', width: '50%', mt: '20%', ml: '20%', alignItems: 'center', maxHeight: '310px', overflow: 'auto'}} open={commentflag} onClose={() => {setCommentFlag(false);}}>
                        <Box sx={{backgroundColor: 'white', alignContent: 'center', borderRadius: 5}}>
                            <Typography variant="h1" sx={{ml: 2}}>Comments</Typography>
                            {commentprintlist}
                            <TextField autoFocus name="comment" label='Add Comment' type='text' value={commenttext} onChange={commentChange} sx={{width: 600, height: 80, ml: 5}}/>
                            <Button type='submit' variant='contained' disabled={(commenttext === "")} onClick={() => {AddComment(commentpostid, commenttext); setCommentFlag(0); setCommentText(""); setAPIFlag(1); getAllPosts()}} name='submitcomment' sx={{mb: 2, ml: 5}}><AddCommentIcon/></Button>
                        </Box>
                    </Modal>
                    <Modal sx={{height: '50%', width: '50%', mt: '20%', ml: '20%', alignItems: 'center', maxHeight: '310px', overflow: 'auto'}} open={reportflag} onClose={() => {setReportFlag(false);}}>
                        <Box sx={{backgroundColor: 'white', alignContent: 'center', borderRadius: 5}}>
                            <Typography variant="h1" sx={{ml: 2}}>Add Report</Typography>
                            <TextField autoFocus name="comment" label='Add Report' type='text' value={reporttext} onChange={reportChange} sx={{width: 600, height: 80, ml: 5}}/>
                            <Button type='submit' variant='contained' disabled={(reporttext === "")} onClick={() => {addReport(reportpostid, reporttext); setReportFlag(false); setReportText(""); setAPIFlag(1); getAllPosts()}} name='submitreport' sx={{mb: 2, ml: 5}}><AddCommentIcon/></Button>
                        </Box>
                    </Modal>
                    <Backdrop open={apiflag} onClose={() => setAPIFlag(0)}>
                        <CircularProgress/>
                    </Backdrop>
                </Box>
            </Box>
        </>
    )
}

export default OpenSubGreddiit;