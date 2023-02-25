import React, { useState } from 'react';
import { Alert, Avatar, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import logo from './logo.png'

function SignUp({loginstatus, setLoginStatus, creds, setCreds, setSignFlag}) {
  const [errortext, setErrorText] = useState("Error 500");
  const emptyvalues = () => {
    if (creds.uname.length === 0 || creds.passwd.length === 0 || creds.fname.length === 0 || creds.lname.length === 0 || creds.email.length === 0 || creds.age.length === 0 || creds.contact.length === 0 || creds.passwd2.length === 0)
      return true;
  }

  const changeHandler = (cred) => {
      if (cred.target.name === 'contact' || cred.target.name === 'age')
      {
        if (!isNaN(cred.target.value))
        {
          setCreds({...creds, [cred.target.name]: cred.target.value.trim()})
        }
      }
      else
      {
        setCreds({...creds, [cred.target.name]: cred.target.value.trim()})
      }
    }
  const correctPassword = () => {
    if (creds.passwd !== creds.passwd2 && creds.passwd.length !== 0 && creds.passwd2.length !==0)
      return false;
    else return true;
  }

  const signupHandler = async (e) => {
    e.preventDefault();

    const signupcreds = {'name': {'fname': creds.fname, 'lname': creds.lname}, 'uname': creds.uname, 'email': creds.email, 'age': creds.age, 'contact': creds.contact, 'passwd': creds.passwd};
    try {
      const sendCreds = await fetch("http://localhost:5000/signup", {
        method: 'POST',
        body: JSON.stringify(signupcreds),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const err = await sendCreds.json()
      setErrorText(err.error);

      if (sendCreds.ok) {
        console.log("Signed up successfully!");
        setLoginStatus(-4);
        setCreds({uname: "", passwd: "", fname: "", lname: "", age: "", contact: "", email: "", passwd2: ""});
      }
      else {
        console.error("Error in signup")
        setLoginStatus(-1);
      }
    } catch (error) {
      console.error(error);
      setLoginStatus(-1);
    }
  }

  return (
    <>
      <Box sx={
        {display: 'flex', flexDirection: 'column', alignItems: 'center', p:10}
      }>
        <Avatar variant='rounded' src={logo} style={{width: 200, height: 200}} />
        <Typography component='h1' variant='h4' sx={{mt: 2}}>SIGN UP</Typography>
        <Box component='form' onSubmit={signupHandler} sx={{p:1}}>
          <TextField required autoFocus name='fname' label='First Name' type='text' value={creds.fname} onChange={changeHandler} sx={{width:150, mt: 2}} disabled={(loginstatus === 1)?true:false}/>
          {/* <br></br> */}
          <TextField required name='lname' label='Last Name' type='text' value={creds.lname} onChange={changeHandler} sx={{width: 150, ml: 2, mt: 2}} disabled={(loginstatus === 1)?true:false}/>
          <br></br>
          <TextField required fullWidth name='uname' label='Username (unique)' type='text' value={creds.uname} onChange={changeHandler} sx={{mt: 2}} disabled={(loginstatus === 1)?true:false}/>
          <br></br>
          <TextField required name='email' helperText="Eg: xyz@greddiit.com" label='Email ID' type='email' value={creds.email} onChange={changeHandler} sx={{width: 320, mt: 2}} disabled={(loginstatus === 1)?true:false}/>
          <br></br>
          <TextField required name='age' label='Age' helperText="Note: 13+ only" type='num' inputProps = {{min: 13, max: 120, maxLength: 3}} value={creds.age} onChange={changeHandler} sx={{width: 120, mt: 2}} disabled={(loginstatus === 1)?true:false}/>
          {/* <br></br> */}
          <TextField required name='contact' label='Contact Number' type='tel' inputProps={{maxLength: 10}} value={creds.contact} onChange={changeHandler} sx={{width: 180, ml: 2, mt: 2}} disabled={(loginstatus === 1)?true:false}/>
          <br></br>
          <TextField required fullWidth name='passwd' label='Password' type='password' value={creds.passwd} onChange={changeHandler} sx={{mt: 2}} disabled={(loginstatus === 1)?true:false}/>
          <br></br>
          <TextField required fullWidth error={!correctPassword()} helperText={(!correctPassword())?"Passwords do not match!":""} name='passwd2' label='Confirm Password' type='password' value={creds.passwd2} onChange={changeHandler} sx={{mt: 2}} disabled={(loginstatus === 1)?true:false}/>
          <br></br>
          <Button type='submit' variant='contained' disabled={emptyvalues() || !correctPassword()} name='loginbutton' sx={{ml: 14, mt: 2}}>Submit</Button>
        </Box>
        <Button variant='text' name='signroutebutton' onClick={() => {setSignFlag(0); setLoginStatus(0)}} sx={{ml: 0, mt: 2}}>Already have an account? Click here to Login</Button>

        { loginstatus > 0 ? <CircularProgress color="success" sx={{mt: 2}}/> : <></>}
        { loginstatus === -4 ? <Alert onClose={() => {setLoginStatus(0)}} variant='filled' severity='success' sx={{mt: 2}}>You have signed up, please login with your credentials</Alert> : <></> }
        { loginstatus === -1 ? <Alert onClose={() => {setLoginStatus(0)}} variant='filled' severity='error' sx={{mt: 2}}>{errortext}</Alert> : <></> }
        { loginstatus === -2 ? <Alert onClose={() => {setLoginStatus(0)}} variant='filled' severity='error' sx={{mt: 2}}>Please log in to access your Profile Page</Alert> : <></> }
        { loginstatus === -3 ? <Alert onClose={() => {setLoginStatus(0)}} variant='filled' severity='success' sx={{mt: 2}}>You have been logged out successfully!</Alert> : <></> }
      </Box>
    </>
  );
}

export default SignUp;
