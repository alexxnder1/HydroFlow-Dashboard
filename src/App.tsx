import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react'

import { useEffect, useState } from "react";

// Components
import ImprovedCard from "./Components/ImprovedCard"

// Icons
import Time from './Pages/Time';
import Status from './Pages/Status';
import Humidity from './Pages/Humidity';
import Temperature from './Pages/Temperature';
import Tasks from './Pages/Tasks';
import Uptime from './Pages/Uptime';

export type Task = {
  hour: number;
  minute  : number;
};

// const STA_IP: string = "172.30.4.150";
const STA_IP: string = "192.168.4.1"; 

function App() {
  const [status, setStatus] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Array<Task>>([ {hour: 4, minute:50},{hour: 12, minute:10},{hour: 19, minute:50} ]);
  const [temp, setTemp] = useState<number>(37.3);
  const [hum, setHum] = useState<number>(50);
  const [uptime, setUptime] = useState<number>(1775001600);

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
    console.log(request)
  };  
  
  const ForceTask = async() => {
    var request = `http://${STA_IP}/force_task`;
    await fetch(request)
    console.log('Force task!')
  }

  function getTimeDifference(ts1: number, ts2: number) {
    const diffMs = Math.abs(ts2 - ts1); // safe for any order
  
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { hours, minutes };
  }

  function formatDiff(ts1: number, ts2: number): string {
    const { hours, minutes } = getTimeDifference(ts1, ts2);
  
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hours`;
  
    return `${hours} hours ${minutes} minutes`;
  }
function getClosestTask(): Task | undefined {
  if (tasks.length === 0) return undefined;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return tasks.reduce((closest, task) => {
    const taskMinutes = task.hour * 60 + task.minute;
    
    // Calculăm diferența. Dacă task-ul a trecut deja azi, 
    // adunăm 1440 (minutele dintr-o zi) pentru a-l proiecta pe mâine.
    const diffClosest = (closest.hour * 60 + closest.minute - currentMinutes + 1440) % 1440;
    const diffTask = (taskMinutes - currentMinutes + 1440) % 1440;

    return diffTask < diffClosest ? task : closest;
  });
}

  function getClosestTaskString(): string {
    const closest = getClosestTask();
    if (!closest) return "";

    const now = new Date();
    const taskDate = new Date();
    
    taskDate.setHours(closest.hour, closest.minute, 0, 0);

    if (taskDate.getTime() <= now.getTime()) {
      taskDate.setDate(taskDate.getDate() + 1);
    }

    return formatDiff(taskDate.getTime(), now.getTime());
  }
  function getTaskWithHourMinute(hour: number, minute: number): Task {
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
  
  // const SendTasksToESP = async() => {
  //   console.log(tasks);

  //   await fetch(`http://${STA_IP}/get_tasks`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },

  //     body: JSON.stringify(tasks)
  //   });
  // };  

  async function GetTasksFromESP() {
    // setTasks(prev => [...prev, getTaskWithHourMinute(23,30)])
    // setTasks(prev => [...prev, getTaskWithHourMinute(12,15)])
    // setTasks(prev => [...prev, getTaskWithHourMinute(19,45)])
    // SendTasksToESP();
    await fetch(`http://${STA_IP}/get_tasks`)
      .then((response) => {
        if(!response.ok)
          throw new Error("ERORR from fetch get tasks");

        return response.json();
      })
      .then((data) => {
        setTasks(data.map(t => getTaskWithHourMinute(t.hour, t.minute)));
      })
  }

  useEffect(() => {
    GetTasksFromESP();

    SendLocalTimeToESP();   

    // TODO: GetUptime();
    return () => { setTasks([]); setTemp(0); setHum(0); setUptime(0) }
  }, []);

  return (
    <Box p={8} minH="100vh" backgroundColor="#c8cfe3">
      <Heading color="black" fontSize={30} mb={20}>HydroFlow Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
        <Time/>
        <Status status={status} setStatus={setStatus} getClosestTaskString={getClosestTaskString}/>
        <Uptime uptime={uptime}/>
      </SimpleGrid>

      <br/>

      <SimpleGrid columns={{ base: 1, md: 1 }} gap={5}>
        <Tasks tasks={tasks} ForceTask={ForceTask} getClosestTask={getClosestTask}/>
        <Temperature data={data_temp} temp={temp}/>
        <Humidity data={data_hum} hum={hum}/>
        </SimpleGrid>
    </Box>
  )
}

export default App