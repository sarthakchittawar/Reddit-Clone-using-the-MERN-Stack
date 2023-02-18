import { Alert, Avatar, Button, CircularProgress, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './logo.png'
import avatar from './avatar.png'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedditIcon from '@mui/icons-material/Reddit';

function Profile({loginstatus, setLoginStatus, creds, setCreds}) {
    const [buttonFlag, setButtonFlag] = useState(0);
    const [editFlag, setEditFlag] = useState(0);
    const [followerFlag, setFollowerFlag] = useState(false);
    const [followingFlag, setFollowingFlag] = useState(false);
    const [flag, setFlag] = useState(0);

    const [errortext, setErrorText] = useState("Error 500");
    const [errorState, setErrorState] = useState(0);
    const [userID, setUserID] = useState("");

    const [followerArray, setFollowerArray] = useState({});
    const [followers, setFollowers] = useState([]);
    const [numfollowers, setnumFollowers] = useState("");
    const [followingArray, setFollowingArray] = useState({});
    const [following, setFollowing] = useState([]);
    const [numfollowing, setnumFollowing] = useState("");
    const [followerlist, setFollowerList] = useState([]);
    const [followinglist, setFollowingList] = useState([]);

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

    const profileChange = async () => {
        const newcreds = {'_id': userID, 'name': {'fname': creds.fname, 'lname': creds.lname}, 'uname': creds.uname, 'email': creds.email, 'age': creds.age, 'contact': creds.contact};
        try {
            const sendCreds = await fetch("http://localhost:5000/editprofile", {
              method: 'POST',
              body: JSON.stringify(newcreds),
              headers: {
                'Content-Type': 'application/json',
                "x-auth-token": localStorage.getItem("jwt")
              }
            })
            const data = await sendCreds.json()
            setErrorText(data.error);
      
            if (sendCreds.ok) {
              console.log("Profile edited successfully!");
              setErrorState(1);
              return true;
            }
            else {
              console.error("Error in editing profile")
              setErrorState(2);
              getCreds();
              return false;
            }
          } catch (error) {
            console.error(error);
            setErrorState(2);
            return false;
          }
    }

    const editProfile = () => {
        if (editFlag === 1) return true;
        else return false;
    };

    const profileEdit = () => {console.log("edit"+editFlag)
        if (editFlag === 1)
        {
            profileChange()
        }
        setEditFlag((editFlag + 1)%2)
    }

    const getCreds = async () => {
        try {
            const checkAuth = await fetch("http://localhost:5000/getcreds", {
            method: 'GET',
            headers: {
            "x-auth-token": localStorage.getItem("jwt")
        }})
        const data = await checkAuth.json()
        await setCreds({fname: data[0].name.fname, lname: data[0].name.lname, uname: data[0].uname, email: data[0].email, age: data[0].age, contact: data[0].contact, passwd: data[0].passwd})
        setUserID(data[0]._id)
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        console.log(creds);
        if (creds.uname !== "" && flag === 0)
        {
            getFollowers();
            getFollowing();
            setFlag(1)
        }
    }, [creds])

    const changeHandler = (cred) => {
        if (cred.target.name === 'contact' || cred.target.name === 'age')
        {
          if (!isNaN(cred.target.value))
          {
            setCreds({...creds, [cred.target.name]: cred.target.value})
          }
        }
        else
          setCreds({...creds, [cred.target.name]: cred.target.value})
    }

    const checkEmpty = () => {
        if (creds.fname === "" || creds.lname === "" || creds.uname === "" || creds.email === "" || creds.contact === "" || creds.age === "") return true;
        return false;
    }

    const getFollowers = async () => {
        const uname = {"uname": creds.uname};
        try {
            console.log(uname)
            const followers = await fetch("http://localhost:5000/getfollowers", {
            method: 'POST',
            body: JSON.stringify(uname),
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("jwt")
        }})
        const data = await followers.json()
        setFollowerArray(data);
        }
        catch (error) {
            console.error(error);
        }
    }
    const getFollowing = async () => {
        const uname = {"uname": creds.uname};
        try {
            console.log(uname)
            const following = await fetch("http://localhost:5000/getfollowing", {
            method: 'POST',
            body: JSON.stringify(uname),
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("jwt")
        }})
        const data = await following.json()
        setFollowingArray(data);
        }
        catch (error) {
            console.error(error);
        }
    }
    const getuserfromfollowerID = async (i, array) => {
        const val = followerArray[i];
        console.log(val)
        try {
            const user = await fetch("http://localhost:5000/followeridtouname", {
            method: 'POST',
            body: JSON.stringify(val),
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("jwt")
        }})
        const data = await user.json()
        console.log("here")
        array.push(data.uname);
        setFollowers(array);
        setFollowerList(followers.map(follower => <li>{follower}<Button onClick={() => deleteFollower(follower)} variant='contained'>X</Button></li>))

        console.log(followerlist)
        }
        catch (error) {
            console.error(error);
        }
    }
    const getuserfromfollowingID = async (i, array) => {
        const val = followingArray[i];
        console.log(val)
        try {
            const user = await fetch("http://localhost:5000/followingidtouname", {
            method: 'POST',
            body: JSON.stringify(val),
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": localStorage.getItem("jwt")
        }})
        const data = await user.json()
        console.log("here")
        array.push(data.uname);
        setFollowing(array);
        setFollowingList(following.map(following => <li>{following}<Button onClick={() => deleteFollowing(following)} variant='contained'>X</Button></li>))
        console.log(following)
        }
        catch (error) {
            console.error(error);
        }
    }
    const deleteFollower = async (follower) => {
        const followerjson = {"funame": follower, "uname": creds.uname};
        try {
            await fetch("http://localhost:5000/deletefollower", {
                method: 'POST',
                body: JSON.stringify(followerjson),
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": localStorage.getItem("jwt")
                }
            })
            const index = followers.indexOf(follower);
            if (index > -1)
                followers.splice(index, 1);
            setFollowerList(followers.map(follower => <li>{follower}<Button onClick={() => deleteFollower(follower)} variant='contained'>X</Button></li>))
            setnumFollowers(followers.length)
        }
        catch (error) {
            console.error(error);
        }
    }

    const deleteFollowing = async (following1) => {
        const followingjson = {"uname": creds.uname, "funame": following1};
        try {
            await fetch("http://localhost:5000/deletefollowing", {
                method: 'POST',
                body: JSON.stringify(followingjson),
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": localStorage.getItem("jwt")
                }
            })
            const index = following.indexOf(following1);
            if (index > -1)
                following.splice(index, 1);
            setFollowingList(following.map(following => <li>{following}<Button onClick={() => deleteFollowing(following)} variant='contained'>X</Button></li>))
            setnumFollowing(following.length)
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCreds();
    }, [])
    useEffect ( () => {
        setnumFollowers(followerArray.length)
        for(var i=0; i<followerArray.length; i++)
        {
            getuserfromfollowerID(i, followers);
        }
    }, [followerArray]);
    useEffect ( () => {
        setnumFollowing(followingArray.length)
        for(var i=0; i<followingArray.length; i++)
        {
            getuserfromfollowingID(i, following);
        }
    }, [followingArray]);

    
    return(
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
            <Box justifyContent="space-around" sx={{display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', mt: 5, width: 1}}>
                <Box sx={{display: 'flex', flexDirection: 'row', ml: 2, mt: 0, alignItems: 'center', justifyContent: 'space-around', width: 1/3}}>
                    <Avatar variant="rounded" src={avatar} style={{width: 300, height: 500}}/>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', ml: 2, mt: 0, alignItems: 'center', justifyContent: 'space-around', width: 1/4}}>
                    <Box onClick={() => setFollowerFlag(true)} sx={{display: 'flex', flexDirection: 'column', mt: 0, alignItems: 'center', justifyContent: 'space-around', width: 1/2, backgroundColor: '#F44336', borderRadius: 5,'&:hover': {cursor: 'pointer', backgroundColor: '#ff7961', opacity: [0.9, 0.8, 0.7]}}}>
                        <Typography variant="h4" sx={{mt: 2}}>Followers</Typography>
                        <Typography variant="h2" sx={{mt: 0}}>{numfollowers}</Typography>
                    </Box>
                    <Modal sx={{height: 500, width: 500, ml: 50, mt: 30, alignContent: 'center'}} open={followerFlag} onClose={() => {setFollowerFlag(false)}}>
                        <Box sx={{backgroundColor: 'white', alignContent: 'center', borderRadius: 5}}>
                            <Typography variant="h3" sx={{ml: 2}}>Followers</Typography>
                            {
                                <ul>
                                    {followerlist}
                                </ul>
                            }
                            {(numfollowers === 0)?(<Typography variant="h5" sx={{ml:3}}>Lmao no followers</Typography>):<></>}
                            <br></br>
                        </Box>
                    </Modal>
                    {(flag === 0)?<CircularProgress color="success"></CircularProgress>:<></>}

                    <Box onClick={() => setFollowingFlag(true)} sx={{display: 'flex', flexDirection: 'column', mt: 0, alignItems: 'center', justifyContent: 'space-around', width: 1/2, backgroundColor: '#F44336', borderRadius: 5,'&:hover': {cursor: 'pointer', backgroundColor: '#ff7961', opacity: [0.9, 0.8, 0.7]}}}>
                        <Typography variant="h4" sx={{mt: 2}}>Following</Typography>
                        <Typography variant="h2" sx={{mt: 0}}>{numfollowing}</Typography>
                    </Box>
                    <Modal sx={{height: 500, width: 500, ml: 50, mt: 30, alignContent: 'center'}} open={followingFlag} onClose={() => {setFollowingFlag(false)}}>
                        <Box sx={{backgroundColor: 'white', alignContent: 'center', borderRadius: 5}}>
                            <Typography variant="h3" sx={{ml: 2}}>Following</Typography>
                            {
                                <ul>
                                    {followinglist}
                                </ul>
                            }
                            {(numfollowing === 0)?(<Typography variant="h5" sx={{ml:3}}>You don't follow anyone</Typography>):<></>}
                            <br></br>
                        </Box>
                    </Modal>
                    
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', ml: 2, mr: 0, mt: 0, alignItems: 'center', width: 1/3}}>
                    <Typography variant="h5" fontFamily='Roboto' sx={{mt: 0}}>My Profile</Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', mt: 4, alignItems: 'center'}}>
                        <TextField required autoFocus name='fname' label='First Name' type='text' value={creds.fname} onChange={changeHandler} disabled={!editProfile()} sx={{width:150}}/>
                        <TextField required name='lname' label='Last Name' type='text' value={creds.lname} onChange={changeHandler} disabled={!editProfile()} sx={{ml: 2, width:150}}/>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', mt: 2, alignItems: 'center'}}>
                        <TextField fullWidth required name='uname' label='Username (unique)' type='text' value={creds.uname} onChange={changeHandler} disabled={!editProfile()}/>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', mt: 2, alignItems: 'center'}}>
                        <TextField fullWidth required name='email' label='Email ID' type='email' value={creds.email} onChange={changeHandler} disabled={!editProfile()}/>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', mt: 2, alignItems: 'center'}}>
                        <TextField required name='age' label='Age' type='num' value={creds.age} onChange={changeHandler} disabled={!editProfile()} sx={{width:120}}/>
                        <TextField required name='contact' label='Contact' type='tel' value={creds.contact} onChange={changeHandler} disabled={!editProfile()} sx={{ml: 2, width:180}}/>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', mt: 5, alignItems: 'center'}}>
                        <Button type='submit' variant='contained' disabled={checkEmpty()} onClick={profileEdit} name='editprofile'>{(editFlag === 0) ? "Edit Profile" : "Save Profile"}</Button>
                    </Box>
                    <Box>
                    { errorState === 1 ? <Alert onClose={() => {setErrorState(0)}} variant='filled' severity='success' sx={{mt: 2}}>Profile edited successfully!</Alert> : <></> }
                    { errorState === 2 ? <Alert onClose={() => {setErrorState(0)}} variant='filled' severity='error' sx={{mt: 2}}>{errortext}</Alert> : <></> }
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Profile;