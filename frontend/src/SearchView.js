import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SearchIcon from '@material-ui/icons/Search';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import ClearIcon from '@material-ui/icons/Clear';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
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
  cancelSearchButton: {
    marginRight: theme.spacing(2),
  },
  searchButton: {
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
 * @return {object} SearchView
 */
export default function SearchView(props) {
  const classes = useStyles();
  const [searchValue, setSearchValue] = React.useState('');
  const [searchData, setSearchData] = React.useState([]);

  /**
   * Formats date entries for inbox
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

  const handleSearch = () => {
    axios.get('http://localhost:3010/v0/mail?from=' + searchValue)
        .then((response) => {
          const mail = [];
          for (let i = 0; i < response.data.length; i++) {
            for (let j = 0; j < response.data[i].mail.length; j++) {
              mail.push(response.data[i].mail[j]);
            }
          };
          setSearchData(mail);
        });
  };

  const handleCancel = () => {
    setSearchData([]);
    setSearchValue('');
  };

  const sortedMail = searchData.concat().sort((a, b) =>
    new Date(b.received) - new Date(a.received),
  );
  for (let i = 0; i < searchData.length; i++) {
    sortedMail[i].formatted = formatDate(sortedMail[i].received);
  }

  const navBar = (
    <div>
      <div>
        <div className={classes.toolbar} />
        <AppBar position='absolute' className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Close drawer"
              edge="start"
              onClick={props.handleSearchClick}
              className={classes.cancelSearchButton}
            >
              <ArrowBackIcon color="inherit" />
            </IconButton>
            <Box display='flex' flexGrow={1}>
              <form className={classes.root} noValidate autoComplete="off">
                <Input
                  style={{backgroundColor: 'white'}}
                  color="primary"
                  variant="outlined"
                  size="small"
                  placeholder="Enter search here"
                  value={searchValue}
                  fullWidth
                  onChange={(e) => setSearchValue(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="cancel search"
                        onClick={handleCancel}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </form>
            </Box>

            <IconButton
              color="inherit"
              aria-label="Search Emails"
              edge="end"
              className={classes.searchButton}
              onClick={handleSearch}
            >
              <SearchIcon color="inherit" />
            </IconButton>

          </Toolbar>
        </AppBar>
      </div>
      <div>
        {sortedMail.map((list) => {
          return (
            <List className={classes.root} key={list.id}>
              <ListItem
                alignItems="flex-start"
              >
                <ListItemAvatar>
                  <Avatar alt="avatar"
                    className={classes.avatar}
                  >
                    {list.from.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  onClick={props.handleMailClick(list.id)}
                  primary={
                    <React.Fragment>
                      <Typography>
                        <Box
                          component="span"
                          fontWeight={props.viewed.includes(list.id) ?
                            'fontWeightRegular' : 'fontWeightBold'}
                        >
                          {list.subject}
                        </Box>
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        <Box
                          component="span"
                          fontWeight={props.viewed.includes(list.id) ?
                            'fontWeightRegular' : 'fontWeightBold'}
                        >
                          {list.from.name}
                        </Box>
                      </Typography>
                      {' - ' + list.content.substring(0, 30) + '...'}
                    </React.Fragment>
                  }
                />
                <ListItemText align="right"
                  primary={list.formatted}
                />

                <IconButton
                  edge="end"
                  align="right"
                  onClick={props.handleStarClick(list.id)}
                >
                  {props.clicks.includes(list.id) ?
                    <StarIcon/> : <StarBorderIcon/>}
                </IconButton>

              </ListItem>
              <Divider variant="inset" component="li"/>
            </List>
          );
        })}
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
            anchor={'top'}
            open={props.searchOpen}
            onClose={props.handleSearchClick}
          >
            {navBar}
          </Drawer>
        </Hidden>
        <Hidden smUp implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerEmailMobile,
            }}
            variant="persistent"
            anchor={'top'}
            open={props.searchOpen}
            onClose={props.handleSearchClick}
          >
            {navBar}
          </Drawer>
        </Hidden>
      </div>
    </div>
  );
}

SearchView.propTypes = {
  handleSearchClick: PropTypes.func,
  searchOpen: PropTypes.bool,
  viewed: PropTypes.array,
  handleMailClick: PropTypes.func,
  clicks: PropTypes.array,
  handleStarClick: PropTypes.func,
};
