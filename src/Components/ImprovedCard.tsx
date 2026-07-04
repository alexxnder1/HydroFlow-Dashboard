import { Box, Button, Card, CardBody, CardFooter } from "@chakra-ui/react";
import { ThemeColors } from "../theme";


const ImprovedCard = (props: any) => {
    return (
        <Card.Root backgroundColor={ThemeColors.Card} style={{ boxShadow: `0 0 5px 2px ${props.color}`}} border={`1px solid ${props.color}`} >
          <CardBody gap="2">
            {props.icon}
            <Card.Title color={ThemeColors.Text} mt="5" fontSize={30}>{props.title}</Card.Title>
            <Card.Description fontSize={25} fontFamily={"DoHyeon"} fontWeight={"bold"} color={ThemeColors.Title}> {props.description} </Card.Description>

            {
              props.graph
              &&

              <Box w="100%" h="60vh">
                {props.graph}
              </Box>

            }

            {
              props?.content
            }

          </CardBody>

            <CardFooter justifyContent={'flex-end'}>
              {
                !(props.buttonColor == undefined && props.buttonText == undefined)
                ?
                <Button onClick={props.onClick} backgroundColor={props.buttonColor}>
                  {props.buttonText}
                </Button>
                :
                <></>
              }
              {
                !(props.secondButtonColor == undefined && props.secondButtonText == undefined)
                ?
                <Button onClick={props.secondOnClick} backgroundColor={props.secondButtonColor}>
                  {props.secondButtonText}
                </Button>
                :
                <></>
              }
            </CardFooter>
        </Card.Root>
    )
};


export default ImprovedCard;