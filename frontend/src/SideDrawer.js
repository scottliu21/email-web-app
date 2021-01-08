/**
 * With code from Material UI Responsive Drawer
 * https://codesandbox.io/s/6khtm
 */
import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import MailIcon from '@material-ui/icons/Mail';
import StarIcon from '@material-ui/icons/Star';
import axios from 'axios';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import AllInboxIcon from '@material-ui/icons/AllInbox';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  button: {
    textTransform: 'none',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    marginTop: 55,
  },
}));

/**
 * @param {object} props
 * @return {object} SideDrawer
 */
export default function SideDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const {window} = props;
  const [mailboxList, setMailboxList] = React.useState([]);
  const [inboxCount, setInboxCount] = React.useState(0);
  const [sentCount, setSentCount] = React.useState(0);
  const [trashCount, setTrashCount] = React.useState(0);
  const [count] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:3010/v0/mail/getMailboxList')
        .then((response) => {
          response.data.splice(0, 3);
          const mailboxes = response.data;
          setMailboxList(mailboxes);
        });
    axios.get('http://localhost:3010/v0/mail/getCount?mailbox=inbox')
        .then((response) => {
          setInboxCount(response.data.count);
        });
    axios.get('http://localhost:3010/v0/mail/getCount?mailbox=trash')
        .then((response) => {
          setTrashCount(response.data.count);
        });
    axios.get('http://localhost:3010/v0/mail/getCount?mailbox=sent')
        .then((response) => {
          setSentCount(response.data.count);
        });
    for (let i = 0; i < mailboxList.length; i++) {
      axios.get('http://localhost:3010/v0/mail/getCount?mailbox=' + mailboxList[i])
          .then((response) => {
            count[i] = response.data.count;
          });
    }
  }, [mailboxList]);


  const drawer = (
    <div>
      <List>
        <ListItem
          button
          selected={props.selectedIndex === 0}
          onClick={(event) => props.handleListItemClick(event, 0, 'inbox')}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
          {inboxCount}
        </ListItem>

        <ListItem
          button
          selected={props.selectedIndex === 1}
          onClick={(event) => props.handleListItemClick(event, 1, 'trash')}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Trash" />
          {trashCount}
        </ListItem>

        <ListItem
          button
          selected={props.selectedIndex === 2}
          onClick={(event) => props.handleListItemClick(event, 2, 'sent')}
        >
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="Sent" />
          {sentCount}
        </ListItem>

        <ListItem
          button
          selected={props.selectedIndex === 3}
          onClick={(event) => props.handleListItemClick(event, 3, 'starred')}
        >
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Starred" />
        </ListItem>
      </List>
      <Divider/>
      <div>
        {mailboxList.map((list) => {
          return (
            <List key={list}>
              <ListItem
                button
                selected={props.selectedIndex === (4 +
                  mailboxList.indexOf(list))}
                onClick={(event) => props.handleListItemClick(event,
                    4 + mailboxList.indexOf(list), list)}
              >
                <ListItemIcon>
                  <AllInboxIcon/>
                </ListItemIcon>
                <ListItemText primary={list} />
                {count[mailboxList.indexOf(list)] - 1}
              </ListItem>
            </List>
          );
        })}
      </div>
      <Divider/>
      <div>
        <Button className={classes.button}
          color="default"
          variant="text"
          onClick={props.handleNewMailboxOpen}
          startIcon={<AddIcon />}
        >
          New Mailbox
        </Button>
      </div>
    </div>
  );

  const container = window !== undefined ? () =>
    window().document.body : undefined;

  return (
    <div>
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={props.mobileOpen}
          onClose={props.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </div>
  );
}

SideDrawer.propTypes = {
  selectedIndex: PropTypes.int,
  mobileOpen: PropTypes.bool,
  handleListItemClick: PropTypes.func,
  window: PropTypes.func,
  handleDrawerToggle: PropTypes.func,
  handleNewMailboxOpen: PropTypes.func,
};
