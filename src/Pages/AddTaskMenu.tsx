import { Text, VStack, Box, Button, Input } from "@chakra-ui/react";
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
            backdropFilter={'blur(10px)'}
        >
            <VStack
                position="absolute"
                left="50%"
                top="50%"
                transform={"translate(-50%, -50%)"}
                width={{ base: "90%", md: "50%", lg: "25%" }}
                p={5}
                borderRadius="2xl"
                bg="transparent"
                gap={5}
            >
                <Text fontSize={{ base: 24, md: 22 }} fontWeight={"bold"}>
                    Pick Task Hour
                </Text>

                <Box position="relative" width="100%" h="50px">
                    
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bg="#f0f0f0"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px={4}
                        zIndex={1}
                        border="1px solid #ccc"
                    >
                        <Text color="black" fontSize="18px">
                            {task 
                                ? `${String(task.hour).padStart(2, "0")}:${String(task.minute).padStart(2, "0")}` 
                                : "--:--"}
                        </Text>
                        <Text fontSize="20px">🕒</Text>
                    </Box>

                    <Input
                        type="time"
                        value={task ? `${String(task.hour).padStart(2, "0")}:${String(task.minute).padStart(2, "0")}` : ""}
                        onChange={(e) => {
                            if (e.target.value) {
                                setTask(ReturnTaskFromString(e.target.value));
                            }
                        }}
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        opacity={0}
                        zIndex={2}  
                        style={{ 
                            WebkitAppearance: "none",
                            cursor: "pointer"
                        }}
                    />
                </Box>

                <Box display={"flex"} width="100%" justifyContent={"center"} mt={2}>
                    <Button
                        colorScheme="green"
                        width="100%"
                        onClick={() => {
                            if (task) {
                                SendTask();
                                setAddTaskMenu(false);
                            }
                        }}
                    >
                        Add Task
                    </Button>
                </Box>
                
                <Button 
                    variant="ghost" 
                    color="whiteAlpha.800" 
                    onClick={() => setAddTaskMenu(false)}
                >
                    Cancel
                </Button>
            </VStack>
        </Box>
    );
};

export default AddTaskMenu;