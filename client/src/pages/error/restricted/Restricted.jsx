import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import illustration from '../../../assets/img/Illustration/illustration.webp'; // Replace with your actual image path

// Styled component for centering the content
const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: '#f4f6f8',
});

const Restricted = () => {
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src={illustration} // Add your image source here
          alt="Restricted Illustration"
          style={{ width: 300, marginBottom: 20 }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" color="textPrimary" gutterBottom>
          Sorry, You are Restricted!
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          It seems like you don’t have permission to access this page.
        </Typography>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.href = '/'}
          sx={{ marginTop: 2 }}
        >
          Go to Home
        </Button>
      </motion.div>
    </Container>
  );
};

export default Restricted;
