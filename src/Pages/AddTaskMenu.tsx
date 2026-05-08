import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { Task } from "./Tasks";
import { createTask, STA_IP } from "../App";

const AddTaskMenu = ({setTasks, setAddTaskMenu}) => {
    const [task, setTask] = useState<Task>();

    const ReturnTaskFromString = (str: string): Task => {
        const spliced: string[] = str.split(":");
        return { hour: Math.trunc(parseInt(spliced[0])), minute: Math.trunc(parseInt(spliced[1])) };
    };

    const SendTask = async() => {
        if(task  == undefined)
        {
            console.error("Undefined Task.");
            return;
        }
 
        await fetch(`http://${STA_IP}/add_task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                hour: task?.hour,
                minute: task?.minute
            })
        })
            .then((response) => {
                if(!response.ok)
                    throw new Error("POST Failed, Add task.");

                return response.json();
            })
            .then((data) => {
                console.log("Added task " + task.hour + " " + task.minute);
                setTasks(prev => [...prev, createTask(task.hour, task.minute)]);
            })
            .catch((err) => {
                console.error("ERR: ", err);
            });

    };  
    
    return (
        <Box 
            position="fixed"
            left="0"
            top="0" 
            w="100vw" 
            h="100vh" 
            zIndex={6767} 
            bg="rgba(0,0,0,0.6)"
            color="white"
            backdropFilter={'blur(10px)'}>
            
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="#111827"
                p={5}
                borderRadius="2xl"
                minW={{ base: "40%", sm: "80%", md: "40%" }}
                boxShadow="0 20px 60px rgba(0,0,0,0.5)">
                    
                <Box>
                    <Text>Pick Task Hour</Text>
                    <Input
                        type="time"
                        value= {
                            task
                            ? `${String(task.hour).padStart(2,"0")}:${String(task.minute).padStart(2,"0")}`
                            : ""
                        }
                        onChange={(e) => {setTask(ReturnTaskFromString(e.target.value))}}
                        size="md"
                        style={{ marginTop:"10px", color: 'black', backgroundColor: '#f0f0f0' }} 
                    />
                </Box>
                
                <Box display={"flex"} justifyContent={"flex-end"} mt={5} onClick={() => { setAddTaskMenu(false); SendTask();}}>
                    <Button  display='flex' justifyContent='flex-end' right={0} color="white" bg="green">Add</Button>
                </Box>
            </Box>
            
        </Box>
    );
};

export default AddTaskMenu;