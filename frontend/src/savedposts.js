import React, { useEffect, useState } from "react";
import { Alert, Avatar, Backdrop, Button, Card, CardActions, CardContent, CircularProgress, IconButton, Modal, TextField, Typography } from "@mui/material";
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
import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentIcon from '@mui/icons-material/Comment';
import ReportIcon from '@mui/icons-material/Report';

function SavedPosts({loginstatus, setLoginStatus, creds, setCreds}) {
    
    const [buttonFlag, setButtonFlag] = useState(0);
    const [postlist, setPostList] = useState([])
    const [postprintlist, setPostPrintList] = useState([])
    const [errorstate, setErrorState] = useState(0)
    const [errortext, setErrorText] = useState("Error 500");
    const [errorpost, setErrorPost] = useState("")
    const [apiflag, setAPIFlag] = useState(0)
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
            getSavedPosts()
    
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
    
            } catch (error) {
            console.error(error);
            }
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
        if (creds.uname !== "")
            getSavedPosts()
    }, [creds])

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
                        <Typography variant='body2'>Posted In: {post.subgreddiit}</Typography>
                    </CardContent>
                    <CardActions>
                    <Button onClick={() => {setAPIFlag(1); upvotePost(post._id)}}><ArrowUpwardIcon/>{post.upvotes.length}</Button>
                    <Button onClick={() => {setAPIFlag(1); downvotePost(post._id)}}><ArrowDownwardIcon/>{post.downvotes.length}</Button>
                    <Button onClick={() => {viewComments(post._id)}}><CommentIcon/>{post.comments.length}</Button>
                    <Button onClick={() => {setReportFlag(true); setReportPostID(post._id)}}><ReportIcon/></Button>
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
            <Modal sx={{height: '50%', width: '50%', mt: '20%', ml: '20%', alignItems: 'center', maxHeight: '310px', overflow: 'auto'}} open={commentflag} onClose={() => {setCommentFlag(false);}}>
                <Box sx={{backgroundColor: 'white', alignContent: 'center', borderRadius: 5}}>
                    <Typography variant="h1" sx={{ml: 2}}>Comments</Typography>
                    {commentprintlist}
                    <TextField autoFocus name="comment" label='Add Comment' type='text' value={commenttext} onChange={commentChange} sx={{width: 600, height: 80, ml: 5}}/>
                    <Button type='submit' variant='contained' disabled={(commenttext === "")} onClick={() => {AddComment(commentpostid, commenttext); setCommentFlag(0); setCommentText(""); setAPIFlag(1); getSavedPosts()}} name='submitcomment' sx={{mb: 2, ml: 5}}><AddCommentIcon/></Button>
                </Box>
            </Modal>
            <Modal sx={{height: '50%', width: '50%', mt: '20%', ml: '20%', alignItems: 'center', maxHeight: '310px', overflow: 'auto'}} open={reportflag} onClose={() => {setReportFlag(false);}}>
                <Box sx={{backgroundColor: 'white', alignContent: 'center', borderRadius: 5}}>
                    <Typography variant="h1" sx={{ml: 2}}>Add Report</Typography>
                    <TextField autoFocus name="comment" label='Add Report' type='text' value={reporttext} onChange={reportChange} sx={{width: 600, height: 80, ml: 5}}/>
                    <Button type='submit' variant='contained' disabled={(reporttext === "")} onClick={() => {addReport(reportpostid, reporttext); setReportFlag(false); setReportText(""); setAPIFlag(1); getSavedPosts()}} name='submitreport' sx={{mb: 2, ml: 5}}><AddCommentIcon/></Button>
                </Box>
            </Modal>
            <Backdrop open={apiflag} onClose={() => setAPIFlag(0)}>
                <CircularProgress/>
            </Backdrop>
        </>
    )
}

export default SavedPosts;