const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});


exports.returnMailboxList = async () => {
  const select = 'SELECT mailbox FROM mail';
  const query = {
    text: select,
  };
  const list = [];
  const {rows} = await pool.query(query);
  for (const row of rows) {
    list.push(row.mailbox);
  }
  const unique = [...new Set(list)];
  return unique;
};

exports.selectEmails = async (mailbox, from) => {
  let select = 'SELECT id, mailbox, mail, starred FROM mail';
  if (mailbox && !from) {
    select += ` WHERE mailbox = $1`;
    const query = {
      text: select,
      values: [mailbox],
    };
    // console.log(query);
    const {rows} = await pool.query(query);
    const emails = [];
    for (const row of rows) {
      if (row.mail != null) {
        row.mail.id = row.id;
        emails.push(row.mail);
      }
    }
    return emails;
  }
  if (from && mailbox) {
    const sub = '%' + from.substring(0, 3) + '%';
    select += ` WHERE (mailbox = ($1)) AND
      (mail->'from'->>'name' ILIKE ($2) OR mail->'from'->>'email' ILIKE ($3))`;
    const query = {
      text: select,
      values: [mailbox, sub, from],
    };
    // console.log(query);
    const {rows} = await pool.query(query);
    if (rows) {
      const emails = [];
      for (const row of rows) {
        row.mail.id = row.id;
        emails.push(row.mail);
      }
      return emails;
    }
  }
  const query = {
    text: select,
    values: [],
  };
  // console.log(query);
  const {rows} = await pool.query(query);
  const emails = [];
  for (const row of rows) {
    if (row.mail != null) {
      row.mail.id = row.id;
      emails.push(row.mail);
    }
  }
  return emails;
};

exports.selectById = async (id) => {
  const select = 'SELECT id, mailbox, mail FROM mail WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  if (rows[0]) {
    rows[0].mail.id = rows[0].id;
    const x = {name: rows[0].mailbox, mail: [rows[0].mail]};
    return x;
  }
  return undefined;
};

exports.insertEmail = async (email) => {
  const insert = 'INSERT INTO mail(mailbox, mail, starred) VALUES ($1, $2, $3) RETURNING id';
  const query = {
    text: insert,
    values: ['sent', email, false],
  };
  const {rows} = await pool.query(query);
  return rows[0].id;
};

exports.insertMailbox = async(mailbox) => {
  const insert = 'INSERT INTO mail(mailbox) VALUES ($1)';
  const query = {
    text: insert,
    values: [mailbox],
  }
  await pool.query(query);
}

exports.moveEmail = async (id, newMailbox) => {
  const update = 'UPDATE mail SET mailbox = ($1) WHERE id = ($2)';
  const query = {
    text: update,
    values: [newMailbox, id],
  };
  console.log(query);
  await pool.query(query);
};

exports.getStarred = async (id) => {
  const select = 'SELECT id, starred FROM mail WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  }
  const {rows} = await pool.query(query);
  return rows[0].starred;
}

exports.setStarred = async (id, starred) => {
  const update = 'UPDATE mail SET starred = ($1) WHERE id = ($2)';
  const query = {
    text: update,
    values: [!starred, id],
  };
  console.log(query);
  await pool.query(query);
}

exports.getStarredMailbox = async () => {
  const select = 'SELECT id, mailbox, mail, starred FROM mail WHERE starred = $1';
  const query = {
    text: select,
    values: [true],
  }
  const {rows} = await pool.query(query);
  const emails = [];
  for (const row of rows) {
    row.mail.id = row.id;
    emails.push(row.mail);
  }
  return emails;
}

exports.getViewed = async (id) => {
  const select = 'SELECT id, viewed FROM mail WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  }
  const {rows} = await pool.query(query);
  return rows[0].viewed;
}

exports.setViewed = async (id, viewed) => {
  const update = 'UPDATE mail SET viewed = ($1) WHERE id = ($2)';
  const query = {
    text: update,
    values: [!viewed, id],
  };
  console.log(query);
  await pool.query(query);
}

exports.viewedCount = async (mailbox) => {
  const select = 'SELECT id, mail, viewed FROM mail WHERE mailbox = ($1) AND viewed = ($2)';
  const query = {
    text: select,
    values: [mailbox, false],
  };
  const {rows} = await pool.query(query);
  count = rows.length;
  return count;
}

console.log(`Connected to database '${process.env.POSTGRES_DB}'`);

