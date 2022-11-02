import { Avatar } from "@mui/material";
import { useRef, useEffect } from "react";
import organogram from "./organogram";


import UserAvatar from "../images/avatar-001.png"
import "./organogram.css";
import { Tree, TreeNode } from "react-organizational-chart";
import config from "../config";
import request from "../handlers/request";
import { generateRandomAvatarOptions } from "../utils/avatar";
import { FaHeart } from "react-icons/fa";



function OrganogramComponent({ options, organogramData, setUserId, setShowBenchModal }) {
  const organogramRef = useRef(null);
 
  const jsuitesOrganogram = useRef(null);

 
  useEffect(() => {
    organogram(organogramRef.current, options, organogramData, UserAvatar, setUserId, setShowBenchModal);
  }, [options]);
 
  return <div ref={organogramRef} />;
}


export default OrganogramComponent;
