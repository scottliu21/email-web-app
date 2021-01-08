import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
// import Grid from '@material-ui/core/Grid';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));


/**
 * @param {object} props
 * @return {object} MyList
 */
export default function MyList(props) {
  const classes = useStyles();

  React.useEffect(() => {
    if (props.currentMailbox === 'starred') {
      axios.get('http://localhost:3010/v0/mail/starred')
          .then((response) => {
            props.setData(response.data[0]);
          })
          .catch( function(error) {
            console.log(error);
          });
    } else {
      axios.get('http://localhost:3010/v0/mail?mailbox=' + props.currentMailbox)
          .then((response) => {
            props.setData(response.data[0]);
          })
          .catch( function(error) {
            console.log(error);
          });
    }
  }, [props.data]);

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

  const sortedMail = props.data.mail.concat().sort((a, b) =>
    new Date(b.received) - new Date(a.received),
  );
  for (let i = 0; i < props.data.mail.length; i++) {
    sortedMail[i].formatted = formatDate(sortedMail[i].received);
  }

  return (
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
  );
}

MyList.propTypes = {
  currentMailbox: PropTypes.string,
  data: PropTypes.object,
  setData: PropTypes.func,
  handleMailClick: PropTypes.func,
  clicks: PropTypes.array,
  setClicks: PropTypes.func,
  handleStarClick: PropTypes.func,
  viewed: PropTypes.array,
  setViewed: PropTypes.func,
  handleViewClick: PropTypes.func,
};

