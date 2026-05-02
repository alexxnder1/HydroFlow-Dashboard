import ImprovedCard from '../Components/ImprovedCard';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import {ResponsiveLine} from "@nivo/line"
import { graphTheme } from '../theme';

const Temperature = ({temp, data}) => {
  return (
  <ImprovedCard
    title="Temperature" description={`Now: ${temp} °C`} 
    color="red"
    icon={<ThermostatIcon sx={{ fontSize: 40 }}/>}
    graph={      <ResponsiveLine
      data={data}
      margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
      }}
      axisBottom={{
        tickRotation: -45,
      }}
      axisLeft={{
        legend: "°C",
        legendOffset: -40,
      }}
      pointSize={10}
      useMesh={true}
      theme={graphTheme}
      colors={{scheme: "red_yellow_green"}}
      enableArea={true}
    />}
  />
    
  )  
};

export default Temperature;
