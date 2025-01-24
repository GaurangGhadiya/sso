const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const basePath = ""; // Set your base path here

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === "/") {
      res.writeHead(302, { Location: `${basePath}/` });
      res.end();
      return;
    }

    if (
      pathname.startsWith(`${basePath}/_next`) ||
      pathname.startsWith(`${basePath}/api`)
    ) {
      handle(req, res, parsedUrl);
    } else if (pathname.startsWith(`${basePath}/_next/image`)) {
      const imagePath = pathname.replace(`${basePath}/_next/image`, "");
      const newPath = `/public${basePath}${imagePath}`;
      app.serveStatic(req, res, newPath);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
  });
});
