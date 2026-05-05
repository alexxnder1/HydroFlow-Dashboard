import ImprovedCard from "../Components/ImprovedCard";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

interface FormattedTimestamp {
  days: number,
  hours: number,
  minutes: number,
}

const Uptime = ({uptime}) => {
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

  return (
    <ImprovedCard
          title="Uptime" description={`${GetFormattedString(uptime)}`}
          color="DarkTurquoise" 
          icon={<HourglassEmptyIcon sx={{ fontSize: 40 }}/>}
    />

  )  
};

export default Uptime;