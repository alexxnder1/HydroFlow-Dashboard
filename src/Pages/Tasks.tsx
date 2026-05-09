import { Box, Button, HStack, Stack, Text, VStack} from '@chakra-ui/react';
import ImprovedCard from '../Components/ImprovedCard';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import AddTaskMenu from './AddTaskMenu';
import { STA_IP } from '../App';

export type Task = {
  hour: number;
  minute  : number;
};

export function getRelativeTimeString(targetMs: number, relativeToMs: number = Date.now()): string {
  const diffMs = Math.abs(targetMs - relativeToMs);
  
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hours`;

  return `${hours} hours ${minutes} minutes`;
}

export function getClosestTaskString(tasks: Task[]): string {
  if (!tasks || tasks.length === 0) return "";

  const now = new Date();
  
  const upcomingTasks = tasks.map(task => {
    const runDate = new Date();
    runDate.setHours(task.hour, task.minute, 0, 0);

    if (runDate.getTime() <= now.getTime()) {
      runDate.setDate(runDate.getDate() + 1);
    }
    
    return {
      ...task,
      nextRunTime: runDate.getTime()
    };
  });

  upcomingTasks.sort((a, b) => a.nextRunTime - b.nextRunTime);

  const closest = upcomingTasks[0];

  return getRelativeTimeString(closest.nextRunTime, now.getTime());
}

function formatDiff(ts1: number, ts2: number): string {
  const { hours, minutes } = getTimeDifference(ts1, ts2);

  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hours`;

  return `${hours} hours ${minutes} minutes`;
}

function getClosestTask(tasks): Task | undefined {
    if (tasks.length === 0) return undefined;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return tasks.reduce((closest, task) => {
      const taskMinutes = task.hour * 60 + task.minute;
      
      const diffClosest = (closest.hour * 60 + closest.minute - currentMinutes + 1440) % 1440;
      const diffTask = (taskMinutes - currentMinutes + 1440) % 1440;

      return diffTask < diffClosest ? task : closest;
    });
  }
  
  function getTimeDifference(ts1: number, ts2: number) {
    const diffMs = Math.abs(ts2 - ts1); // safe for any order
  
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { hours, minutes };
  }

function getLowestTask(tasks: Task[]): Task | undefined {
  if (!tasks.length) return undefined;

  return tasks.reduce((min, t) =>
    t.hour < min.hour ? t : min
  );
}
function getHighestTask(tasks: Task[]): Task | undefined {
  if (!tasks.length) return undefined;

  return tasks.reduce((max, t) =>
    t.hour > max.hour ? t : max
  );
}
 
const Tasks = ({tasks, setTasks, ForceTask}) => {
  const pulse = keyframes`
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.6; }
    100% { transform: scale(1); opacity: 1; }
  `;
useEffect(() => {
  console.log("Tasks s-au schimbat:", tasks);
}, [tasks]);
  const color = "#5a79cd";
  
  const [addTaskMenu, setAddTaskMenu] = useState<boolean>(false);

  const DeleteTask = async (task: Task) => {
    var request = `http://${STA_IP}/delete_task?hour=${task.hour}&minute=${task.minute}`;
    await fetch(request)
      .then((response) => {
        if(!response.ok)
          throw new Error("ERORR from deleting a task.");

        return response.text();
      })
      .then(() => {
        setTasks(prev => {
            var filtr = prev.filter(t =>
              !(t.hour === task.hour && t.minute === task.minute)
            )
            return [...filtr];
          }
        );
        console.log(tasks)
      });
  };  

  return (
    <>
    
    <ImprovedCard
      title="Tasks" description={ 
        <Box position="relative" w="100%" py={6}>
        <Box
          position="absolute"
          top="50%"
          left="0"
          right="0"
          height="5px"
          bg={color}
          transform="translateY(150%)"
          zIndex={1}
        />
          <HStack marginTop={20} justify="space-between" align="center">
            {
              [...tasks].sort((a, b) =>
                  a.hour * 60 + a.minute - (b.hour * 60 + b.minute)
              )
              .map((t, id) => {
                return (
                    <VStack zIndex={2} key={`${t.hour}-${t.minute}`}>
                      <Text position={"absolute"} top={50} fontSize={25}>{String(t.hour).padStart(2,"0")}:{String(t.minute).padStart(2,"0")}</Text>
                      <Box w="12px" h="12px" borderRadius="full" border="10px  solid" borderColor={'blue'}/> 
                     
                      <Button onClick={() => {DeleteTask(t)}} color="white" marginTop={2} bg={'red.500'} fontSize={15}>{'Delete'}</Button>
                    </VStack>
                )
              })
              
            }
            </HStack>
        </Box>
        }
        buttonColor={color}  color={color}
        buttonText="Force Task"
        onClick={() => {ForceTask()}}

        secondButtonColor={"#0039d6"}  secondColor={color}
        secondButtonText="Add Task"
        secondOnClick={() => {setAddTaskMenu(true)}}
        
        icon={<AssignmentLateIcon sx={{ fontSize: 40 }}/>}
      />
      {
        addTaskMenu
        &&
        <AddTaskMenu setTasks={setTasks} setAddTaskMenu={setAddTaskMenu}/>
      }
    </>
  )  
};

export default Tasks;
