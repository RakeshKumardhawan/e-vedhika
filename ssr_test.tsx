import { URL } from "url";
const Module = require("module");
const origRequire = Module.prototype.require;
Module.prototype.require = function(request) {
  if (request.endsWith(".css") || request.endsWith(".png") || request.endsWith(".svg")) return {};
  return origRequire.apply(this, arguments);
};
import React from "react";
import ReactDOMServer from "react-dom/server";
import { BrowserRouter } from "react-router-dom";
import App from "./src/App";
try {
  const html = ReactDOMServer.renderToString(<BrowserRouter><App /></BrowserRouter>);
  console.log("Rendered correctly");
} catch (e) {
  console.log(e.stack);
}