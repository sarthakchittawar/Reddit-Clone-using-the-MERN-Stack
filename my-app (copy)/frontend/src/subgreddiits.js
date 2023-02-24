import React, { useEffect, useState } from "react";
import { Alert, Avatar, Button, Card, CardContent, IconButton, InputAdornment, MenuItem, OutlinedInput, Radio, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import logo from './logo.png'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedditIcon from '@mui/icons-material/Reddit';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LogoutIcon from '@mui/icons-material/Logout';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Fuse from 'fuse.js'
import SearchIcon from '@mui/icons-material/Search';

function SubGreddiits({loginstatus, setLoginStatus, creds, setCreds}) {
    
    const [buttonFlag, setButtonFlag] = useState(0);
    const [searchtext, setSearchText] = useState("");
    const [searchjoinedlist, setSearchJoinedList] = useState([]);
    const [searchnotjoinedlist, setSearchNotJoinedList] = useState([]);
    const [tagsjoinedlist, setTagsJoinedList] = useState([]);
    const [tagsnotjoinedlist, setTagsNotJoinedList] = useState([]);
    const [joinedlist, setJoinedList] = useState([]);
    const [notjoinedlist, setNotJoinedList] = useState([]);
    const [joinedprintlist, setJoinedPrintList] = useState([]);
    const [notjoinedprintlist, setNotJoinedPrintList] = useState([]);
    const [leaveflag, setLeaveFlag] = useState(0)
    const [errorstate, setErrorState] = useState(0)
    const [errortext, setErrorText] = useState("Error 500");
    const [errorsubg, setErrorSubg] = useState("")
    const [personName, setPersonName] = React.useState([]);
    const [names, setNames] = useState([])
    const [searchflag, setSearchFlag] = useState(0)
    const [tagflag, setTagFlag] = useState(0)
    const [namesort, setNameSort] = useState(0)
    const [followersort, setFollowerSort] = useState(0)
    const [datesort, setDateSort] = useState(0)

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
            body: JSON.stringify({'search': "", 'uname': creds.uname}),
            headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem("jwt")
            }
        })
        const arr = await search.json();
        if (search.ok){
            const fuse1 = new Fuse(arr[0], {
                keys: ['title']
            })
            const res1 = fuse1.search(searchtext)
            const fuse2 = new Fuse(arr[1], {
                keys: ['title']
            })
            const res2 = fuse2.search(searchtext)
            
            var p1 = [], p2 = []
            for(var i=0; i<res1.length; i++)
            {
                p1.push(res1[i].item)
            }
            for(i=0; i<res2.length; i++)
            {
                p2.push(res2[i].item)
            }

            if (searchtext === "")
            {
                p1 = arr[0]
                p2 = arr[1]
            }
            
            setJoinedList(p1)
            setNotJoinedList(p2)
            setSearchJoinedList(p1)
            setSearchNotJoinedList(p2)
            setSearchFlag(1)
        }

        } catch (error) {
        console.error(error);
        }
    }

    const leaveSubGreddiit = async (title) => {
        try {
        await fetch("http://localhost:5000/subgreddiits/leave", {
            method: 'POST',
            body: JSON.stringify({'title': title, 'uname': creds.uname}),
            headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem("jwt")
            }
        })
        setLeaveFlag(1);

        } catch (error) {
        console.error(error);
        }
    }

    const viewSubGreddiit = (title) => {
        navigate(`/subgreddiits/${title}`);
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
        const arr = await request.json()
        if (request.ok){
            console.log("Requested to join");
            setErrorState(0)
            setErrorText("")
            setErrorSubg("")
        }
        else
        {
            console.log("Can't request to join")
            setErrorState(1)
            console.log(arr.error)
            setErrorText(arr.error)
            setErrorSubg(title)
        }

        } catch (error) {
        console.error(error);
        }
    }

    const getalltags = async () => {
        try {
            console.log("hi")
        const check = await fetch("http://localhost:5000/subgreddiits/getalltags", {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem("jwt")
            }
        })
        const arr = await check.json()
        if (check.ok)
        {
            console.log("got all tags")
            setNames(arr)
            
        }
        else
        {
            console.log("Could not get tags")
        }

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
        {
            search();
        }
    }, [creds])

    useEffect(() => {
        search()
    }, [searchtext])

    useEffect(() => {
        if (searchflag === 1)
        {
            getalltags()
            setPersonName([])
            setSearchFlag(0)
        }
    }, [searchflag])

    useEffect(() => {
        if (tagflag === 1 && personName.length !== 0)
        {
            var arr = personName
            var p= []
            var q= []
            for(var i=0; i<searchjoinedlist.length; i++)
            {
                for (var j=0; j<searchjoinedlist[i].tags.length; j++)
                {
                    
                    if (arr.includes(searchjoinedlist[i].tags[j]))
                    {
                        p.push(searchjoinedlist[i])
                        break;
                    }
                }
            }
            for(i=0; i<searchnotjoinedlist.length; i++)
            {
                for (j=0; j<searchnotjoinedlist[i].tags.length; j++)
                {
                    if (arr.includes(searchnotjoinedlist[i].tags[j]))
                    {
                        q.push(searchnotjoinedlist[i])
                        break;
                    }
                }
            }
            setTagsJoinedList(p)
            setTagsNotJoinedList(q)
            setJoinedList(p)
            setNotJoinedList(q)
            setTagFlag(0)
        }
        else if (tagflag === 1 && personName.length === 0)
        {
            setTagsJoinedList(searchjoinedlist)
            setTagsNotJoinedList(searchnotjoinedlist)
            setJoinedList(searchjoinedlist)
            setNotJoinedList(searchnotjoinedlist)
            setTagFlag(0)
        }
    }, [tagflag])

    function namecompare(a, b) {
        return a.title.localeCompare(b.title)
    }
    
    function followercompare(a, b) {
        return b.followers.length - a.followers.length
    }

    function datecompare(a, b) {
        return (b.date > a.date)
    }

    useEffect(() => {
        var list = tagsjoinedlist.slice()
        var list2 = tagsnotjoinedlist.slice()
        if (namesort !== 0)
        {
            // setFollowerSort(0)
            // setDateSort(0)
            list.sort(namecompare)
            list2.sort(namecompare)
            if (namesort === 2)
            {
                list.reverse()
                list2.reverse()
            }
        }
        if (followersort !== 0)
        {
            // setNameSort(0)
            // setDateSort(0)
            list.sort(followercompare)
            list2.sort(followercompare)
        }
        if (datesort !== 0)
        {
            // setNameSort(0)
            // setFollowerSort(0)
            list.sort(datecompare)
            list2.sort(datecompare)
        }
        // setJoinedList(list)
        // setNotJoinedList(list2)
        console.log(list)
        console.log(list2)

        if (Array.isArray(list))
            setJoinedPrintList(list.map((subg) => (
                <Card sx={{maxWidth: 400, ml: 2, mt: 2, borderRadius: 3, '&:hover': {backgroundColor: 'orangered'}}}>
                    <CardContent onClick={() => {viewSubGreddiit(subg.title)}} sx={{'&:hover': {cursor: 'pointer'}}}>
                        <Typography variant="h3">Title: {subg.title}</Typography>
                        <Typography variant="h5">Description: {subg.desc}</Typography>
                        <Typography variant="h6">Followers: {subg.followers.length}</Typography>
                        <Typography variant="h6">No. of Posts: {subg.posts.length}</Typography>
                        <Typography variant="h6">Banned Keywords: {subg.banned.join(', ')}</Typography>
                    </CardContent>
                    <Button disabled={(subg.mod === creds.uname)} onClick={() => {leaveSubGreddiit(subg.title)}}>Leave <ExitToAppIcon/></Button>
                    {/* <Button sx={{ml: 8}} onClick={() => {viewSubGreddiit(subg.title)}}>View</Button> */}
                </Card>
            )))

        if (Array.isArray(list2))
            setNotJoinedPrintList(notjoinedlist.map((subg) => (
                <Card sx={{maxWidth: 400, ml: 2, mt: 2}}>
                    <CardContent>
                        <Typography variant="h3">Title: {subg.title}</Typography>
                        <Typography variant="h5">Description: {subg.desc}</Typography>
                        <Typography variant="h6">Followers: {subg.followers.length}</Typography>
                        <Typography variant="h6">No. of Posts: {subg.posts.length}</Typography>
                        <Typography variant="h6">Banned Keywords: {subg.banned.join(', ')}</Typography>
                    </CardContent>
                    <Button onClick={() => {setErrorState(0);setErrorText("");setErrorSubg("");joinSubGreddiit(subg.title)}}>Request to Join</Button>
                    {/* <Button sx={{ml: 8}} onClick={() => {viewSubGreddiit(subg.title)}}>View SubGreddiit</Button> */}
                    {(errorstate === 1 && errorsubg === subg.title) ? <Alert onClose={() => {setErrorState(0); setErrorText("");}} variant='filled' severity='error'>{errortext}</Alert> : <></>}
                </Card>
            )))

    }, [namesort, followersort, datesort])

    useEffect(() => {
        console.log(personName)
        setTagFlag(1)
    }, [personName])

    useEffect(() => {
        if (Array.isArray(joinedlist))
            setJoinedPrintList(joinedlist.map((subg) => (
                <Card sx={{maxWidth: 400, ml: 2, mt: 2, borderRadius: 3, '&:hover': {backgroundColor: 'orangered'}}}>
                    <CardContent onClick={() => {viewSubGreddiit(subg.title)}} sx={{'&:hover': {cursor: 'pointer'}}}>
                        <Typography variant="h3">Title: {subg.title}</Typography>
                        <Typography variant="h5">Description: {subg.desc}</Typography>
                        <Typography variant="h6">Followers: {subg.followers.length}</Typography>
                        <Typography variant="h6">No. of Posts: {subg.posts.length}</Typography>
                        <Typography variant="h6">Banned Keywords: {subg.banned.join(', ')}</Typography>
                    </CardContent>
                    <Button disabled={(subg.mod === creds.uname)} onClick={() => {leaveSubGreddiit(subg.title)}}>Leave <ExitToAppIcon/></Button>
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
                    <Button onClick={() => {setErrorState(0);setErrorText("");setErrorSubg("");joinSubGreddiit(subg.title)}}>Request to Join</Button>
                    {/* <Button sx={{ml: 8}} onClick={() => {viewSubGreddiit(subg.title)}}>View SubGreddiit</Button> */}
                    {(errorstate === 1 && errorsubg === subg.title) ? <Alert onClose={() => {setErrorState(0); setErrorText("");}} variant='filled' severity='error'>{errortext}</Alert> : <></>}
                </Card>
            )))
    }, [notjoinedlist, errorstate])

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
    };

    // function getStyles(name, personName, theme) {
    //     return {
    //       fontWeight:
    //         personName.indexOf(name) === -1
    //           ? theme.typography.fontWeightRegular
    //           : theme.typography.fontWeightMedium,
    //     };
    //   }

    // const names = [
    //     'Oliver Hansen',
    //     'Van Henry',
    //     'April Tucker',
    //     'Ralph Hubbard',
    //     'Omar Alexander',
    //     'Carlos Abbott',
    //     'Miriam Wagner',
    //     'Bradley Wilkerson',
    //     'Virginia Andrews',
    //     'Kelly Snyder',
    //   ];

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setPersonName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };

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
            <Box>
                <TextField label='Search' name="searchtext" value={searchtext} type='text' onChange={changeHandler} InputProps={{endAdornment: (<InputAdornment position='end'><SearchIcon/></InputAdornment>)}}/>
                <Select label="Tags" sx={{ml: 5, width: 200}} multiple value={personName} onChange={handleChange} input={<OutlinedInput/>} renderValue={(s) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                        {s.map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
                >
                {names.map((name) => (
                    <MenuItem
                    key={name}
                    value={name}>{name}
                    {/* style={getStyles(name, personName, theme)} */}
                    </MenuItem>
                ))}
                </Select>
                <br></br>
                Sort by Name (None/Asc/Desc)
                <Radio onClick={() => {setNameSort(0); setFollowerSort(0); setDateSort(0)}} checked={namesort === 0}/>
                <Radio onClick={() => {setNameSort(1); setFollowerSort(0); setDateSort(0)}} checked={namesort === 1}/>
                <Radio onClick={() => {setNameSort(2); setFollowerSort(0); setDateSort(0)}} checked={namesort === 2}/>
                <br></br>
                Sort by number of Followers (None/Desc)
                <Radio onClick={() => {setFollowerSort(0); setNameSort(0); setDateSort(0)}} checked={followersort === 0}/>
                <Radio onClick={() => {setFollowerSort(1); setNameSort(0); setDateSort(0)}} checked={followersort === 1}/>
                <br></br>
                Sort by Creation Date (Latest on top)
                <Radio onClick={() => {setDateSort(0); setNameSort(0); setFollowerSort(0)}} checked={datesort === 0}/>
                <Radio onClick={() => {setDateSort(1); setNameSort(0); setFollowerSort(0)}} checked={datesort === 1}/>
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

export default SubGreddiits;