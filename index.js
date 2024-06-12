const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded());

app.post("/scrape", async(req, res) => {
  console.log(req.body);
  const{url}=req.body
  const data=await scrapeLogic(url);
  res.send(data);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
