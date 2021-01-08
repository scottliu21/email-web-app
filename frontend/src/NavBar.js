/**
 * With code from Material UI Responsive Drawer
 * https://codesandbox.io/s/6khtm
 */
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {fade, makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import MailIcon from '@material-ui/icons/Mail';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      marginLeft: drawerWidth,
      height: 50,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  search: {
    'position': 'relative',
    'borderRadius': theme.shape.borderRadius,
    'backgroundColor': fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    'marginRight': theme.spacing(2),
    'marginLeft': 0,
    'width': '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

/**
 * @param {object} props
 * @return {object} NavBar
 */
export default function NavBar(props) {
  const classes = useStyles();

  return (
    <div>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={props.handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>

          <Box display={{xs: 'none', md: 'block'}}>
            <Typography variant ='h6' noWrap>
              {props.appBarText}
            </Typography>
          </Box>

          <Button
            color="inherit"
            variant="text"
            onClick={props.handleSearchClick}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>

          <IconButton
            color="inherit"
            aria-label="open compose"
            edge="end"
            onClick={props.handleCompose}
          >
            <MailIcon/>
          </IconButton>

        </Toolbar>
      </AppBar>
    </div>
  );
}

NavBar.propTypes = {
  handleDrawerToggle: PropTypes.func,
  appBarText: PropTypes.string,
  handleCompose: PropTypes.func,
  handleSearchClick: PropTypes.func,
};
