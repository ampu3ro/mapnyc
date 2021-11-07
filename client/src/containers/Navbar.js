import { React, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../store/actions/auth';
import { setSearch } from '../store/actions/locations';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

const HomeButton = styled(Button)(() => ({
  textTransform: 'none',
  fontSize: 20,
  fontWeight: 600,
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const Navbar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState();

  const recordButtonPosition = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const clickMenu = (route) => {
    history.push(route);
    dispatch(setSearch(''));
    closeMenu();
  };

  const clickLogout = () => {
    history.push('/');
    dispatch(setSearch(''));
    dispatch(logout());
  };

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 8 }}>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', opacity: 0.95 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <div>
            <MenuButton
              edge="start"
              variant="text"
              aria-label="menu"
              onClick={recordButtonPosition}
            >
              <MenuIcon />
            </MenuButton>
            <HomeButton variant="text" onClick={() => history.push('/')}>
              {'bot\u0101NYC'}
            </HomeButton>
          </div>
          {currentUser.isAuthenticated ? (
            <div>
              <Button variant="text" onClick={clickLogout}>
                Logout
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={closeMenu}
              >
                <MenuItem onClick={() => clickMenu('/farm')}>
                  Farm/Garden Form
                </MenuItem>
                {currentUser.isAdmin && (
                  <MenuItem onClick={() => clickMenu('/bulk')}>
                    Bulk Upload
                  </MenuItem>
                )}
                {currentUser.isAdmin && (
                  <MenuItem onClick={() => clickMenu('/admin')}>
                    Admin Settings
                  </MenuItem>
                )}
              </Menu>
            </div>
          ) : (
            <div>
              <Button variant="text" onClick={() => history.push('/signup')}>
                Sign Up
              </Button>
              <Button variant="text" onClick={() => history.push('/signin')}>
                Login
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
