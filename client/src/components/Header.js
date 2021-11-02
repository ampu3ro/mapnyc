import React from 'react';
import Typography from '@mui/material/Typography';

const Header = ({ text }) => {
  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        {text}
      </Typography>
    </div>
  );
};

export default Header;
