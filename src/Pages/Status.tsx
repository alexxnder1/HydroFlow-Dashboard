
import ImprovedCard from "../Components/ImprovedCard";

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { getClosestTaskString } from "./Tasks";
import { useEffect, useState } from "react";

const Status = ({tasks, status, setStatus}) => {
  const [closestTaskString, setClosestTaskString] = useState("");
  
  useEffect(() => {
    const f = () => {setClosestTaskString(getClosestTaskString(tasks));};
   
    f();
   
    const timer = setInterval(f, 1000*5);
    
    return () => clearInterval(timer);
  });
  
  return (
    <ImprovedCard
    //  ${getClosestTaskString() ?? "null"}` : "Idle"}
          title="Status" description={status == true ? `Next task in ${closestTaskString}` : "Idle"}
          buttonColor={status == true ? "red" : "green"}  color={status == false ? "red" : "green"}  
          buttonText={status == false ? "Start" : "Idle"}
          onClick={() => setStatus(!status)}
          icon={status==false ? <CloseIcon sx={{ fontSize: 40 }}/> : <CheckIcon sx={{ fontSize: 40 }}/>}
    />

  )  
};

export default Status;
