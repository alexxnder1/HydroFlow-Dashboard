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
const formatUptime = (ms: number) => {
  const totalMinutes = Math.floor(ms / 1000 / 60);

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days} days`);
  if (hours > 0) parts.push(`${hours} hours`);
  if (minutes > 0) parts.push(`${minutes} minutes`);

  return parts.length > 0 ? parts.join(" ") : "0 minutes";
};
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
    var timer: any = null;
    const fetchData = async() => {
      var request = `http://${STA_IP}/get_uptime`;
      await fetch(request)
        .then((response) => {
            if(!response.ok)
              throw new Error("ERROR fetching Uptime of esp32 Server.");

            return response.json();
        })
        .then((data: Uptime) => {
          setUptime(data.uptime);
          setLoaded(true);
          setUptimeString(formatUptime(parseInt( data.uptime)));
        })
    }
    fetchData();
    timer = setInterval(fetchData, 1000*5);

    return () => {  setUptime(0); if(timer != null) clearInterval(timer);}
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