import ImprovedCard from "../Components/ImprovedCard";
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { Slider } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { STA_IP } from "../App";
import LoadingElement from "../Components/Loading";

const TaskDuration = ({taskDuration, setTaskDuration}) => {
    const Content = () => {    
        return (
            <>
                <br/>
                {
                    taskDuration == -1
                    ?
                    <LoadingElement/>
                    :
                    <Slider.Root colorPalette="purple" defaultValue={[taskDuration]} onValueChange={(e) => setTaskDuration(e.value[0])} min={1} max={100}>
                        <Slider.Label fontSize={'xl'}>All tasks span: {taskDuration} minutes</Slider.Label>
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range  />
                            </Slider.Track>
                            <Slider.Thumb index={0} />
                        </Slider.Control>
                    </Slider.Root>
                }
            </>
        )
    }
  useEffect(() => {
    async function f() {
      await fetch(`http://${STA_IP}/get_task_duration`)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        setTaskDuration(parseInt(data));
      });
    }

    f();
    return () => {setTaskDuration(-1)}
  }, []);  

    const sendTaskDuration = async() => {
        var url = `http://${STA_IP}/set_task_duration?d=${taskDuration}`;
        await fetch(url)
        .then((response) => {
            if(!response.ok)
                throw new Error("ERORR from sending a task duration.");

            console.log("Task Duration Sent.");
            return response.text();
        });
    };

    return (
        <ImprovedCard
          title="Time" description={'Select Task Duration'}
          color="purple" 
          icon={<TimelapseIcon sx={{ fontSize: 40 }}/>}
          content={<Content/>}

          buttonColor="purple"
          buttonText="Send"
          onClick={() => sendTaskDuration()}
        />
    );
}

export default TaskDuration;