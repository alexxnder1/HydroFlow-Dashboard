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
  minute: number;
  day: number;
  month: number;
  year: number;
  timestamp: number;
  date: Date;
};

function App() {
  const [status, setStatus] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Array<Task>>([  ]);
  const [temp, setTemp] = useState<number>(37.3);
  const [hum, setHum] = useState<number>(50);
  const [uptime, setUptime] = useState<number>(0);

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
    var request = `http://192.168.4.1/get_time?timestamp=${Date.now()}`;
    await fetch(request)
    console.log(request)
  };  
  
  const ForceTask = async() => {
    var request = `http://192.168.4.1/force_task`;
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
      const now = Date.now();
    
      const futureTasks = tasks.filter(task => task.timestamp > now);
    
      if (futureTasks.length === 0) return undefined;
    
      return futureTasks.reduce((closest, task) =>
        task.timestamp < closest.timestamp ? task : closest
      );
    }

  function getClosestTaskString(): string {
    if(tasks.length == 0)
      return "";

    return formatDiff(getClosestTask().timestamp, (new Date()).getTime());
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
      minute: minute,
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      timestamp: date.getTime(),
      date: date
    };
  
    return t;
  }
  
  const SendTasksToESP = async() => {
    await fetch("http://192.168.4.1/get_tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(tasks)
    });
    console.log(JSON.stringify(tasks));
  };  

  function AddDefaultTasks() {
    setTasks(prev => [...prev, getTaskWithHourMinute(23,30)])
    setTasks(prev => [...prev, getTaskWithHourMinute(12,15)])
    setTasks(prev => [...prev, getTaskWithHourMinute(19,45)])
  }

  useEffect(() => {
    AddDefaultTasks();

    SendLocalTimeToESP();   

    // TODO: GetUptime();
    
    SendTasksToESP();
    return () => { setTasks([]); setTemp(0); setHum(0); setUptime(0) }
  }, []);

  return (
    <Box p={50} minH="100vh" backgroundColor="#c8cfe3">
      <Heading color="black" fontSize={30} mb={20}>HydroFlow Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
        <Time/>
        <Status status={status} setStatus={setStatus} getClosestTaskString={getClosestTaskString}/>
        <Uptime uptime={uptime}/>
      </SimpleGrid>

      <br/>

      <SimpleGrid columns={{ base: 1, md: 1 }} gap={5}>
        <Tasks data={data_tasks} tasks={tasks} ForceTask={ForceTask} getClosestTask={getClosestTask}/>
        <Temperature data={data_temp} temp={temp}/>
        <Humidity data={data_hum} hum={hum}/>
        </SimpleGrid>
    </Box>
  )
}

export default App