import ImprovedCard from "../Components/ImprovedCard";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const Time = () => {
  return (
    <ImprovedCard
          title="Time" description={`${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`}
          buttonColor="blue"  color="white" 
          buttonText="Update Time from This Device"
          icon={<AccessTimeFilledIcon sx={{ fontSize: 40 }}/>}
    />

  )  
};

export default Time;