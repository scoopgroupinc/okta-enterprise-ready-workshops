import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient, Todo, User } from '@prisma/client';
import passportLocal from 'passport-local';
import passportOIDC from 'passport-openidconnect';
import passport from 'passport';
import session from 'express-session';
import passportBearer from 'passport-http-bearer';
import cors from 'cors';

// body-parser is required to accept the header content-type application/scim+json from Okta
// https://www.npmjs.com/package/body-parser
// RFC Notes: https://datatracker.ietf.org/doc/html/rfc7644#section-3.1
import bodyParser from 'body-parser';

// For logging http requests
import morgan from 'morgan';

// Import the scimRoute from the scim.ts file
import { scimRoute } from './scim';
import { dateData } from './dateData';
import { openaiRoute } from './openai';

interface IUser {
  id: number;
}

const prisma = new PrismaClient();
const LocalStrategy = passportLocal.Strategy;
const OpenIDConnectStrategy = passportOIDC.Strategy;
const BearerStrategy = passportBearer.Strategy;

const app = express();
app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'top secret',
    cookie: {
      http: false,
      sameSite: 'lax',
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/todos', (req, res, next) => {
  if (req.isUnauthenticated()) {
    return res.sendStatus(401);
  }

  next();
});
app.use('/api/users', (req, res, next) => {
  if (req.isUnauthenticated()) {
    return res.sendStatus(401);
  }

  next();
});

app.use(
  '/api/datedata',
  (req, res, next) => {
    if (req.isUnauthenticated()) {
      return res.sendStatus(401);
    }

    next();
  },
  dateData
);

app.use(
  '/api/openai',
  (req, res, next) => {
    if (req.isUnauthenticated()) {
      return res.sendStatus(401);
    }

    next();
  },
  openaiRoute
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await prisma.user.findFirst({
      where: {
        AND: {
          email: username,
          password,
        },
      },
    });

    return done(null, user);
  })
);

passport.serializeUser(async (user: IUser, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const user: User = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  done(null, user);
});

app.post('/api/register', async (req, res) => {
  console.log('req.body: ', req.body);
  const { email, password, name } = req.body;

  // Input validation (basic example)
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: 'Name, email, and password are required.' });
  }

  // More comprehensive validation should be done here

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: `User with email ${email} already exists.` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Send Response
    res
      .status(201)
      .json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  }

  try {
    // Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // User matched, proceed with login process
    // For example, generating a JWT token or starting a session
    // ...

    res.status(200).json({ message: 'User logged in successfully' });
    // Include the token or user data as needed
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.post('/api/signin', passport.authenticate('local'), async (req, res) => {
  res.json({
    name: req.user['name'],
  });
});

app.post('/api/signout', async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(204);
  });
});

app.get('/api/users/me', async (req, res) => {
  const user: User = await prisma.user.findUnique({
    where: {
      id: req.user['id'],
    },
  });

  delete user.password;

  res.json({ ...user });
});

//-------- TODO --------------

app.get('/api/todos', async (req, res) => {
  const todos: Todo[] = await prisma.todo.findMany({
    where: {
      userId: req.user['id'],
    },
  });
  res.json({ todos });
});

app.post('/api/todos', async (req, res) => {
  const { task } = req.body;
  const id = req.user['id'];
  const todo: Todo = await prisma.todo.create({
    data: {
      task,
      completed: false,
      user: { connect: { id } },
      org: { connect: { id: req.user['orgId'] } },
    },
  });

  res.json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { task, completed } = req.body;
  let completedAt = null;

  if (completed) {
    completedAt = new Date().toISOString();
  }

  const todo: Todo = await prisma.todo.update({
    where: { id },
    data: { task, completed, completedAt },
  });

  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.todo.delete({
    where: { id },
  });

  res.sendStatus(204);
});

////////////// ORG ------
app.get('/api/org/todos', passport.authenticate('bearer'), async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      orgId: req.user['id'],
    },
  });
  res.json({ todos });
});

///////////////////////////////////////////////////////
// SCIM-related routes

passport.use(
  new BearerStrategy(async (apikey, done) => {
    const org = await prisma.org.findFirst({
      where: {
        apikey,
      },
    });

    return done(null, org);
  })
);

app.use(bodyParser.json({ type: 'application/scim+json' }));

// https://github.com/expressjs/morgan
app.use(morgan('combined'));

// '/scim/v2' path appends to every SCIM Endpoints
// Okta recommended url - https://developer.okta.com/docs/guides/scim-provisioning-integration-prepare/main/#base-url
app.use('/scim/v2', scimRoute);

app.use(cors());
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

////////////////////////////////////////////
// OpenID Connect Routes Below

function getDomainFromEmail(email) {
  let domain;
  try {
    domain = email.split('@')[1];
  } catch (e) {
    return null;
  }
  return domain;
}

app.post('/api/openid/check', async (req, res, next) => {
  const { username } = req.body;

  const domain = getDomainFromEmail(username);
  if (domain) {
    let org = await prisma.org.findFirst({
      where: {
        domain: domain,
      },
    });
    if (!org) {
      org = await prisma.org.findFirst({
        where: {
          User: {
            some: {
              email: username,
            },
          },
        },
      });
    }
    if (org && org.issuer) {
      return res.json({ org_id: org.id });
    }
  }

  res.json({ org_id: null });
});

function createStrategy(org) {
  return new OpenIDConnectStrategy(
    {
      issuer: org.issuer,
      authorizationURL: org.authorization_endpoint,
      tokenURL: org.token_endpoint,
      userInfoURL: org.userinfo_endpoint,
      clientID: org.client_id,
      clientSecret: org.client_secret,
      scope: 'profile email',
      callbackURL: 'http://localhost:3333/openid/callback/' + org.id,
    },
    async function verify(issuer, profile, cb) {
      // Passport.js runs this verify function after successfully completing
      // the OIDC flow, and gives this app a chance to do something with
      // the response from the OIDC server, like create users on the fly.

      let user = await prisma.user.findFirst({
        where: {
          orgId: org.id,
          externalId: profile.id,
        },
      });

      if (!user) {
        user = await prisma.user.findFirst({
          where: {
            orgId: org.id,
            email: profile.emails[0].value,
          },
        });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { externalId: profile.id },
          });
        }
      }

      if (!user) {
        user = await prisma.user.create({
          data: {
            org: { connect: { id: org.id } },
            externalId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          },
        });
      }

      return cb(null, user);
    }
  );
}

async function orgFromId(id) {
  const org = await prisma.org.findFirst({
    where: {
      id: parseInt(id),
    },
  });
  return org;
}

// The frontend then redirects here to have the backend start the OIDC flow.
// (You should probably use random IDs, not auto-increment integers
// to avoid revealing how many enterprise customers you have.)
app.get('/openid/start/:id', async (req, res, next) => {
  const org = await orgFromId(req.params.id);
  if (!org) {
    return res.sendStatus(404);
  }

  const strategy = createStrategy(org);
  if (!strategy) {
    return res.sendStatus(404);
  }

  passport.authenticate(strategy)(req, res, next);
});

app.get('/openid/callback/:id', async (req, res, next) => {
  const org = await orgFromId(req.params.id);
  if (!org) {
    return res.sendStatus(404);
  }

  const strategy = createStrategy(org);
  if (!strategy) {
    return res.sendStatus(404);
  }

  passport.authenticate(strategy, {
    successRedirect: 'http://localhost:3000/',
  })(req, res, next);
});
