import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Slider from "../Slider/Slider";

function InputFiled() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [flag, setflag] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    setflag(true);
  };

  useEffect(()=>{
    if(name==="" || email === "") setflag(false)
  },[name,email])

  return (
    <div>
      <form>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <Button onClick={handleClick}> Submit</Button>
      </form>
      <Slider name={name} flag={flag}/>
    </div>
  );
}

export default InputFiled;
