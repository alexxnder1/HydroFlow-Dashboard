
import ImprovedCard from "../Components/ImprovedCard";

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const Status = ({status, setStatus, getClosestTaskString}) => {
  return (
    <ImprovedCard
          title="Status" description={status == true ? `Next task in ${getClosestTaskString() ?? "null"}` : "Idle"} 
          buttonColor={status == true ? "red" : "green"}  color={status == false ? "red" : "green"}  
          buttonText={status == false ? "Start" : "Idle"}
          onClick={() => setStatus(!status)}
          icon={status==false ? <CloseIcon sx={{ fontSize: 40 }}/> : <CheckIcon sx={{ fontSize: 40 }}/>}
    />

  )  
};

export default Status;
