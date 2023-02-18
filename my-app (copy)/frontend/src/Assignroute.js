import Login from "./Login";
import SignUp from "./SignUp";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Assignroute ({loginstatus, setLoginStatus, creds, setCreds, jwt, setJWT}) {
    const [signFlag, setSignFlag] = useState(0);

    const navigate = useNavigate();
    console.log("loginstatus " + loginstatus);

    if (loginstatus === 1)
    {
        console.log("set "+loginstatus)
        navigate("/profile");
    }

    if (signFlag === 0)
    {
        return <Login loginstatus={loginstatus} setLoginStatus={setLoginStatus} creds={creds} setCreds={setCreds} setSignFlag={setSignFlag} jwt={jwt} setJWT={setJWT}/>
    }
    else
    {
        return <SignUp loginstatus={loginstatus} setLoginStatus={setLoginStatus} creds={creds} setCreds={setCreds} setSignFlag={setSignFlag}/>
    }
}

export default Assignroute;