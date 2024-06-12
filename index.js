import express from "express";
import  scrapeLogic  from "./scrapeLogic.js";
import wrapperFunEmailVerfier from "./emailVerification.js";
const app = express();

const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/scrape", async(req, res) => {
  console.log(req.body);
  const{url}=req.body
  const data=await scrapeLogic(url);
  res.send(data);
});
app.post("/emailVerification", async(req, res) => {
  const{firstName,lastName,domainName}=req.body
  console.log(`firstName=${firstName},lastName=${lastName},domainName=${domainName}`)
  const data=await wrapperFunEmailVerfier(firstName,lastName,domainName);
  res.send({
    success:true,
    data:data});
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
