import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

/**
 * @param {object} props
 * @return {object} OpenNewMailbox
 */
export default function OpenNewMailbox(props) {
  return (
    <div>
      <Dialog open={props.newMailboxOpen} onClose={props.handleNewMailboxClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create new mailbox</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Mailbox Name"
            type="email"
            fullWidth
            onChange={(e) => props.setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleNewMailboxClose} color="primary">
            Cancel
          </Button>
          <Button onClick={props.handleNewMailboxClose} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

OpenNewMailbox.propTypes = {
  handleNewMailboxOpen: PropTypes.func,
  handleNewMailboxClose: PropTypes.func,
  newMailboxOpen: PropTypes.bool,
  name: PropTypes.string,
  setName: PropTypes.func,
};
