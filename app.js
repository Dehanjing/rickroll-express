let express = require("express");
const app = express();
let __dir = process.cwd();
const PORT = process.env.PORT || 8000;
const cors = require("cors");
const axios = require("axios");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const rickroll = `${__dir}/static/awokwok.mp4`;
let { creator, github } = require("./config.json");

function countVisitor(host) {
	return new Promise(resolve => {
		axios.get("https://api.countapi.xyz/hit/" + host + "/rickroll")
		.then(response => resolve(response.data.value))
		.catch(err => err);
	});
}

app.set('trust proxy', true);
app.use(express.static("static"));
app.set("json spaces", 2);
app.use(favicon(__dir + "/static/favicon.jpg"));
app.use(morgan("dev"));
app.use(morgan("combined"));
app.use(cors());

app.use(function(req, res, next) {
	res.setHeader("Creator", creator);
	res.setHeader("Github", github);
	res.setHeader("Dehanjing", "https://dhn.my.id/");
	next();
});

app.get("/", async (req, res) => {
	res.sendFile(rickroll);
	await countVisitor(req.headers.host);
});

app.get("/visitor", async (req, res) => {
	let visitor = await countVisitor(req.headers.host);
	res.status(200).json({
		visitor,
	});
});

app.use("*", async (req, res) => {
	res.sendFile(rickroll);
	await countVisitor(req.headers.host);
});

app.listen(PORT, () => console.log("App listening to http://localhost:" + PORT));