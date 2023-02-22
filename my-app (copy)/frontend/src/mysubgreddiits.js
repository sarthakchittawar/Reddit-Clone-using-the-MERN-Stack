import React, { useEffect, useState } from "react";
import { Alert, Avatar, Button, Card, CardActions, CardContent, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import logo from './logo.png'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedditIcon from '@mui/icons-material/Reddit';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';

function MySubGreddiits({loginstatus, setLoginStatus, creds, setCreds, navState, setNavState}) {
    
    const [buttonFlag, setButtonFlag] = useState(0);
    const [newflag, setNewFlag] = useState(false);
    const [values, setValues] = useState({title: "", desc: "", tags: "", banned: ""});
    const [subGreddiits, setSubGreddiits] = useState([]);
    const [subGreddiitsArray, setSubGreddiitsArray] = useState([]);
    const [errortext, setErrorText] = useState("Error 500");
    const [errorState, setErrorState] = useState(0);

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
        setValues({...values, [val.target.name]: val.target.value})
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

    const submitForm = async (e) => {
        e.preventDefault();
        const formvalues = {'title': values.title, 'desc': values.desc, 'mod': creds.uname, 'tags': values.tags, 'banned': values.banned}
        try {
        const sendValues = await fetch("http://localhost:5000/createsubgreddiit", {
            method: 'POST',
            body: JSON.stringify(formvalues),
            headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem("jwt")
            }
        })

        const arr = await sendValues.json();
        setErrorText(arr.error);

        if (sendValues.ok) {
            console.log("SubGreddiit created successfully!");
            setErrorState(1);
        }
        else {
            console.error("Error in creation of SubGreddiit")
            setErrorState(2);
        }
        await getSubGreddits();
        } catch (error) {
        console.error(error);
        }
    }

    const getSubGreddits = async () => {
        try {
        const sendValues = await fetch("http://localhost:5000/getsubgreddiits", {
            method: 'POST',
            body: JSON.stringify({'mod': creds.uname}),
            headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem("jwt")
            }
        })
        const arr = await sendValues.json();
        setSubGreddiits(arr);

        if (!sendValues.ok) setErrorState(2);

        } catch (error) {
        console.error(error);
        }
    }

    const deleteSubGreddiit = async (title) => {
        try {
        await fetch("http://localhost:5000/deletesubgreddiit", {
            method: 'POST',
            body: JSON.stringify({'mod': creds.uname, 'title': title}),
            headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem("jwt")
            }
        })
        getSubGreddits();

        } catch (error) {
        console.error(error);
        }
    }

    const viewSubGreddiit = (title) => {
        navigate(`/mysubgreddiits/${title}`);
    }

    const checkEmpty = () => {
        if (values.title === "" || values.desc === "") return true;
        return false;
    }

    useEffect(() => {
        if (Array.isArray(subGreddiits))
        {
            setSubGreddiitsArray(subGreddiits.map((subg) => (
                <Card sx={{maxWidth: 400, ml: 2, mt: 2}}>
                    <CardContent>
                        <Typography variant="h3">Title: {subg.title}</Typography>
                        <Typography variant="body1" style={{whiteSpace: 'break-spaces'}}>Description:<br/>{subg.desc}</Typography>
                        <Typography variant="h6">Followers: {subg.followers.length}</Typography>
                        <Typography variant="h6">No. of Posts: {subg.posts.length}</Typography>
                        <Typography variant="h6">Banned Keywords: {subg.banned.join(', ')}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => {viewSubGreddiit(subg.title)}}>View</Button>
                        <Button onClick={() => {deleteSubGreddiit(subg.title)}}><DeleteIcon/></Button>
                    </CardActions>
                </Card>
            )))
        }
    }, [subGreddiits])

    useEffect(() => {
        getCreds();
    }, [])

    useEffect(() => {
        getSubGreddits();
    }, [creds])

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
            <Box>
                <Button onClick={() => setNewFlag(true)} sx={{ml: 2}} variant='contained'>Make a new SubGreddiit</Button>
                <Modal sx={{height: 500, width: 500, ml: 50, mt: 30, alignContent: 'center'}} open={newflag} onClose={() => {setNewFlag(false); setErrorState(0)}}>
                    <Box sx={{backgroundColor: 'white', alignContent: 'center', borderRadius: 5}}>
                        <Typography variant="h3" sx={{ml: 2}}>Form</Typography>
                        <TextField required autoFocus name='title' label='Title' type='text' value={values.title} onChange={changeHandler} sx={{width:150}}/>
                        <TextField required multiline maxRows={4} name='desc' label='Description' type='text' value={values.desc} onChange={changeHandler} sx={{ml: 2, width:150}}/>
                        <TextField name='tags' label='Tags' type='text' value={values.tags} onChange={changeHandler} sx={{ml: 2, width:150}}/>
                        <TextField name='banned' label='Banned Keywords' type='text' value={values.banned} onChange={changeHandler} sx={{mt: 2, width:200}}/>
                        <Button type='submit' variant='contained' disabled={checkEmpty()} onClick={submitForm} name='submitform' sx={{mt: 3, ml: 2}}>Submit</Button>
                        { errorState === 1 ? <Alert onClose={() => {setErrorState(0)}} variant='filled' severity='success' sx={{mt: 2}}>SubGreddiit created successfully!</Alert> : <></> }
                        { errorState === 2 ? <Alert onClose={() => {setErrorState(0)}} variant='filled' severity='error' sx={{mt: 2}}>{errortext}</Alert> : <></> }
                    </Box>
                </Modal>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    { subGreddiitsArray }
                    { (subGreddiitsArray.length === 0) ? <Typography variant="h4">You have no SubGreddiits</Typography> : <></> }
                </Box>
            </Box>
        </>
    )
}

export default MySubGreddiits;