import { Box, Button, HStack, SimpleGrid, Text } from '@chakra-ui/react'
import { useEffect, useState } from "react";
import './App.css'
import MenuIcon from '@mui/icons-material/Menu';

// Components
import Time from './Pages/Time';
import Status from './Pages/Status';
import Tasks, { type Task } from './Pages/Tasks';
import Uptime from './Pages/Uptime';
import TaskDuration from './Pages/TaskDuration';

import { SocketClose, SocketSetup } from './socketManager';
import { SetupNotifications } from './notifications';
import IntroScreen from './Components/IntroScreen';
import Weather from './Pages/Weather';
import { ThemeColors } from './theme';
import Sidebar from './Components/Sidebar';

export const STA_MODE: boolean = false;
export const STA_IP: string = "192.168.0.142";

export function createTask(hour: number, minute: number): Task {
  return { hour, minute };
}

export const Menu = {
  ControlPanel: 0,
  Stats: 1,
  Tasks: 2,
} as const; 

export type Menu = typeof Menu[keyof typeof Menu];
export const names: Array<string> = ["Generale", "Stats", "Tasks"];

function App() {
  const [status, setStatus] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [uptime, setUptime] = useState<string>("");
  const [taskDuration, setTaskDuration] = useState<number>(-1);
  const [menu, setMenu] = useState<Menu>(Menu.ControlPanel);
  
  const [sidebar, setSidebar] = useState<boolean>(window.innerWidth > 973);
  const [loaded, setLoading] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState(new Date());

  const SendLocalTimeToESP = async() => {
    var request = `http://${STA_IP}/get_time?timestamp=${Date.now()}`;
    await fetch(request).then(res => res.text()).catch(err => console.log(err));
  };

  const ForceTask = async() => {
    var request = `http://${STA_IP}/force_task`;
    await fetch(request).catch(err => console.log(err));
  };

  async function GetTasksFromESP() {
    await fetch(`http://${STA_IP}/get_tasks`)
      .then(res => res.json())
      .then((data) => {
        setTasks(data.map((t: any) => createTask(t.hour, t.minute)));
        setLoading(true);
      })
      .catch(err => {
        console.log(err);
        setLoading(true);
      });
  }

  useEffect(() => {
    SetupNotifications();
    SocketSetup();
    GetTasksFromESP();
    SendLocalTimeToESP();

    return () => { 
      SocketClose(); 
      setLoading(false);
    }
  }, []);

  return (
    <Box p={0} minH="100vh" backgroundColor={ThemeColors.Background} color={ThemeColors.Text} overflow="hidden">
      {
        !loaded ? <IntroScreen/> : (
        <HStack alignItems="flex-start" gap={0} w="100vw" h="100vh" position="relative">
          
         <Button
            id="sidebar-button"
            transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            transform={sidebar ? "rotate(180deg)" : "rotate(0deg)"}
            style={{
                borderRadius: "15px",
                width: "50px",
                position: "absolute",
                top: 25, 
                left: 20,
                zIndex: 999999,
                height: "50px"
              }} 
            onClick={() => setSidebar(!sidebar)}
          >
            <MenuIcon style={{ pointerEvents: "none"}}/>
          </Button>


          <Sidebar sidebar={sidebar} setSidebar={setSidebar} menu={menu} setMenu={setMenu} />

          <Box 
            p={8} 
            id="box-content" 
            w="100%" 
            h="100vh" 
            overflowY="auto" 
            pl={{ base: "30px", md: sidebar ? "22vw" : "80px" }}
            pt="90px"
          >
              <Text 
                fontWeight="bold" 
                fontSize={25} 
                mb={7} 
                position="fixed" 
                top="30px"
                left={{ base: "85px", md: sidebar ? "23vw" : "90px" }}
                zIndex={999}
              >
                {names[menu]}
              </Text>
              <br/>

              {
                menu === Menu.ControlPanel && (
                  <SimpleGrid id="content" columns={{ base: 1, md: 3 }} gap={5}>
                    <Time timestamp={timestamp} setTimestamp={setTimestamp}/>
                    <Status tasks={tasks} status={status} setStatus={setStatus}/>
                    <Uptime uptime={uptime} setUptime={setUptime}/>
                  </SimpleGrid>
                )
              }

              {
                menu === Menu.Stats && (
                  <SimpleGrid id="content" columns={{ base: 1, md: 1 }} gap={5}>
                    <Weather/>
                  </SimpleGrid>
                )
              }

              {
                menu === Menu.Tasks && (
                  <SimpleGrid id="content" columns={{ base: 1, md: 1 }} gap={5}>
                    <Tasks tasks={tasks} setTasks={setTasks} ForceTask={ForceTask} taskDuration={taskDuration}/>
                    <TaskDuration setTaskDuration={setTaskDuration} taskDuration={taskDuration}/>
                  </SimpleGrid>
                )
              }
          </Box>
        </HStack>
      )
    }
    </Box>
  )
}

export default App;
