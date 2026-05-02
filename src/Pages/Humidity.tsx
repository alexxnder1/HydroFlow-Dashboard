import ImprovedCard from '../Components/ImprovedCard';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import {ResponsiveLine} from "@nivo/line"
import { graphTheme } from '../theme';

const Humidity =({hum, data}) => {
  return (
    <ImprovedCard
    title="Humidity" description={`Now: ${hum}%RH`} 
    color="purple"
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
        legend: "%RH",
        legendOffset: -40,
      }}
      pointSize={10}
      colors={{scheme: "purpleRed_green"}}
      theme={graphTheme}
      useMesh={true}
      enableArea={true}
    />}
  />
    
  )  
};

export default Humidity;