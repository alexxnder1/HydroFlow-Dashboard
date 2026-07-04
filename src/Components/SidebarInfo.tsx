import { Text, VStack } from "@chakra-ui/react";

const SidebarInfo = () => {
  return (
    <VStack opacity={0.6} bottom={50} position="absolute" fontSize={14} fontFamily={"DoHyeon"} textAlign={"center"}>
      <Text>Coded and engineered with 💜 by < a href="https://github.com/alexxnder1" style={{color: 'violet'}}>0x9988b7</a></Text>
      <a href="https://github.com/alexxnder1/HydroFlow-Dashboard" style={{color: 'cyan'}}>GitHub Repository</a>
    </VStack>
  )
};

export default SidebarInfo;