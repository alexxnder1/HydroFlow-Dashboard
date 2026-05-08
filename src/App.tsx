import { Box, Heading, Text, SimpleGrid, Button, Spinner, Center, AbsoluteCenter, Input } from '@chakra-ui/react'

import { useEffect, useState } from "react";

// Components
import ImprovedCard from "./Components/ImprovedCard"

// Icons
import Time from './Pages/Time';
import Status from './Pages/Status';
import Humidity from './Pages/Humidity';
import Temperature from './Pages/Temperature';
import Tasks, { type Task } from './Pages/Tasks';
import Uptime from './Pages/Uptime';
import LoadingElement from './Components/Loading';

export const STA_MODE: boolean = true;

export const STA_IP: string = STA_MODE ? "172.30.4.186" : "192.168.4.1"; 
// const STA_IP: string = "192.168.4.1"; 
export function createTask(hour: number, minute: number): Task {
  const today = new Date();
  const date = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hour,
    minute,
    0,
    0
  );

  const t: Task = {
    hour: hour,
    minute: minute
  };

  return t;
}
function App() {
  const [status, setStatus] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [temp, setTemp] = useState<number>(37.3);
  const [hum, setHum] = useState<number>(50);
  const [uptime, setUptime] = useState<string>("");

  const [loaded, setLoading] = useState<boolean>(true);

  const [timestamp, setTimestamp] = useState(new Date());

  const data_hum = [
    {
      id: "temperature",
      data: [
        { x: "01:00", y: 10.5 },
        { x: "02:00", y: 20.1 },
        { x: "03:00", y: 10.3 },
        { x: "05:00", y: 40.5 },
        { x: "06:00", y: 60.1 },
        { x: "07:00", y: 40.3 },
        { x: "08:00", y: 20.5 },
        { x: "09:00", y: 0.1 },
        { x: "10:00", y: 35.3 },
      ],
    },
  ]
  const data_temp = [
    {
      id: "temperature",
      data: [
        { x: "01:00", y: 10.5 },
        { x: "02:00", y: 20.1 },
        { x: "03:00", y: 10.3 },
        { x: "05:00", y: 40.5 },
        { x: "06:00", y: 60.1 },
        { x: "07:00", y: 40.3 },
        { x: "08:00", y: 20.5 },
        { x: "09:00", y: 0.1 },
        { x: "10:00", y: 35.3 },
      ],
    },
  ]
  const data_tasks = [
    {
      id: "events",
      data: [
        { x: "10:00", y: 1 },
        { x: "12:30", y: 1 },
        { x: "15:45", y: 1 },
      ],
    },
  ]
  const SendLocalTimeToESP = async() => {
    var request = `http://${STA_IP}/get_time?timestamp=${Date.now()}`;
    await fetch(request)
      .then((response) => {
        if(!response.ok)
          throw new Error("ERORR from fetch local time.");

        return response.json();
      })
  };  
  
  const ForceTask = async() => {
    var request = `http://${STA_IP}/force_task`;
    await fetch(request)
    console.log('Force task!')
  }


  async function GetTasksFromESP() {
    await fetch(`http://${STA_IP}/get_tasks`)
      .then((response) => {
        if(!response.ok)
          throw new Error("ERORR from fetch get tasks");

        return response.json();
      })
      .then((data) => {
        setTasks(data.map(t => createTask(t.hour, t.minute)));
        setLoading(true);
      })
  }

  useEffect(() => {
    GetTasksFromESP();

    SendLocalTimeToESP();   

    // TODO: GetUptime();
    return () => { setTasks([]); setTemp(0); setHum(0); setUptime(""); setLoading(false) }
  }, []);
  const [time, setTime] = useState("12:00");

  return (
    <Box p={8} minH="100vh" backgroundColor="#c8cfe3">
      {
        !loaded
        ?
        // <LoadingElement/>
        <></>
        :
        <>
          <Heading color="black" fontSize={30} mb={20}>HydroFlow Dashboard</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
            <Time timestamp={timestamp} setTimestamp={setTimestamp}/>
            <Status tasks={tasks} status={status} setStatus={setStatus}/>
            <Uptime uptime={uptime} setUptime={setUptime}/>
          </SimpleGrid>

          <br/>

          <SimpleGrid columns={{ base: 1, md: 1 }} gap={5}>
            <Tasks tasks={tasks} setTasks={setTasks} ForceTask={ForceTask}/>
            <Temperature data={data_temp} temp={temp}/>
            <Humidity data={data_hum} hum={hum}/>
          </SimpleGrid>
        </>
      }
    </Box>
  )
}

export default App