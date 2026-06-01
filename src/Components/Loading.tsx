import { Text, Flex, Spinner } from "@chakra-ui/react";

const LoadingElement = () => {
    return (
        <Flex 
            align="center" 
            justify="center" 
            width="100%" 
            height="100%" 
            direction="column"
            gap={8}
            minH="100px" 
            >
                <Spinner 
                    size="xl" 
                    css={{ "--spinner-track-color": "rgba(0,0,0,0.1)" }} 
                    borderWidth="6px" 
                    animationDuration='0.7s' 
                    color="blue.700" 
                />
            <Text color={"white"} fontSize={'xl'} fontWeight={'bold'} opacity={0.4}>Asteapta...</Text>
        </Flex>
    )
};
export default LoadingElement;