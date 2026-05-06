import { useEffect, useState } from "react";
import ImprovedCard from "../Components/ImprovedCard";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { STA_IP, STA_MODE } from "../App";
import LoadingElement from "../Components/Loading";
import { getClosestTaskString, getRelativeTimeString } from "./Tasks";

interface FormattedTimestamp {
  days: number,
  hours: number,
  minutes: number,
}

interface Uptime {
  uptime: string
}

const Uptime = ({uptime, setUptime}) => {
  const GetFormattedTimestamp = (timestamp): FormattedTimestamp => {
    const t1 = new Date().getTime();
    const t2 = timestamp;

    var diff = Math.abs(t1-t2);
    const zile = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= zile * (1000 * 60 * 60 * 24);

    const ore = Math.floor(diff / (1000 * 60 * 60));
    diff -= ore * (1000 * 60 * 60);

    const minute = Math.floor(diff / (1000 * 60));
    return {days: zile, hours: ore, minutes: minute};
  };

  // seconds
const GetFormattedString = (since: number) => {
    const ft = GetFormattedTimestamp(since*1000);
    let parts: string[] = [];

    if (ft.days > 0) parts.push(`${ft.days} days`);
    if (ft.hours > 0) parts.push(`${ft.hours} hours`);
    if (ft.minutes > 0) parts.push(`${ft.minutes} minutes`);
    const formattedParts = parts.map((part, index) => {
      if (index === parts.length - 1) return part; 
      return part.replace(/\b(\w+s)\b/gi, '$1,');   
    });

    return formattedParts.join(" ");
  };

  const [loaded, setLoaded] = useState<boolean>(STA_MODE ? true : false);
  const [uptimeString, setUptimeString] = useState("");
  
  
  useEffect(() => {
    const fetchData = async() => {
      var request = `http://${STA_IP}/get_uptime`;
      await fetch(request)
        .then((response) => {
            if(!response.ok)
              throw new Error("ERROR fetching Uptime of esp32 Server.");

            return response.json();
        })
        .then((data: Uptime) => {
          setUptime(data);
          setLoaded(true);
        })
    }
    fetchData();

    const f = () => {setUptimeString(getRelativeTimeString(uptime));};
   
    f();
   
    const timer = setInterval(f, 1000*5);
    
    return () => {setUptime(0); clearInterval(timer);}
  }, []);

  return (
    <>
      {
        loaded
        ?
          <ImprovedCard
                title="Uptime" description={`${uptimeString}`}
                color="DarkTurquoise" 
                icon={<HourglassEmptyIcon sx={{ fontSize: 40 }}/>}
          />
        :
        <LoadingElement/>
      }
    </>
  )  
};

export default Uptime;