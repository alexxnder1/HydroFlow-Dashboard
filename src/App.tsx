import { Box, HStack, MenuIndicator, SimpleGrid,Text } from '@chakra-ui/react'

import { useEffect, useState } from "react";

// Components
import Time from './Pages/Time';
import Status from './Pages/Status';
import Tasks, { type Task } from './Pages/Tasks';
import Uptime from './Pages/Uptime';
import TaskDuration from './Pages/TaskDuration';

import { SocketClose, SocketSetup } from './socketManager';
import { SetupNotifications } from './notifications';
import IntroScreen from './Components/IntroScreen';
import WeatherWidget from './Components/WeatherWidget';
import Weather from './Pages/Weather';
import { ThemeColors } from './theme';
import Sidebar, { useIsMobile } from './Components/Sidebar';

export const STA_MODE: boolean =  false;

export const STA_IP: string = "192.168.0.205";
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

export enum Menu {
  ControlPanel,
  Stats,
  Tasks
}

export const names: Array<string> = ["Panoul de control", "Stats", "Tasks"];

function App() {
  const [status, setStatus] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [temp, setTemp] = useState<number>(37.3);
  const [hum, setHum] = useState<number>(50);
  const [uptime, setUptime] = useState<string>("");
  const [taskDuration, setTaskDuration] = useState<number>(-1);
  const [menu, setMenu] = useState<Menu>(Menu.ControlPanel);
  const isMobile = useIsMobile();

  // TODO
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

        return response.text();
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
    SetupNotifications();
    SocketSetup();

    GetTasksFromESP();
    SendLocalTimeToESP();

    return () => { SocketClose(); setTasks([]); setTemp(0); setHum(0); setUptime(""); setLoading(false) }
  }, []);

  const ControlPanel = () => {
    return (
        <SimpleGrid columns={{ base: 1, md: 3}} gap={5}>
          <Time timestamp={timestamp} setTimestamp={setTimestamp}/>
          <Status tasks={tasks} status={status} setStatus={setStatus}/>
          <Uptime uptime={uptime} setUptime={setUptime}/>
        </SimpleGrid>
    )
  };

  const Stats = () => {
    return (

      <SimpleGrid columns={{ base: 1, md: 1 }} gap={5}>
        <Weather/>
      </SimpleGrid>
    )
  };

  const TasksPanel = () => {
    return(
      <SimpleGrid columns={{ base: 1, md: 1 }} gap={5}>
        <Tasks tasks={tasks} setTasks={setTasks} ForceTask={ForceTask} taskDuration={taskDuration}/>
        <TaskDuration setTaskDuration={setTaskDuration} taskDuration={taskDuration}/>
      </SimpleGrid>
    )
  };

  const ConditionalRendering = () => {
    switch(menu)
    {
      case Menu.ControlPanel:
        return <ControlPanel/>

      case Menu.Stats:
        return <Stats/>

      case Menu.Tasks:
        return <TasksPanel/>
    }
  };
  return (
    <Box p={0} minH="100vh" backgroundColor={ThemeColors.Background} color={ThemeColors.Text}>
      {
        !loaded
        ?
        <IntroScreen/>
        :
        <HStack >
          <Sidebar menu={menu} setMenu={setMenu} />

          <Box p={8} id="content" w="100vw" h="100vh" overflowY={"auto"}>
              <Text fontWeight={"bold"} fontSize={25} pl={10}  mb={7}>{names.at(menu)}</Text>
              <ConditionalRendering/>
          </Box>
        </HStack>
      }
    </Box>
  )
}


export default App