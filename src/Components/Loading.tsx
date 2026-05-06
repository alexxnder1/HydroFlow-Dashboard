import { AbsoluteCenter, Flex, Spinner } from "@chakra-ui/react";

const LoadingElement = () => {
    return (
        <Flex 
            align="center" 
            justify="center" 
            width="100%" 
            height="100%" 
            minH="100px" // Previne colapsarea dacă părintele e gol
            >
            <Spinner size="xl" color="blue.500" />
        </Flex>
    )
};
export default LoadingElement;