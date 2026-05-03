import { Box, HStack, Stack, Text, VStack} from '@chakra-ui/react';
import ImprovedCard from '../Components/ImprovedCard';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import type { Task } from '../App';
import { keyframes } from '@emotion/react';

const Tasks = ({tasks, ForceTask, getClosestTask}) => {
  function IsNextTask(task: Task): boolean {
    // return (getClosestTask() == task);
    return false;
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
  
  const pulse = keyframes`
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.6; }
    100% { transform: scale(1); opacity: 1; }
  `;

  const color = "#6A5ACD";

  return (
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
              tasks.sort((a,b) => a.timestamp-b.timestamp).map((t, id) => {
                return (
                  <>
                    <VStack zIndex={2} key={id}>
                      <Text position={"absolute"} top={IsNextTask(t) ? 30 : 50} fontSize={IsNextTask(t) ? 40 : 25}>{t.hour}:{t.minute}</Text>
                      <Box w="12px" h="12px" borderRadius="full" border="10px  solid" borderColor={`${IsNextTask(t) ? "#663399": color}`}/> 
                      
                      <Box marginTop={5} borderRadius="10%" paddingInline={3} paddingBlock={1} backgroundColor={IsNextTask(t) ? '#2E8B57' : '#708090'} border="1px solid">
                        <Text color="white" fontSize={IsNextTask(t) ? 15 : 15}>{IsNextTask(t) ? 'Upcoming' : 'Scheduled'}</Text>
                      </Box>
                    </VStack>
                  </>
                )
              })
              
            }
            </HStack>
        </Box>
        }
        buttonColor={color}  color={color}
        buttonText="Force Task"
        onClick={() => {ForceTask()}}
        icon={<AssignmentLateIcon sx={{ fontSize: 40 }}/>}
      />
  )  
};

export default Tasks;
