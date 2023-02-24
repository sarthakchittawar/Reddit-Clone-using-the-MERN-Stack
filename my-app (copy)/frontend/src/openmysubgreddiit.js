import React, { useEffect, useState } from "react";
import { Alert, Avatar, Backdrop, BottomNavigation, BottomNavigationAction, Button, Card, CardActions, CardContent, CircularProgress, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import logo from './logo.png'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RedditIcon from '@mui/icons-material/Reddit';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ReportIcon from '@mui/icons-material/Report';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import LogoutIcon from '@mui/icons-material/Logout';

function OpenMySubGreddiit({loginstatus, setLoginStatus, creds, setCreds, navState, setNavState}) {
    
    const [buttonFlag, setButtonFlag] = useState(0);
    const [value, setValue] = useState(0);
    const [users, setUsers] = useState([]);
    const [bannedusers, setBannedUsers] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [bannedusersList, setBannedUsersList] = useState([]);
    const [requests, setRequests] = useState([]);
    const [requestsList, setRequestsList] = useState([]);
    const [reports, setReports] = useState([]);
    const [reportsList, setReportsList] = useState([]);
    const [reportsindex, setReportsIndex] = useState(0)
    const [reportid, setReportID] = useState("")
    const [blockflag, setBlockFlag] = useState(0)
    const [apiflag, setAPIFlag] = useState(1)
    const [disabledflag, setDisabledFlag] = useState(0)
    const [countdown, setCountdown] = useState(0)
    const [errorstate, setErrorState] = useState(0)
    const [errortext, setErrorText] = useState("Error 500");

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

    const title = parts[parts.length - 1].split('%20').join(' ');;

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
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem("jwt")
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

    const getreports = async (title) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/getreports", {
                method: 'POST',
                body: JSON.stringify({'title': title}),
                headers: {
                'Content-Type': 'application/json',
                "x-auth-token": localStorage.getItem("jwt")
                }
            })
            const arr = await check.json();
            console.log(arr)
            setAPIFlag(0)
            setReports(arr)
        
            } catch (error) {
            console.error(error);
            }
    }

    const setstatus = async (reportid, status) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/reports/setstatus", {
                method: 'POST',
                body: JSON.stringify({'reportid': reportid, 'status': status}),
                headers: {
                'Content-Type': 'application/json',
                "x-auth-token": localStorage.getItem("jwt")
                }
            })
            if (check.ok) console.log("Report Ignored")
            else console.log("Report could not be ignored")

            getreports(title)
        
            } catch (error) {
            console.error(error);
            }
    }

    const deletepost = async (reportid) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/reports/deletepost", {
                method: 'POST',
                body: JSON.stringify({'reportid': reportid}),
                headers: {
                'Content-Type': 'application/json',
                "x-auth-token": localStorage.getItem("jwt")
                }
            })
            const arr = check.json()
            if (check.ok)
            {
                console.log("Post deleted")
                setErrorState(0)
                setErrorText("")
            }
            else
            {
                console.log("Could not delete post")
                setErrorState(1)
                setErrorText(arr.error)
            }

            getreports(title)
        
            } catch (error) {
            console.error(error);
            }
    }

    const blockuser = async (reportid) => {
        try {
            const check = await fetch("http://localhost:5000/subgreddiits/reports/blockuser", {
                method: 'POST',
                body: JSON.stringify({'reportid': reportid}),
                headers: {
                'Content-Type': 'application/json',
                "x-auth-token": localStorage.getItem("jwt")
                }
            })
            const arr = await check.json()

            if (check.ok)
            {
                console.log("User blocked")
                setErrorState(0)
                setErrorText("")
            }
            else
            {
                console.log("User could not be blocked")
                setErrorState(1)
                setErrorText(arr.error)
            }

            getreports(title)
        
            } catch (error) {
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
        // const interval = setInterval(() => {
        //     if (countdown > 0 && blockflag === 1)
        //     {
        //         setCountdown(countdown - 1);
        //         getreports(title)
        //     }
        //     else if (blockflag === 1 && title !== "")
        //     {
        //         setBlockFlag(0)
        //         getreports(title)
        //         setCountdown(3)
        //     }
        //   }, 1000);
        //   return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        if (title !== "")
        {
            getusers(title);
            getreports(title);
            setBlockFlag(0)
            setDisabledFlag(0)
            setErrorState(0)
            setErrorText("")
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
        // console.log(requests)
        if (Array.isArray(requests))
            setRequestsList((requests).map((user) => <li>{user}<Button color='success' variant='contained' onClick={() => acceptRequest(user)}>Accept</Button><Button color='warning' variant='contained' onClick={() => rejectRequest(user)}>Reject</Button></li>))
    }, [requests])

    // useEffect(() => {
    //     console.log(blockflag)
    // }, [blockflag])

    useEffect(() => {
        if (countdown === 0 && title !== "")
        {
            if (blockflag === 1)
            {
                setAPIFlag(1)
                blockuser(reportid)
            }
            setBlockFlag(0)
            setDisabledFlag(0)
            getreports(title)
        }
        else if (blockflag === 1)
        {
            setTimeout(function () {
                setCountdown(countdown - 1)
                getreports(title)
            }, 1000)
        }

        // const interval = setInterval(() => {
        //     if (countdown > 0 && blockflag === 1)
        //     {
        //         setCountdown(countdown - 1);
        //         getreports(title)
        //     }
        //     else if (blockflag === 1 && title !== "")
        //     {
        //         setBlockFlag(0)
        //         getreports(title)
        //         setCountdown(3)
        //     }
        //   }, 1000);
        //   return () => clearInterval(interval);
    }, [countdown])

    useEffect(() => {
        // console.log(reports)
        if (Array.isArray(reports))
            setReportsList((reports).map((report) => 
            <Card sx={{maxWidth: 500, ml: 2, mt: 2}}>
                <CardContent>
                    <Typography variant="h6">Concern:</Typography>
                    <Typography sx={{overflow: 'scroll', textOverflow: 'clip'}} variant="body1" style={{whiteSpace: 'break-spaces'}}>{report.concern}</Typography>
                    <br></br>
                    <Typography sx={{overflow: 'scroll', textOverflow: 'clip'}} variant="h6">Post Text:</Typography>
                    <Typography variant="body1" style={{whiteSpace: 'break-spaces'}}>{report.post}</Typography>
                    <br></br>
                    <Typography variant="body2">Reported By: {report.reportedby}</Typography>
                    <Typography variant="body2">Reported User: {report.reporteduser}</Typography>
                </CardContent>
                <CardActions>
                    <Button variant='contained' disabled={report.status === 0 || (disabledflag === 1 && reportsindex !== reports.indexOf(report))} onClick={() => {setAPIFlag(1); setBlockFlag((blockflag+1)%2); setDisabledFlag((disabledflag+1)%2); setReportsIndex(reports.indexOf(report)); getreports(title); if (blockflag === 0 && reportsindex === reports.indexOf(report)){ setReportID(report._id); setCountdown(3); console.log(countdown) }}} color='error'>{(blockflag === 1 && reportsindex === reports.indexOf(report))?<>Cancel In {countdown} secs</>:<>Block User</>}</Button>
                    <Button variant='contained' disabled={report.status === 0 || disabledflag === 1} onClick={() => {setAPIFlag(1); deletepost(report._id)}} color='warning'>Delete Post</Button>
                    <Button variant='contained' disabled={report.status === 0 || disabledflag === 1} onClick={() => {setAPIFlag(1); setstatus(report._id, 0)}} color='success'>Ignore</Button>
                </CardActions>
                {(errorstate === 1 && reportid === report._id) ? <Alert onClose={() => {setErrorState(0); setAPIFlag(1); setErrorText(""); getreports(title)}} variant='filled' severity='error'>{errortext}</Alert> : <></>}
            </Card>
))
    }, [reports])

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
                <IconButton sx={{display: 'flex', flexDirection: 'column'}} onClick={() => navigate("/savedposts")}>
                    <BookmarksIcon sx={{fontSize: 40, color: 'yellow'}}/>
                </IconButton>
                <Button type="submit" variant="contained" sx={{alignItems: 'center', mt: 1, height: 40, width: 100}} onClick={() => {localStorage.clear(); setCreds({uname: "", passwd: "", fname: "", lname: "", email: "", age: "", contact: "", passwd2: ""}); setButtonFlag(1)}}>Logout<LogoutIcon/></Button>
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
            {(value === 3) ? (<Box>
                <ul>
                    {reportsList}
                </ul>
            </Box>) : <></>}
            {(value === 3 && reports.length === 0)?(<Box><Typography variant='h4'>You have no reports</Typography></Box>):<></>}

            <Backdrop open={apiflag} onClose={() => setAPIFlag(0)}>
                <CircularProgress/>
            </Backdrop>
        </>
    )
}

export default OpenMySubGreddiit;