import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

function Slider({ name, flag }) {
  const [arr, setArr] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    try {
      fetch("https://picsum.photos/v2/list?page=2&limit=5")
        .then((response) => response.json())
        .then((data) => setArr(data));
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleNext = () => {
    if (arr.length - 1 === index) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };
  const handlePrev = () => {
    if (index === 0) {
      setIndex(arr.length - 1);
    } else {
      setIndex(index - 1);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => handleNext(), 200000);
    return () => {
      clearInterval(timer);
    };
  }, [arr, index]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      {flag && <Typography>{name}</Typography>}

      {arr.length !== 0 && (
        <>
          <Button variant="contained" onClick={handlePrev}>
            Prev
          </Button>
          {arr.map((image, ind) => (
            <img
              style={{
                width: "300px",
                height: "300px",
                margin: "10px 10px 0px 10px",
                display: index === ind ? "block" : "none",
              }}
              src={`${image?.download_url}`}
              alt="walpaper"
            />
          ))}
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </>
      )}
    </div>
  );
}

export default Slider;
