/**
 * With code from Material UI Responsive Drawer
 * https://codesandbox.io/s/6khtm
 */
import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
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
 * @return {object} Compose
 */
export default function Compose(props) {
  const classes = useStyles();
  const [toName, setToName] = React.useState('');
  const [toEmail, setToEmail] = React.useState('');
  const [content, setContent] = React.useState('');
  const [subject, setSubject] = React.useState('');

  const handleSend = () => {
    const mail = {
      to: {name: toName, email: toEmail},
      subject: subject,
      content: content,
    };
    axios.post('http://localhost:3010/v0/mail', mail)
        .then((response) => {
          console.log(response);
        });
    setToName('');
    setToEmail('');
    setContent('');
    setSubject('');
    props.setComposeOpen(!props.composeOpen);
    axios.get('http://localhost:3010/v0/mail?mailbox=' + props.currentMailbox)
        .then((response) => {
          props.setData(response.data[0]);
        })
        .catch( function(error) {
          console.log(error);
        });
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
            onClick={props.handleCompose}
            className={classes.arrowBackButton}
          >
            <ArrowBackIcon color="inherit" />
          </IconButton>
          <Box display='flex' flexGrow={1}>
            <Typography variant ='h6' noWrap>
              New Mail
            </Typography>
          </Box>

          <IconButton
            color="inherit"
            aria-label="Send Email"
            edge="end"
            onClick={handleSend}
            className={classes.sendButton}
          >
            <SendIcon color="inherit" />
          </IconButton>

        </Toolbar>
      </AppBar>
      <div>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            style={{margin: 8}}
            placeholder="To Name"
            fullWidth
            margin="normal"
            value={toName}
            onChange={(e) => setToName(e.target.value)}
          />
          <TextField
            style={{margin: 8}}
            placeholder="To Email"
            fullWidth
            margin="normal"
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
          />
          <TextField
            style={{margin: 8}}
            placeholder="Subject"
            fullWidth
            margin="normal"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            style={{margin: 8}}
            placeholder="Content"
            fullWidth
            multiline
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>
      </div>
    </div>
  );

  return (
    <div>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerEmail,
          }}
          variant="persistent"
          anchor={'bottom'}
          open={props.composeOpen}
          onClose={props.handleCompose}
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
          open={props.composeOpen}
          onClose={props.handleCompose}
        >
          {email}
        </Drawer>
      </Hidden>
    </div>

  );
}

Compose.propTypes = {
  handleCompose: PropTypes.func,
  composeOpen: PropTypes.bool,
  setComposeOpen: PropTypes.func,
  currentMailbox: PropTypes.string,
  setCurrentMailbox: PropTypes.func,
  data: PropTypes.object,
  setData: PropTypes.func,
};
