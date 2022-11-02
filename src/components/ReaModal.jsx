import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 4,
  p: 0,
};

export default function ReaModal({ id, setModalOpen, modalOpen, children}) {
  const handleClose = () => setModalOpen(false);

  return (
    <div>
      <Modal
        aria-label={id}
        open={modalOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 400,
        }}
      >
        <Fade in={modalOpen}>
          <Box sx={style}>
            {children}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}