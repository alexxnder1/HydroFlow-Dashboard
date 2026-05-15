import { Box, Button, Card, CardBody, CardFooter } from "@chakra-ui/react";

const ImprovedCard = (props: any) => {
    return (
        <Card.Root backgroundColor="#ffffff" border={`2px solid ${props.color}`} >
          <CardBody gap="2">
            {props.icon} 
            <Card.Title color="black" mt="5" fontSize={30}>{props.title}</Card.Title>
            <Card.Description fontSize={25} fontWeight={"bold"} color={props.descriptionColor}> {props.description} </Card.Description>
            
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