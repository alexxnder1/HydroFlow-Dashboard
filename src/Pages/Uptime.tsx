import ImprovedCard from "../Components/ImprovedCard";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const Uptime = ({uptime}) => {
  return (
    <ImprovedCard
          title="Uptime" description={"to be added"}
          color="DarkTurquoise" 
          icon={<HourglassEmptyIcon sx={{ fontSize: 40 }}/>}
    />

  )  
};

export default Uptime;