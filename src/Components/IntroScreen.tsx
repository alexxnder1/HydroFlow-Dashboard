import { AbsoluteCenter, HStack, Image, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import LoadingElement from "./Loading";

const pulse = keyframes`
  0% {  opacity: 0.2; }
  50% {  opacity: 1; }
  100% { opacity: 0.2; }
`;

const IntroScreen = () => {
    return (
        <AbsoluteCenter >
            <VStack>
                <Image animation={`${pulse} 1.5s infinite ease-in-out`}  w={200} h={200} src="./logo.png"/>
                <LoadingElement/>
            </VStack>
        </AbsoluteCenter>
    )
};

export default IntroScreen;