const db = require('./db');
const idPattern =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';

exports.getMail = async (req, res) => {
  const mailboxList = await db.returnMailboxList();
  const mailbox = await db.selectEmails(req.query.mailbox);
  if (req.query.mailbox) {
    if (mailboxList.includes(req.query.mailbox) === false) {
      res.status(404).send();
      return;
    }
    if (req.query.from) {
      const mailbox = await db.selectEmails(req.query.mailbox, req.query.from);
      const obj = [{name: req.query.mailbox, mail: mailbox}];
      res.status(200).send(obj);
      return;
    }
    const x = [{name: req.query.mailbox, mail: mailbox}];
    res.status(200).send(x);
    return;
  }
  if (req.query.from) {
    console.log('IN FROM MAIL.JS');
    const allMailboxes = [];
    for (let i = 0; i < mailboxList.length; i++) {
      const mailbox = await db.selectEmails(mailboxList[i], req.query.from);
      const obj = {name: mailboxList[i], mail: mailbox};
      if (obj.mail.length != 0) {
        allMailboxes.push(obj);
      }
    }
    res.status(200).send(allMailboxes);
    return;
  }
  const allMailboxes = [];
  for (let i = 0; i < mailboxList.length; i++) {
    const mailbox = await db.selectEmails(mailboxList[i]);
    const obj = {name: mailboxList[i], mail: mailbox};
    allMailboxes.push(obj);
  }
  res.status(200).send(allMailboxes);
};

exports.getById = async (req, res) => {
  if (req.params.id.match(idPattern)) {
    const email = await db.selectById(req.params.id);
    if (email) {
      res.status(200).json(email);
      return;
    } else {
      res.status(404).send();
      return;
    }
  } else {
    console.log('Invalid UUID');
    res.status(404).send();
  }
};

exports.getStarredMail = async (req, res) => {
  const starredMail = await db.getStarredMailbox();
  const obj = [{name: 'starred', mail: starredMail}];
  res.status(200).send(obj);
}

exports.getMailboxList = async (req, res) => {
  const mailboxList = await db.returnMailboxList();
  res.status(200).send(mailboxList);
}

exports.getCount = async (req, res) => {
  const count = await db.viewedCount(req.query.mailbox);
  const obj = {count: count};
  res.status(200).send(obj);
}

exports.post = async (req, res) => {
  if (req.body.id != undefined ||
    req.body.from != undefined ||
    req.body.sent != undefined ||
    req.body.received != undefined) {
    res.status(400).send(count);
  } else {
    req.body.from = {name: 'CSE183 Student', email: 'cse183student@ucsc.edu'};
    req.body.sent = new Date().toJSON();
    req.body.received = req.body.sent;
    const id = await db.insertEmail(req.body);
    req.body.id = id;
    res.status(201).send(req.body);
  }
};

exports.postMailbox = async (req, res) => {
  await db.insertMailbox(req.query.mailbox)
  res.status(201).send();
}


exports.put = async (req, res) => {
  // Check if ID is valid pattern
  if (req.params.id.match(idPattern)) {
    const email = await db.selectById(req.params.id);
    if (email) {
      if (email.name !== 'sent' && req.query.mailbox === 'sent') {
        res.status(409).send();
        return;
      }
      await db.moveEmail(req.params.id, req.query.mailbox);
      res.status(204).send();
    } else {
      res.status(404).send();
      return;
    }
  } else {
    res.status(400).send();
  }
};

exports.patch = async (req, res) => {
  if (req.params.id.match(idPattern)) {
    const email = await db.selectById(req.params.id);
    if (email) {
      const starred = await db.getStarred(req.params.id);
      await db.setStarred(req.params.id, starred);
      res.status(200).send(starred);
      return;
    } else {
      res.status(404).send();
      return;
    }
  } else {
    res.status(400).send();
  }
};

exports.patchViewed = async (req, res) => {
  if (req.params.id.match(idPattern)) {
    const email = await db.selectById(req.params.id);
    if (email) {
      const viewed = await db.getViewed(req.params.id);
      await db.setViewed(req.params.id, viewed);
      res.status(200).send(viewed);
      return;
    } else {
      res.status(404).send();
      return;
    }
  } else {
    res.status(400).send();
  }
}

