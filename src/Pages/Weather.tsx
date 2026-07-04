import ImprovedCard from "../Components/ImprovedCard";
import WeatherWidget from "../Components/WeatherWidget";
import CloudIcon from '@mui/icons-material/Cloud';

const Weather = () => {
  return (
      <ImprovedCard
          title="Vreme" description={""}
          content={<WeatherWidget/>}
          icon={<CloudIcon  sx={{fontSize: 40}}/>}
      />
  )
};

export default Weather;