import React, { useState } from 'react';
import { Alert, Avatar, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import logo from './logo.png'

function Login({loginstatus, setLoginStatus, creds, setCreds, setSignFlag, jwt, setJWT}) {
  const [errortext, setErrorText] = useState("Error 500");
  console.log(creds);
  const emptyvalues = () => {
    if (creds.uname.length === 0 || creds.passwd.length === 0)
      return true;
  }

  const changeHandler = (cred) => {
      setCreds({...creds, [cred.target.name]: cred.target.value})
    }
  
  const loginHandler = async (e) => {
    e.preventDefault();
    const logincreds = {"uname": creds.uname, "passwd": creds.passwd};
    // const checkAuth = users.find(user => (user.uname === creds.uname && user.passwd === creds.passwd))
    try {
      const checkAuth = await fetch("http://localhost:5000/login", {
        method: 'POST',
        body: JSON.stringify(logincreds),
        headers: {
          "Content-Type": "application/json"
      }})
      console.log("checking auth");
      const data = await checkAuth.json()
      setErrorText(data.error);
      setJWT(data.token);

      if (checkAuth.ok)
      {
        console.log('logged in');
        // displaying loading bar and success box
        setLoginStatus(1);
      }
      else
      {
        console.log('invalid creds');
        // display error box
        setCreds({...creds, passwd: ""})
        setLoginStatus(-1);
      }
    }
    catch(error) {
      console.error(error);
    }
  }

  return (
    <>
      <Box sx={
        {display: 'flex', flexDirection: 'column', alignItems: 'center', p:10}
      }>
        <Avatar variant='rounded' src={logo} style={{width: 200, height: 200}} />
        <Typography component='h1' variant='h4' sx={{mt: 2}}>LOGIN</Typography>
        <Box component='form' onSubmit={loginHandler} sx={{p:1}}>
          <TextField required fullWidth autoFocus name='uname' label='Username (unique)' type='text' value={creds.uname} onChange={changeHandler} sx={{mt: 2}} disabled={(loginstatus === 1)?true:false}/>
          <br></br>
          <TextField required fullWidth name='passwd' label='Password' type='password' value={creds.passwd} onChange={changeHandler} sx={{mt: 2}} disabled={(loginstatus === 1)?true:false}/>
          <br></br>
          <Button type='submit' variant='contained' disabled={emptyvalues()} name='loginbutton' sx={{ml: 9, mt: 2}}>Submit</Button>
        </Box>
        <Button variant='text' name='signroutebutton' onClick={() => {setSignFlag(1); setLoginStatus(0)}} sx={{ml: 0, mt: 2}}>Don't have a Greddit account? Click here to create one</Button>
        { loginstatus > 0 ? <CircularProgress color="success" sx={{mt: 2}}/> : <></>}
        { loginstatus > 0 ? <Alert variant='filled' severity='success' sx={{mt: 2}}>You are logged in, taking you to your Dashboard...</Alert> : <></> }
        { loginstatus === -1 ? <Alert onClose={() => {setLoginStatus(0)}} variant='filled' severity='error' sx={{mt: 2}}>{errortext}</Alert> : <></> }
        { loginstatus === -2 ? <Alert onClose={() => {setLoginStatus(0)}} variant='filled' severity='error' sx={{mt: 2}}>Please log in to access your Profile Page</Alert> : <></> }
        { loginstatus === -3 ? <Alert onClose={() => {setLoginStatus(0)}} variant='filled' severity='success' sx={{mt: 2}}>You have been logged out successfully!</Alert> : <></> }
      </Box>
    </>
  );
}

export default Login;
