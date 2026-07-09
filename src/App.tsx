import { Box, HStack, MenuIndicator, SimpleGrid,Text, VStack } from '@chakra-ui/react'

import { useEffect, useState } from "react";

import './App.css'

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

import WifiPasswordIcon from '@mui/icons-material/WifiPassword';

export const STA_MODE: boolean =  false;

export const STA_IP: string = "192.168.0.142";
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

export const names: Array<string> = ["Generale", "Stats", "Tasks"];

function App() {
  const [status, setStatus] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [temp, setTemp] = useState<number>(37.3);
  const [hum, setHum] = useState<number>(50);
  const [uptime, setUptime] = useState<string>("");
  const [taskDuration, setTaskDuration] = useState<number>(-1);
  const [menu, setMenu] = useState<Menu>(Menu.ControlPanel);
  const [sidebar, setSidebar] = useState<boolean>(true);
  const isMobile = useIsMobile();

  // TODO
  const [loaded, setLoading] = useState<boolean>(false);

  const [timestamp, setTimestamp] = useState(new Date());

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

  return (
    <Box p={0} minH="100vh" backgroundColor={ThemeColors.Background} color={ThemeColors.Text}>
      {
        !loaded
        ?
        <IntroScreen/>
        :
        <HStack >

          <Sidebar sidebar={sidebar} setSidebar={setSidebar} menu={menu} setMenu={setMenu} />

          {/* <HStack style={{position: "absolute", top: 40, right:40}}>
            <WifiPasswordIcon/>
            <Text>Da</Text>
          </HStack> */}


          <Box p={8} id="box-content" w="100vw" h="100vh" overflowY={"auto"} ml={(!isMobile && !sidebar) && '400px'}>
              <Text fontWeight={"bold"} fontSize={25} pl={!isMobile ? (!sidebar ? 15:  0) : 10}  mb={7} position="fixed">{names.at(menu)}</Text>
              <br/>
              <br/>
              <br/>

              {/* fucking react dumb thing, i cant create separate functions outside this App comp because i loose all states... */}
              {
                menu === Menu.ControlPanel &&
                (
                  <SimpleGrid id="content" columns={{ base: 1, md: 3 }} gap={5}>
                    <Time timestamp={timestamp} setTimestamp={setTimestamp}/>
                    <Status tasks={tasks} status={status} setStatus={setStatus}/>
                    <Uptime uptime={uptime} setUptime={setUptime}/>
                  </SimpleGrid>
                )
              }

              {
                menu === Menu.Stats &&
                (
                  <SimpleGrid id="content" columns={{ base: 1, md: 1 }} gap={5}>
                    <Weather/>
                  </SimpleGrid>
                )
              }

              {
                menu === Menu.Tasks &&
                (
                  <SimpleGrid id="content" columns={{ base: 1, md: 1 }} gap={5}>
                    <Tasks 
                      tasks={tasks} 
                      setTasks={setTasks} 
                      ForceTask={ForceTask} 
                      taskDuration={taskDuration}
                    />
                    <TaskDuration 
                      setTaskDuration={setTaskDuration} 
                      taskDuration={taskDuration}
                    />
                  </SimpleGrid>
                )
              }
          </Box>
        </HStack>
      }
    </Box>
  )
}


export default App