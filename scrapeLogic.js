import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

let maxRetries=4;

async function safeGoto(page, url, options, retries = 0) {
  try {
      await page.goto(url, options);
  } catch (error) {
      if (retries < maxRetries) {
          console.log(`Retrying navigation to ${url} (${retries + 1}/${maxRetries})...`);
          await safeGoto(page, url, options, retries + 1);
      } else {
          throw error;
      }
  }
}


const scrapeLogic = async (url1) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

      console.log("Puputeer is launched")
      await page.setViewport({ width: 800, height: 600 });


      const cookie = {
          name: 'li_at',
          value: 'AQEFAQ8BAAAAAA_9W-EAAAGP8vkCmgAAAZAXBY8XVgAAsnVybjpsaTplbnRlcnByaXNlQXV0aFRva2VuOmVKeGpaQUFDbHFhTU15Q2EzWUJ0R29nV1ZQK3hrUkhFU09WY1hnaG1SSzV3ZFdGZ0JBQ2VrZ2VEXnVybjpsaTplbnRlcnByaXNlUHJvZmlsZToodXJuOmxpOmVudGVycHJpc2VBY2NvdW50Ojc1NjU1MzcyLDEyMDU4NzkyNiledXJuOmxpOm1lbWJlcjo4ODUyMTEzODVAEnM090WcGzcHVbH0PYjGOdpeaPYJKwGByL1txB_mYFDjIQgYGs7n7bcUB8ZQh5J_X2E5Kj3ObgRXCGYKMfTdoBEME8EdY8_JiJKewOv4IpQdJQuKaIwn9eWzkuLFFsoAibefSHN4cwqEFv3lyHn87NRMB9ZNyc0pUl00dB7P-oQNVlWOQBuZ2vel2E75b1jWAvaK',
          domain: '.www.linkedin.com',
          path: '/',
          httpOnly: false,
          secure: true
      };
      await page.setCookie(cookie);
      await page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.linkedin.com/',
      });

         

          

          await safeGoto(page,url1, {  waitUntil: 'networkidle2',  timeout: 20000000 });
         

          await page.waitForSelector('.account-top-card__account-actions', { timeout: 18000000 });
          await new Promise(r => setTimeout(r, 4000));

          const companyLink = await page.evaluate(() => {
              const links = document.querySelector(".account-top-card__account-actions").children[0].children[3].href;
              return { Link: links };
          });

          console.log(companyLink);
      

      console.log(`All done, check the screenshots. ✨`);

    

    return companyLink;
  } 
  catch (error) {
    console.log(error);
    return error;
} finally {
    console.log("I am in finally");
    browser.close();
}
};

export default scrapeLogic ;
