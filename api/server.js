const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const restricted = require("../auth/restricted-middleware");
const knexSessionStore = require("connect-session-knex")(session);

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router");

const server = express();

const sessionConfig = {
	name: "lemonade",
	secret: "I cannot tell you my secret",
	cookie: {
		maxAge: 1000 * 30,
		secure: false, // should be true in production
		httpOnly: true
	},
	resave: false,
	saveUninitialized: false,

	store: new knexSessionStore({
		knex: require("../database/dbConfig"),
		tableName: "sessions",
		sidfieldname: "sid",
		createtable: true,
		clearInterval: 1000 * 30
	})
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", restricted, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
	res.json({ api: "up" });
});

module.exports = server;
