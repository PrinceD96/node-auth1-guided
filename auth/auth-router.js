const bcrypt = require("bcryptjs");

const router = require("express").Router();
const Users = require("../users/users-model");

router.post("/register", (req, res) => {
	let user = req.body;
	const hash = bcrypt.hashSync(user.password, 8);

	user.password = hash;

	Users.add(user)
		.then(saved => {
			res.status(201).json({ saved });
		})
		.catch(error => {
			res.status(500).json({ message: "Problem with the database", error });
		});
});

router.post("/login", (req, res) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.then(([user]) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.user = username;
				res.status(200).json({ message: "welcome" });
			} else {
				res.status(401).json({ message: "invalid credentials" });
			}
		})
		.catch(error => {
			res.status(500).json({ message: "Problem with the database", error });
		});
});

router.get("/logout", (req, res) => {
	req.session.destroy(error => {
		error ? res.send("unable to logout") : res.send("logged out");
	});
});

module.exports = router;
