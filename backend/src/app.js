const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const mail = require('./mail');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

// Your routes go here
app.get('/v0/mail', mail.getMail);
app.get('/v0/mail/getMailboxList', mail.getMailboxList);
app.get('/v0/mail/starred', mail.getStarredMail);
app.get('/v0/mail/getCount', mail.getCount);
app.get('/v0/mail/:id', mail.getById);
app.post('/v0/mail', mail.post);
app.post('/v0/mail/newMailbox', mail.postMailbox);
app.put('/v0/mail/:id', mail.put);
app.patch('/v0/mail/:id', mail.patch);
app.patch('/v0/mail/view/:id', mail.patchViewed);


app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
