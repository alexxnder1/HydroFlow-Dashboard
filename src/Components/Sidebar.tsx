import '../App.css'

import { Box, Button, Image, Text, VStack } from '@chakra-ui/react'
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import SidebarInfo from './SidebarInfo';
import { Menu, names } from '../App';
import { useMediaQuery } from "@chakra-ui/react";


// icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const useIsMobile = () => {
  const [isMobile] = useMediaQuery(["(max-width: 973px)"]);
  return isMobile;
};

const Sidebar = ({sidebar, setSidebar, menu, setMenu}) => {
  const [hover, setHover] = useState<Menu>();
  const isMobile = useIsMobile();

  const changeSidebarState = () => {
    setSidebar(!sidebar);
  };
  const SidebarButton = ({icon, id}) => {
    return (
      <Button
        id={id}
        width={"100%"}
        height="50px"
        onMouseLeave={() => { setHover(null) }}
        onMouseEnter={() => { setHover(id) }}
        onClick={() => { if(isMobile) setSidebar(false);  setMenu(id) }}
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
    <>
    <Button
      id="sidebar-button"
      transition="transform 0.5s"
      transform={sidebar ? "rotate(180deg)" : "rotate(0deg)"}
      style={{
          borderRadius: "15px",
          width: "50px",
          position:"absolute",
          top: 25, left: 15,
          zIndex:999999,
          height:"50px"
        }} onClick={() => {
          if(isMobile)
            changeSidebarState();
        }}>
          <MenuIcon style={{ pointerEvents: "none"}}/>
      </Button>
    {
      <VStack
        gap={5}
        padding={5}
        id="sidebar"
        w={isMobile ? "100vw" : "20vw" }
        zIndex={99999}
        h="100vh"
        opacity={isMobile && "0.97"}
        animation={`${sidebar ? 'sidebarOpen' : 'sidebarClose'} 0.5s forwards`}
        position= {isMobile ? "fixed" :  "sticky" }
        // top={0}
        backgroundColor="#093C5D"
        alignItems="center"
        border={"1px solid black"}
        boxShadow={"0px 0px 5px white"}
        background={"#1c2124"}
        pt={40}

      >
      <Image w={"95px"} h={"85px"}  src="./logo_large.png" />
          <Text color={"#1DCD9F"}  fontFamily={"DoHyeon"} fontSize={"25px"}>
            HydroFlow
        </Text>


      <VStack w="100%" pt={10} pb={10}>
        <SidebarButton icon={<AdminPanelSettingsIcon/>} id={Menu.ControlPanel} />
        <SidebarButton icon={<LeaderboardIcon/>} id={Menu.Stats}/>
        <SidebarButton icon={<AssignmentIcon/>} id={Menu.Tasks}/>
        <SidebarInfo/>
      </VStack>
    </VStack>
    }
    </>
  )
};


export default Sidebar;