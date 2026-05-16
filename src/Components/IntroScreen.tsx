import { AbsoluteCenter, HStack, Image, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0% { transform: scale(0.8); opacity: 0.2; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.2; }
`;

const IntroScreen = () => {
    return (
        <AbsoluteCenter>
            <VStack>
                <Image animation={`${pulse} 1.5s infinite ease-in-out`} w={250} h={250} src="./logo.png"/>
            </VStack>
        </AbsoluteCenter>
    )
};

export default IntroScreen;