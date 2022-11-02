import React from 'react'
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import PropagateLoader from "react-spinners/PropagateLoader";
import FadeLoader from "react-spinners/FadeLoader";
import DotLoader from "react-spinners/DotLoader";
import PuffLoader from "react-spinners/PuffLoader";
import PulseLoader from "react-spinners/PulseLoader";



// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin-left: 50%;
  margin-top: 20%;
  width: 50%;
  justifyContent: 'center',
  alignItems:'center'
  border-color: red;
`;

function customPreLoader() {


  return (
 <div className="sweet-loading">
      <PuffLoader color="rgb(243,55,83)"  css={override} size={50} />
    </div>  
    )
}

export default customPreLoader