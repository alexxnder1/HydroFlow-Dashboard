import '../App.css'
import { Button, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import SidebarInfo from './SidebarInfo';
import { Menu, names } from '../App';

// icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CircleIcon from '@mui/icons-material/Circle';

const Sidebar = ({ sidebar, setSidebar, menu, setMenu }) => {
  const [hover, setHover] = useState<Menu>();

  const SidebarButton = ({ icon, id }) => {
    return (
      <Button
        id={id}
        width={"100%"}
        height="50px"
        onMouseLeave={() => { setHover(undefined) }}
        onMouseEnter={() => { setHover(id) }}
        onClick={() => { 
          if (window.innerWidth <= 973) {
            setSidebar(false); 
          }
          setMenu(id); 
        }}
        fontSize={"15px"}
        shadow={"0.2px black"}
        border={"1px solid black"}
        backgroundColor={(id == menu || hover == id) ? "#02361c" : "#000d07"}
      >
        {icon}
        { names[id] }
      </Button>
    )
  }

  return (
    <VStack
      gap={5}
      padding={5}
      id="sidebar"
      w={{ base: "100vw", md: "20vw" }}
      zIndex={99998}
      h="100vh"
      position={{ base: "fixed", md: "sticky" }}
      top={0}
      left={0}
      backgroundColor="#093C5D"
      alignItems="center"
      border={"1px solid black"}
      boxShadow={"0px 0px 5px white"}
      background={"#1c2124"}
      pt={40}

      transform={sidebar ? "translateX(0)" : { base: "translateX(-100%)", md: "translateX(-25vw)" }}
      opacity={sidebar ? { base: "0.97", md: "1" } : 0}
      visibility={sidebar ? "visible" : "hidden"}
      
      transition="transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, visibility 0.3s"
    >
      <Image w={"95px"} h={"85px"} src="./logo_large.png" />
      <Text color={"#1DCD9F"} fontFamily={"DoHyeon"} fontSize={"25px"}>
        HydroFlow
      </Text>

      <HStack style={{color:"green"}}>
        <CircleIcon/>
        <Text>Connected</Text>
      </HStack>

      <VStack w="100%" pt={10} pb={10}>
        <SidebarButton icon={<AdminPanelSettingsIcon/>} id={Menu.ControlPanel} />
        <SidebarButton icon={<LeaderboardIcon/>} id={Menu.Stats}/>
        <SidebarButton icon={<AssignmentIcon/>} id={Menu.Tasks}/>
        <SidebarInfo/>
      </VStack>
    </VStack>
  )
};

export default Sidebar;
