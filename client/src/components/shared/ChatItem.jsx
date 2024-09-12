import React, { memo, Suspense, lazy, useState , useEffect} from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography, IconButton, Dialog,Button, DialogContent } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setIsCall } from "../../redux/reducers/misc";
import { Headset, Search , Call ,CallEnd } from "@mui/icons-material";
import { getSocket } from "../../socket";

import { CALLED_USER,  CALL_ENDED, CALL_RECIEVED , CALL_REJECTED} from "../../constants/events";

import toast from "react-hot-toast";

const SearchDialog = lazy(() => import("../specific/Search"));

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
  members
}) => {
  const dispatch = useDispatch();
  const { iscall, isSearchOpen } = useSelector((state) => state.misc);
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const [receiveCall , setReciveCall] = useState(false)
 
  
  //const toastId = toast.loading("Logging In...");

  const openCall = (e) => {

    socket.emit(CALLED_USER, { callerId: user._id, members});
    e.preventDefault();
    e.stopPropagation();
    
    setOpenCallDialog(true);
    dispatch(setIsCall(true));
  };

  const handleCloseCallDialog = () => {
    setOpenCallDialog(false);
    dispatch(setIsCall(false));
  };


  // const reciveCall = (e) => {

    
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setOpenCallDialog(true);
  //   dispatch(setIsCall(true));
  // };

  const handleCloseCallReceiveDialog = () => {
    setReciveCall(false)
  };






  const onAccept = () =>{}

const onReject = () =>{

  handleCloseCallReceiveDialog()
  socket.emit(CALL_ENDED, { caller_id: user._id, members:members });
}

  const socket = getSocket();

  const { user } = useSelector((state) => state.auth);



  useEffect(() => {
    socket.on(CALL_RECIEVED, (userId) => {
      console.log(`recieved call ${userId}`)
      console.log(`${members[0]}`)

      if(members[0] === userId)
      {
        setReciveCall(true)

      }
      
    })

    socket.on(CALL_REJECTED,(userId) => {
      setOpenCallDialog(false);
      dispatch(setIsCall(false));
      
     
      
    })
   

    return () => {
      socket.emit(CALL_ENDED, { caller_id: user._id, members:members });
    };
  }, []);

  return (
    <>
      <Link
        sx={{
          padding: "0",
          textDecoration: "none",
          color: "inherit",
        }}
        to={`/chat/${_id}`}
        onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      >
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            backgroundColor: sameSender ? "rgba(0,0,0,0.85)" : "unset",
            color: sameSender ? "white" : "unset",
            position: "relative",
            padding: "1rem",
          }}
        >
          <AvatarCard avatar={avatar} />

          <Stack>
            <Typography>{name}</Typography>
            {newMessageAlert && (
              <Typography>{newMessageAlert.count} New Message</Typography>
            )}
          </Stack>

          {isOnline && (
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
                position: "absolute",
                top: "50%",
                right: "1rem",
                transform: "translateY(-50%)",
              }}
            />
          )}

          <IconButton onClick={openCall} sx={{ color: "inherit" }}>
            <Headset />
          </IconButton>
        </motion.div>
      </Link>

      <Dialog
        open={openCallDialog}
        onClose={handleCloseCallDialog}
        aria-labelledby="call-dialog-title"
        aria-describedby="call-dialog-description"
      >
        <DialogContent>
          <Stack alignItems="center" spacing={2}>
            <AvatarCard avatar={avatar} />
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body1">Calling...</Typography>
          </Stack>
        </DialogContent>
      </Dialog>




      <Dialog
      open={receiveCall}
      onClose={handleCloseCallReceiveDialog}
      aria-labelledby="call-dialog-title"
      aria-describedby="call-dialog-description"
    >
      <DialogContent>
        <Stack alignItems="center" spacing={2}>
          <AvatarCard avatar={avatar} />
          <Typography variant="h6">{name}</Typography>
          <Typography variant="body1">Incoming call...</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<Call />}
              onClick={onAccept}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<CallEnd />}
              onClick={onReject}
            >
              Reject
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>



    </>
  );
};

export default memo(ChatItem);