import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Assignroute from './Assignroute';
import Profile from './Profile';
import MySubGreddiits from './mysubgreddiits';
import SubGreddiits from './subgreddiits';
import { BrowserRouter } from "react-router-dom";
import Dashboard from './Dashboard';
import OpenMySubGreddiit from './openmysubgreddiit';
import OpenSubGreddiit from './opensubgreddiit';
import SavedPosts from './savedposts';

function App() {

  const [loginstatus, setLoginStatus] = useState(parseInt(localStorage.getItem("loginstatus")));
  const [creds, setCreds] = useState({uname: '', passwd: '', fname: '', lname: '', age: '', contact: '', email: '', passwd2: ''});
  const [jwt, setJWT] = useState(localStorage.getItem("jwt"));

  useEffect(() => {
    localStorage.setItem("loginstatus", loginstatus);
  }, [loginstatus]);

  useEffect(() => {
    localStorage.setItem("jwt", jwt);
  }, [jwt]);

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Assignroute loginstatus={loginstatus} setLoginStatus={setLoginStatus} creds={creds} setCreds={setCreds} jwt={jwt} setJWT={setJWT}/>}/>
      <Route path='/profile' element={<Profile loginstatus={loginstatus} setLoginStatus={setLoginStatus} creds={creds} setCreds={setCreds}/>}/>
      <Route path='/dashboard' element={<Dashboard loginstatus={loginstatus} setLoginStatus={setLoginStatus} creds={creds} setCreds={setCreds}/>}/>
      <Route path='/mysubgreddiits' element={<MySubGreddiits loginstatus={loginstatus} setLoginStatus={setLoginStatus} creds={creds} setCreds={setCreds}/>}/>
      <Route path='/subgreddiits' element={<SubGreddiits loginstatus={loginstatus} setLoginStatus={setLoginStatus} creds={creds} setCreds={setCreds}/>}/>
      <Route path='/mysubgreddiits/:title' element={<OpenMySubGreddiit loginstatus={loginstatus} setLoginStatus={setLoginStatus} creds={creds} setCreds={setCreds}/>}/>
      <Route path='/subgreddiits/:title' element={<OpenSubGreddiit loginstatus={loginstatus} setLoginStatus={setLoginStatus} creds={creds} setCreds={setCreds}/>}/>
      <Route path='/savedposts' element={<SavedPosts loginstatus={loginstatus} setLoginStatus={setLoginStatus} creds={creds} setCreds={setCreds}/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
