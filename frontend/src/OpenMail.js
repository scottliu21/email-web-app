/**
 * With code from Material UI Responsive Drawer
 * https://codesandbox.io/s/6khtm
 */
import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import DeleteIcon from '@material-ui/icons/Delete';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MarkunreadIcon from '@material-ui/icons/Markunread';
import axios from 'axios';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      marginLeft: drawerWidth,
      height: 50,
    },
  },
  arrowBackButton: {
    marginRight: theme.spacing(2),
  },
  sendButton: {
    marginRight: theme.spacing(2),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerEmail: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      height: '50vh',
    },
  },
  drawerEmailMobile: {
    [theme.breakpoints.up('xs')]: {
      width: '100%',
      height: '100%',
    },
  },
}));

/**
 * @param {object} props
 * @return {object} OpenMail
 */
export default function OpenMail(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuList, setMenuList] = React.useState([]);
  /**
   * @param {object} date
   * @return {string} Returns formatted string
   */
  function formatDate(date) {
    const currentDate = new Date();
    const emailDate = new Date(date);
    const diffInDays = Math.round((emailDate-currentDate) / (1000*60*60*24));
    if (currentDate.getDate() === emailDate.getDate() &&
      currentDate.getMonth() === emailDate.getMonth() &&
      currentDate.getFullYear() === emailDate.getFullYear()) {
      const formatted = emailDate.getHours() + ':' + emailDate.getMinutes();
      return formatted.toString();
    }
    if (currentDate.getDate() != emailDate.getDate() &&
      currentDate.getMonth() === emailDate.getMonth() &&
      currentDate.getFullYear() === emailDate.getFullYear()) {
      const formatted = emailDate.toLocaleString('default', {month: 'short'});
      return formatted + ' ' + emailDate.getDate();
    }
    if (currentDate.getMonth() != emailDate.getMonth() ||
      Math.abs(diffInDays) <= 365) {
      const formatted = emailDate.toLocaleString('default', {month: 'short'});
      return formatted + ' ' + emailDate.getDate();
    }
    if (Math.abs(diffInDays) > 365) {
      const formatted = emailDate.getFullYear();
      return formatted.toString();
    }
  }

  React.useEffect(() => {
    axios.get('http://localhost:3010/v0/mail/getMailboxList')
        .then((response) => {
          setMenuList(response.data);
        });
  }, [menuList]);

  const received = formatDate(props.fromReceived);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (list) => {
    if (typeof list === 'string') {
      axios.put('http://localhost:3010/v0/mail/' + props.fromID + '?mailbox=' + list)
          .then((response) => {
            props.setFromMailbox(list);
          });
      setAnchorEl(null);
    }
    setAnchorEl(null);
  };

  const email = (
    <div>
      <div className={classes.toolbar} />
      <AppBar position='absolute' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Close drawer"
            edge="start"
            onClick={props.handleMailClick()}
            className={classes.arrowBackButton}
          >
            <ArrowBackIcon color="inherit" />
          </IconButton>
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleMenu}
          >
            <MoveToInboxIcon/>
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="Move to trash"
            edge="end"
            onClick={props.handleTrash(props.fromID)}
          >
            <DeleteIcon/>
          </IconButton>

          <IconButton
            color="inherit"
            aria-label="Mark unread"
            edge="end"
            onClick={(event) => props.handleViewClick(props.fromID)}
          >
            <MarkunreadIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box m={1}>
        <Typography variant="h6">
          {props.fromSubject}
        </Typography>
        <Box p={1} flexWrap="wrap" bgcolor="grey.300" display="flex"
          css={{width: '100%'}}
        >
          {props.fromMailbox.charAt(0).toUpperCase() +
          props.fromMailbox.slice(1)}
        </Box>
        <IconButton
          edge="end"
          onClick={props.handleStarClick(props.fromID)}
        >
          {props.clicks.includes(props.fromID) ?
            <StarIcon/> : <StarBorderIcon/>}
        </IconButton>
      </Box>
      <Divider/>
      <br/>
      <div>
        <Box m={1} display="flex">
          <Avatar alt="avatar" className={classes.avatar} display="inline">
            {props.fromName.charAt(0)}
          </Avatar>
          <Box justifyContent="flex-start">
            <Box>
              <Typography>
                {props.fromName}
              </Typography>
            </Box>
            <Box>
              <Typography>
                {props.fromEmail}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography>
              {received}
            </Typography>
          </Box>
        </Box>
        <br/>
        <Divider/>
        <br/>
        <Box m={2}>
          {props.fromContent}
        </Box>
      </div>
    </div>
  );

  return (
    <div>
      <div>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerEmail,
            }}
            variant="persistent"
            anchor={'bottom'}
            open={props.emailOpen}
            onClose={props.handleMailClick}
          >
            {email}
          </Drawer>
        </Hidden>
        <Hidden smUp implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerEmailMobile,
            }}
            variant="persistent"
            anchor={'bottom'}
            open={props.emailOpen}
            onClose={props.handleMailClick}
          >
            {email}
          </Drawer>
        </Hidden>
      </div>
      <div>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <div>
            {menuList.map((list) => {
              return (
                <MenuItem key={list}
                  onClick={(event) => handleMenuClose(list)}
                >
                  {list.charAt(0).toUpperCase() +
                   list.slice(1)}
                </MenuItem>
              );
            })}
          </div>
        </Menu>
      </div>
    </div>
  );
}

OpenMail.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  handleMailClick: PropTypes.func,
  emailOpen: PropTypes.bool,
  setEmailOpen: PropTypes.func,
  fromName: PropTypes.string,
  fromEmail: PropTypes.string,
  fromSubject: PropTypes.string,
  fromContent: PropTypes.string,
  fromReceived: PropTypes.string,
  fromMailbox: PropTypes.string,
  setFromMailbox: PropTypes.func,
  fromID: PropTypes.string,
  clicks: PropTypes.array,
  setClicks: PropTypes.func,
  handleStarClick: PropTypes.func,
  handleTrash: PropTypes.func,
  handleViewClick: PropTypes.func,
};
