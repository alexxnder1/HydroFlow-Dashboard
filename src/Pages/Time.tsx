import { useEffect, useState } from "react";
import ImprovedCard from "../Components/ImprovedCard";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const Time = ({timestamp, setTimestamp}) => {
  useEffect(() => {
      const timer = setInterval(() => {
        setTimestamp(new Date());
      }, 1000*5);
      return () => clearInterval(timer);
  });
  
  return (
    <ImprovedCard
          title="Ora" description={`${String(timestamp.getHours()).padStart(2, "0")}:${String(timestamp.getMinutes()).padStart(2, "0")}`}
          color="white" 
          icon={<AccessTimeFilledIcon sx={{ fontSize: 40 }}/>}
    />

  )  
};

export default Time;