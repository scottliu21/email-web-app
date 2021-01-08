import React from 'react';
import NavBar from './NavBar';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import SideDrawer from './SideDrawer';
import MyList from './MyList';
import Compose from './Compose';
import OpenMail from './OpenMail';
import OpenNewMailbox from './OpenNewMailbox';
import SearchView from './SearchView';
import axios from 'axios';

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
  toolbar: theme.mixins.toolbar,
}));

/**
 * Simple component with no state.
 * @return {object} JSX
 */
function App() {
  const classes = useStyles();
  // All the states to be used and passed to components
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [appBarText, setAppBarText] = React.useState('Inbox');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [currentMailbox, setCurrentMailbox] = React.useState('inbox');
  const [composeOpen, setComposeOpen] = React.useState(false);
  const [data, setData] = React.useState({mail: []});
  const [emailOpen, setEmailOpen] = React.useState(false);
  const [fromName, setFromName] = React.useState('');
  const [fromEmail, setFromEmail] = React.useState('');
  const [fromContent, setFromContent] = React.useState('');
  const [fromReceived, setFromReceived] = React.useState('');
  const [fromSubject, setFromSubject] = React.useState('');
  const [fromMailbox, setFromMailbox] = React.useState('');
  const [fromID, setFromID] = React.useState('');
  const [clicks, setClicks] = React.useState([]);
  const [newMailboxOpen, setNewMailboxOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [viewed, setViewed] = React.useState([]);
  const [searchOpen, setSearchOpen] = React.useState(false);

  // All the functions that will be passed to components
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleListItemClick = (event, index, mailboxName) => {
    setSelectedIndex(index);
    setCurrentMailbox(mailboxName);
    setAppBarText(mailboxName.charAt(0).toUpperCase() +
      mailboxName.slice(1));
  };
  const handleCompose = () => {
    setComposeOpen(!composeOpen);
  };

  const handleNewMailboxOpen = () => {
    setNewMailboxOpen(true);
  };

  const handleNewMailboxClose = () => {
    if (name) {
      axios.post('http://localhost:3010/v0/mail/newMailbox?mailbox=' + name)
          .then((response) => {
          });
      setNewMailboxOpen(false);
    }
    setNewMailboxOpen(false);
  };

  const handleMailClick = (id) => () => {
    if (id === undefined) {
      setFromName(''); setFromEmail(''); setFromSubject('');
      setFromReceived(''); setFromContent('');
      setEmailOpen(!emailOpen);
    } else {
      axios.get('http://localhost:3010/v0/mail/' + id)
          .then((response) => {
            const mail = response.data.mail[0];
            setFromName(mail.from.name);
            setFromEmail(mail.from.email);
            setFromSubject(mail.subject);
            setFromReceived(mail.received);
            setFromContent(mail.content);
            setFromMailbox(response.data.name);
            setEmailOpen(!emailOpen);
            setFromID(mail.id);
          });
      if (viewed.includes(id) === false) {
        handleViewClick(id);
      }
    }
  };

  const handleStarClick = (id) => () => {
    const result = clicks.includes(id)?
      clicks.filter((click) => click != id): [...clicks, id];
    setClicks(result);
    axios.patch('http://localhost:3010/v0/mail/' + id)
        .then((response) => {
        });
  };

  const handleViewClick = (id) => {
    const result = viewed.includes(id)?
      viewed.filter((view) => view != id): [...viewed, id];
    setViewed(result);
    axios.patch('http://localhost:3010/v0/mail/view/' + id)
        .then((response) => {
        });
  };

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
  };

  const handleTrash = (id) => () => {
    axios.put('http://localhost:3010/v0/mail/' + id + '?mailbox=trash')
        .then((response) => {
          setEmailOpen(!emailOpen);
        });
  };

  return (

    <div className={classes.root}>
      <NavBar handleDrawerToggle={handleDrawerToggle}
        appBarText={appBarText}
        handleCompose={handleCompose}
        handleSearchClick={handleSearchClick}
      />

      <nav className={classes.drawer} aria-label="mailbox folders">
        <SideDrawer selectedIndex={selectedIndex} mobileOpen={mobileOpen}
          handleListItemClick={handleListItemClick}
          handleDrawerToggle={handleDrawerToggle}
          handleNewMailboxOpen={handleNewMailboxOpen}
        />

        <Compose handleCompose={handleCompose}
          composeOpen={composeOpen}
          setComposeOpen={setComposeOpen}
          currentMailbox={currentMailbox}
          setCurrentMailbox={setCurrentMailbox}
          data={data}
          setData={setData}
        />

        <OpenNewMailbox newMailboxOpen={newMailboxOpen}
          handleNewMailboxOpen={handleNewMailboxOpen}
          handleNewMailboxClose={handleNewMailboxClose}
          name={name} setName={setName}
        />

        <SearchView handleSearchClick={handleSearchClick}
          searchOpen={searchOpen} handleMailClick={handleMailClick}
          viewed={viewed} clicks={clicks}
          handleStarClick={handleStarClick}
        />
      </nav>
      <div style={{marginTop: 55}}>
        <Box className={classes.toolbar}>
          <MyList currentMailbox={currentMailbox}
            setData={setData} data={data}
            handleMailClick={handleMailClick}
            clicks={clicks} setClicks={setClicks}
            handleStarClick={handleStarClick}
            viewed={viewed} setViewed={setViewed}
            handleViewClick={handleViewClick}
          />
        </Box>
      </div>
      <div>
        <OpenMail emailOpen={emailOpen}
          setEmailOpen={setEmailOpen}
          handleMailClick={handleMailClick}
          fromName={fromName} fromEmail={fromEmail}
          fromSubject={fromSubject} fromContent={fromContent}
          fromReceived={fromReceived} fromMailbox={fromMailbox}
          fromID={fromID} setFromMailbox={setFromMailbox}
          clicks={clicks} setClicks={setClicks}
          handleStarClick={handleStarClick}
          handleTrash={handleTrash}
          handleViewClick={handleViewClick}
        />
      </div>

    </div>

  );
}

export default App;
