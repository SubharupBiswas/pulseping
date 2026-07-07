
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "4.0.2";globalThis.nextVersion = "16.2.6";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var a, b, c, d, e = {}, f = {};
      function g(a2) {
        var b2 = f[a2];
        if (void 0 !== b2) return b2.exports;
        var c2 = f[a2] = { exports: {} }, d2 = true;
        try {
          e[a2](c2, c2.exports, g), d2 = false;
        } finally {
          d2 && delete f[a2];
        }
        return c2.exports;
      }
      g.m = e, g.amdO = {}, a = [], g.O = (b2, c2, d2, e2) => {
        if (c2) {
          e2 = e2 || 0;
          for (var f2 = a.length; f2 > 0 && a[f2 - 1][2] > e2; f2--) a[f2] = a[f2 - 1];
          a[f2] = [c2, d2, e2];
          return;
        }
        for (var h = 1 / 0, f2 = 0; f2 < a.length; f2++) {
          for (var [c2, d2, e2] = a[f2], i = true, j = 0; j < c2.length; j++) (false & e2 || h >= e2) && Object.keys(g.O).every((a2) => g.O[a2](c2[j])) ? c2.splice(j--, 1) : (i = false, e2 < h && (h = e2));
          if (i) {
            a.splice(f2--, 1);
            var k = d2();
            void 0 !== k && (b2 = k);
          }
        }
        return b2;
      }, g.n = (a2) => {
        var b2 = a2 && a2.__esModule ? () => a2.default : () => a2;
        return g.d(b2, { a: b2 }), b2;
      }, g.d = (a2, b2) => {
        for (var c2 in b2) g.o(b2, c2) && !g.o(a2, c2) && Object.defineProperty(a2, c2, { enumerable: true, get: b2[c2] });
      }, g.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (a2) {
          if ("object" == typeof window) return window;
        }
      }(), g.o = (a2, b2) => Object.prototype.hasOwnProperty.call(a2, b2), g.r = (a2) => {
        "u" > typeof Symbol && Symbol.toStringTag && Object.defineProperty(a2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(a2, "__esModule", { value: true });
      }, b = { 149: 0 }, g.O.j = (a2) => 0 === b[a2], c = (a2, c2) => {
        var d2, e2, [f2, h, i] = c2, j = 0;
        if (f2.some((a3) => 0 !== b[a3])) {
          for (d2 in h) g.o(h, d2) && (g.m[d2] = h[d2]);
          if (i) var k = i(g);
        }
        for (a2 && a2(c2); j < f2.length; j++) e2 = f2[j], g.o(b, e2) && b[e2] && b[e2][0](), b[e2] = 0;
        return g.O(k);
      }, (d = self.webpackChunk_N_E = self.webpackChunk_N_E || []).forEach(c.bind(null, 0)), d.push = c.bind(null, d.push.bind(d));
    })();
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/src/middleware.js
var require_middleware = __commonJS({
  ".next/server/src/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[550], { 6: (a, b, c) => {
      "use strict";
      let d, e, f, g, h, i, j, k, l, m, n;
      c.r(b), c.d(b, { default: () => kq, handler: () => kp });
      var o, p = {};
      async function q() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      c.r(p), c.d(p, { config: () => kj, default: () => ki, runtime: () => kg });
      let r = null;
      async function s() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        r || (r = q());
        let a10 = await r;
        if (null == a10 ? void 0 : a10.register) try {
          await a10.register();
        } catch (a11) {
          throw a11.message = `An error occurred while loading instrumentation hook: ${a11.message}`, a11;
        }
      }
      async function t(...a10) {
        let b10 = await q();
        try {
          var c10;
          await (null == b10 || null == (c10 = b10.onRequestError) ? void 0 : c10.call(b10, ...a10));
        } catch (a11) {
          console.error("Error in instrumentation.onRequestError:", a11);
        }
      }
      let u = null;
      function v() {
        return u || (u = s()), u;
      }
      function w(a10) {
        return `The edge runtime does not support Node.js '${a10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== c.g.process && (process.env = c.g.process.env, c.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(a10) {
          let b10 = new Proxy(function() {
          }, { get(b11, c10) {
            if ("then" === c10) return {};
            throw Object.defineProperty(Error(w(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(w(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(c10, d10, e10) {
            if ("function" == typeof e10[0]) return e10[0](b10);
            throw Object.defineProperty(Error(w(a10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => b10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      v();
      class x extends Error {
        constructor({ page: a10 }) {
          super(`The middleware "${a10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class y extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  ");
        }
      }
      class z extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  ");
        }
      }
      let A = "x-prerender-revalidate", B = ".meta", C = "x-next-cache-tags", D = "x-next-revalidated-tags", E = "_N_T_", F = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function G(a10) {
        var b10, c10, d10, e10, f10, g10 = [], h10 = 0;
        function i10() {
          for (; h10 < a10.length && /\s/.test(a10.charAt(h10)); ) h10 += 1;
          return h10 < a10.length;
        }
        for (; h10 < a10.length; ) {
          for (b10 = h10, f10 = false; i10(); ) if ("," === (c10 = a10.charAt(h10))) {
            for (d10 = h10, h10 += 1, i10(), e10 = h10; h10 < a10.length && "=" !== (c10 = a10.charAt(h10)) && ";" !== c10 && "," !== c10; ) h10 += 1;
            h10 < a10.length && "=" === a10.charAt(h10) ? (f10 = true, h10 = e10, g10.push(a10.substring(b10, d10)), b10 = h10) : h10 = d10 + 1;
          } else h10 += 1;
          (!f10 || h10 >= a10.length) && g10.push(a10.substring(b10, a10.length));
        }
        return g10;
      }
      function H(a10) {
        let b10 = {}, c10 = [];
        if (a10) for (let [d10, e10] of a10.entries()) "set-cookie" === d10.toLowerCase() ? (c10.push(...G(e10)), b10[d10] = 1 === c10.length ? c10[0] : c10) : b10[d10] = e10;
        return b10;
      }
      function I(a10) {
        try {
          return String(new URL(String(a10)));
        } catch (b10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(a10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: b10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...F, GROUP: { builtinReact: [F.reactServerComponents, F.actionBrowser], serverOnly: [F.reactServerComponents, F.actionBrowser, F.instrument, F.middleware], neutralTarget: [F.apiNode, F.apiEdge], clientOnly: [F.serverSideRendering, F.appPagesBrowser], bundled: [F.reactServerComponents, F.actionBrowser, F.serverSideRendering, F.appPagesBrowser, F.shared, F.instrument, F.middleware], appPages: [F.reactServerComponents, F.serverSideRendering, F.appPagesBrowser, F.actionBrowser] } });
      let J = Symbol("response"), K = Symbol("passThrough"), L = Symbol("waitUntil");
      class M {
        constructor(a10, b10) {
          this[K] = false, this[L] = b10 ? { kind: "external", function: b10 } : { kind: "internal", promises: [] };
        }
        respondWith(a10) {
          this[J] || (this[J] = Promise.resolve(a10));
        }
        passThroughOnException() {
          this[K] = true;
        }
        waitUntil(a10) {
          if ("external" === this[L].kind) return (0, this[L].function)(a10);
          this[L].promises.push(a10);
        }
      }
      class N extends M {
        constructor(a10) {
          var b10;
          super(a10.request, null == (b10 = a10.context) ? void 0 : b10.waitUntil), this.sourcePage = a10.page;
        }
        get request() {
          throw Object.defineProperty(new x({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new x({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function O(a10) {
        return a10.replace(/\/$/, "") || "/";
      }
      function P(a10) {
        let b10 = a10.indexOf("#"), c10 = a10.indexOf("?"), d10 = c10 > -1 && (b10 < 0 || c10 < b10);
        return d10 || b10 > -1 ? { pathname: a10.substring(0, d10 ? c10 : b10), query: d10 ? a10.substring(c10, b10 > -1 ? b10 : void 0) : "", hash: b10 > -1 ? a10.slice(b10) : "" } : { pathname: a10, query: "", hash: "" };
      }
      function Q(a10, b10) {
        if (!a10.startsWith("/") || !b10) return a10;
        let { pathname: c10, query: d10, hash: e10 } = P(a10);
        return `${b10}${c10}${d10}${e10}`;
      }
      function R(a10, b10) {
        if (!a10.startsWith("/") || !b10) return a10;
        let { pathname: c10, query: d10, hash: e10 } = P(a10);
        return `${c10}${b10}${d10}${e10}`;
      }
      function S(a10, b10) {
        if ("string" != typeof a10) return false;
        let { pathname: c10 } = P(a10);
        return c10 === b10 || c10.startsWith(b10 + "/");
      }
      let T = /* @__PURE__ */ new WeakMap();
      function U(a10, b10) {
        let c10;
        if (!b10) return { pathname: a10 };
        let d10 = T.get(b10);
        d10 || (d10 = b10.map((a11) => a11.toLowerCase()), T.set(b10, d10));
        let e10 = a10.split("/", 2);
        if (!e10[1]) return { pathname: a10 };
        let f10 = e10[1].toLowerCase(), g10 = d10.indexOf(f10);
        return g10 < 0 ? { pathname: a10 } : (c10 = b10[g10], { pathname: a10 = a10.slice(c10.length + 1) || "/", detectedLocale: c10 });
      }
      let V = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function W(a10, b10) {
        let c10 = new URL(String(a10), b10 && String(b10));
        return V.test(c10.hostname) && (c10.hostname = "localhost"), c10;
      }
      let X = Symbol("NextURLInternal");
      class Y {
        constructor(a10, b10, c10) {
          let d10, e10;
          "object" == typeof b10 && "pathname" in b10 || "string" == typeof b10 ? (d10 = b10, e10 = c10 || {}) : e10 = c10 || b10 || {}, this[X] = { url: W(a10, d10 ?? e10.base), options: e10, basePath: "" }, this.analyze();
        }
        analyze() {
          var a10, b10, c10, d10, e10;
          let f10 = function(a11, b11) {
            let { basePath: c11, i18n: d11, trailingSlash: e11 } = b11.nextConfig ?? {}, f11 = { pathname: a11, trailingSlash: "/" !== a11 ? a11.endsWith("/") : e11 };
            c11 && S(f11.pathname, c11) && (f11.pathname = function(a12, b12) {
              if (!S(a12, b12)) return a12;
              let c12 = a12.slice(b12.length);
              return c12.startsWith("/") ? c12 : `/${c12}`;
            }(f11.pathname, c11), f11.basePath = c11);
            let g11 = f11.pathname;
            if (f11.pathname.startsWith("/_next/data/") && f11.pathname.endsWith(".json")) {
              let a12 = f11.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              f11.buildId = a12[0], g11 = "index" !== a12[1] ? `/${a12.slice(1).join("/")}` : "/", true === b11.parseData && (f11.pathname = g11);
            }
            if (d11) {
              let a12 = b11.i18nProvider ? b11.i18nProvider.analyze(f11.pathname) : U(f11.pathname, d11.locales);
              f11.locale = a12.detectedLocale, f11.pathname = a12.pathname ?? f11.pathname, !a12.detectedLocale && f11.buildId && (a12 = b11.i18nProvider ? b11.i18nProvider.analyze(g11) : U(g11, d11.locales)).detectedLocale && (f11.locale = a12.detectedLocale);
            }
            return f11;
          }(this[X].url.pathname, { nextConfig: this[X].options.nextConfig, parseData: true, i18nProvider: this[X].options.i18nProvider }), g10 = function(a11, b11) {
            let c11;
            if (b11?.host && !Array.isArray(b11.host)) c11 = b11.host.toString().split(":", 1)[0];
            else {
              if (!a11.hostname) return;
              c11 = a11.hostname;
            }
            return c11.toLowerCase();
          }(this[X].url, this[X].options.headers);
          this[X].domainLocale = this[X].options.i18nProvider ? this[X].options.i18nProvider.detectDomainLocale(g10) : function(a11, b11, c11) {
            if (a11) {
              for (let d11 of (c11 && (c11 = c11.toLowerCase()), a11)) if (b11 === d11.domain?.split(":", 1)[0].toLowerCase() || c11 === d11.defaultLocale.toLowerCase() || d11.locales?.some((a12) => a12.toLowerCase() === c11)) return d11;
            }
          }(null == (b10 = this[X].options.nextConfig) || null == (a10 = b10.i18n) ? void 0 : a10.domains, g10);
          let h10 = (null == (c10 = this[X].domainLocale) ? void 0 : c10.defaultLocale) || (null == (e10 = this[X].options.nextConfig) || null == (d10 = e10.i18n) ? void 0 : d10.defaultLocale);
          this[X].url.pathname = f10.pathname, this[X].defaultLocale = h10, this[X].basePath = f10.basePath ?? "", this[X].buildId = f10.buildId, this[X].locale = f10.locale ?? h10, this[X].trailingSlash = f10.trailingSlash;
        }
        formatPathname() {
          var a10;
          let b10;
          return b10 = function(a11, b11, c10, d10) {
            if (!b11 || b11 === c10) return a11;
            let e10 = a11.toLowerCase();
            return !d10 && (S(e10, "/api") || S(e10, `/${b11.toLowerCase()}`)) ? a11 : Q(a11, `/${b11}`);
          }((a10 = { basePath: this[X].basePath, buildId: this[X].buildId, defaultLocale: this[X].options.forceLocale ? void 0 : this[X].defaultLocale, locale: this[X].locale, pathname: this[X].url.pathname, trailingSlash: this[X].trailingSlash }).pathname, a10.locale, a10.buildId ? void 0 : a10.defaultLocale, a10.ignorePrefix), (a10.buildId || !a10.trailingSlash) && (b10 = O(b10)), a10.buildId && (b10 = R(Q(b10, `/_next/data/${a10.buildId}`), "/" === a10.pathname ? "index.json" : ".json")), b10 = Q(b10, a10.basePath), !a10.buildId && a10.trailingSlash ? b10.endsWith("/") ? b10 : R(b10, "/") : O(b10);
        }
        formatSearch() {
          return this[X].url.search;
        }
        get buildId() {
          return this[X].buildId;
        }
        set buildId(a10) {
          this[X].buildId = a10;
        }
        get locale() {
          return this[X].locale ?? "";
        }
        set locale(a10) {
          var b10, c10;
          if (!this[X].locale || !(null == (c10 = this[X].options.nextConfig) || null == (b10 = c10.i18n) ? void 0 : b10.locales.includes(a10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${a10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[X].locale = a10;
        }
        get defaultLocale() {
          return this[X].defaultLocale;
        }
        get domainLocale() {
          return this[X].domainLocale;
        }
        get searchParams() {
          return this[X].url.searchParams;
        }
        get host() {
          return this[X].url.host;
        }
        set host(a10) {
          this[X].url.host = a10;
        }
        get hostname() {
          return this[X].url.hostname;
        }
        set hostname(a10) {
          this[X].url.hostname = a10;
        }
        get port() {
          return this[X].url.port;
        }
        set port(a10) {
          this[X].url.port = a10;
        }
        get protocol() {
          return this[X].url.protocol;
        }
        set protocol(a10) {
          this[X].url.protocol = a10;
        }
        get href() {
          let a10 = this.formatPathname(), b10 = this.formatSearch();
          return `${this.protocol}//${this.host}${a10}${b10}${this.hash}`;
        }
        set href(a10) {
          this[X].url = W(a10), this.analyze();
        }
        get origin() {
          return this[X].url.origin;
        }
        get pathname() {
          return this[X].url.pathname;
        }
        set pathname(a10) {
          this[X].url.pathname = a10;
        }
        get hash() {
          return this[X].url.hash;
        }
        set hash(a10) {
          this[X].url.hash = a10;
        }
        get search() {
          return this[X].url.search;
        }
        set search(a10) {
          this[X].url.search = a10;
        }
        get password() {
          return this[X].url.password;
        }
        set password(a10) {
          this[X].url.password = a10;
        }
        get username() {
          return this[X].url.username;
        }
        set username(a10) {
          this[X].url.username = a10;
        }
        get basePath() {
          return this[X].basePath;
        }
        set basePath(a10) {
          this[X].basePath = a10.startsWith("/") ? a10 : `/${a10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new Y(String(this), this[X].options);
        }
      }
      var Z = c(387);
      let $ = Symbol("internal request");
      class _ extends Request {
        constructor(a10, b10 = {}) {
          const c10 = "string" != typeof a10 && "url" in a10 ? a10.url : String(a10);
          I(c10), a10 instanceof Request ? super(a10, b10) : super(c10, b10);
          const d10 = new Y(c10, { headers: H(this.headers), nextConfig: b10.nextConfig });
          this[$] = { cookies: new Z.tm(this.headers), nextUrl: d10, url: d10.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[$].cookies;
        }
        get nextUrl() {
          return this[$].nextUrl;
        }
        get page() {
          throw new y();
        }
        get ua() {
          throw new z();
        }
        get url() {
          return this[$].url;
        }
      }
      var aa = c(58);
      let ab = Symbol("internal response"), ac = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function ad(a10, b10) {
        var c10;
        if (null == a10 || null == (c10 = a10.request) ? void 0 : c10.headers) {
          if (!(a10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let c11 = [];
          for (let [d10, e10] of a10.request.headers) b10.set("x-middleware-request-" + d10, e10), c11.push(d10);
          b10.set("x-middleware-override-headers", c11.join(","));
        }
      }
      class ae extends Response {
        constructor(a10, b10 = {}) {
          super(a10, b10);
          const c10 = this.headers, d10 = new Proxy(new Z.VO(c10), { get(a11, d11, e10) {
            switch (d11) {
              case "delete":
              case "set":
                return (...e11) => {
                  let f10 = Reflect.apply(a11[d11], a11, e11), g10 = new Headers(c10);
                  return f10 instanceof Z.VO && c10.set("x-middleware-set-cookie", f10.getAll().map((a12) => (0, Z.Ud)(a12)).join(",")), ad(b10, g10), f10;
                };
              default:
                return aa.l.get(a11, d11, e10);
            }
          } });
          this[ab] = { cookies: d10, url: b10.url ? new Y(b10.url, { headers: H(c10), nextConfig: b10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[ab].cookies;
        }
        static json(a10, b10) {
          let c10 = Response.json(a10, b10);
          return new ae(c10.body, c10);
        }
        static redirect(a10, b10) {
          let c10 = "number" == typeof b10 ? b10 : (null == b10 ? void 0 : b10.status) ?? 307;
          if (!ac.has(c10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let d10 = "object" == typeof b10 ? b10 : {}, e10 = new Headers(null == d10 ? void 0 : d10.headers);
          return e10.set("Location", I(a10)), new ae(null, { ...d10, headers: e10, status: c10 });
        }
        static rewrite(a10, b10) {
          let c10 = new Headers(null == b10 ? void 0 : b10.headers);
          return c10.set("x-middleware-rewrite", I(a10)), ad(b10, c10), new ae(null, { ...b10, headers: c10 });
        }
        static next(a10) {
          let b10 = new Headers(null == a10 ? void 0 : a10.headers);
          return b10.set("x-middleware-next", "1"), ad(a10, b10), new ae(null, { ...a10, headers: b10 });
        }
      }
      function af(a10, b10) {
        let c10 = "string" == typeof b10 ? new URL(b10) : b10, d10 = new URL(a10, b10), e10 = d10.origin === c10.origin;
        return { url: e10 ? d10.toString().slice(c10.origin.length) : d10.toString(), isRelative: e10 };
      }
      let ag = "next-router-prefetch", ah = ["rsc", "next-router-state-tree", ag, "next-hmr-refresh", "next-router-segment-prefetch"], ai = "_rsc";
      function aj(a10) {
        return a10.startsWith("/") ? a10 : `/${a10}`;
      }
      function ak(a10) {
        return aj(a10.split("/").reduce((a11, b10, c10, d10) => b10 ? "(" === b10[0] && b10.endsWith(")") || "@" === b10[0] || ("page" === b10 || "route" === b10) && c10 === d10.length - 1 ? a11 : `${a11}/${b10}` : a11, ""));
      }
      var al = c(271), am = c(672), an = ((iv = an || {}).handleRequest = "BaseServer.handleRequest", iv.run = "BaseServer.run", iv.pipe = "BaseServer.pipe", iv.getStaticHTML = "BaseServer.getStaticHTML", iv.render = "BaseServer.render", iv.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", iv.renderToResponse = "BaseServer.renderToResponse", iv.renderToHTML = "BaseServer.renderToHTML", iv.renderError = "BaseServer.renderError", iv.renderErrorToResponse = "BaseServer.renderErrorToResponse", iv.renderErrorToHTML = "BaseServer.renderErrorToHTML", iv.render404 = "BaseServer.render404", iv), ao = ((iw = ao || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", iw.loadComponents = "LoadComponents.loadComponents", iw), ap = ((ix = ap || {}).getRequestHandler = "NextServer.getRequestHandler", ix.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", ix.getServer = "NextServer.getServer", ix.getServerRequestHandler = "NextServer.getServerRequestHandler", ix.createServer = "createServer.createServer", ix), aq = ((iy = aq || {}).compression = "NextNodeServer.compression", iy.getBuildId = "NextNodeServer.getBuildId", iy.createComponentTree = "NextNodeServer.createComponentTree", iy.clientComponentLoading = "NextNodeServer.clientComponentLoading", iy.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", iy.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", iy.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", iy.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", iy.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", iy.sendRenderResult = "NextNodeServer.sendRenderResult", iy.proxyRequest = "NextNodeServer.proxyRequest", iy.runApi = "NextNodeServer.runApi", iy.render = "NextNodeServer.render", iy.renderHTML = "NextNodeServer.renderHTML", iy.imageOptimizer = "NextNodeServer.imageOptimizer", iy.getPagePath = "NextNodeServer.getPagePath", iy.getRoutesManifest = "NextNodeServer.getRoutesManifest", iy.findPageComponents = "NextNodeServer.findPageComponents", iy.getFontManifest = "NextNodeServer.getFontManifest", iy.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", iy.getRequestHandler = "NextNodeServer.getRequestHandler", iy.renderToHTML = "NextNodeServer.renderToHTML", iy.renderError = "NextNodeServer.renderError", iy.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", iy.render404 = "NextNodeServer.render404", iy.startResponse = "NextNodeServer.startResponse", iy.route = "route", iy.onProxyReq = "onProxyReq", iy.apiResolver = "apiResolver", iy.internalFetch = "internalFetch", iy), ar = ((iz = ar || {}).startServer = "startServer.startServer", iz), as = ((iA = as || {}).getServerSideProps = "Render.getServerSideProps", iA.getStaticProps = "Render.getStaticProps", iA.renderToString = "Render.renderToString", iA.renderDocument = "Render.renderDocument", iA.createBodyResult = "Render.createBodyResult", iA), at = ((iB = at || {}).renderToString = "AppRender.renderToString", iB.renderToReadableStream = "AppRender.renderToReadableStream", iB.getBodyResult = "AppRender.getBodyResult", iB.fetch = "AppRender.fetch", iB), au = ((iC = au || {}).executeRoute = "Router.executeRoute", iC), av = ((iD = av || {}).runHandler = "Node.runHandler", iD), aw = ((iE = aw || {}).runHandler = "AppRouteRouteHandlers.runHandler", iE), ax = ((iF = ax || {}).generateMetadata = "ResolveMetadata.generateMetadata", iF.generateViewport = "ResolveMetadata.generateViewport", iF), ay = ((iG = ay || {}).execute = "Middleware.execute", iG);
      let az = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), aA = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function aB(a10) {
        return null !== a10 && "object" == typeof a10 && "then" in a10 && "function" == typeof a10.then;
      }
      let aC = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: aD, propagation: aE, trace: aF, SpanStatusCode: aG, SpanKind: aH, ROOT_CONTEXT: aI } = d = c(446);
      class aJ extends Error {
        constructor(a10, b10) {
          super(), this.bubble = a10, this.result = b10;
        }
      }
      let aK = (a10, b10) => {
        "object" == typeof b10 && null !== b10 && b10 instanceof aJ && b10.bubble ? a10.setAttribute("next.bubble", true) : (b10 && (a10.recordException(b10), a10.setAttribute("error.type", b10.name)), a10.setStatus({ code: aG.ERROR, message: null == b10 ? void 0 : b10.message })), a10.end();
      }, aL = /* @__PURE__ */ new Map(), aM = d.createContextKey("next.rootSpanId"), aN = 0, aO = { set(a10, b10, c10) {
        a10.push({ key: b10, value: c10 });
      } };
      class aP {
        getTracerInstance() {
          return aF.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return aD;
        }
        getTracePropagationData() {
          let a10 = aD.active(), b10 = [];
          return aE.inject(a10, b10, aO), b10;
        }
        getActiveScopeSpan() {
          return aF.getSpan(null == aD ? void 0 : aD.active());
        }
        withPropagatedContext(a10, b10, c10, d10 = false) {
          let e10 = aD.active();
          if (d10) {
            let d11 = aE.extract(aI, a10, c10);
            if (aF.getSpanContext(d11)) return aD.with(d11, b10);
            let f11 = aE.extract(e10, a10, c10);
            return aD.with(f11, b10);
          }
          if (aF.getSpanContext(e10)) return b10();
          let f10 = aE.extract(e10, a10, c10);
          return aD.with(f10, b10);
        }
        trace(...a10) {
          let [b10, c10, d10] = a10, { fn: e10, options: f10 } = "function" == typeof c10 ? { fn: c10, options: {} } : { fn: d10, options: { ...c10 } }, g10 = f10.spanName ?? b10;
          if (!az.has(b10) && "1" !== process.env.NEXT_OTEL_VERBOSE || f10.hideSpan) return e10();
          let h10 = this.getSpanContext((null == f10 ? void 0 : f10.parentSpan) ?? this.getActiveScopeSpan());
          h10 || (h10 = (null == aD ? void 0 : aD.active()) ?? aI);
          let i10 = h10.getValue(aM), j10 = "number" != typeof i10 || !aL.has(i10), k2 = aN++;
          return f10.attributes = { "next.span_name": g10, "next.span_type": b10, ...f10.attributes }, aD.with(h10.setValue(aM, k2), () => this.getTracerInstance().startActiveSpan(g10, f10, (a11) => {
            let c11;
            aC && b10 && aA.has(b10) && (c11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let d11 = false, g11 = () => {
              !d11 && (d11 = true, aL.delete(k2), c11 && performance.measure(`${aC}:next-${(b10.split(".").pop() || "").replace(/[A-Z]/g, (a12) => "-" + a12.toLowerCase())}`, { start: c11, end: performance.now() }));
            };
            if (j10 && aL.set(k2, new Map(Object.entries(f10.attributes ?? {}))), e10.length > 1) try {
              return e10(a11, (b11) => aK(a11, b11));
            } catch (b11) {
              throw aK(a11, b11), b11;
            } finally {
              g11();
            }
            try {
              let b11 = e10(a11);
              if (aB(b11)) return b11.then((b12) => (a11.end(), b12)).catch((b12) => {
                throw aK(a11, b12), b12;
              }).finally(g11);
              return a11.end(), g11(), b11;
            } catch (b11) {
              throw aK(a11, b11), g11(), b11;
            }
          }));
        }
        wrap(...a10) {
          let b10 = this, [c10, d10, e10] = 3 === a10.length ? a10 : [a10[0], {}, a10[1]];
          return az.has(c10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let a11 = d10;
            "function" == typeof a11 && "function" == typeof e10 && (a11 = a11.apply(this, arguments));
            let f10 = arguments.length - 1, g10 = arguments[f10];
            if ("function" != typeof g10) return b10.trace(c10, a11, () => e10.apply(this, arguments));
            {
              let d11 = b10.getContext().bind(aD.active(), g10);
              return b10.trace(c10, a11, (a12, b11) => (arguments[f10] = function(a13) {
                return null == b11 || b11(a13), d11.apply(this, arguments);
              }, e10.apply(this, arguments)));
            }
          } : e10;
        }
        startSpan(...a10) {
          let [b10, c10] = a10, d10 = this.getSpanContext((null == c10 ? void 0 : c10.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(b10, c10, d10);
        }
        getSpanContext(a10) {
          return a10 ? aF.setSpan(aD.active(), a10) : void 0;
        }
        getRootSpanAttributes() {
          let a10 = aD.active().getValue(aM);
          return aL.get(a10);
        }
        setRootSpanAttribute(a10, b10) {
          let c10 = aD.active().getValue(aM), d10 = aL.get(c10);
          d10 && !d10.has(a10) && d10.set(a10, b10);
        }
        withSpan(a10, b10) {
          let c10 = aF.setSpan(aD.active(), a10);
          return aD.with(c10, b10);
        }
      }
      let aQ = (f = new aP(), () => f), aR = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(aR);
      class aS {
        constructor(a10, b10, c10, d10) {
          var e10;
          const f10 = a10 && function(a11, b11) {
            let c11 = al.o.from(a11.headers);
            return { isOnDemandRevalidate: c11.get(A) === b11.previewModeId, revalidateOnlyGenerated: c11.has("x-prerender-revalidate-if-generated") };
          }(b10, a10).isOnDemandRevalidate, g10 = null == (e10 = c10.get(aR)) ? void 0 : e10.value;
          this._isEnabled = !!(!f10 && g10 && a10 && g10 === a10.previewModeId), this._previewModeId = null == a10 ? void 0 : a10.previewModeId, this._mutableCookies = d10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: aR, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: aR, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function aT(a10, b10) {
        if ("x-middleware-set-cookie" in a10.headers && "string" == typeof a10.headers["x-middleware-set-cookie"]) {
          let c10 = a10.headers["x-middleware-set-cookie"], d10 = new Headers();
          for (let a11 of G(c10)) d10.append("set-cookie", a11);
          for (let a11 of new Z.VO(d10).getAll()) b10.set(a11);
        }
      }
      var aU = c(391), aV = c(232), aW = c.n(aV), aX = c(520), aY = c(778);
      class aZ {
        constructor(a10, b10, c10) {
          this.prev = null, this.next = null, this.key = a10, this.data = b10, this.size = c10;
        }
      }
      class a$ {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class a_ {
        constructor(a10, b10, c10) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = a10, this.calculateSize = b10, this.onEvict = c10, this.head = new a$(), this.tail = new a$(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(a10) {
          a10.prev = this.head, a10.next = this.head.next, this.head.next.prev = a10, this.head.next = a10;
        }
        removeNode(a10) {
          a10.prev.next = a10.next, a10.next.prev = a10.prev;
        }
        moveToHead(a10) {
          this.removeNode(a10), this.addToHead(a10);
        }
        removeTail() {
          let a10 = this.tail.prev;
          return this.removeNode(a10), a10;
        }
        set(a10, b10) {
          let c10 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, b10)) ?? 1;
          if (c10 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${c10}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (c10 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let d10 = this.cache.get(a10);
          if (d10) d10.data = b10, this.totalSize = this.totalSize - d10.size + c10, d10.size = c10, this.moveToHead(d10);
          else {
            let d11 = new aZ(a10, b10, c10);
            this.cache.set(a10, d11), this.addToHead(d11), this.totalSize += c10;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let a11 = this.removeTail();
            this.cache.delete(a11.key), this.totalSize -= a11.size, null == this.onEvict || this.onEvict.call(this, a11.key, a11.data);
          }
          return true;
        }
        has(a10) {
          return this.cache.has(a10);
        }
        get(a10) {
          let b10 = this.cache.get(a10);
          if (b10) return this.moveToHead(b10), b10.data;
        }
        *[Symbol.iterator]() {
          let a10 = this.head.next;
          for (; a10 && a10 !== this.tail; ) {
            let b10 = a10;
            yield [b10.key, b10.data], a10 = a10.next;
          }
        }
        remove(a10) {
          let b10 = this.cache.get(a10);
          b10 && (this.removeNode(b10), this.cache.delete(a10), this.totalSize -= b10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      let a0 = /* @__PURE__ */ new Map(), a1 = (a10, b10) => {
        for (let c10 of a10) {
          let a11 = a0.get(c10), d10 = null == a11 ? void 0 : a11.expired;
          if ("number" == typeof d10 && d10 <= Date.now() && d10 > b10) return true;
        }
        return false;
      }, a2 = (a10, b10) => {
        for (let c10 of a10) {
          let a11 = a0.get(c10), d10 = (null == a11 ? void 0 : a11.stale) ?? 0;
          if ("number" == typeof d10 && d10 > b10) return true;
        }
        return false;
      };
      c(356).Buffer, process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let a3 = Symbol.for("@next/cache-handlers-map"), a4 = Symbol.for("@next/cache-handlers-set"), a5 = globalThis;
      function a6() {
        if (a5[a3]) return a5[a3].entries();
      }
      async function a7(a10, b10) {
        if (!a10) return b10();
        let c10 = a8(a10);
        try {
          return await b10();
        } finally {
          var d10, e10, f10, g10;
          let b11, h10, i10, j10, k2 = (d10 = c10, e10 = a8(a10), b11 = new Set(d10.pendingRevalidatedTags.map((a11) => {
            let b12 = "object" == typeof a11.profile ? JSON.stringify(a11.profile) : a11.profile || "";
            return `${a11.tag}:${b12}`;
          })), h10 = new Set(d10.pendingRevalidateWrites), { pendingRevalidatedTags: e10.pendingRevalidatedTags.filter((a11) => {
            let c11 = "object" == typeof a11.profile ? JSON.stringify(a11.profile) : a11.profile || "";
            return !b11.has(`${a11.tag}:${c11}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(e10.pendingRevalidates).filter(([a11]) => !(a11 in d10.pendingRevalidates))), pendingRevalidateWrites: e10.pendingRevalidateWrites.filter((a11) => !h10.has(a11)) });
          await (f10 = a10, i10 = [], (j10 = (null == (g10 = k2) ? void 0 : g10.pendingRevalidatedTags) ?? f10.pendingRevalidatedTags ?? []).length > 0 && i10.push(a9(j10, f10.incrementalCache, f10)), i10.push(...Object.values((null == g10 ? void 0 : g10.pendingRevalidates) ?? f10.pendingRevalidates ?? {})), i10.push(...(null == g10 ? void 0 : g10.pendingRevalidateWrites) ?? f10.pendingRevalidateWrites ?? []), 0 !== i10.length && Promise.all(i10).then(() => void 0));
        }
      }
      function a8(a10) {
        return { pendingRevalidatedTags: a10.pendingRevalidatedTags ? [...a10.pendingRevalidatedTags] : [], pendingRevalidates: { ...a10.pendingRevalidates }, pendingRevalidateWrites: a10.pendingRevalidateWrites ? [...a10.pendingRevalidateWrites] : [] };
      }
      async function a9(a10, b10, c10) {
        if (0 === a10.length) return;
        let d10 = function() {
          if (a5[a4]) return a5[a4].values();
        }(), e10 = [], f10 = /* @__PURE__ */ new Map();
        for (let b11 of a10) {
          let a11, c11 = b11.profile;
          for (let [b12] of f10) if ("string" == typeof b12 && "string" == typeof c11 && b12 === c11 || "object" == typeof b12 && "object" == typeof c11 && JSON.stringify(b12) === JSON.stringify(c11) || b12 === c11) {
            a11 = b12;
            break;
          }
          let d11 = a11 || c11;
          f10.has(d11) || f10.set(d11, []), f10.get(d11).push(b11.tag);
        }
        for (let [a11, h10] of f10) {
          let f11;
          if (a11) {
            let b11;
            if ("object" == typeof a11) b11 = a11;
            else if ("string" == typeof a11) {
              var g10;
              if (!(b11 = null == c10 || null == (g10 = c10.cacheLifeProfiles) ? void 0 : g10[a11])) throw Object.defineProperty(Error(`Invalid profile provided "${a11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            }
            b11 && (f11 = { expire: b11.expire });
          }
          for (let b11 of d10 || []) a11 ? e10.push(null == b11.updateTags ? void 0 : b11.updateTags.call(b11, h10, f11)) : e10.push(null == b11.updateTags ? void 0 : b11.updateTags.call(b11, h10));
          b10 && e10.push(b10.revalidateTag(h10, f11));
        }
        await Promise.all(e10);
      }
      var ba = c(722), bb = c(662);
      class bc {
        constructor({ waitUntil: a10, onClose: b10, onTaskError: c10 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = a10, this.onClose = b10, this.onTaskError = c10, this.callbackQueue = new (aW())(), this.callbackQueue.pause();
        }
        after(a10) {
          if (aB(a10)) this.waitUntil || bd(), this.waitUntil(a10.catch((a11) => this.reportTaskError("promise", a11)));
          else if ("function" == typeof a10) this.addCallback(a10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(a10) {
          this.waitUntil || bd();
          let b10 = aU.FP.getStore();
          b10 && this.workUnitStores.add(b10);
          let c10 = bb.Z.getStore(), d10 = c10 ? c10.rootTaskSpawnPhase : null == b10 ? void 0 : b10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let e10 = (0, ba.cg)(async () => {
            try {
              await bb.Z.run({ rootTaskSpawnPhase: d10 }, () => a10());
            } catch (a11) {
              this.reportTaskError("function", a11);
            }
          });
          this.callbackQueue.add(e10);
        }
        async runCallbacksOnClose() {
          return await new Promise((a10) => this.onClose(a10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let a11 of this.workUnitStores) a11.phase = "after";
          let a10 = aY.J.getStore();
          if (!a10) throw Object.defineProperty(new aX.z("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return a7(a10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(a10, b10) {
          if (console.error("promise" === a10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", b10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, b10);
          } catch (a11) {
            console.error(Object.defineProperty(new aX.z("`onTaskError` threw while handling an error thrown from an `after` task", { cause: a11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function bd() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function be(a10) {
        let b10, c10 = { then: (d10, e10) => (b10 || (b10 = Promise.resolve(a10())), b10.then((a11) => {
          c10.value = a11;
        }).catch(() => {
        }), b10.then(d10, e10)) };
        return c10;
      }
      class bf {
        onClose(a10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", a10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function bg() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let bh = Symbol.for("@next/request-context");
      async function bi(a10, b10, c10) {
        let d10 = /* @__PURE__ */ new Set();
        for (let b11 of ((a11) => {
          let b12 = ["/layout"];
          if (a11.startsWith("/")) {
            let c11 = a11.split("/");
            for (let a12 = 1; a12 < c11.length + 1; a12++) {
              let d11 = c11.slice(0, a12).join("/");
              d11 && (d11.endsWith("/page") || d11.endsWith("/route") || (d11 = `${d11}${!d11.endsWith("/") ? "/" : ""}layout`), b12.push(d11));
            }
          }
          return b12;
        })(a10)) b11 = `${E}${b11}`, d10.add(b11);
        if (b10 && (!c10 || 0 === c10.size)) {
          let a11 = `${E}${b10}`;
          d10.add(a11);
        }
        d10.has(`${E}/`) && d10.add(`${E}/index`), d10.has(`${E}/index`) && d10.add(`${E}/`);
        let e10 = Array.from(d10);
        return { tags: e10, expirationsByCacheKind: function(a11) {
          let b11 = /* @__PURE__ */ new Map(), c11 = a6();
          if (c11) for (let [d11, e11] of c11) "getExpiration" in e11 && b11.set(d11, be(async () => e11.getExpiration(a11)));
          return b11;
        }(e10) };
      }
      let bj = Symbol.for("NextInternalRequestMeta");
      class bk extends _ {
        constructor(a10) {
          super(a10.input, a10.init), this.sourcePage = a10.page;
        }
        get request() {
          throw Object.defineProperty(new x({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new x({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new x({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let bl = { keys: (a10) => Array.from(a10.keys()), get: (a10, b10) => a10.get(b10) ?? void 0 }, bm = (a10, b10) => aQ().withPropagatedContext(a10.headers, b10, bl), bn = false;
      async function bo(a10) {
        var b10, d10, e10, f10, g10;
        let h10, i10, j10, k2, l2;
        !function() {
          if (!bn && (bn = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: a11, wrapRequestHandler: b11 } = c(987);
            a11(), bm = b11(bm);
          }
        }(), await v();
        let m2 = void 0 !== globalThis.__BUILD_MANIFEST;
        a10.request.url = a10.request.url.replace(/\.rsc($|\?)/, "$1");
        let n2 = a10.bypassNextUrl ? new URL(a10.request.url) : new Y(a10.request.url, { headers: a10.request.headers, nextConfig: a10.request.nextConfig });
        for (let a11 of [...n2.searchParams.keys()]) {
          let b11 = n2.searchParams.getAll(a11), c10 = function(a12) {
            for (let b12 of ["nxtP", "nxtI"]) if (a12 !== b12 && a12.startsWith(b12)) return a12.substring(b12.length);
            return null;
          }(a11);
          if (c10) {
            for (let a12 of (n2.searchParams.delete(c10), b11)) n2.searchParams.append(c10, a12);
            n2.searchParams.delete(a11);
          }
        }
        let o2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in n2 && (o2 = n2.buildId || "", n2.buildId = "");
        let p2 = function(a11) {
          let b11 = new Headers();
          for (let [c10, d11] of Object.entries(a11)) for (let a12 of Array.isArray(d11) ? d11 : [d11]) void 0 !== a12 && ("number" == typeof a12 && (a12 = a12.toString()), b11.append(c10, a12));
          return b11;
        }(a10.request.headers), q2 = p2.has("x-nextjs-data"), r2 = "1" === p2.get("rsc");
        q2 && "/index" === n2.pathname && (n2.pathname = "/");
        let s2 = /* @__PURE__ */ new Map();
        if (!m2) for (let a11 of ah) {
          let b11 = p2.get(a11);
          null !== b11 && (s2.set(a11, b11), p2.delete(a11));
        }
        let t2 = n2.searchParams.get(ai), u2 = new bk({ page: a10.page, input: ((k2 = (j10 = "string" == typeof n2) ? new URL(n2) : n2).searchParams.delete(ai), j10 ? k2.toString() : k2).toString(), init: { body: a10.request.body, headers: p2, method: a10.request.method, nextConfig: a10.request.nextConfig, signal: a10.request.signal } });
        a10.request.requestMeta && (g10 = a10.request.requestMeta, u2[bj] = g10), q2 && Object.defineProperty(u2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && a10.IncrementalCache && (globalThis.__incrementalCache = new a10.IncrementalCache({ CurCacheHandler: a10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: a10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: bg() }) }));
        let w2 = a10.request.waitUntil ?? (null == (b10 = null == (l2 = globalThis[bh]) ? void 0 : l2.get()) ? void 0 : b10.waitUntil), x2 = new N({ request: u2, page: a10.page, context: w2 ? { waitUntil: w2 } : void 0 });
        if ((h10 = await bm(u2, () => {
          if ("/middleware" === a10.page || "/src/middleware" === a10.page || "/proxy" === a10.page || "/src/proxy" === a10.page) {
            let b11 = x2.waitUntil.bind(x2), c10 = new bf();
            return aQ().trace(ay.execute, { spanName: `middleware ${u2.method}`, attributes: { "http.target": u2.nextUrl.pathname, "http.method": u2.method } }, async () => {
              try {
                var d11, e11, f11, g11, h11, j11;
                let k3 = bg(), l3 = await bi("/", u2.nextUrl.pathname, null), m3 = (h11 = u2.nextUrl, j11 = (a11) => {
                  i10 = a11;
                }, function(a11, b12, c11, d12, e12, f12, g12, h12, i11, j12) {
                  function k4(a12) {
                    c11 && c11.setHeader("Set-Cookie", a12);
                  }
                  let l4 = {};
                  return { type: "request", phase: a11, implicitTags: f12, url: { pathname: d12.pathname, search: d12.search ?? "" }, rootParams: e12, get headers() {
                    return l4.headers || (l4.headers = function(a12) {
                      let b13 = al.o.from(a12);
                      for (let a13 of ah) b13.delete(a13);
                      return al.o.seal(b13);
                    }(b12.headers)), l4.headers;
                  }, get cookies() {
                    if (!l4.cookies) {
                      let a12 = new Z.tm(al.o.from(b12.headers));
                      aT(b12, a12), l4.cookies = am.Ck.seal(a12);
                    }
                    return l4.cookies;
                  }, set cookies(value) {
                    l4.cookies = value;
                  }, get mutableCookies() {
                    if (!l4.mutableCookies) {
                      var m4, n4;
                      let a12, d13 = (m4 = b12.headers, n4 = g12 || (c11 ? k4 : void 0), a12 = new Z.tm(al.o.from(m4)), am.K8.wrap(a12, n4));
                      aT(b12, d13), l4.mutableCookies = d13;
                    }
                    return l4.mutableCookies;
                  }, get userspaceMutableCookies() {
                    return l4.userspaceMutableCookies || (l4.userspaceMutableCookies = (0, am.EJ)(this)), l4.userspaceMutableCookies;
                  }, get draftMode() {
                    return l4.draftMode || (l4.draftMode = new aS(h12, b12, this.cookies, this.mutableCookies)), l4.draftMode;
                  }, renderResumeDataCache: null, isHmrRefresh: i11, serverComponentsHmrCache: j12 || globalThis.__serverComponentsHmrCache, fallbackParams: null };
                }("action", u2, void 0, h11, {}, l3, j11, k3, false, void 0)), n3 = function({ page: a11, renderOpts: b12, isPrefetchRequest: c11, buildId: d12, deploymentId: e12, previouslyRevalidatedTags: f12, nonce: g12 }) {
                  let h12 = !b12.shouldWaitOnAllReady && !b12.supportsDynamicResponse && !b12.isDraftMode && !b12.isPossibleServerAction, i11 = h12 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), j12 = { isStaticGeneration: h12, page: a11, route: ak(a11), incrementalCache: b12.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: b12.cacheLifeProfiles, isBuildTimePrerendering: b12.isBuildTimePrerendering, fetchCache: b12.fetchCache, isOnDemandRevalidate: b12.isOnDemandRevalidate, isDraftMode: b12.isDraftMode, isPrefetchRequest: c11, buildId: d12, deploymentId: e12, reactLoadableManifest: (null == b12 ? void 0 : b12.reactLoadableManifest) || {}, assetPrefix: (null == b12 ? void 0 : b12.assetPrefix) || "", nonce: g12, afterContext: function(a12) {
                    let { waitUntil: b13, onClose: c12, onAfterTaskError: d13 } = a12;
                    return new bc({ waitUntil: b13, onClose: c12, onTaskError: d13 });
                  }(b12), cacheComponentsEnabled: b12.cacheComponents, previouslyRevalidatedTags: f12, refreshTagsByCacheKind: function() {
                    let a12 = /* @__PURE__ */ new Map(), b13 = a6();
                    if (b13) for (let [c12, d13] of b13) "refreshTags" in d13 && a12.set(c12, be(async () => d13.refreshTags()));
                    return a12;
                  }(), runInCleanSnapshot: (0, ba.$p)(), shouldTrackFetchMetrics: i11, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return b12.store = j12, j12;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (e11 = a10.request.nextConfig) || null == (d11 = e11.experimental) ? void 0 : d11.cacheLife, cacheComponents: false, experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (g11 = a10.request.nextConfig) || null == (f11 = g11.experimental) ? void 0 : f11.authInterrupts) }, supportsDynamicResponse: true, waitUntil: b11, onClose: c10.onClose.bind(c10), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === u2.headers.get(ag), buildId: o2 ?? "", deploymentId: false, previouslyRevalidatedTags: [] });
                return await aY.J.run(n3, () => aU.FP.run(m3, a10.handler, u2, x2));
              } finally {
                setTimeout(() => {
                  c10.dispatchClose();
                }, 0);
              }
            });
          }
          return a10.handler(u2, x2);
        })) && !(h10 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        h10 && i10 && h10.headers.set("set-cookie", i10);
        let y2 = null == h10 ? void 0 : h10.headers.get("x-middleware-rewrite");
        if (h10 && y2 && (r2 || !m2)) {
          let b11 = new Y(y2, { forceLocale: true, headers: a10.request.headers, nextConfig: a10.request.nextConfig });
          m2 || b11.host !== u2.nextUrl.host || (b11.buildId = o2 || b11.buildId, h10.headers.set("x-middleware-rewrite", String(b11)));
          let { url: c10, isRelative: g11 } = af(b11.toString(), n2.toString());
          !m2 && q2 && h10.headers.set("x-nextjs-rewrite", c10);
          let i11 = !g11 && (null == (f10 = a10.request.nextConfig) || null == (e10 = f10.experimental) || null == (d10 = e10.clientParamParsingOrigins) ? void 0 : d10.some((a11) => new RegExp(a11).test(b11.origin)));
          r2 && (g11 || i11) && (n2.pathname !== b11.pathname && h10.headers.set("x-nextjs-rewritten-path", b11.pathname), n2.search !== b11.search && h10.headers.set("x-nextjs-rewritten-query", b11.search.slice(1)));
        }
        if (h10 && y2 && r2 && t2) {
          let a11 = new URL(y2);
          a11.searchParams.has(ai) || (a11.searchParams.set(ai, t2), h10.headers.set("x-middleware-rewrite", a11.toString()));
        }
        let z2 = null == h10 ? void 0 : h10.headers.get("Location");
        if (h10 && z2 && !m2) {
          let b11 = new Y(z2, { forceLocale: false, headers: a10.request.headers, nextConfig: a10.request.nextConfig });
          h10 = new Response(h10.body, h10), b11.host === n2.host && (b11.buildId = o2 || b11.buildId, h10.headers.set("Location", af(b11, n2).url)), q2 && (h10.headers.delete("Location"), h10.headers.set("x-nextjs-redirect", af(b11.toString(), n2.toString()).url));
        }
        let A2 = h10 || ae.next(), B2 = A2.headers.get("x-middleware-override-headers"), C2 = [];
        if (B2) {
          for (let [a11, b11] of s2) A2.headers.set(`x-middleware-request-${a11}`, b11), C2.push(a11);
          C2.length > 0 && A2.headers.set("x-middleware-override-headers", B2 + "," + C2.join(","));
        }
        return { response: A2, waitUntil: ("internal" === x2[L].kind ? Promise.all(x2[L].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: u2.fetchMetrics };
      }
      let { env: bp, stdout: bq } = (null == (iJ = globalThis) ? void 0 : iJ.process) ?? {}, br = bp && !bp.NO_COLOR && (bp.FORCE_COLOR || (null == bq ? void 0 : bq.isTTY) && !bp.CI && "dumb" !== bp.TERM), bs = (a10, b10, c10, d10) => {
        let e10 = a10.substring(0, d10) + c10, f10 = a10.substring(d10 + b10.length), g10 = f10.indexOf(b10);
        return ~g10 ? e10 + bs(f10, b10, c10, g10) : e10 + f10;
      }, bt = (a10, b10, c10 = a10) => br ? (d10) => {
        let e10 = "" + d10, f10 = e10.indexOf(b10, a10.length);
        return ~f10 ? a10 + bs(e10, b10, c10, f10) + b10 : a10 + e10 + b10;
      } : String, bu = bt("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      bt("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), bt("\x1B[3m", "\x1B[23m"), bt("\x1B[4m", "\x1B[24m"), bt("\x1B[7m", "\x1B[27m"), bt("\x1B[8m", "\x1B[28m"), bt("\x1B[9m", "\x1B[29m"), bt("\x1B[30m", "\x1B[39m");
      let bv = bt("\x1B[31m", "\x1B[39m"), bw = bt("\x1B[32m", "\x1B[39m"), bx = bt("\x1B[33m", "\x1B[39m");
      bt("\x1B[34m", "\x1B[39m");
      let by = bt("\x1B[35m", "\x1B[39m");
      bt("\x1B[38;2;173;127;168m", "\x1B[39m"), bt("\x1B[36m", "\x1B[39m");
      let bz = bt("\x1B[37m", "\x1B[39m");
      bt("\x1B[90m", "\x1B[39m"), bt("\x1B[40m", "\x1B[49m"), bt("\x1B[41m", "\x1B[49m"), bt("\x1B[42m", "\x1B[49m"), bt("\x1B[43m", "\x1B[49m"), bt("\x1B[44m", "\x1B[49m"), bt("\x1B[45m", "\x1B[49m"), bt("\x1B[46m", "\x1B[49m"), bt("\x1B[47m", "\x1B[49m"), bz(bu("\u25CB")), bv(bu("\u2A2F")), bx(bu("\u26A0")), bz(bu(" ")), bw(bu("\u2713")), by(bu("\xBB")), new a_(1e4, (a10) => a10.length), new a_(1e4, (a10) => a10.length);
      var bA = ((iH = {}).APP_PAGE = "APP_PAGE", iH.APP_ROUTE = "APP_ROUTE", iH.PAGES = "PAGES", iH.FETCH = "FETCH", iH.REDIRECT = "REDIRECT", iH.IMAGE = "IMAGE", iH), bB = ((iI = {}).APP_PAGE = "APP_PAGE", iI.APP_ROUTE = "APP_ROUTE", iI.PAGES = "PAGES", iI.FETCH = "FETCH", iI.IMAGE = "IMAGE", iI);
      function bC() {
      }
      new Uint8Array([60, 104, 116, 109, 108]), new Uint8Array([60, 104, 101, 97, 100]), new Uint8Array([60, 98, 111, 100, 121]), new Uint8Array([60, 47, 104, 101, 97, 100, 62]), new Uint8Array([60, 47, 98, 111, 100, 121, 62]), new Uint8Array([60, 47, 104, 116, 109, 108, 62]), new Uint8Array([60, 47, 98, 111, 100, 121, 62, 60, 47, 104, 116, 109, 108, 62]), new Uint8Array([60, 109, 101, 116, 97, 32, 110, 97, 109, 101, 61, 34, 194, 171, 110, 120, 116, 45, 105, 99, 111, 110, 194, 187, 34]), c(356).Buffer, new TextEncoder(), c(356).Buffer;
      let bD = new TextEncoder();
      function bE(a10) {
        return new ReadableStream({ start(b10) {
          b10.enqueue(bD.encode(a10)), b10.close();
        } });
      }
      function bF(a10) {
        return new ReadableStream({ start(b10) {
          b10.enqueue(a10), b10.close();
        } });
      }
      async function bG(a10, b10) {
        let c10 = new TextDecoder("utf-8", { fatal: true }), d10 = "";
        for await (let e10 of a10) {
          if (null == b10 ? void 0 : b10.aborted) return d10;
          d10 += c10.decode(e10, { stream: true });
        }
        return d10 + c10.decode();
      }
      let bH = "ResponseAborted";
      class bI extends Error {
        constructor(...a10) {
          super(...a10), this.name = bH;
        }
      }
      class bJ {
        constructor() {
          let a10, b10;
          this.promise = new Promise((c10, d10) => {
            a10 = c10, b10 = d10;
          }), this.resolve = a10, this.reject = b10;
        }
      }
      let bK = 0, bL = 0, bM = 0;
      function bN(a10) {
        return (null == a10 ? void 0 : a10.name) === "AbortError" || (null == a10 ? void 0 : a10.name) === bH;
      }
      async function bO(a10, b10, c10) {
        try {
          let d10, { errored: e10, destroyed: f10 } = b10;
          if (e10 || f10) return;
          let g10 = (d10 = new AbortController(), b10.once("close", () => {
            b10.writableFinished || d10.abort(new bI());
          }), d10), h10 = function(a11, b11) {
            let c11 = false, d11 = new bJ();
            function e11() {
              d11.resolve();
            }
            a11.on("drain", e11), a11.once("close", () => {
              a11.off("drain", e11), d11.resolve();
            });
            let f11 = new bJ();
            return a11.once("finish", () => {
              f11.resolve();
            }), new WritableStream({ write: async (b12) => {
              if (!c11) {
                if (c11 = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                  let a12 = function(a13 = {}) {
                    let b13 = 0 === bK ? void 0 : { clientComponentLoadStart: bK, clientComponentLoadTimes: bL, clientComponentLoadCount: bM };
                    return a13.reset && (bK = 0, bL = 0, bM = 0), b13;
                  }();
                  a12 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: a12.clientComponentLoadStart, end: a12.clientComponentLoadStart + a12.clientComponentLoadTimes });
                }
                a11.flushHeaders(), aQ().trace(aq.startResponse, { spanName: "start response" }, () => void 0);
              }
              try {
                let c12 = a11.write(b12);
                "flush" in a11 && "function" == typeof a11.flush && a11.flush(), c12 || (await d11.promise, d11 = new bJ());
              } catch (b13) {
                throw a11.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: b13 }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
              }
            }, abort: (b12) => {
              a11.writableFinished || a11.destroy(b12);
            }, close: async () => {
              if (b11 && await b11, !a11.writableFinished) return a11.end(), f11.promise;
            } });
          }(b10, c10);
          await a10.pipeTo(h10, { signal: g10.signal });
        } catch (a11) {
          if (bN(a11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: a11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      var bP = c(356).Buffer;
      class bQ {
        static #a = this.EMPTY = new bQ(null, { metadata: {}, contentType: null });
        static fromStatic(a10, b10) {
          return new bQ(a10, { metadata: {}, contentType: b10 });
        }
        constructor(a10, { contentType: b10, waitUntil: c10, metadata: d10 }) {
          this.response = a10, this.contentType = b10, this.metadata = d10, this.waitUntil = c10;
        }
        assignMetadata(a10) {
          Object.assign(this.metadata, a10);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(a10 = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!a10) throw Object.defineProperty(new aX.z("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return bG(this.readable);
          }
          return this.response;
        }
        get readable() {
          return null === this.response ? new ReadableStream({ start(a10) {
            a10.close();
          } }) : "string" == typeof this.response ? bE(this.response) : bP.isBuffer(this.response) ? bF(this.response) : Array.isArray(this.response) ? function(...a10) {
            if (0 === a10.length) return new ReadableStream({ start(a11) {
              a11.close();
            } });
            if (1 === a10.length) return a10[0];
            let { readable: b10, writable: c10 } = new TransformStream(), d10 = a10[0].pipeTo(c10, { preventClose: true }), e10 = 1;
            for (; e10 < a10.length - 1; e10++) {
              let b11 = a10[e10];
              d10 = d10.then(() => b11.pipeTo(c10, { preventClose: true }));
            }
            let f10 = a10[e10];
            return (d10 = d10.then(() => f10.pipeTo(c10))).catch(bC), b10;
          }(...this.response) : this.response;
        }
        coerce() {
          return null === this.response ? [] : "string" == typeof this.response ? [bE(this.response)] : Array.isArray(this.response) ? this.response : bP.isBuffer(this.response) ? [bF(this.response)] : [this.response];
        }
        pipeThrough(a10) {
          this.response = this.readable.pipeThrough(a10);
        }
        unshift(a10) {
          this.response = this.coerce(), this.response.unshift(a10);
        }
        push(a10) {
          this.response = this.coerce(), this.response.push(a10);
        }
        async pipeTo(a10) {
          try {
            await this.readable.pipeTo(a10, { preventClose: true }), this.waitUntil && await this.waitUntil, await a10.close();
          } catch (b10) {
            if (bN(b10)) return void await a10.abort(b10);
            throw b10;
          }
        }
        async pipeToNodeResponse(a10) {
          await bO(this.readable, a10, this.waitUntil);
        }
      }
      function bR(a10, b10) {
        if (!a10) return b10;
        let c10 = parseInt(a10, 10);
        return Number.isFinite(c10) && c10 > 0 ? c10 : b10;
      }
      bR(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), bR(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150);
      var bS = c(654), bT = c.n(bS);
      class bU {
        constructor(a10) {
          this.fs = a10, this.tasks = [];
        }
        findOrCreateTask(a10) {
          for (let b11 of this.tasks) if (b11[0] === a10) return b11;
          let b10 = this.fs.mkdir(a10);
          b10.catch(() => {
          });
          let c10 = [a10, b10, []];
          return this.tasks.push(c10), c10;
        }
        append(a10, b10) {
          let c10 = this.findOrCreateTask(bT().dirname(a10)), d10 = c10[1].then(() => this.fs.writeFile(a10, b10));
          d10.catch(() => {
          }), c10[2].push(d10);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((a10) => a10[2]));
        }
      }
      function bV(a10) {
        return (null == a10 ? void 0 : a10.length) || 0;
      }
      class bW {
        static #a = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor(a10) {
          this.fs = a10.fs, this.flushToDisk = a10.flushToDisk, this.serverDistDir = a10.serverDistDir, this.revalidatedTags = a10.revalidatedTags, a10.maxMemoryCacheSize ? bW.memoryCache ? bW.debug && console.log("FileSystemCache: memory store already initialized") : (bW.debug && console.log("FileSystemCache: using memory store for fetch cache"), bW.memoryCache = function(a11) {
            return e || (e = new a_(a11, function({ value: a12 }) {
              var b10, c10;
              if (!a12) return 25;
              if (a12.kind === bA.REDIRECT) return JSON.stringify(a12.props).length;
              if (a12.kind === bA.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
              if (a12.kind === bA.FETCH) return JSON.stringify(a12.data || "").length;
              if (a12.kind === bA.APP_ROUTE) return a12.body.length;
              return a12.kind === bA.APP_PAGE ? Math.max(1, a12.html.length + bV(a12.rscData) + ((null == (c10 = a12.postponed) ? void 0 : c10.length) || 0) + function(a13) {
                if (!a13) return 0;
                let b11 = 0;
                for (let [c11, d10] of a13) b11 += c11.length + bV(d10);
                return b11;
              }(a12.segmentData)) : a12.html.length + ((null == (b10 = JSON.stringify(a12.pageData)) ? void 0 : b10.length) || 0);
            })), e;
          }(a10.maxMemoryCacheSize)) : bW.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        async revalidateTag(a10, b10) {
          if (a10 = "string" == typeof a10 ? [a10] : a10, bW.debug && console.log("FileSystemCache: revalidateTag", a10, b10), 0 === a10.length) return;
          let c10 = Date.now();
          for (let d10 of a10) {
            let a11 = a0.get(d10) || {};
            if (b10) {
              let e10 = { ...a11 };
              e10.stale = c10, void 0 !== b10.expire && (e10.expired = c10 + 1e3 * b10.expire), a0.set(d10, e10);
            } else a0.set(d10, { ...a11, expired: c10 });
          }
        }
        async get(...a10) {
          var b10, c10, d10, e10, f10, g10;
          let [h10, i10] = a10, { kind: j10 } = i10, k2 = null == (b10 = bW.memoryCache) ? void 0 : b10.get(h10);
          if (bW.debug && (j10 === bB.FETCH ? console.log("FileSystemCache: get", h10, i10.tags, j10, !!k2) : console.log("FileSystemCache: get", h10, j10, !!k2)), (null == k2 || null == (c10 = k2.value) ? void 0 : c10.kind) === bA.APP_PAGE || (null == k2 || null == (d10 = k2.value) ? void 0 : d10.kind) === bA.APP_ROUTE || (null == k2 || null == (e10 = k2.value) ? void 0 : e10.kind) === bA.PAGES) {
            let a11 = null == (g10 = k2.value.headers) ? void 0 : g10[C];
            if ("string" == typeof a11) {
              let b11 = a11.split(",");
              if (b11.length > 0 && a1(b11, k2.lastModified)) return bW.debug && console.log("FileSystemCache: expired tags", b11), null;
            }
          } else if ((null == k2 || null == (f10 = k2.value) ? void 0 : f10.kind) === bA.FETCH) {
            let a11 = i10.kind === bB.FETCH ? [...i10.tags || [], ...i10.softTags || []] : [];
            if (a11.some((a12) => this.revalidatedTags.includes(a12))) return bW.debug && console.log("FileSystemCache: was revalidated", a11), null;
            if (a1(a11, k2.lastModified)) return bW.debug && console.log("FileSystemCache: expired tags", a11), null;
          }
          return k2 ?? null;
        }
        async set(a10, b10, c10) {
          var d10;
          if (null == (d10 = bW.memoryCache) || d10.set(a10, { value: b10, lastModified: Date.now() }), bW.debug && console.log("FileSystemCache: set", a10), !this.flushToDisk || !b10) return;
          let e10 = new bU(this.fs);
          if (b10.kind === bA.APP_ROUTE) {
            let c11 = this.getFilePath(`${a10}.body`, bB.APP_ROUTE);
            e10.append(c11, b10.body);
            let d11 = { headers: b10.headers, status: b10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            e10.append(c11.replace(/\.body$/, B), JSON.stringify(d11, null, 2));
          } else if (b10.kind === bA.PAGES || b10.kind === bA.APP_PAGE) {
            let d11 = b10.kind === bA.APP_PAGE, f10 = this.getFilePath(`${a10}.html`, d11 ? bB.APP_PAGE : bB.PAGES);
            if (e10.append(f10, b10.html), c10.fetchCache || c10.isFallback || c10.isRoutePPREnabled || e10.append(this.getFilePath(`${a10}${d11 ? ".rsc" : ".json"}`, d11 ? bB.APP_PAGE : bB.PAGES), d11 ? b10.rscData : JSON.stringify(b10.pageData)), (null == b10 ? void 0 : b10.kind) === bA.APP_PAGE) {
              let a11;
              if (b10.segmentData) {
                a11 = [];
                let c12 = f10.replace(/\.html$/, ".segments");
                for (let [d12, f11] of b10.segmentData) {
                  a11.push(d12);
                  let b11 = c12 + d12 + ".segment.rsc";
                  e10.append(b11, f11);
                }
              }
              let c11 = { headers: b10.headers, status: b10.status, postponed: b10.postponed, segmentPaths: a11, prefetchHints: void 0 };
              e10.append(f10.replace(/\.html$/, B), JSON.stringify(c11));
            }
          } else if (b10.kind === bA.FETCH) {
            let d11 = this.getFilePath(a10, bB.FETCH);
            e10.append(d11, JSON.stringify({ ...b10, tags: c10.fetchCache ? c10.tags : [] }));
          }
          await e10.wait();
        }
        getFilePath(a10, b10) {
          switch (b10) {
            case bB.FETCH:
              return bT().join(this.serverDistDir, "..", "cache", "fetch-cache", a10);
            case bB.PAGES:
              return bT().join(this.serverDistDir, "pages", a10);
            case bB.IMAGE:
            case bB.APP_PAGE:
            case bB.APP_ROUTE:
              return bT().join(this.serverDistDir, "app", a10);
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${b10}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
        }
      }
      let bX = ["(..)(..)", "(.)", "(..)", "(...)"], bY = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, bZ = /\/\[[^/]+\](?=\/|$)/;
      function b$(a10) {
        return a10.replace(/(?:\/index)?\/?$/, "") || "/";
      }
      "u" > typeof performance && ["mark", "measure", "getEntriesByName"].every((a10) => "function" == typeof performance[a10]);
      class b_ {
        static #a = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(a10) {
          this.prerenderManifest = a10;
        }
        get(a10) {
          let b10 = b_.cacheControls.get(a10);
          if (b10) return b10;
          let c10 = this.prerenderManifest.routes[a10];
          if (c10) {
            let { initialRevalidateSeconds: a11, initialExpireSeconds: b11 } = c10;
            if (void 0 !== a11) return { revalidate: a11, expire: b11 };
          }
          let d10 = this.prerenderManifest.dynamicRoutes[a10];
          if (d10) {
            let { fallbackRevalidate: a11, fallbackExpire: b11 } = d10;
            if (void 0 !== a11) return { revalidate: a11, expire: b11 };
          }
        }
        set(a10, b10) {
          b_.cacheControls.set(a10, b10);
        }
        clear() {
          b_.cacheControls.clear();
        }
      }
      c(259);
      class b0 {
        static #a = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs: a10, dev: b10, flushToDisk: c10, minimalMode: d10, serverDistDir: e10, requestHeaders: f10, maxMemoryCacheSize: g10, getPrerenderManifest: h10, fetchCacheKeyPrefix: i10, CurCacheHandler: j10, allowedRevalidateHeaderKeys: k2 }) {
          var l2, m2, n2, o2;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!j10;
          const p2 = Symbol.for("@next/cache-handlers"), q2 = globalThis;
          if (j10) b0.debug && console.log("IncrementalCache: using custom cache handler", j10.name);
          else {
            const b11 = q2[p2];
            (null == b11 ? void 0 : b11.FetchCache) ? (j10 = b11.FetchCache, b0.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : a10 && e10 && (b0.debug && console.log("IncrementalCache: using filesystem cache handler"), j10 = bW);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (g10 = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = b10, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = d10, this.requestHeaders = f10, this.allowedRevalidateHeaderKeys = k2, this.prerenderManifest = h10(), this.cacheControls = new b_(this.prerenderManifest), this.fetchCacheKeyPrefix = i10;
          let r2 = [];
          f10[A] === (null == (m2 = this.prerenderManifest) || null == (l2 = m2.preview) ? void 0 : l2.previewModeId) && (this.isOnDemandRevalidate = true), d10 && (r2 = this.revalidatedTags = function(a11, b11) {
            return "string" == typeof a11[D] && a11["x-next-revalidate-tag-token"] === b11 ? a11[D].split(",") : [];
          }(f10, null == (o2 = this.prerenderManifest) || null == (n2 = o2.preview) ? void 0 : n2.previewModeId)), j10 && (this.cacheHandler = new j10({ dev: b10, fs: a10, flushToDisk: c10, serverDistDir: e10, revalidatedTags: r2, maxMemoryCacheSize: g10, _requestHeaders: f10, fetchCacheKeyPrefix: i10 }));
        }
        calculateRevalidate(a10, b10, c10, d10) {
          if (c10) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let e10 = this.cacheControls.get(b$(a10)), f10 = e10 ? e10.revalidate : !d10 && 1;
          return "number" == typeof f10 ? 1e3 * f10 + b10 : f10;
        }
        _getPathname(a10, b10) {
          return b10 ? a10 : /^\/index(\/|$)/.test(a10) && !function(a11, b11 = true) {
            return (void 0 !== a11.split("/").find((a12) => bX.find((b12) => a12.startsWith(b12))) && (a11 = function(a12) {
              let b12, c10, d10;
              for (let e10 of a12.split("/")) if (c10 = bX.find((a13) => e10.startsWith(a13))) {
                [b12, d10] = a12.split(c10, 2);
                break;
              }
              if (!b12 || !c10 || !d10) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
              switch (b12 = ak(b12), c10) {
                case "(.)":
                  d10 = "/" === b12 ? `/${d10}` : b12 + "/" + d10;
                  break;
                case "(..)":
                  if ("/" === b12) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
                  d10 = b12.split("/").slice(0, -1).concat(d10).join("/");
                  break;
                case "(...)":
                  d10 = "/" + d10;
                  break;
                case "(..)(..)":
                  let e10 = b12.split("/");
                  if (e10.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${a12}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
                  d10 = e10.slice(0, -2).concat(d10).join("/");
                  break;
                default:
                  throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
              }
              return { interceptingRoute: b12, interceptedRoute: d10 };
            }(a11).interceptedRoute), b11) ? bZ.test(a11) : bY.test(a11);
          }(a10) ? `/index${a10}` : "/" === a10 ? "/index" : aj(a10);
        }
        resetRequestCache() {
          var a10, b10;
          null == (b10 = this.cacheHandler) || null == (a10 = b10.resetRequestCache) || a10.call(b10);
        }
        async lock(a10) {
          for (; ; ) {
            let b11 = this.locks.get(a10);
            if (b0.debug && console.log("IncrementalCache: lock get", a10, !!b11), !b11) break;
            await b11;
          }
          let { resolve: b10, promise: c10 } = new bJ();
          return b0.debug && console.log("IncrementalCache: successfully locked", a10), this.locks.set(a10, c10), () => {
            b10(), this.locks.delete(a10);
          };
        }
        async revalidateTag(a10, b10) {
          var c10;
          return null == (c10 = this.cacheHandler) ? void 0 : c10.revalidateTag(a10, b10);
        }
        async generateCacheKey(a10, b10 = {}) {
          let c10 = [], d10 = new TextEncoder(), e10 = new TextDecoder();
          if (b10.body) if (b10.body instanceof Uint8Array) c10.push(e10.decode(b10.body)), b10._ogBody = b10.body;
          else if ("function" == typeof b10.body.getReader) {
            let a11 = b10.body, f11 = [];
            try {
              await a11.pipeTo(new WritableStream({ write(a12) {
                "string" == typeof a12 ? (f11.push(d10.encode(a12)), c10.push(a12)) : (f11.push(a12), c10.push(e10.decode(a12, { stream: true })));
              } })), c10.push(e10.decode());
              let g11 = f11.reduce((a12, b11) => a12 + b11.length, 0), h11 = new Uint8Array(g11), i10 = 0;
              for (let a12 of f11) h11.set(a12, i10), i10 += a12.length;
              b10._ogBody = h11;
            } catch (a12) {
              console.error("Problem reading body", a12);
            }
          } else if ("function" == typeof b10.body.keys) {
            let a11 = b10.body;
            for (let d11 of (b10._ogBody = b10.body, /* @__PURE__ */ new Set([...a11.keys()]))) {
              let b11 = a11.getAll(d11);
              c10.push(`${d11}=${(await Promise.all(b11.map(async (a12) => "string" == typeof a12 ? a12 : await a12.text()))).join(",")}`);
            }
          } else if ("function" == typeof b10.body.arrayBuffer) {
            let a11 = b10.body, d11 = await a11.arrayBuffer();
            c10.push(await a11.text()), b10._ogBody = new Blob([d11], { type: a11.type });
          } else "string" == typeof b10.body && (c10.push(b10.body), b10._ogBody = b10.body);
          let f10 = "function" == typeof (b10.headers || {}).keys ? Object.fromEntries(b10.headers) : Object.assign({}, b10.headers);
          "traceparent" in f10 && delete f10.traceparent, "tracestate" in f10 && delete f10.tracestate;
          let g10 = JSON.stringify(["v3", this.fetchCacheKeyPrefix || "", a10, b10.method, f10, b10.mode, b10.redirect, b10.credentials, b10.referrer, b10.referrerPolicy, b10.integrity, b10.cache, c10]);
          {
            var h10;
            let a11 = d10.encode(g10);
            return h10 = await crypto.subtle.digest("SHA-256", a11), Array.prototype.map.call(new Uint8Array(h10), (a12) => a12.toString(16).padStart(2, "0")).join("");
          }
        }
        async get(a10, b10) {
          var c10, d10, e10, f10, g10, h10, i10;
          let j10, k2;
          if (b10.kind === bB.FETCH) {
            let c11 = aU.FP.getStore(), d11 = c11 ? (0, aU.E0)(c11) : null;
            if (d11) {
              let c12 = d11.fetch.get(a10);
              if ((null == c12 ? void 0 : c12.kind) === bA.FETCH) {
                let d12 = aY.J.getStore();
                if (![...b10.tags || [], ...b10.softTags || []].some((a11) => {
                  var b11, c13;
                  return (null == (b11 = this.revalidatedTags) ? void 0 : b11.includes(a11)) || (null == d12 || null == (c13 = d12.pendingRevalidatedTags) ? void 0 : c13.some((b12) => b12.tag === a11));
                })) return b0.debug && console.log("IncrementalCache: rdc:hit", a10), { isStale: false, value: c12 };
                b0.debug && console.log("IncrementalCache: rdc:revalidated-tag", a10);
              } else b0.debug && console.log("IncrementalCache: rdc:miss", a10);
            } else b0.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (b10.kind !== bB.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          a10 = this._getPathname(a10, b10.kind === bB.FETCH);
          let l2 = await (null == (c10 = this.cacheHandler) ? void 0 : c10.get(a10, b10));
          if (b10.kind === bB.FETCH) {
            if (!l2) return null;
            if ((null == (e10 = l2.value) ? void 0 : e10.kind) !== bA.FETCH) throw Object.defineProperty(new aX.z(`Expected cached value for cache key ${JSON.stringify(a10)} to be a "FETCH" kind, got ${JSON.stringify(null == (f10 = l2.value) ? void 0 : f10.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let c11 = aY.J.getStore(), d11 = [...b10.tags || [], ...b10.softTags || []];
            if (d11.some((a11) => {
              var b11, d12;
              return (null == (b11 = this.revalidatedTags) ? void 0 : b11.includes(a11)) || (null == c11 || null == (d12 = c11.pendingRevalidatedTags) ? void 0 : d12.some((b12) => b12.tag === a11));
            })) return b0.debug && console.log("IncrementalCache: expired tag", a10), null;
            let g11 = aU.FP.getStore();
            if (g11) {
              let b11 = (0, aU.fm)(g11);
              b11 && (b0.debug && console.log("IncrementalCache: rdc:set", a10), b11.fetch.set(a10, l2.value));
            }
            let h11 = b10.revalidate || l2.value.revalidate, i11 = (performance.timeOrigin + performance.now() - (l2.lastModified || 0)) / 1e3 > h11, j11 = l2.value.data;
            return a1(d11, l2.lastModified) ? null : (a2(d11, l2.lastModified) && (i11 = true), { isStale: i11, value: { kind: bA.FETCH, data: j11, revalidate: h11 } });
          }
          if ((null == l2 || null == (d10 = l2.value) ? void 0 : d10.kind) === bA.FETCH) throw Object.defineProperty(new aX.z(`Expected cached value for cache key ${JSON.stringify(a10)} not to be a ${JSON.stringify(b10.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let m2 = null, { isFallback: n2 } = b10, o2 = this.cacheControls.get(b$(a10));
          if ((null == l2 ? void 0 : l2.lastModified) === -1) j10 = -1, k2 = -31536e6;
          else {
            let c11 = performance.timeOrigin + performance.now(), d11 = (null == l2 ? void 0 : l2.lastModified) || c11;
            if (void 0 === (j10 = false !== (k2 = this.calculateRevalidate(a10, d11, this.dev ?? false, b10.isFallback)) && k2 < c11 || void 0) && ((null == l2 || null == (g10 = l2.value) ? void 0 : g10.kind) === bA.APP_PAGE || (null == l2 || null == (h10 = l2.value) ? void 0 : h10.kind) === bA.APP_ROUTE)) {
              let a11 = null == (i10 = l2.value.headers) ? void 0 : i10[C];
              if ("string" == typeof a11) {
                let b11 = a11.split(",");
                b11.length > 0 && (a1(b11, d11) ? j10 = -1 : a2(b11, d11) && (j10 = true));
              }
            }
          }
          return l2 && (m2 = { isStale: j10, cacheControl: o2, revalidateAfter: k2, value: l2.value, isFallback: n2 }), !l2 && this.prerenderManifest.notFoundRoutes.includes(a10) && (m2 = { isStale: j10, value: null, cacheControl: o2, revalidateAfter: k2, isFallback: n2 }, this.set(a10, m2.value, { ...b10, cacheControl: o2 })), m2;
        }
        async set(a10, b10, c10) {
          if ((null == b10 ? void 0 : b10.kind) === bA.FETCH) {
            let c11 = aU.FP.getStore(), d11 = c11 ? (0, aU.fm)(c11) : null;
            d11 && (b0.debug && console.log("IncrementalCache: rdc:set", a10), d11.fetch.set(a10, b10));
          }
          if (this.disableForTestmode || this.dev && !c10.fetchCache) return;
          a10 = this._getPathname(a10, c10.fetchCache);
          let d10 = JSON.stringify(b10).length;
          if (c10.fetchCache && d10 > 2097152 && !this.hasCustomCacheHandler && !c10.isImplicitBuildTimeCache) {
            let b11 = `Failed to set Next.js data cache for ${c10.fetchUrl || a10}, items over 2MB can not be cached (${d10} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(b11), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(b11);
            return;
          }
          try {
            var e10;
            !c10.fetchCache && c10.cacheControl && this.cacheControls.set(b$(a10), c10.cacheControl), await (null == (e10 = this.cacheHandler) ? void 0 : e10.set(a10, b10, c10));
          } catch (b11) {
            console.warn("Failed to update prerender cache for", a10, b11);
          }
        }
      }
      function b1(a10) {
        return a10.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
      }
      function b2(a10) {
        return a10 && a10.sensitive ? "" : "i";
      }
      function b3(a10, b10, c10) {
        var d10;
        return a10 instanceof RegExp ? function(a11, b11) {
          if (!b11) return a11;
          for (var c11 = /\((?:\?<(.*?)>)?(?!\?)/g, d11 = 0, e10 = c11.exec(a11.source); e10; ) b11.push({ name: e10[1] || d11++, prefix: "", suffix: "", modifier: "", pattern: "" }), e10 = c11.exec(a11.source);
          return a11;
        }(a10, b10) : Array.isArray(a10) ? (d10 = a10.map(function(a11) {
          return b3(a11, b10, c10).source;
        }), new RegExp("(?:".concat(d10.join("|"), ")"), b2(c10))) : function(a11, b11, c11) {
          void 0 === c11 && (c11 = {});
          for (var d11 = c11.strict, e10 = void 0 !== d11 && d11, f10 = c11.start, g10 = c11.end, h10 = c11.encode, i10 = void 0 === h10 ? function(a12) {
            return a12;
          } : h10, j10 = c11.delimiter, k2 = c11.endsWith, l2 = "[".concat(b1(void 0 === k2 ? "" : k2), "]|$"), m2 = "[".concat(b1(void 0 === j10 ? "/#?" : j10), "]"), n2 = void 0 === f10 || f10 ? "^" : "", o2 = 0; o2 < a11.length; o2++) {
            var p2 = a11[o2];
            if ("string" == typeof p2) n2 += b1(i10(p2));
            else {
              var q2 = b1(i10(p2.prefix)), r2 = b1(i10(p2.suffix));
              if (p2.pattern) if (b11 && b11.push(p2), q2 || r2) if ("+" === p2.modifier || "*" === p2.modifier) {
                var s2 = "*" === p2.modifier ? "?" : "";
                n2 += "(?:".concat(q2, "((?:").concat(p2.pattern, ")(?:").concat(r2).concat(q2, "(?:").concat(p2.pattern, "))*)").concat(r2, ")").concat(s2);
              } else n2 += "(?:".concat(q2, "(").concat(p2.pattern, ")").concat(r2, ")").concat(p2.modifier);
              else {
                if ("+" === p2.modifier || "*" === p2.modifier) throw TypeError('Can not repeat "'.concat(p2.name, '" without a prefix and suffix'));
                n2 += "(".concat(p2.pattern, ")").concat(p2.modifier);
              }
              else n2 += "(?:".concat(q2).concat(r2, ")").concat(p2.modifier);
            }
          }
          if (void 0 === g10 || g10) e10 || (n2 += "".concat(m2, "?")), n2 += c11.endsWith ? "(?=".concat(l2, ")") : "$";
          else {
            var t2 = a11[a11.length - 1], u2 = "string" == typeof t2 ? m2.indexOf(t2[t2.length - 1]) > -1 : void 0 === t2;
            e10 || (n2 += "(?:".concat(m2, "(?=").concat(l2, "))?")), u2 || (n2 += "(?=".concat(m2, "|").concat(l2, ")"));
          }
          return new RegExp(n2, b2(c11));
        }(function(a11, b11) {
          void 0 === b11 && (b11 = {});
          for (var c11 = function(a12) {
            for (var b12 = [], c12 = 0; c12 < a12.length; ) {
              var d12 = a12[c12];
              if ("*" === d12 || "+" === d12 || "?" === d12) {
                b12.push({ type: "MODIFIER", index: c12, value: a12[c12++] });
                continue;
              }
              if ("\\" === d12) {
                b12.push({ type: "ESCAPED_CHAR", index: c12++, value: a12[c12++] });
                continue;
              }
              if ("{" === d12) {
                b12.push({ type: "OPEN", index: c12, value: a12[c12++] });
                continue;
              }
              if ("}" === d12) {
                b12.push({ type: "CLOSE", index: c12, value: a12[c12++] });
                continue;
              }
              if (":" === d12) {
                for (var e11 = "", f11 = c12 + 1; f11 < a12.length; ) {
                  var g11 = a12.charCodeAt(f11);
                  if (g11 >= 48 && g11 <= 57 || g11 >= 65 && g11 <= 90 || g11 >= 97 && g11 <= 122 || 95 === g11) {
                    e11 += a12[f11++];
                    continue;
                  }
                  break;
                }
                if (!e11) throw TypeError("Missing parameter name at ".concat(c12));
                b12.push({ type: "NAME", index: c12, value: e11 }), c12 = f11;
                continue;
              }
              if ("(" === d12) {
                var h11 = 1, i11 = "", f11 = c12 + 1;
                if ("?" === a12[f11]) throw TypeError('Pattern cannot start with "?" at '.concat(f11));
                for (; f11 < a12.length; ) {
                  if ("\\" === a12[f11]) {
                    i11 += a12[f11++] + a12[f11++];
                    continue;
                  }
                  if (")" === a12[f11]) {
                    if (0 == --h11) {
                      f11++;
                      break;
                    }
                  } else if ("(" === a12[f11] && (h11++, "?" !== a12[f11 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(f11));
                  i11 += a12[f11++];
                }
                if (h11) throw TypeError("Unbalanced pattern at ".concat(c12));
                if (!i11) throw TypeError("Missing pattern at ".concat(c12));
                b12.push({ type: "PATTERN", index: c12, value: i11 }), c12 = f11;
                continue;
              }
              b12.push({ type: "CHAR", index: c12, value: a12[c12++] });
            }
            return b12.push({ type: "END", index: c12, value: "" }), b12;
          }(a11), d11 = b11.prefixes, e10 = void 0 === d11 ? "./" : d11, f10 = b11.delimiter, g10 = void 0 === f10 ? "/#?" : f10, h10 = [], i10 = 0, j10 = 0, k2 = "", l2 = function(a12) {
            if (j10 < c11.length && c11[j10].type === a12) return c11[j10++].value;
          }, m2 = function(a12) {
            var b12 = l2(a12);
            if (void 0 !== b12) return b12;
            var d12 = c11[j10], e11 = d12.type, f11 = d12.index;
            throw TypeError("Unexpected ".concat(e11, " at ").concat(f11, ", expected ").concat(a12));
          }, n2 = function() {
            for (var a12, b12 = ""; a12 = l2("CHAR") || l2("ESCAPED_CHAR"); ) b12 += a12;
            return b12;
          }, o2 = function(a12) {
            for (var b12 = 0; b12 < g10.length; b12++) {
              var c12 = g10[b12];
              if (a12.indexOf(c12) > -1) return true;
            }
            return false;
          }, p2 = function(a12) {
            var b12 = h10[h10.length - 1], c12 = a12 || (b12 && "string" == typeof b12 ? b12 : "");
            if (b12 && !c12) throw TypeError('Must have text between two parameters, missing text after "'.concat(b12.name, '"'));
            return !c12 || o2(c12) ? "[^".concat(b1(g10), "]+?") : "(?:(?!".concat(b1(c12), ")[^").concat(b1(g10), "])+?");
          }; j10 < c11.length; ) {
            var q2 = l2("CHAR"), r2 = l2("NAME"), s2 = l2("PATTERN");
            if (r2 || s2) {
              var t2 = q2 || "";
              -1 === e10.indexOf(t2) && (k2 += t2, t2 = ""), k2 && (h10.push(k2), k2 = ""), h10.push({ name: r2 || i10++, prefix: t2, suffix: "", pattern: s2 || p2(t2), modifier: l2("MODIFIER") || "" });
              continue;
            }
            var u2 = q2 || l2("ESCAPED_CHAR");
            if (u2) {
              k2 += u2;
              continue;
            }
            if (k2 && (h10.push(k2), k2 = ""), l2("OPEN")) {
              var t2 = n2(), v2 = l2("NAME") || "", w2 = l2("PATTERN") || "", x2 = n2();
              m2("CLOSE"), h10.push({ name: v2 || (w2 ? i10++ : ""), pattern: v2 && !w2 ? p2(t2) : w2, prefix: t2, suffix: x2, modifier: l2("MODIFIER") || "" });
              continue;
            }
            m2("END");
          }
          return h10;
        }(a10, c10), b10, c10);
      }
      var b4 = class extends Error {
        statusCode = 400;
        constructor(a10, b10) {
          super(`Malformed encoding in URL path: ${a10}`), this.name = "MalformedURLError", this.cause = b10;
        }
      };
      let b5 = ["CI", "CONTINUOUS_INTEGRATION", "GITHUB_ACTIONS", "GITLAB_CI", "CIRCLECI", "TRAVIS", "BUILDKITE", "BITBUCKET_BUILD_NUMBER", "APPVEYOR", "CODEBUILD_BUILD_ID", "TF_BUILD", "TEAMCITY_VERSION", "JENKINS_URL", "HUDSON_URL", "BAMBOO_BUILDKEY", "CF_PAGES"], b6 = () => {
        try {
          return true;
        } catch {
        }
        return false;
      }, b7 = /* @__PURE__ */ new Set(), b8 = (a10, b10, c10) => {
        let d10 = b6(), e10 = c10 ?? a10;
        b7.has(e10) || d10 || (b7.add(e10), console.warn(`Clerk - DEPRECATION WARNING: "${a10}" is deprecated and will be removed in the next major release.
${b10}`));
      }, b9 = [".lcl.dev", ".lclstage.dev", ".lclclerk.com"], ca = [".accounts.dev", ".accountsstage.dev", ".accounts.lclclerk.com"], cb = [".lcl.dev", ".stg.dev", ".lclstage.dev", ".stgstage.dev", ".dev.lclclerk.com", ".stg.lclclerk.com", ".accounts.lclclerk.com", "accountsstage.dev", "accounts.dev"], cc = [".lcl.dev", "lclstage.dev", ".lclclerk.com", ".accounts.lclclerk.com"], cd = [".accountsstage.dev"], ce = "https://api.clerk.com", cf = "https://frontend-api.clerk.dev", cg = "/__clerk", ch = (a10) => "u" > typeof atob && "function" == typeof atob ? atob(a10) : void 0 !== globalThis.Buffer ? globalThis.Buffer.from(a10, "base64").toString() : a10, ci = "pk_live_";
      function cj(a10) {
        if (!a10.endsWith("$")) return false;
        let b10 = a10.slice(0, -1);
        return !b10.includes("$") && b10.includes(".");
      }
      function ck(a10, b10 = {}) {
        let c10;
        if (!(a10 = a10 || "") || !cl(a10)) {
          if (b10.fatal && !a10) throw Error("Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys");
          if (b10.fatal && !cl(a10)) throw Error("Publishable key not valid.");
          return null;
        }
        let d10 = a10.startsWith(ci) ? "production" : "development";
        try {
          c10 = ch(a10.split("_")[2]);
        } catch {
          if (b10.fatal) throw Error("Publishable key not valid: Failed to decode key.");
          return null;
        }
        if (!cj(c10)) {
          if (b10.fatal) throw Error("Publishable key not valid: Decoded key has invalid format.");
          return null;
        }
        let e10 = c10.slice(0, -1);
        return b10.proxyUrl ? e10 = b10.proxyUrl : "development" !== d10 && b10.domain && b10.isSatellite && (e10 = `clerk.${b10.domain}`), { instanceType: d10, frontendApi: e10 };
      }
      function cl(a10 = "") {
        try {
          if (!(a10.startsWith(ci) || a10.startsWith("pk_test_"))) return false;
          let b10 = a10.split("_");
          if (3 !== b10.length) return false;
          let c10 = b10[2];
          if (!c10) return false;
          return cj(ch(c10));
        } catch {
          return false;
        }
      }
      function cm(a10) {
        return a10.startsWith("live_") || a10.startsWith("pk_live_");
      }
      function cn(a10) {
        return a10.startsWith("test_") || a10.startsWith("sk_test_");
      }
      async function co(a10, b10 = globalThis.crypto.subtle) {
        var c10;
        let d10 = new TextEncoder().encode(a10);
        return (c10 = String.fromCharCode(...new Uint8Array(await b10.digest("sha-1", d10))), "u" > typeof btoa && "function" == typeof btoa ? btoa(c10) : void 0 !== globalThis.Buffer ? globalThis.Buffer.from(c10).toString("base64") : c10).replace(/\+/gi, "-").replace(/\//gi, "_").substring(0, 8);
      }
      let cp = { initialDelay: 125, maxDelayBetweenRetries: 0, factor: 2, shouldRetry: (a10, b10) => b10 < 5, retryImmediately: false, jitter: true }, cq = async (a10) => new Promise((b10) => setTimeout(b10, a10)), cr = (a10, b10) => b10 ? a10 * (1 + Math.random()) : a10, cs = async (a10, b10 = {}) => {
        var c10;
        let d10, e10 = 0, { shouldRetry: f10, initialDelay: g10, maxDelayBetweenRetries: h10, factor: i10, retryImmediately: j10, jitter: k2, onBeforeRetry: l2 } = { ...cp, ...b10 }, m2 = (c10 = { initialDelay: g10, maxDelayBetweenRetries: h10, factor: i10, jitter: k2 }, d10 = 0, async () => {
          let a11;
          await cq((a11 = cr(a11 = c10.initialDelay * Math.pow(c10.factor, d10), c10.jitter), Math.min(c10.maxDelayBetweenRetries || a11, a11))), d10++;
        });
        for (; ; ) try {
          return await a10();
        } catch (a11) {
          if (!f10(a11, ++e10)) throw a11;
          l2 && await l2(e10), j10 && 1 === e10 ? await cq(cr(100, k2)) : await m2();
        }
      };
      function ct(a10) {
        return function(b10) {
          let c10 = b10 ?? this;
          if (!c10) throw TypeError(`${a10.kind || a10.name} type guard requires an error object`);
          return !!a10.kind && "object" == typeof c10 && null !== c10 && "constructor" in c10 && c10.constructor?.kind === a10.kind || c10 instanceof a10;
        };
      }
      var cu = class a10 extends Error {
        static kind = "ClerkError";
        clerkError = true;
        code;
        longMessage;
        docsUrl;
        cause;
        get name() {
          return this.constructor.name;
        }
        constructor(b10) {
          super(new.target.formatMessage(new.target.kind, b10.message, b10.code, b10.docsUrl), { cause: b10.cause }), Object.setPrototypeOf(this, a10.prototype), this.code = b10.code, this.docsUrl = b10.docsUrl, this.longMessage = b10.longMessage, this.cause = b10.cause;
        }
        toString() {
          return `[${this.name}]
Message:${this.message}`;
        }
        static formatMessage(a11, b10, c10, d10) {
          let e10 = "Clerk:", f10 = RegExp(e10.replace(" ", "\\s*"), "i");
          return b10 = b10.replace(f10, ""), b10 = `${e10} ${b10.trim()}

(code="${c10}")

`, d10 && (b10 += `

Docs: ${d10}`), b10;
        }
      };
      ct(class a10 extends cu {
        static kind = "ClerkRuntimeError";
        clerkRuntimeError = true;
        constructor(b10, c10) {
          super({ ...c10, message: b10 }), Object.setPrototypeOf(this, a10.prototype);
        }
      });
      var cv = class {
        static kind = "ClerkAPIError";
        code;
        message;
        longMessage;
        meta;
        constructor(a10) {
          const b10 = { code: a10.code, message: a10.message, longMessage: a10.long_message, meta: { paramName: a10.meta?.param_name, sessionId: a10.meta?.session_id, emailAddresses: a10.meta?.email_addresses, identifiers: a10.meta?.identifiers, zxcvbn: a10.meta?.zxcvbn, plan: a10.meta?.plan, isPlanUpgradePossible: a10.meta?.is_plan_upgrade_possible, seatsQuantityToAdd: a10.meta?.seats_quantity_to_add, seatsQuantity: a10.meta?.seats_quantity } };
          this.code = b10.code, this.message = b10.message, this.longMessage = b10.longMessage, this.meta = b10.meta;
        }
      };
      function cw(a10) {
        return new cv(a10);
      }
      ct(cv);
      var cx = class a10 extends cu {
        static kind = "ClerkAPIResponseError";
        status;
        clerkTraceId;
        retryAfter;
        errors;
        constructor(b10, c10) {
          const { data: d10, status: e10, clerkTraceId: f10, retryAfter: g10 } = c10;
          super({ ...c10, message: b10, code: "api_response_error" }), Object.setPrototypeOf(this, a10.prototype), this.status = e10, this.clerkTraceId = f10, this.retryAfter = g10, this.errors = (d10 || []).map((a11) => new cv(a11));
        }
        toString() {
          let a11 = `[${this.name}]
Message:${this.message}
Status:${this.status}
Serialized errors: ${this.errors.map((a12) => JSON.stringify(a12))}`;
          return this.clerkTraceId && (a11 += `
Clerk Trace ID: ${this.clerkTraceId}`), a11;
        }
        static formatMessage(a11, b10, c10, d10) {
          return b10;
        }
      };
      let cy = ct(cx), cz = Object.freeze({ InvalidProxyUrlErrorMessage: "The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})", InvalidPublishableKeyErrorMessage: "The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})", MissingPublishableKeyErrorMessage: "Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.", MissingSecretKeyErrorMessage: "Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.", MissingClerkProvider: "{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider" });
      function cA({ packageName: a10, customMessages: b10 }) {
        let c10 = a10;
        function d10(a11, b11) {
          if (!b11) return `${c10}: ${a11}`;
          let d11 = a11;
          for (let c11 of a11.matchAll(/{{([a-zA-Z0-9-_]+)}}/g)) {
            let a12 = (b11[c11[1]] || "").toString();
            d11 = d11.replace(`{{${c11[1]}}}`, a12);
          }
          return `${c10}: ${d11}`;
        }
        let e10 = { ...cz, ...b10 };
        return { setPackageName({ packageName: a11 }) {
          return "string" == typeof a11 && (c10 = a11), this;
        }, setMessages({ customMessages: a11 }) {
          return Object.assign(e10, a11 || {}), this;
        }, throwInvalidPublishableKeyError(a11) {
          throw Error(d10(e10.InvalidPublishableKeyErrorMessage, a11));
        }, throwInvalidProxyUrl(a11) {
          throw Error(d10(e10.InvalidProxyUrlErrorMessage, a11));
        }, throwMissingPublishableKeyError() {
          throw Error(d10(e10.MissingPublishableKeyErrorMessage));
        }, throwMissingSecretKeyError() {
          throw Error(d10(e10.MissingSecretKeyErrorMessage));
        }, throwMissingClerkProviderError(a11) {
          throw Error(d10(e10.MissingClerkProvider, a11));
        }, throw(a11) {
          throw Error(d10(a11));
        } };
      }
      var cB = cA({ packageName: "@clerk/backend" }), { isDevOrStagingUrl: cC } = (g = /* @__PURE__ */ new Map(), { isDevOrStagingUrl: (a10) => {
        if (!a10) return false;
        let b10 = "string" == typeof a10 ? a10 : a10.hostname, c10 = g.get(b10);
        return void 0 === c10 && (c10 = cb.some((a11) => b10.endsWith(a11)), g.set(b10, c10)), c10;
      } }), cD = "token-expired", cE = "token-invalid", cF = "token-invalid-signature", cG = "token-not-active-yet", cH = "token-iat-in-the-future", cI = "token-verification-failed", cJ = "jwk-remote-failed-to-load", cK = "jwk-failed-to-resolve", cL = "Contact support@clerk.com", cM = "Make sure that this is a valid Clerk-generated JWT.", cN = "Set the CLERK_JWT_KEY environment variable.", cO = class a10 extends Error {
        constructor({ action: b10, message: c10, reason: d10 }) {
          super(c10), Object.setPrototypeOf(this, a10.prototype), this.reason = d10, this.message = c10, this.action = b10;
        }
        getFullMessage() {
          return `${[this.message, this.action].filter((a11) => a11).join(" ")} (reason=${this.reason}, token-carrier=${this.tokenCarrier})`;
        }
      }, cP = "token-invalid", cQ = "unexpected-error", cR = "token-verification-failed", cS = class a10 extends cu {
        constructor({ message: b10, code: c10, status: d10, action: e10 }) {
          super({ message: b10, code: c10 }), Object.setPrototypeOf(this, a10.prototype), this.status = d10, this.action = e10;
        }
        static formatMessage(a11, b10, c10, d10) {
          return b10;
        }
        getFullMessage() {
          return `${this.message} (code=${this.code}, status=${this.status || "n/a"})`;
        }
      };
      cS.kind = "MachineTokenVerificationError";
      let cT = crypto;
      var cU = fetch.bind(globalThis), cV = { crypto: cT, get fetch() {
        return cU;
      }, AbortController: globalThis.AbortController, Blob: globalThis.Blob, FormData: globalThis.FormData, Headers: globalThis.Headers, Request: globalThis.Request, Response: globalThis.Response }, cW = (a10, b10) => function(a11, b11, c10 = {}) {
        if (!b11.codes) {
          b11.codes = {};
          for (let a12 = 0; a12 < b11.chars.length; ++a12) b11.codes[b11.chars[a12]] = a12;
        }
        if (!c10.loose && a11.length * b11.bits & 7) throw SyntaxError("Invalid padding");
        let d10 = a11.length;
        for (; "=" === a11[d10 - 1]; ) if (--d10, !c10.loose && !((a11.length - d10) * b11.bits & 7)) throw SyntaxError("Invalid padding");
        let e10 = new (c10.out ?? Uint8Array)(d10 * b11.bits / 8 | 0), f10 = 0, g10 = 0, h10 = 0;
        for (let c11 = 0; c11 < d10; ++c11) {
          let d11 = b11.codes[a11[c11]];
          if (void 0 === d11) throw SyntaxError("Invalid character " + a11[c11]);
          g10 = g10 << b11.bits | d11, (f10 += b11.bits) >= 8 && (f10 -= 8, e10[h10++] = 255 & g10 >> f10);
        }
        if (f10 >= b11.bits || 255 & g10 << 8 - f10) throw SyntaxError("Unexpected end of data");
        return e10;
      }(a10, cX, b10), cX = { chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", bits: 6 }, cY = { RS256: "SHA-256", RS384: "SHA-384", RS512: "SHA-512" }, cZ = "RSASSA-PKCS1-v1_5", c$ = { RS256: cZ, RS384: cZ, RS512: cZ }, c_ = Object.keys(cY), c0 = (a10, b10) => {
        if (void 0 === a10 && void 0 === b10) return;
        let c10 = b10 ?? "JWT", d10 = Array.isArray(c10) ? c10 : [c10];
        if (!d10.includes(a10)) throw new cO({ action: cM, reason: cE, message: `Invalid JWT type ${JSON.stringify(a10)}. Expected "${d10.join(", ")}".` });
      }, c1 = (a10) => {
        if (!c_.includes(a10)) throw new cO({ action: cM, reason: "token-invalid-algorithm", message: `Invalid JWT algorithm ${JSON.stringify(a10)}. Supported: ${c_}.` });
      };
      async function c2(a10, b10) {
        let { header: c10, signature: d10, raw: e10 } = a10, f10 = new TextEncoder().encode([e10.header, e10.payload].join(".")), g10 = function(a11) {
          let b11 = cY[a11], c11 = c$[a11];
          if (!b11 || !c11) throw Error(`Unsupported algorithm ${a11}, expected one of ${c_.join(",")}.`);
          return { hash: { name: cY[a11] }, name: c$[a11] };
        }(c10.alg);
        try {
          let a11 = await function(a12, b11, c11) {
            if ("object" == typeof a12) return cV.crypto.subtle.importKey("jwk", a12, b11, false, [c11]);
            let d11 = function(a13) {
              let b12 = ch(a13.replace(/-----BEGIN.*?-----/g, "").replace(/-----END.*?-----/g, "").replace(/\s/g, "")), c12 = new Uint8Array(new ArrayBuffer(b12.length));
              for (let a14 = 0, d12 = b12.length; a14 < d12; a14++) c12[a14] = b12.charCodeAt(a14);
              return c12;
            }(a12), e11 = "sign" === c11 ? "pkcs8" : "spki";
            return cV.crypto.subtle.importKey(e11, d11, b11, false, [c11]);
          }(b10, g10, "verify");
          return { data: await cV.crypto.subtle.verify(g10.name, a11, d10, f10) };
        } catch (a11) {
          return { errors: [new cO({ reason: cF, message: a11?.message })] };
        }
      }
      function c3(a10) {
        let b10 = (a10 || "").toString().split(".");
        if (3 !== b10.length) return { errors: [new cO({ reason: cE, message: "Invalid JWT form. A JWT consists of three parts separated by dots." })] };
        let [c10, d10, e10] = b10, f10 = new TextDecoder(), g10 = JSON.parse(f10.decode(cW(c10, { loose: true }))), h10 = JSON.parse(f10.decode(cW(d10, { loose: true })));
        return { data: { header: g10, payload: h10, signature: cW(e10, { loose: true }), raw: { header: c10, payload: d10, signature: e10, text: a10 } } };
      }
      async function c4(a10, b10) {
        let { audience: c10, authorizedParties: d10, clockSkewInMs: e10, key: f10, headerType: g10 } = b10, h10 = "number" == typeof e10 && Number.isFinite(e10) ? e10 : 5e3, { data: i10, errors: j10 } = c3(a10);
        if (j10) return { errors: j10 };
        let { header: k2, payload: l2 } = i10;
        try {
          let { typ: a11, alg: b11 } = k2;
          c0(a11, g10), c1(b11);
        } catch (a11) {
          return { errors: [a11] };
        }
        let { data: m2, errors: n2 } = await c2(i10, f10);
        if (n2) return { errors: [new cO({ action: cM, reason: cI, message: `Error verifying JWT signature. ${n2[0]}` })] };
        if (!m2) return { errors: [new cO({ reason: cF, message: "JWT signature is invalid." })] };
        try {
          let { azp: a11, sub: b11, aud: e11, iat: f11, exp: g11, nbf: i11 } = l2;
          if ("string" != typeof b11) throw new cO({ action: cM, reason: cI, message: `Subject claim (sub) is required and must be a string. Received ${JSON.stringify(b11)}.` });
          let j11 = [c10].flat().filter((a12) => !!a12), k3 = [e11].flat().filter((a12) => !!a12);
          if (j11.length > 0 && k3.length > 0) {
            if ("string" == typeof e11) {
              if (!j11.includes(e11)) throw new cO({ action: cM, reason: cI, message: `Invalid JWT audience claim (aud) ${JSON.stringify(e11)}. Is not included in "${JSON.stringify(j11)}".` });
            } else if (Array.isArray(e11) && e11.length > 0 && e11.every((a12) => "string" == typeof a12) && !e11.some((a12) => j11.includes(a12))) throw new cO({ action: cM, reason: cI, message: `Invalid JWT audience claim array (aud) ${JSON.stringify(e11)}. Is not included in "${JSON.stringify(j11)}".` });
          }
          if (a11 && d10 && 0 !== d10.length && !d10.includes(a11)) throw new cO({ reason: "token-invalid-authorized-parties", message: `Invalid JWT Authorized party claim (azp) ${JSON.stringify(a11)}. Expected "${d10}".` });
          if ("number" != typeof g11) throw new cO({ action: cM, reason: cI, message: `Invalid JWT expiry date claim (exp) ${JSON.stringify(g11)}. Expected number.` });
          let m3 = new Date(Date.now()), n3 = /* @__PURE__ */ new Date(0);
          if (n3.setUTCSeconds(g11), n3.getTime() <= m3.getTime() - h10) throw new cO({ reason: cD, message: `JWT is expired. Expiry date: ${n3.toUTCString()}, Current date: ${m3.toUTCString()}.` });
          ((a12, b12) => {
            if (void 0 === a12) return;
            if ("number" != typeof a12) throw new cO({ action: cM, reason: cI, message: `Invalid JWT not before date claim (nbf) ${JSON.stringify(a12)}. Expected number.` });
            let c11 = new Date(Date.now()), d11 = /* @__PURE__ */ new Date(0);
            if (d11.setUTCSeconds(a12), d11.getTime() > c11.getTime() + b12) throw new cO({ reason: cG, message: `JWT cannot be used prior to not before date claim (nbf). Not before date: ${d11.toUTCString()}; Current date: ${c11.toUTCString()};` });
          })(i11, h10), ((a12, b12) => {
            if (void 0 === a12) return;
            if ("number" != typeof a12) throw new cO({ action: cM, reason: cI, message: `Invalid JWT issued at date claim (iat) ${JSON.stringify(a12)}. Expected number.` });
            let c11 = new Date(Date.now()), d11 = /* @__PURE__ */ new Date(0);
            if (d11.setUTCSeconds(a12), d11.getTime() > c11.getTime() + b12) throw new cO({ reason: cH, message: `JWT issued at date claim (iat) is in the future. Issued at date: ${d11.toUTCString()}; Current date: ${c11.toUTCString()};` });
          })(f11, h10);
        } catch (a11) {
          return { errors: [a11] };
        }
        return { data: l2 };
      }
      var c5 = Object.create, c6 = Object.defineProperty, c7 = Object.getOwnPropertyDescriptor, c8 = Object.getOwnPropertyNames, c9 = Object.getPrototypeOf, da = Object.prototype.hasOwnProperty, db = (a10) => {
        throw TypeError(a10);
      }, dc = (a10, b10, c10) => b10.has(a10) || db("Cannot " + c10), dd = (a10, b10, c10) => b10.has(a10) ? db("Cannot add the same private member more than once") : b10 instanceof WeakSet ? b10.add(a10) : b10.set(a10, c10), de = (a10, b10, c10) => (dc(a10, b10, "access private method"), c10);
      function df(a10) {
        return a10 ? `https://${a10.replace(/clerk\.accountsstage\./, "accountsstage.").replace(/clerk\.accounts\.|clerk\./, "accounts.")}` : "";
      }
      let dg = /* @__PURE__ */ new Set();
      function dh(a10) {
        return /^http(s)?:\/\//.test(a10 || "");
      }
      let di = [".vercel.app"];
      function dj(a10) {
        return di.some((b10) => a10?.endsWith(b10)) ?? false;
      }
      let dk = { strict_mfa: { afterMinutes: 10, level: "multi_factor" }, strict: { afterMinutes: 10, level: "second_factor" }, moderate: { afterMinutes: 60, level: "second_factor" }, lax: { afterMinutes: 1440, level: "second_factor" } }, dl = /* @__PURE__ */ new Set(["first_factor", "second_factor", "multi_factor"]), dm = /* @__PURE__ */ new Set(["strict_mfa", "strict", "moderate", "lax"]), dn = /* @__PURE__ */ new Set(["o", "org", "organization"]), dp = /* @__PURE__ */ new Set(["u", "user"]), dq = (a10) => "number" == typeof a10 && Number.isFinite(a10) && (-1 === a10 || a10 >= 0), dr = (a10, b10) => {
        let { org: c10, user: d10 } = ds(a10), [e10, f10] = b10.split(":"), g10 = void 0 !== f10, h10 = f10 || e10;
        if (g10 && !dn.has(e10) && !dp.has(e10)) throw Error(`Invalid scope: ${e10}`);
        if (g10) {
          if (dn.has(e10)) return c10.includes(h10);
          if (dp.has(e10)) return d10.includes(h10);
        }
        return [...c10, ...d10].includes(h10);
      }, ds = (a10) => {
        let b10 = [], c10 = [];
        if (!a10) return { org: b10, user: c10 };
        let d10 = a10.split(",");
        for (let a11 = 0; a11 < d10.length; a11++) {
          let e10 = d10[a11].trim(), f10 = e10.indexOf(":");
          if (-1 === f10) throw Error(`Invalid claim element (missing colon): ${e10}`);
          let g10 = e10.slice(0, f10), h10 = e10.slice(f10 + 1);
          "o" === g10 ? b10.push(h10) : "u" === g10 ? c10.push(h10) : ("ou" === g10 || "uo" === g10) && (b10.push(h10), c10.push(h10));
        }
        return { org: b10, user: c10 };
      };
      var dt = (h = { "../../node_modules/.pnpm/cookie@1.1.1/node_modules/cookie/dist/index.js"(a10) {
        let b10;
        Object.defineProperty(a10, "__esModule", { value: true }), a10.parseCookie = j10, a10.parse = j10, a10.stringifyCookie = function(a11, b11) {
          let e11 = b11?.encode || encodeURIComponent, f11 = [];
          for (let b12 of Object.keys(a11)) {
            let g11 = a11[b12];
            if (void 0 === g11) continue;
            if (!c10.test(b12)) throw TypeError(`cookie name is invalid: ${b12}`);
            let h11 = e11(g11);
            if (!d10.test(h11)) throw TypeError(`cookie val is invalid: ${g11}`);
            f11.push(`${b12}=${h11}`);
          }
          return f11.join("; ");
        }, a10.stringifySetCookie = k2, a10.serialize = k2, a10.parseSetCookie = function(a11, b11) {
          let c11 = b11?.decode || o2, d11 = a11.length, e11 = l2(a11, 0, d11), f11 = m2(a11, 0, e11), h11 = -1 === f11 ? { name: "", value: c11(n2(a11, 0, e11)) } : { name: n2(a11, 0, f11), value: c11(n2(a11, f11 + 1, e11)) }, i11 = e11 + 1;
          for (; i11 < d11; ) {
            let b12 = l2(a11, i11, d11), c12 = m2(a11, i11, b12), e12 = -1 === c12 ? n2(a11, i11, b12) : n2(a11, i11, c12), f12 = -1 === c12 ? void 0 : n2(a11, c12 + 1, b12);
            switch (e12.toLowerCase()) {
              case "httponly":
                h11.httpOnly = true;
                break;
              case "secure":
                h11.secure = true;
                break;
              case "partitioned":
                h11.partitioned = true;
                break;
              case "domain":
                h11.domain = f12;
                break;
              case "path":
                h11.path = f12;
                break;
              case "max-age":
                f12 && g10.test(f12) && (h11.maxAge = Number(f12));
                break;
              case "expires":
                if (!f12) break;
                let j11 = new Date(f12);
                Number.isFinite(j11.valueOf()) && (h11.expires = j11);
                break;
              case "priority":
                if (!f12) break;
                let k3 = f12.toLowerCase();
                ("low" === k3 || "medium" === k3 || "high" === k3) && (h11.priority = k3);
                break;
              case "samesite":
                if (!f12) break;
                let o3 = f12.toLowerCase();
                ("lax" === o3 || "strict" === o3 || "none" === o3) && (h11.sameSite = o3);
            }
            i11 = b12 + 1;
          }
          return h11;
        }, a10.stringifySetCookie = k2, a10.serialize = k2;
        var c10 = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/, d10 = /^[\u0021-\u003A\u003C-\u007E]*$/, e10 = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, f10 = /^[\u0020-\u003A\u003D-\u007E]*$/, g10 = /^-?\d+$/, h10 = Object.prototype.toString, i10 = ((b10 = function() {
        }).prototype = /* @__PURE__ */ Object.create(null), b10);
        function j10(a11, b11) {
          let c11 = new i10(), d11 = a11.length;
          if (d11 < 2) return c11;
          let e11 = b11?.decode || o2, f11 = 0;
          do {
            let b12 = m2(a11, f11, d11);
            if (-1 === b12) break;
            let g11 = l2(a11, f11, d11);
            if (b12 > g11) {
              f11 = a11.lastIndexOf(";", b12 - 1) + 1;
              continue;
            }
            let h11 = n2(a11, f11, b12);
            void 0 === c11[h11] && (c11[h11] = e11(n2(a11, b12 + 1, g11))), f11 = g11 + 1;
          } while (f11 < d11);
          return c11;
        }
        function k2(a11, b11, g11) {
          let i11 = "object" == typeof a11 ? a11 : { ...g11, name: a11, value: String(b11) }, j11 = ("object" == typeof b11 ? b11 : g11)?.encode || encodeURIComponent;
          if (!c10.test(i11.name)) throw TypeError(`argument name is invalid: ${i11.name}`);
          let k3 = i11.value ? j11(i11.value) : "";
          if (!d10.test(k3)) throw TypeError(`argument val is invalid: ${i11.value}`);
          let l3 = i11.name + "=" + k3;
          if (void 0 !== i11.maxAge) {
            if (!Number.isInteger(i11.maxAge)) throw TypeError(`option maxAge is invalid: ${i11.maxAge}`);
            l3 += "; Max-Age=" + i11.maxAge;
          }
          if (i11.domain) {
            if (!e10.test(i11.domain)) throw TypeError(`option domain is invalid: ${i11.domain}`);
            l3 += "; Domain=" + i11.domain;
          }
          if (i11.path) {
            if (!f10.test(i11.path)) throw TypeError(`option path is invalid: ${i11.path}`);
            l3 += "; Path=" + i11.path;
          }
          if (i11.expires) {
            var m3;
            if (m3 = i11.expires, "[object Date]" !== h10.call(m3) || !Number.isFinite(i11.expires.valueOf())) throw TypeError(`option expires is invalid: ${i11.expires}`);
            l3 += "; Expires=" + i11.expires.toUTCString();
          }
          if (i11.httpOnly && (l3 += "; HttpOnly"), i11.secure && (l3 += "; Secure"), i11.partitioned && (l3 += "; Partitioned"), i11.priority) switch ("string" == typeof i11.priority ? i11.priority.toLowerCase() : void 0) {
            case "low":
              l3 += "; Priority=Low";
              break;
            case "medium":
              l3 += "; Priority=Medium";
              break;
            case "high":
              l3 += "; Priority=High";
              break;
            default:
              throw TypeError(`option priority is invalid: ${i11.priority}`);
          }
          if (i11.sameSite) switch ("string" == typeof i11.sameSite ? i11.sameSite.toLowerCase() : i11.sameSite) {
            case true:
            case "strict":
              l3 += "; SameSite=Strict";
              break;
            case "lax":
              l3 += "; SameSite=Lax";
              break;
            case "none":
              l3 += "; SameSite=None";
              break;
            default:
              throw TypeError(`option sameSite is invalid: ${i11.sameSite}`);
          }
          return l3;
        }
        function l2(a11, b11, c11) {
          let d11 = a11.indexOf(";", b11);
          return -1 === d11 ? c11 : d11;
        }
        function m2(a11, b11, c11) {
          let d11 = a11.indexOf("=", b11);
          return d11 < c11 ? d11 : -1;
        }
        function n2(a11, b11, c11) {
          let d11 = b11, e11 = c11;
          do {
            let b12 = a11.charCodeAt(d11);
            if (32 !== b12 && 9 !== b12) break;
          } while (++d11 < e11);
          for (; e11 > d11; ) {
            let b12 = a11.charCodeAt(e11 - 1);
            if (32 !== b12 && 9 !== b12) break;
            e11--;
          }
          return a11.slice(d11, e11);
        }
        function o2(a11) {
          if (-1 === a11.indexOf("%")) return a11;
          try {
            return decodeURIComponent(a11);
          } catch (b11) {
            return a11;
          }
        }
      } }, function() {
        return i || (0, h[c8(h)[0]])((i = { exports: {} }).exports, i), i.exports;
      }), du = "https://api.clerk.com", dv = "@clerk/backend@3.11.0", dw = "2026-05-12", dx = { Session: "__session", Refresh: "__refresh", ClientUat: "__client_uat", Handshake: "__clerk_handshake", DevBrowser: "__clerk_db_jwt", RedirectCount: "__clerk_redirect_count", HandshakeNonce: "__clerk_handshake_nonce" }, dy = { ClerkSynced: "__clerk_synced", SuffixedCookies: "suffixed_cookies", ClerkRedirectUrl: "__clerk_redirect_url", DevBrowser: dx.DevBrowser, Handshake: dx.Handshake, HandshakeHelp: "__clerk_help", LegacyDevBrowser: "__dev_session", HandshakeReason: "__clerk_hs_reason", HandshakeNonce: dx.HandshakeNonce, HandshakeFormat: "format", Session: "__session" }, dz = { NeedsSync: "false", Completed: "true" }, dA = "accept", dB = "x-clerk-auth-message", dC = "authorization", dD = "x-clerk-auth-reason", dE = "x-clerk-auth-signature", dF = "x-clerk-auth-status", dG = "x-clerk-auth-token", dH = "cache-control", dI = "x-clerk-redirect-to", dJ = "x-clerk-request-data", dK = "x-clerk-clerk-url", dL = "cloudfront-forwarded-proto", dM = "content-type", dN = "content-security-policy", dO = "content-security-policy-report-only", dP = "x-clerk-debug", dQ = "x-forwarded-host", dR = "x-forwarded-proto", dS = "host", dT = "location", dU = "x-nonce", dV = "origin", dW = "referer", dX = "sec-fetch-dest", dY = "user-agent", dZ = "reporting-endpoints", d$ = "application/json", d_ = (a10, b10, c10, d10, e10) => {
        if ("" === a10) return d0(b10.toString(), c10?.toString());
        let f10 = new URL(a10), g10 = c10 ? new URL(c10, f10) : void 0, h10 = new URL(b10, f10), i10 = `${f10.hostname}:${f10.port}` != `${h10.hostname}:${h10.port}`;
        return g10 && (i10 && e10 && g10.searchParams.set(dy.ClerkSynced, dz.NeedsSync), h10.searchParams.set("redirect_url", g10.toString())), i10 && d10 && h10.searchParams.set(dy.DevBrowser, d10), h10.toString();
      }, d0 = (a10, b10) => {
        let c10;
        if (a10.startsWith("http")) c10 = new URL(a10);
        else {
          if (!b10 || !b10.startsWith("http")) throw Error("destination url or return back url should be an absolute path url!");
          let d10 = new URL(b10);
          c10 = new URL(a10, d10.origin);
        }
        return b10 && c10.searchParams.set("redirect_url", b10), c10.toString();
      };
      function d1(a10, b10) {
        return Object.keys(a10).reduce((a11, c10) => ({ ...a11, [c10]: b10[c10] || a11[c10] }), { ...a10 });
      }
      function d2(a10) {
        if (!a10 || "string" != typeof a10) throw Error("Missing Clerk Secret Key. Go to https://dashboard.clerk.com and get your key for your instance.");
      }
      var d3 = "session_token", d4 = "api_key", d5 = "m2m_token", d6 = "oauth_token", d7 = class {
        constructor(a10, b10, c10) {
          this.cookieSuffix = a10, this.clerkRequest = b10, this.originalFrontendApi = "";
          const d10 = function({ publishableKey: a11, hasDomain: b11 = false, hasProxyUrl: c11 = false, environment: d11 = "u" > typeof process && process.env ? process.env : {} }) {
            if (c11 || b11 || !cm(a11) || "production" !== d11.VERCEL_TARGET_ENV) return "";
            let e10 = d11.VERCEL_PROJECT_PRODUCTION_URL;
            return e10 && dj(function(a12) {
              if (a12.startsWith("http://") || a12.startsWith("https://")) try {
                return new URL(a12).hostname;
              } catch {
                return "";
              }
              return a12.split("/")[0] || "";
            }(e10)) ? "/__clerk" : "";
          }({ publishableKey: c10.publishableKey ?? "", hasProxyUrl: !!c10.proxyUrl, hasDomain: !!c10.domain });
          d10 && (c10 = { ...c10, proxyUrl: `${b10.clerkUrl.origin}${d10}` }), c10.acceptsToken === d5 || c10.acceptsToken === d4 ? this.initHeaderValues() : (this.initPublishableKeyValues(c10), this.initHeaderValues(), this.initCookieValues(), this.initHandshakeValues()), Object.assign(this, c10), this.clerkUrl = this.clerkRequest.clerkUrl, this.proxyUrl?.startsWith("/") && (this.proxyUrl = `${this.clerkUrl.origin}${this.proxyUrl}`);
        }
        get sessionToken() {
          return this.sessionTokenInCookie || this.tokenInHeader;
        }
        usesSuffixedCookies() {
          let a10 = this.getSuffixedCookie(dx.ClientUat), b10 = this.getCookie(dx.ClientUat), c10 = this.getSuffixedCookie(dx.Session) || "", d10 = this.getCookie(dx.Session) || "";
          if (d10 && !this.tokenHasIssuer(d10)) return false;
          if (d10 && !this.tokenBelongsToInstance(d10)) return true;
          if (!a10 && !c10) return false;
          let { data: e10 } = c3(d10), f10 = e10?.payload.iat || 0, { data: g10 } = c3(c10), h10 = g10?.payload.iat || 0;
          if ("0" !== a10 && "0" !== b10 && f10 > h10 || "0" === a10 && "0" !== b10) return false;
          if ("production" !== this.instanceType) {
            let c11 = this.sessionExpired(g10);
            if ("0" !== a10 && "0" === b10 && c11) return false;
          }
          return !!a10 || !c10;
        }
        isCrossOriginReferrer() {
          if (!this.referrer || !this.clerkUrl.origin) return false;
          try {
            return new URL(this.referrer).origin !== this.clerkUrl.origin;
          } catch {
            return false;
          }
        }
        isKnownClerkReferrer() {
          if (!this.referrer) return false;
          try {
            let a10 = new URL(this.referrer), b10 = a10.hostname;
            if (this.frontendApi) {
              let a11 = this.frontendApi.startsWith("http") ? new URL(this.frontendApi).hostname : this.frontendApi;
              if (b10 === a11) return true;
            }
            if (b9.some((a11) => b10.startsWith("accounts.") && b10.endsWith(a11)) || ca.some((a11) => b10.endsWith(a11) && !b10.endsWith(".clerk" + a11))) return true;
            let c10 = df(this.frontendApi);
            if (c10) {
              let b11 = new URL(c10).origin;
              if (a10.origin === b11) return true;
            }
            if (b10.startsWith("accounts.")) return true;
            return false;
          } catch {
            return false;
          }
        }
        initPublishableKeyValues(a10) {
          ck(a10.publishableKey, { fatal: true }), this.publishableKey = a10.publishableKey;
          let b10 = a10.proxyUrl;
          b10?.startsWith("/") && (b10 = `${this.clerkRequest.clerkUrl.origin}${b10}`);
          let c10 = ck(this.publishableKey, { fatal: true, domain: a10.domain, isSatellite: a10.isSatellite });
          this.originalFrontendApi = c10.frontendApi;
          let d10 = ck(this.publishableKey, { fatal: true, proxyUrl: b10, domain: a10.domain, isSatellite: a10.isSatellite });
          this.instanceType = d10.instanceType, this.frontendApi = d10.frontendApi;
        }
        initHeaderValues() {
          this.method = this.clerkRequest.method, this.tokenInHeader = this.parseAuthorizationHeader(this.getHeader(dC)), this.origin = this.getHeader(dV), this.host = this.getHeader(dS), this.forwardedHost = this.getHeader(dQ), this.forwardedProto = this.getHeader(dL) || this.getHeader(dR), this.referrer = this.getHeader(dW), this.userAgent = this.getHeader(dY), this.secFetchDest = this.getHeader(dX), this.accept = this.getHeader(dA);
        }
        initCookieValues() {
          this.sessionTokenInCookie = this.getSuffixedOrUnSuffixedCookie(dx.Session), this.refreshTokenInCookie = this.getSuffixedCookie(dx.Refresh), this.clientUat = Number.parseInt(this.getSuffixedOrUnSuffixedCookie(dx.ClientUat) || "") || 0;
        }
        initHandshakeValues() {
          this.devBrowserToken = this.getQueryParam(dy.DevBrowser) || this.getSuffixedOrUnSuffixedCookie(dx.DevBrowser), this.handshakeToken = this.getQueryParam(dy.Handshake) || this.getCookie(dx.Handshake), this.handshakeRedirectLoopCounter = Number(this.getCookie(dx.RedirectCount)) || 0, this.handshakeNonce = this.getQueryParam(dy.HandshakeNonce) || this.getCookie(dx.HandshakeNonce);
        }
        getQueryParam(a10) {
          return this.clerkRequest.clerkUrl.searchParams.get(a10);
        }
        getHeader(a10) {
          return this.clerkRequest.headers.get(a10) || void 0;
        }
        getCookie(a10) {
          return this.clerkRequest.cookies.get(a10) || void 0;
        }
        getSuffixedCookie(a10) {
          let b10;
          return this.getCookie((b10 = this.cookieSuffix, `${a10}_${b10}`)) || void 0;
        }
        getSuffixedOrUnSuffixedCookie(a10) {
          return this.usesSuffixedCookies() ? this.getSuffixedCookie(a10) : this.getCookie(a10);
        }
        parseAuthorizationHeader(a10) {
          if (!a10) return;
          let [b10, c10] = a10.split(" ", 2);
          return c10 ? "Bearer" === b10 ? c10 : void 0 : b10;
        }
        tokenHasIssuer(a10) {
          let { data: b10, errors: c10 } = c3(a10);
          return !c10 && !!b10.payload.iss;
        }
        tokenBelongsToInstance(a10) {
          if (!a10) return false;
          let { data: b10, errors: c10 } = c3(a10);
          if (c10) return false;
          let d10 = b10.payload.iss.replace(/https?:\/\//gi, "");
          return this.originalFrontendApi === d10;
        }
        sessionExpired(a10) {
          return !!a10 && a10?.payload.exp <= (Date.now() / 1e3 | 0);
        }
      }, d8 = async (a10, b10) => new d7(b10.publishableKey ? await co(b10.publishableKey, cV.crypto.subtle) : "", a10, b10), d9 = RegExp("(?<!:)/{1,}", "g");
      function ea(...a10) {
        let b10 = a10.filter((a11) => a11).join("/").replace(d9, "/");
        for (let a11 of b10.split("/")) if (function(a12) {
          let b11 = a12;
          for (let c10 = 0; c10 <= 10; c10++) {
            if (b11.split(/[/\\]/).some((a13) => "." === a13 || ".." === a13)) return true;
            if (10 === c10) throw Error(`joinPaths: too many layers of encoding in ${a12}`);
            try {
              let a13 = decodeURIComponent(b11);
              if (a13 === b11) break;
              b11 = a13;
            } catch {
              break;
            }
          }
          return false;
        }(a11)) throw Error(`joinPaths: "." and ".." path segments are not allowed (received "${b10}")`);
        return b10;
      }
      var eb = class {
        constructor(a10) {
          this.request = a10;
        }
        requireId(a10) {
          if (!a10) throw Error("A valid resource ID is required.");
        }
      }, ec = "/actor_tokens", ed = class extends eb {
        async create(a10) {
          return this.request({ method: "POST", path: ec, bodyParams: a10 });
        }
        async revoke(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(ec, a10, "revoke") });
        }
      }, ee = "/agents/tasks", ef = class extends eb {
        async create(a10) {
          return this.request({ method: "POST", path: ee, bodyParams: a10, options: { deepSnakecaseBodyParamKeys: true } });
        }
        async revoke(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(ee, a10, "revoke") });
        }
      }, eg = "/accountless_applications", eh = class extends eb {
        async createAccountlessApplication(a10) {
          let b10 = a10?.requestHeaders ? Object.fromEntries(a10.requestHeaders.entries()) : void 0;
          return this.request({ method: "POST", path: eg, headerParams: b10, queryParams: { source: a10?.source } });
        }
        async completeAccountlessApplicationOnboarding(a10) {
          let b10 = a10?.requestHeaders ? Object.fromEntries(a10.requestHeaders.entries()) : void 0;
          return this.request({ method: "POST", path: ea(eg, "complete"), headerParams: b10, queryParams: { source: a10?.source } });
        }
      }, ei = "/allowlist_identifiers", ej = class extends eb {
        async getAllowlistIdentifierList(a10 = {}) {
          return this.request({ method: "GET", path: ei, queryParams: { ...a10, paginated: true } });
        }
        async createAllowlistIdentifier(a10) {
          return this.request({ method: "POST", path: ei, bodyParams: a10 });
        }
        async deleteAllowlistIdentifier(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(ei, a10) });
        }
      }, ek = "/api_keys", el = class extends eb {
        async list(a10) {
          return this.request({ method: "GET", path: ek, queryParams: a10 });
        }
        async create(a10) {
          return this.request({ method: "POST", path: ek, bodyParams: a10 });
        }
        async get(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(ek, a10) });
        }
        async update(a10) {
          let { apiKeyId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "PATCH", path: ea(ek, b10), bodyParams: c10 });
        }
        async delete(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(ek, a10) });
        }
        async revoke(a10) {
          let { apiKeyId: b10, revocationReason: c10 = null } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(ek, b10, "revoke"), bodyParams: { revocationReason: c10 } });
        }
        async getSecret(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(ek, a10, "secret") });
        }
        async verify(a10) {
          return this.request({ method: "POST", path: ea(ek, "verify"), bodyParams: { secret: a10 } });
        }
      }, em = class extends eb {
        async changeDomain(a10) {
          return this.request({ method: "POST", path: ea("/beta_features", "change_domain"), bodyParams: a10 });
        }
      }, en = "/blocklist_identifiers", eo = class extends eb {
        async getBlocklistIdentifierList(a10 = {}) {
          return this.request({ method: "GET", path: en, queryParams: a10 });
        }
        async createBlocklistIdentifier(a10) {
          return this.request({ method: "POST", path: en, bodyParams: a10 });
        }
        async deleteBlocklistIdentifier(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(en, a10) });
        }
      }, ep = "/clients", eq = class extends eb {
        async getClientList(a10 = {}) {
          return this.request({ method: "GET", path: ep, queryParams: { ...a10, paginated: true } });
        }
        async getClient(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(ep, a10) });
        }
        verifyClient(a10) {
          return this.request({ method: "POST", path: ea(ep, "verify"), bodyParams: { token: a10 } });
        }
        async getHandshakePayload(a10) {
          return this.request({ method: "GET", path: ea(ep, "handshake_payload"), queryParams: a10 });
        }
      }, er = "/domains", es = class extends eb {
        async list() {
          return this.request({ method: "GET", path: er });
        }
        async add(a10) {
          return this.request({ method: "POST", path: er, bodyParams: a10 });
        }
        async update(a10) {
          let { domainId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "PATCH", path: ea(er, b10), bodyParams: c10 });
        }
        async delete(a10) {
          return this.deleteDomain(a10);
        }
        async deleteDomain(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(er, a10) });
        }
      }, et = "/email_addresses", eu = class extends eb {
        async getEmailAddress(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(et, a10) });
        }
        async createEmailAddress(a10) {
          return this.request({ method: "POST", path: et, bodyParams: a10 });
        }
        async updateEmailAddress(a10, b10 = {}) {
          return this.requireId(a10), this.request({ method: "PATCH", path: ea(et, a10), bodyParams: b10 });
        }
        async deleteEmailAddress(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(et, a10) });
        }
      }, ev = class extends eb {
        async create(a10) {
          return this.request({ method: "POST", path: "/email", bodyParams: a10, options: { deepSnakecaseBodyParamKeys: true } });
        }
      }, ew = "/enterprise_connections", ex = class extends eb {
        async createEnterpriseConnection(a10) {
          return this.request({ method: "POST", path: ew, bodyParams: a10, options: { deepSnakecaseBodyParamKeys: true } });
        }
        async updateEnterpriseConnection(a10, b10) {
          return this.requireId(a10), this.request({ method: "PATCH", path: ea(ew, a10), bodyParams: b10, options: { deepSnakecaseBodyParamKeys: true } });
        }
        async getEnterpriseConnectionList(a10 = {}) {
          return this.request({ method: "GET", path: ew, queryParams: a10 });
        }
        async getEnterpriseConnection(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(ew, a10) });
        }
        async deleteEnterpriseConnection(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(ew, a10) });
        }
      }, ey = class extends eb {
        async verify(a10) {
          return this.request({ method: "POST", path: ea("/oauth_applications/access_tokens", "verify"), bodyParams: { access_token: a10 } });
        }
      }, ez = "/instance", eA = class extends eb {
        async get() {
          return this.request({ method: "GET", path: ez });
        }
        async update(a10) {
          return this.request({ method: "PATCH", path: ez, bodyParams: a10 });
        }
        async updateRestrictions(a10) {
          return this.request({ method: "PATCH", path: ea(ez, "restrictions"), bodyParams: a10 });
        }
        async getOrganizationSettings() {
          return this.request({ method: "GET", path: ea(ez, "organization_settings") });
        }
        async updateOrganizationSettings(a10) {
          return this.request({ method: "PATCH", path: ea(ez, "organization_settings"), bodyParams: a10 });
        }
      }, eB = "/invitations", eC = class extends eb {
        async getInvitationList(a10 = {}) {
          return this.request({ method: "GET", path: eB, queryParams: { ...a10, paginated: true } });
        }
        async createInvitation(a10) {
          return this.request({ method: "POST", path: eB, bodyParams: a10 });
        }
        async createInvitationBulk(a10) {
          return this.request({ method: "POST", path: ea(eB, "bulk"), bodyParams: a10 });
        }
        async revokeInvitation(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(eB, a10, "revoke") });
        }
      }, eD = "/machines", eE = class extends eb {
        async get(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(eD, a10) });
        }
        async list(a10 = {}) {
          return this.request({ method: "GET", path: eD, queryParams: a10 });
        }
        async create(a10) {
          return this.request({ method: "POST", path: eD, bodyParams: a10 });
        }
        async update(a10) {
          let { machineId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "PATCH", path: ea(eD, b10), bodyParams: c10 });
        }
        async delete(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(eD, a10) });
        }
        async getSecretKey(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(eD, a10, "secret_key") });
        }
        async rotateSecretKey(a10) {
          let { machineId: b10, previousTokenTtl: c10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(eD, b10, "secret_key", "rotate"), bodyParams: { previousTokenTtl: c10 } });
        }
        async createScope(a10, b10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(eD, a10, "scopes"), bodyParams: { toMachineId: b10 } });
        }
        async deleteScope(a10, b10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(eD, a10, "scopes", b10) });
        }
      }, eF = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2) {
          this.id = a11, this.clientId = b10, this.type = c10, this.subject = d10, this.scopes = e10, this.revoked = f10, this.revocationReason = g10, this.expired = h10, this.expiration = i10, this.createdAt = j10, this.updatedAt = k2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.client_id, b10.type, b10.subject, b10.scopes, b10.revoked, b10.revocation_reason, b10.expired, b10.expiration, b10.created_at, b10.updated_at);
        }
        static fromJwtPayload(b10, c10 = 5e3) {
          return new a10(b10.jti ?? "", b10.client_id ?? "", "oauth_token", b10.sub, b10.scp ?? b10.scope?.split(" ") ?? [], false, null, 1e3 * b10.exp <= Date.now() - c10, 1e3 * b10.exp, 1e3 * b10.iat, 1e3 * b10.iat);
        }
      }, eG = /* @__PURE__ */ new Set(["iss", "sub", "exp", "nbf", "iat", "jti"]), eH = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2) {
          this.id = a11, this.subject = b10, this.scopes = c10, this.claims = d10, this.revoked = e10, this.revocationReason = f10, this.expired = g10, this.expiration = h10, this.createdAt = i10, this.updatedAt = j10, this.token = k2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.subject, b10.scopes, b10.claims, b10.revoked, b10.revocation_reason, b10.expired, b10.expiration, b10.created_at, b10.updated_at, b10.token);
        }
        static fromJwtPayload(b10, c10 = 5e3) {
          return new a10(b10.jti ?? "", b10.sub, b10.scopes?.split(" ") ?? b10.aud ?? [], function(a11) {
            let b11 = {};
            for (let c11 of Object.keys(a11)) eG.has(c11) || (b11[c11] = a11[c11]);
            return Object.keys(b11).length > 0 ? b11 : null;
          }(b10), false, null, 1e3 * b10.exp <= Date.now() - c10, 1e3 * b10.exp, 1e3 * b10.iat, 1e3 * b10.iat);
        }
      }, eI = {}, eJ = 0;
      function eK(a10, b10, c10 = true) {
        eI[a10] = b10, eJ = c10 ? Date.now() : -1;
      }
      function eL(a10) {
        let { kid: b10, pem: c10 } = a10, d10 = `local-${b10}`, e10 = eI[d10];
        if (e10) return e10;
        if (!c10) throw new cO({ action: cN, message: "Missing local JWK.", reason: "jwk-local-missing" });
        let f10 = { kid: d10, kty: "RSA", alg: "RS256", n: c10.replace(/\r\n|\n|\r/g, "").replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").replace("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA", "").replace("IDAQAB", "").replace(/\+/g, "-").replace(/\//g, "_"), e: "AQAB" };
        return eK(d10, f10, false), f10;
      }
      async function eM(a10) {
        let { secretKey: b10, apiUrl: c10 = du, apiVersion: d10 = "v1", kid: e10, skipJwksCache: f10 } = a10;
        if (f10 || function() {
          if (-1 === eJ) return false;
          let a11 = Date.now() - eJ >= 3e5;
          return a11 && (eI = {}), a11;
        }() || !eI[e10]) {
          if (!b10) throw new cO({ action: cL, message: "Failed to load JWKS from Clerk Backend or Frontend API.", reason: cJ });
          let { keys: a11 } = await cs(() => eN(c10, b10, d10));
          if (!a11 || !a11.length) throw new cO({ action: cL, message: "The JWKS endpoint did not contain any signing keys. Contact support@clerk.com.", reason: cJ });
          a11.forEach((a12) => eK(a12.kid, a12));
        }
        let g10 = eI[e10];
        if (!g10) {
          let a11 = Object.values(eI).map((a12) => a12.kid).sort().join(", ");
          throw new cO({ action: `Go to your Dashboard and validate your secret and public keys are correct. ${cL} if the issue persists.`, message: `Unable to find a signing key in JWKS that matches the kid='${e10}' of the provided session token. Please make sure that the __session cookie or the HTTP authorization header contain a Clerk-generated session JWT. The following kid is available: ${a11}`, reason: "jwk-kid-mismatch" });
        }
        return g10;
      }
      async function eN(a10, b10, c10) {
        if (!b10) throw new cO({ action: "Set the CLERK_SECRET_KEY environment variable.", message: "Missing Clerk Secret Key or API Key. Go to https://dashboard.clerk.com and get your key for your instance.", reason: cJ });
        let d10 = new URL(a10);
        d10.pathname = ea(d10.pathname, c10, "/jwks");
        let e10 = await cV.fetch(d10.href, { headers: { Authorization: `Bearer ${b10}`, "Clerk-API-Version": dw, "Content-Type": "application/json", "User-Agent": dv } });
        if (!e10.ok) {
          let a11 = await e10.json(), b11 = eO(a11?.errors, "clerk_key_invalid");
          if (b11) throw new cO({ action: cL, message: b11.message, reason: "secret-key-invalid" });
          throw new cO({ action: cL, message: `Error loading Clerk JWKS from ${d10.href} with code=${e10.status}`, reason: cJ });
        }
        return e10.json();
      }
      var eO = (a10, b10) => a10 ? a10.find((a11) => a11.code === b10) : null, eP = "mch_", eQ = "oat_", eR = ["mt_", eQ, "ak_"], eS = /^[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+$/;
      function eT(a10) {
        return eS.test(a10);
      }
      var eU = ["at+jwt", "application/at+jwt"];
      function eV(a10) {
        if (!eT(a10)) return false;
        try {
          let { data: b10, errors: c10 } = c3(a10);
          return !c10 && !!b10 && eU.includes(b10.header.typ);
        } catch {
          return false;
        }
      }
      function eW(a10) {
        if (!eT(a10)) return false;
        try {
          let { data: b10, errors: c10 } = c3(a10);
          return !c10 && !!b10 && "string" == typeof b10.payload.sub && b10.payload.sub.startsWith(eP);
        } catch {
          return false;
        }
      }
      function eX(a10) {
        return eR.some((b10) => a10.startsWith(b10));
      }
      function eY(a10) {
        return eX(a10) || eV(a10) || eW(a10);
      }
      function eZ(a10) {
        if (a10.startsWith("mt_") || eW(a10)) return d5;
        if (a10.startsWith(eQ) || eV(a10)) return d6;
        if (a10.startsWith("ak_")) return d4;
        throw Error("Unknown machine token type");
      }
      var e$ = (a10, b10) => !!a10 && ("any" === b10 || (Array.isArray(b10) ? b10 : [b10]).includes(a10)), e_ = /* @__PURE__ */ new Set([d4, d5, d6]);
      async function e0(a10, b10, c10, d10) {
        try {
          let e10;
          if (c10.jwtKey) e10 = eL({ kid: b10, pem: c10.jwtKey });
          else {
            if (!c10.secretKey) return { error: new cS({ action: cN, message: "Failed to resolve JWK during verification.", code: cR }) };
            e10 = await eM({ ...c10, kid: b10 });
          }
          let { data: f10, errors: g10 } = await c4(a10, { ...c10, key: e10, ...d10 ? { headerType: d10 } : {} });
          if (g10) return { error: new cS({ code: cR, message: g10[0].message }) };
          return { payload: f10 };
        } catch (a11) {
          return { error: new cS({ code: cR, message: a11.message }) };
        }
      }
      async function e1(a10, b10, c10) {
        let d10 = b10.header.cat;
        if (void 0 !== d10 && "cl_B7d4PD333AAA" !== d10) return { data: void 0, tokenType: d5, errors: [new cS({ code: cP, message: "Invalid M2M JWT category." })] };
        let e10 = await e0(a10, b10.header.kid, c10);
        return "error" in e10 ? { data: void 0, tokenType: d5, errors: [e10.error] } : { data: eH.fromJwtPayload(e10.payload, c10.clockSkewInMs), tokenType: d5, errors: void 0 };
      }
      async function e2(a10, b10, c10) {
        let d10 = await e0(a10, b10.header.kid, c10, eU);
        return "error" in d10 ? { data: void 0, tokenType: d6, errors: [d10.error] } : { data: eF.fromJwtPayload(d10.payload, c10.clockSkewInMs), tokenType: d6, errors: void 0 };
      }
      var e3 = "/m2m_tokens", e4 = class extends eb {
        constructor(a10, b10 = {}) {
          super(a10), dd(this, iL), dd(this, iK), ((a11, b11, c10, d10) => (dc(a11, b11, "write to private field"), d10 ? d10.call(a11, c10) : b11.set(a11, c10)))(this, iK, b10);
        }
        async list(a10) {
          let { machineSecretKey: b10, ...c10 } = a10, d10 = de(this, iL, iM).call(this, { method: "GET", path: e3, queryParams: c10 }, b10);
          return this.request(d10);
        }
        async createToken(a10) {
          let { claims: b10 = null, machineSecretKey: c10, minRemainingTtlSeconds: d10, secondsUntilExpiration: e10 = null, tokenFormat: f10 = "opaque" } = a10 || {}, g10 = de(this, iL, iM).call(this, { method: "POST", path: e3, bodyParams: { secondsUntilExpiration: e10, claims: b10, minRemainingTtlSeconds: d10, tokenFormat: f10 } }, c10);
          return this.request(g10);
        }
        async revokeToken(a10) {
          let { m2mTokenId: b10, revocationReason: c10 = null, machineSecretKey: d10 } = a10;
          this.requireId(b10);
          let e10 = de(this, iL, iM).call(this, { method: "POST", path: ea(e3, b10, "revoke"), bodyParams: { revocationReason: c10 } }, d10);
          return this.request(e10);
        }
        async verify(a10) {
          let { token: b10, machineSecretKey: c10 } = a10;
          if (eW(b10)) return de(this, iL, iN).call(this, b10);
          let d10 = de(this, iL, iM).call(this, { method: "POST", path: ea(e3, "verify"), bodyParams: { token: b10 } }, c10);
          return this.request(d10);
        }
      };
      iK = /* @__PURE__ */ new WeakMap(), iL = /* @__PURE__ */ new WeakSet(), iM = function(a10, b10) {
        return b10 ? { ...a10, headerParams: { ...a10.headerParams, Authorization: `Bearer ${b10}` } } : a10;
      }, iN = async function(a10) {
        let b10, c10, d10;
        try {
          let { data: c11, errors: d11 } = c3(a10);
          if (d11) throw d11[0];
          b10 = c11;
        } catch (a11) {
          throw new cS({ code: cP, message: a11.message });
        }
        let e10 = await e1(a10, b10, (dc(this, c10 = iK, "read from private field"), d10 ? d10.call(this) : c10.get(this)));
        if (e10.errors) throw e10.errors[0];
        return e10.data;
      };
      var e5 = class extends eb {
        async getJwks() {
          return this.request({ method: "GET", path: "/jwks" });
        }
      }, e6 = "/jwt_templates", e7 = class extends eb {
        async list(a10 = {}) {
          return this.request({ method: "GET", path: e6, queryParams: { ...a10, paginated: true } });
        }
        async get(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(e6, a10) });
        }
        async create(a10) {
          return this.request({ method: "POST", path: e6, bodyParams: a10 });
        }
        async update(a10) {
          let { templateId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "PATCH", path: ea(e6, b10), bodyParams: c10 });
        }
        async delete(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(e6, a10) });
        }
      }, e8 = "/organizations", e9 = class extends eb {
        async getOrganizationList(a10) {
          return this.request({ method: "GET", path: e8, queryParams: a10 });
        }
        async createOrganization(a10) {
          return this.request({ method: "POST", path: e8, bodyParams: a10 });
        }
        async getOrganization(a10) {
          let { includeMembersCount: b10 } = a10, c10 = "organizationId" in a10 ? a10.organizationId : a10.slug;
          return this.requireId(c10), this.request({ method: "GET", path: ea(e8, c10), queryParams: { includeMembersCount: b10 } });
        }
        async updateOrganization(a10, b10) {
          this.requireId(a10);
          let { publicMetadata: c10, privateMetadata: d10, ...e10 } = b10, f10 = void 0 !== c10 || void 0 !== d10, g10 = Object.keys(e10).length > 0;
          return (f10 && b8("updateOrganization(organizationId, { publicMetadata | privateMetadata })", "Use updateOrganizationMetadata for partial updates (merge) or replaceOrganizationMetadata for full replacement."), f10) ? (g10 && await this.request({ method: "PATCH", path: ea(e8, a10), bodyParams: e10 }), this.request({ method: "PUT", path: ea(e8, a10, "metadata"), bodyParams: { publicMetadata: c10, privateMetadata: d10 } })) : this.request({ method: "PATCH", path: ea(e8, a10), bodyParams: e10 });
        }
        async updateOrganizationLogo(a10, b10) {
          this.requireId(a10);
          let c10 = new cV.FormData();
          return c10.append("file", b10?.file), b10?.uploaderUserId && c10.append("uploader_user_id", b10?.uploaderUserId), this.request({ method: "PUT", path: ea(e8, a10, "logo"), formData: c10 });
        }
        async deleteOrganizationLogo(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(e8, a10, "logo") });
        }
        async updateOrganizationMetadata(a10, b10) {
          return this.requireId(a10), this.request({ method: "PATCH", path: ea(e8, a10, "metadata"), bodyParams: b10 });
        }
        async replaceOrganizationMetadata(a10, b10) {
          return this.requireId(a10), this.request({ method: "PUT", path: ea(e8, a10, "metadata"), bodyParams: b10 });
        }
        async deleteOrganization(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(e8, a10) });
        }
        async getOrganizationMembershipList(a10) {
          let { organizationId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "GET", path: ea(e8, b10, "memberships"), queryParams: c10 });
        }
        async getInstanceOrganizationMembershipList(a10) {
          return this.request({ method: "GET", path: "/organization_memberships", queryParams: a10 });
        }
        async createOrganizationMembership(a10) {
          let { organizationId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(e8, b10, "memberships"), bodyParams: c10 });
        }
        async updateOrganizationMembership(a10) {
          let { organizationId: b10, userId: c10, ...d10 } = a10;
          return this.requireId(b10), this.request({ method: "PATCH", path: ea(e8, b10, "memberships", c10), bodyParams: d10 });
        }
        async updateOrganizationMembershipMetadata(a10) {
          let { organizationId: b10, userId: c10, ...d10 } = a10;
          return this.request({ method: "PATCH", path: ea(e8, b10, "memberships", c10, "metadata"), bodyParams: d10 });
        }
        async deleteOrganizationMembership(a10) {
          let { organizationId: b10, userId: c10 } = a10;
          return this.requireId(b10), this.request({ method: "DELETE", path: ea(e8, b10, "memberships", c10) });
        }
        async getOrganizationInvitationList(a10) {
          let { organizationId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "GET", path: ea(e8, b10, "invitations"), queryParams: c10 });
        }
        async createOrganizationInvitation(a10) {
          let { organizationId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(e8, b10, "invitations"), bodyParams: c10 });
        }
        async createOrganizationInvitationBulk(a10, b10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(e8, a10, "invitations", "bulk"), bodyParams: b10 });
        }
        async getOrganizationInvitation(a10) {
          let { organizationId: b10, invitationId: c10 } = a10;
          return this.requireId(b10), this.requireId(c10), this.request({ method: "GET", path: ea(e8, b10, "invitations", c10) });
        }
        async revokeOrganizationInvitation(a10) {
          let { organizationId: b10, invitationId: c10, ...d10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(e8, b10, "invitations", c10, "revoke"), bodyParams: d10 });
        }
        async getOrganizationDomainList(a10) {
          let { organizationId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "GET", path: ea(e8, b10, "domains"), queryParams: c10 });
        }
        async createOrganizationDomain(a10) {
          let { organizationId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(e8, b10, "domains"), bodyParams: { ...c10, verified: c10.verified ?? true } });
        }
        async updateOrganizationDomain(a10) {
          let { organizationId: b10, domainId: c10, ...d10 } = a10;
          return this.requireId(b10), this.requireId(c10), this.request({ method: "PATCH", path: ea(e8, b10, "domains", c10), bodyParams: d10 });
        }
        async deleteOrganizationDomain(a10) {
          let { organizationId: b10, domainId: c10 } = a10;
          return this.requireId(b10), this.requireId(c10), this.request({ method: "DELETE", path: ea(e8, b10, "domains", c10) });
        }
      }, fa = "/organization_permissions", fb = class extends eb {
        async getOrganizationPermissionList(a10 = {}) {
          return this.request({ method: "GET", path: fa, queryParams: a10 });
        }
        async getOrganizationPermission(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(fa, a10) });
        }
        async createOrganizationPermission(a10) {
          return this.request({ method: "POST", path: fa, bodyParams: a10 });
        }
        async updateOrganizationPermission(a10) {
          let { permissionId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "PATCH", path: ea(fa, b10), bodyParams: c10 });
        }
        async deleteOrganizationPermission(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fa, a10) });
        }
      }, fc = "/organization_roles", fd = class extends eb {
        async getOrganizationRoleList(a10 = {}) {
          return this.request({ method: "GET", path: fc, queryParams: a10 });
        }
        async getOrganizationRole(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(fc, a10) });
        }
        async createOrganizationRole(a10) {
          return this.request({ method: "POST", path: fc, bodyParams: a10 });
        }
        async updateOrganizationRole(a10) {
          let { organizationRoleId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "PATCH", path: ea(fc, b10), bodyParams: c10 });
        }
        async deleteOrganizationRole(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fc, a10) });
        }
        async assignPermissionToOrganizationRole(a10) {
          let { organizationRoleId: b10, permissionId: c10 } = a10;
          return this.requireId(b10), this.requireId(c10), this.request({ method: "POST", path: ea(fc, b10, "permissions", c10) });
        }
        async removePermissionFromOrganizationRole(a10) {
          let { organizationRoleId: b10, permissionId: c10 } = a10;
          return this.requireId(b10), this.requireId(c10), this.request({ method: "DELETE", path: ea(fc, b10, "permissions", c10) });
        }
      }, fe = "/oauth_applications", ff = class extends eb {
        async list(a10 = {}) {
          return this.request({ method: "GET", path: fe, queryParams: a10 });
        }
        async get(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(fe, a10) });
        }
        async create(a10) {
          return this.request({ method: "POST", path: fe, bodyParams: a10 });
        }
        async update(a10) {
          let { oauthApplicationId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "PATCH", path: ea(fe, b10), bodyParams: c10 });
        }
        async delete(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fe, a10) });
        }
        async rotateSecret(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fe, a10, "rotate_secret") });
        }
        async revokeToken(a10) {
          let { oauthApplicationId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(fe, b10, "revoke_token"), bodyParams: c10 });
        }
      }, fg = "/phone_numbers", fh = class extends eb {
        async getPhoneNumber(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(fg, a10) });
        }
        async createPhoneNumber(a10) {
          return this.request({ method: "POST", path: fg, bodyParams: a10 });
        }
        async updatePhoneNumber(a10, b10 = {}) {
          return this.requireId(a10), this.request({ method: "PATCH", path: ea(fg, a10), bodyParams: b10 });
        }
        async deletePhoneNumber(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fg, a10) });
        }
      }, fi = class extends eb {
        async verify(a10) {
          return this.request({ method: "POST", path: "/proxy_checks", bodyParams: a10 });
        }
      }, fj = "/redirect_urls", fk = class extends eb {
        async getRedirectUrlList() {
          return this.request({ method: "GET", path: fj, queryParams: { paginated: true } });
        }
        async getRedirectUrl(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(fj, a10) });
        }
        async createRedirectUrl(a10) {
          return this.request({ method: "POST", path: fj, bodyParams: a10 });
        }
        async deleteRedirectUrl(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fj, a10) });
        }
      }, fl = "/role_sets", fm = class extends eb {
        async getRoleSetList(a10 = {}) {
          return this.request({ method: "GET", path: fl, queryParams: a10 });
        }
        async getRoleSet(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(fl, a10) });
        }
        async createRoleSet(a10) {
          return this.request({ method: "POST", path: fl, bodyParams: a10 });
        }
        async updateRoleSet(a10) {
          let { roleSetKeyOrId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "PATCH", path: ea(fl, b10), bodyParams: c10 });
        }
        async addRolesToRoleSet(a10) {
          let { roleSetKeyOrId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(fl, b10, "roles"), bodyParams: c10 });
        }
        async replaceRoleInRoleSet(a10) {
          let { roleSetKeyOrId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(fl, b10, "roles", "replace"), bodyParams: c10 });
        }
        async replaceRoleSet(a10) {
          let { roleSetKeyOrId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(fl, b10, "replace"), bodyParams: c10 });
        }
      }, fn = "/saml_connections", fo = class extends eb {
        async getSamlConnectionList(a10 = {}) {
          return this.request({ method: "GET", path: fn, queryParams: a10 });
        }
        async createSamlConnection(a10) {
          return this.request({ method: "POST", path: fn, bodyParams: a10, options: { deepSnakecaseBodyParamKeys: true } });
        }
        async getSamlConnection(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(fn, a10) });
        }
        async updateSamlConnection(a10, b10 = {}) {
          return this.requireId(a10), this.request({ method: "PATCH", path: ea(fn, a10), bodyParams: b10, options: { deepSnakecaseBodyParamKeys: true } });
        }
        async deleteSamlConnection(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fn, a10) });
        }
      }, fp = "/sessions", fq = class extends eb {
        async getSessionList(a10 = {}) {
          return this.request({ method: "GET", path: fp, queryParams: { ...a10, paginated: true } });
        }
        async getSession(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(fp, a10) });
        }
        async createSession(a10) {
          return this.request({ method: "POST", path: fp, bodyParams: a10 });
        }
        async revokeSession(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fp, a10, "revoke") });
        }
        async verifySession(a10, b10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fp, a10, "verify"), bodyParams: { token: b10 } });
        }
        async getToken(a10, b10, c10) {
          this.requireId(a10);
          let d10 = { method: "POST", path: b10 ? ea(fp, a10, "tokens", b10) : ea(fp, a10, "tokens") };
          return void 0 !== c10 && (d10.bodyParams = { expires_in_seconds: c10 }), this.request(d10);
        }
        async refreshSession(a10, b10) {
          this.requireId(a10);
          let { suffixed_cookies: c10, ...d10 } = b10;
          return this.request({ method: "POST", path: ea(fp, a10, "refresh"), bodyParams: d10, queryParams: { suffixed_cookies: c10 } });
        }
      }, fr = "/sign_in_tokens", fs = class extends eb {
        async createSignInToken(a10) {
          return this.request({ method: "POST", path: fr, bodyParams: a10 });
        }
        async revokeSignInToken(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fr, a10, "revoke") });
        }
      }, ft = "/sign_ups", fu = class extends eb {
        async get(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(ft, a10) });
        }
        async update(a10) {
          let { signUpAttemptId: b10, ...c10 } = a10;
          return this.request({ method: "PATCH", path: ea(ft, b10), bodyParams: c10 });
        }
      }, fv = class extends eb {
        async createTestingToken() {
          return this.request({ method: "POST", path: "/testing_tokens" });
        }
      }, fw = "/users", fx = class extends eb {
        async getUserList(a10 = {}) {
          let { limit: b10, offset: c10, orderBy: d10, ...e10 } = a10, [f10, g10] = await Promise.all([this.request({ method: "GET", path: fw, queryParams: a10 }), this.getCount(e10)]);
          return { data: f10, totalCount: g10 };
        }
        async getUser(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea(fw, a10) });
        }
        async createUser(a10) {
          return this.request({ method: "POST", path: fw, bodyParams: a10 });
        }
        async updateUser(a10, b10 = {}) {
          this.requireId(a10);
          let { publicMetadata: c10, privateMetadata: d10, unsafeMetadata: e10, ...f10 } = b10, g10 = void 0 !== c10 || void 0 !== d10 || void 0 !== e10, h10 = Object.keys(f10).length > 0;
          return (g10 && b8("updateUser(userId, { publicMetadata | privateMetadata | unsafeMetadata })", "Use updateUserMetadata for partial updates (merge) or replaceUserMetadata for full replacement."), g10) ? (h10 && await this.request({ method: "PATCH", path: ea(fw, a10), bodyParams: f10 }), this.request({ method: "PUT", path: ea(fw, a10, "metadata"), bodyParams: { publicMetadata: c10, privateMetadata: d10, unsafeMetadata: e10 } })) : this.request({ method: "PATCH", path: ea(fw, a10), bodyParams: f10 });
        }
        async replaceUserEmailAddress(a10, b10) {
          return this.requireId(a10), this.request({ method: "PUT", path: ea(fw, a10, "email_address"), bodyParams: b10 });
        }
        async replaceUserPhoneNumber(a10, b10) {
          return this.requireId(a10), this.request({ method: "PUT", path: ea(fw, a10, "phone_number"), bodyParams: b10 });
        }
        async updateUserProfileImage(a10, b10) {
          this.requireId(a10);
          let c10 = new cV.FormData();
          return c10.append("file", b10?.file), this.request({ method: "POST", path: ea(fw, a10, "profile_image"), formData: c10 });
        }
        async updateUserMetadata(a10, b10) {
          return this.requireId(a10), this.request({ method: "PATCH", path: ea(fw, a10, "metadata"), bodyParams: b10 });
        }
        async replaceUserMetadata(a10, b10) {
          return this.requireId(a10), this.request({ method: "PUT", path: ea(fw, a10, "metadata"), bodyParams: b10 });
        }
        async deleteUser(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fw, a10) });
        }
        async getCount(a10 = {}) {
          return this.request({ method: "GET", path: ea(fw, "count"), queryParams: a10 });
        }
        async getUserOauthAccessToken(a10, b10) {
          this.requireId(a10);
          let c10 = b10.startsWith("oauth_"), d10 = c10 ? b10 : `oauth_${b10}`;
          return c10 && b8("getUserOauthAccessToken(userId, provider)", "Remove the `oauth_` prefix from the `provider` argument."), this.request({ method: "GET", path: ea(fw, a10, "oauth_access_tokens", d10), queryParams: { paginated: true } });
        }
        async disableUserMFA(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fw, a10, "mfa") });
        }
        async getOrganizationMembershipList(a10) {
          let { userId: b10, limit: c10, offset: d10 } = a10;
          return this.requireId(b10), this.request({ method: "GET", path: ea(fw, b10, "organization_memberships"), queryParams: { limit: c10, offset: d10 } });
        }
        async getOrganizationInvitationList(a10) {
          let { userId: b10, ...c10 } = a10;
          return this.requireId(b10), this.request({ method: "GET", path: ea(fw, b10, "organization_invitations"), queryParams: c10 });
        }
        async verifyPassword(a10) {
          let { userId: b10, password: c10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(fw, b10, "verify_password"), bodyParams: { password: c10 } });
        }
        async verifyTOTP(a10) {
          let { userId: b10, code: c10 } = a10;
          return this.requireId(b10), this.request({ method: "POST", path: ea(fw, b10, "verify_totp"), bodyParams: { code: c10 } });
        }
        async banUser(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fw, a10, "ban") });
        }
        async unbanUser(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fw, a10, "unban") });
        }
        async lockUser(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fw, a10, "lock") });
        }
        async unlockUser(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fw, a10, "unlock") });
        }
        async deleteUserProfileImage(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fw, a10, "profile_image") });
        }
        async deleteUserPasskey(a10) {
          return this.requireId(a10.userId), this.requireId(a10.passkeyIdentificationId), this.request({ method: "DELETE", path: ea(fw, a10.userId, "passkeys", a10.passkeyIdentificationId) });
        }
        async deleteUserWeb3Wallet(a10) {
          return this.requireId(a10.userId), this.requireId(a10.web3WalletIdentificationId), this.request({ method: "DELETE", path: ea(fw, a10.userId, "web3_wallets", a10.web3WalletIdentificationId) });
        }
        async deleteUserExternalAccount(a10) {
          return this.requireId(a10.userId), this.requireId(a10.externalAccountId), this.request({ method: "DELETE", path: ea(fw, a10.userId, "external_accounts", a10.externalAccountId) });
        }
        async deleteUserBackupCodes(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fw, a10, "backup_code") });
        }
        async deleteUserTOTP(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fw, a10, "totp") });
        }
        async setPasswordCompromised(a10, b10 = { revokeAllSessions: false }) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fw, a10, "password", "set_compromised"), bodyParams: b10 });
        }
        async unsetPasswordCompromised(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fw, a10, "password", "unset_compromised") });
        }
      }, fy = "/waitlist_entries", fz = class extends eb {
        async list(a10 = {}) {
          return this.request({ method: "GET", path: fy, queryParams: a10 });
        }
        async create(a10) {
          return this.request({ method: "POST", path: fy, bodyParams: a10 });
        }
        async createBulk(a10) {
          return this.request({ method: "POST", path: ea(fy, "bulk"), bodyParams: a10 });
        }
        async invite(a10, b10 = {}) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fy, a10, "invite"), bodyParams: b10 });
        }
        async reject(a10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea(fy, a10, "reject") });
        }
        async delete(a10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fy, a10) });
        }
      }, fA = "/webhooks", fB = class extends eb {
        async createSvixApp() {
          return this.request({ method: "POST", path: ea(fA, "svix") });
        }
        async generateSvixAuthURL() {
          return this.request({ method: "POST", path: ea(fA, "svix_url") });
        }
        async deleteSvixApp() {
          return this.request({ method: "DELETE", path: ea(fA, "svix") });
        }
      }, fC = "/billing", fD = class extends eb {
        async getPlanList(a10) {
          return this.request({ method: "GET", path: ea(fC, "plans"), queryParams: a10 });
        }
        async cancelSubscriptionItem(a10, b10) {
          return this.requireId(a10), this.request({ method: "DELETE", path: ea(fC, "subscription_items", a10), queryParams: b10 });
        }
        async extendSubscriptionItemFreeTrial(a10, b10) {
          return this.requireId(a10), this.request({ method: "POST", path: ea("/billing", "subscription_items", a10, "extend_free_trial"), bodyParams: b10 });
        }
        async getOrganizationBillingSubscription(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea("/organizations", a10, "billing", "subscription") });
        }
        async getUserBillingSubscription(a10) {
          return this.requireId(a10), this.request({ method: "GET", path: ea("/users", a10, "billing", "subscription") });
        }
      }, fE = (a10) => "object" == typeof a10 && null !== a10, fF = (a10) => fE(a10) && !(a10 instanceof RegExp) && !(a10 instanceof Error) && !(a10 instanceof Date) && !(globalThis.Blob && a10 instanceof globalThis.Blob), fG = Symbol("mapObjectSkip"), fH = (a10, b10, c10, d10 = /* @__PURE__ */ new WeakMap()) => {
        if (c10 = { deep: false, target: {}, ...c10 }, d10.has(a10)) return d10.get(a10);
        d10.set(a10, c10.target);
        let { target: e10 } = c10;
        delete c10.target;
        let f10 = (a11) => a11.map((a12) => fF(a12) ? fH(a12, b10, c10, d10) : a12);
        if (Array.isArray(a10)) return f10(a10);
        for (let [g10, h10] of Object.entries(a10)) {
          let i10 = b10(g10, h10, a10);
          if (i10 === fG) continue;
          let [j10, k2, { shouldRecurse: l2 = true } = {}] = i10;
          "__proto__" !== j10 && (c10.deep && l2 && fF(k2) && (k2 = Array.isArray(k2) ? f10(k2) : fH(k2, b10, c10, d10)), e10[j10] = k2);
        }
        return e10;
      };
      function fI(a10, b10, c10) {
        if (!fE(a10)) throw TypeError(`Expected an object, got \`${a10}\` (${typeof a10})`);
        if (Array.isArray(a10)) throw TypeError("Expected an object, got an array");
        return fH(a10, b10, c10);
      }
      var fJ = /([\p{Ll}\d])(\p{Lu})/gu, fK = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu, fL = /(\d)\p{Ll}|(\p{L})\d/u, fM = /[^\p{L}\d]+/giu, fN = "$1\0$2";
      function fO(a10) {
        let b10 = a10.trim();
        b10 = (b10 = b10.replace(fJ, fN).replace(fK, fN)).replace(fM, "\0");
        let c10 = 0, d10 = b10.length;
        for (; "\0" === b10.charAt(c10); ) c10++;
        if (c10 === d10) return [];
        for (; "\0" === b10.charAt(d10 - 1); ) d10--;
        return b10.slice(c10, d10).split(/\0/g);
      }
      function fP(a10) {
        let b10 = fO(a10);
        for (let a11 = 0; a11 < b10.length; a11++) {
          let c10 = b10[a11], d10 = fL.exec(c10);
          if (d10) {
            let e10 = d10.index + (d10[1] ?? d10[2]).length;
            b10.splice(a11, 1, c10.slice(0, e10), c10.slice(e10));
          }
        }
        return b10;
      }
      function fQ(a10, b10) {
        return function(a11, b11) {
          var c10;
          let [d10, e10, f10] = function(a12, b12 = {}) {
            let c11 = b12.split ?? (b12.separateNumbers ? fP : fO), d11 = b12.prefixCharacters ?? "", e11 = b12.suffixCharacters ?? "", f11 = 0, g10 = a12.length;
            for (; f11 < a12.length; ) {
              let b13 = a12.charAt(f11);
              if (!d11.includes(b13)) break;
              f11++;
            }
            for (; g10 > f11; ) {
              let b13 = g10 - 1, c12 = a12.charAt(b13);
              if (!e11.includes(c12)) break;
              g10 = b13;
            }
            return [a12.slice(0, f11), c11(a12.slice(f11, g10)), a12.slice(g10)];
          }(a11, b11);
          return d10 + e10.map(false === (c10 = b11?.locale) ? (a12) => a12.toLowerCase() : (a12) => a12.toLocaleLowerCase(c10)).join(b11?.delimiter ?? " ") + f10;
        }(a10, { delimiter: "_", ...b10 });
      }
      var fR = {}.constructor;
      function fS(a10, b10) {
        return a10.some((a11) => "string" == typeof a11 ? a11 === b10 : a11.test(b10));
      }
      function fT(a10, b10, c10) {
        return c10.shouldRecurse ? { shouldRecurse: c10.shouldRecurse(a10, b10) } : void 0;
      }
      var fU = function(a10, b10) {
        if (Array.isArray(a10)) {
          if (a10.some((a11) => a11.constructor !== fR)) throw Error("obj must be array of plain objects");
          let c11 = (b10 = { deep: true, exclude: [], parsingOptions: {}, ...b10 }).snakeCase || ((a11) => fQ(a11, b10.parsingOptions));
          return a10.map((a11) => fI(a11, (a12, d10) => [fS(b10.exclude, a12) ? a12 : c11(a12), d10, fT(a12, d10, b10)], b10));
        }
        if (a10.constructor !== fR) throw Error("obj must be an plain object");
        let c10 = (b10 = { deep: true, exclude: [], parsingOptions: {}, ...b10 }).snakeCase || ((a11) => fQ(a11, b10.parsingOptions));
        return fI(a10, (a11, d10) => [fS(b10.exclude, a11) ? a11 : c10(a11), d10, fT(a11, d10, b10)], b10);
      }, fV = class a10 {
        constructor(a11, b10, c10, d10) {
          this.publishableKey = a11, this.secretKey = b10, this.claimUrl = c10, this.apiKeysUrl = d10;
        }
        static fromJSON(b10) {
          return new a10(b10.publishable_key, b10.secret_key, b10.claim_url, b10.api_keys_url);
        }
      }, fW = class a10 {
        constructor(a11, b10, c10, d10) {
          this.agentId = a11, this.taskId = b10, this.agentTaskId = c10, this.url = d10;
        }
        static fromJSON(b10) {
          let c10 = b10.agent_task_id ?? b10.task_id ?? "";
          return new a10(b10.agent_id, c10, c10, b10.url);
        }
      }, fX = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10) {
          this.id = a11, this.status = b10, this.userId = c10, this.actor = d10, this.token = e10, this.url = f10, this.createdAt = g10, this.updatedAt = h10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.status, b10.user_id, b10.actor, b10.token, b10.url, b10.created_at, b10.updated_at);
        }
      }, fY = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10) {
          this.id = a11, this.identifier = b10, this.identifierType = c10, this.createdAt = d10, this.updatedAt = e10, this.instanceId = f10, this.invitationId = g10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.identifier, b10.identifier_type, b10.created_at, b10.updated_at, b10.instance_id, b10.invitation_id);
        }
      }, fZ = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2, n2, o2, p2) {
          this.id = a11, this.type = b10, this.name = c10, this.subject = d10, this.scopes = e10, this.claims = f10, this.revoked = g10, this.revocationReason = h10, this.expired = i10, this.expiration = j10, this.createdBy = k2, this.description = l2, this.lastUsedAt = m2, this.createdAt = n2, this.updatedAt = o2, this.secret = p2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.type, b10.name, b10.subject, b10.scopes, b10.claims, b10.revoked, b10.revocation_reason, b10.expired, b10.expiration, b10.created_by, b10.description, b10.last_used_at, b10.created_at, b10.updated_at, b10.secret);
        }
      }, f$ = class a10 {
        constructor(a11, b10, c10, d10, e10, f10) {
          this.id = a11, this.identifier = b10, this.identifierType = c10, this.createdAt = d10, this.updatedAt = e10, this.instanceId = f10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.identifier, b10.identifier_type, b10.created_at, b10.updated_at, b10.instance_id);
        }
      }, f_ = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10) {
          this.id = a11, this.isMobile = b10, this.ipAddress = c10, this.city = d10, this.country = e10, this.browserVersion = f10, this.browserName = g10, this.deviceType = h10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.is_mobile, b10.ip_address, b10.city, b10.country, b10.browser_version, b10.browser_name, b10.device_type);
        }
      }, f0 = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2 = null) {
          this.id = a11, this.clientId = b10, this.userId = c10, this.status = d10, this.lastActiveAt = e10, this.expireAt = f10, this.abandonAt = g10, this.createdAt = h10, this.updatedAt = i10, this.lastActiveOrganizationId = j10, this.latestActivity = k2, this.actor = l2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.client_id, b10.user_id, b10.status, b10.last_active_at, b10.expire_at, b10.abandon_at, b10.created_at, b10.updated_at, b10.last_active_organization_id, b10.latest_activity && f_.fromJSON(b10.latest_activity), b10.actor);
        }
      }, f1 = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10) {
          this.id = a11, this.sessionIds = b10, this.sessions = c10, this.signInId = d10, this.signUpId = e10, this.lastActiveSessionId = f10, this.lastAuthenticationStrategy = g10, this.createdAt = h10, this.updatedAt = i10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.session_ids, b10.sessions.map((a11) => f0.fromJSON(a11)), b10.sign_in_id, b10.sign_up_id, b10.last_active_session_id, b10.last_authentication_strategy, b10.created_at, b10.updated_at);
        }
      }, f2 = class a10 {
        constructor(a11, b10, c10) {
          this.host = a11, this.value = b10, this.required = c10;
        }
        static fromJSON(b10) {
          return new a10(b10.host, b10.value, b10.required);
        }
      }, f3 = class a10 {
        constructor(a11) {
          this.cookies = a11;
        }
        static fromJSON(b10) {
          return new a10(b10.cookies);
        }
      }, f4 = class a10 {
        constructor(a11, b10, c10, d10) {
          this.object = a11, this.id = b10, this.slug = c10, this.deleted = d10;
        }
        static fromJSON(b10) {
          return new a10(b10.object, b10.id || null, b10.slug || null, b10.deleted);
        }
      }, f5 = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10) {
          this.id = a11, this.name = b10, this.isSatellite = c10, this.frontendApiUrl = d10, this.developmentOrigin = e10, this.cnameTargets = f10, this.accountsPortalUrl = g10, this.proxyUrl = h10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.is_satellite, b10.frontend_api_url, b10.development_origin, b10.cname_targets && b10.cname_targets.map((a11) => f2.fromJSON(a11)), b10.accounts_portal_url, b10.proxy_url);
        }
      }, f6 = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2) {
          this.id = a11, this.fromEmailName = b10, this.emailAddressId = c10, this.toEmailAddress = d10, this.subject = e10, this.body = f10, this.bodyPlain = g10, this.status = h10, this.slug = i10, this.data = j10, this.deliveredByClerk = k2, this.userId = l2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.from_email_name, b10.email_address_id, b10.to_email_address, b10.subject, b10.body, b10.body_plain, b10.status, b10.slug, b10.data, b10.delivered_by_clerk, b10.user_id);
        }
      }, f7 = class a10 {
        constructor(a11, b10) {
          this.id = a11, this.type = b10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.type);
        }
      }, f8 = class a10 {
        constructor(a11, b10, c10 = null, d10 = null, e10 = null, f10 = null, g10 = null) {
          this.status = a11, this.strategy = b10, this.externalVerificationRedirectURL = c10, this.attempts = d10, this.expireAt = e10, this.nonce = f10, this.message = g10;
        }
        static fromJSON(b10) {
          return new a10(b10.status, b10.strategy, b10.external_verification_redirect_url ? new URL(b10.external_verification_redirect_url) : null, b10.attempts, b10.expire_at, b10.nonce);
        }
      }, f9 = class a10 {
        constructor(a11, b10, c10, d10) {
          this.id = a11, this.emailAddress = b10, this.verification = c10, this.linkedTo = d10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.email_address, b10.verification && f8.fromJSON(b10.verification), b10.linked_to.map((a11) => f7.fromJSON(a11)));
        }
      }, ga = class a10 {
        constructor(a11, b10, c10, d10, e10) {
          this.id = a11, this.name = b10, this.description = c10, this.slug = d10, this.avatarUrl = e10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.description ?? null, b10.slug, b10.avatar_url ?? null);
        }
      }, gb = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2, n2, o2, p2) {
          this.id = a11, this.name = b10, this.slug = c10, this.description = d10, this.isDefault = e10, this.isRecurring = f10, this.hasBaseFee = g10, this.publiclyVisible = h10, this.fee = i10, this.annualFee = j10, this.annualMonthlyFee = k2, this.forPayerType = l2, this.features = m2, this.avatarUrl = n2, this.freeTrialDays = o2, this.freeTrialEnabled = p2;
        }
        static fromJSON(b10) {
          let c10 = (a11) => a11 ? { amount: a11.amount, amountFormatted: a11.amount_formatted, currency: a11.currency, currencySymbol: a11.currency_symbol } : null;
          return new a10(b10.id, b10.name, b10.slug, b10.description ?? null, b10.is_default, b10.is_recurring, b10.has_base_fee, b10.publicly_visible, c10(b10.fee), c10(b10.annual_fee), c10(b10.annual_monthly_fee), b10.for_payer_type, (b10.features ?? []).map((a11) => ga.fromJSON(a11)), b10.avatar_url, b10.free_trial_days, b10.free_trial_enabled);
        }
      }, gc = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2, n2, o2, p2, q2) {
          this.id = a11, this.status = b10, this.planPeriod = c10, this.periodStart = d10, this.nextPayment = e10, this.amount = f10, this.plan = g10, this.planId = h10, this.createdAt = i10, this.updatedAt = j10, this.periodEnd = k2, this.canceledAt = l2, this.pastDueAt = m2, this.endedAt = n2, this.payerId = o2, this.isFreeTrial = p2, this.lifetimePaid = q2;
        }
        static fromJSON(b10) {
          function c10(a11) {
            return a11 ? { amount: a11.amount, amountFormatted: a11.amount_formatted, currency: a11.currency, currencySymbol: a11.currency_symbol } : a11;
          }
          return new a10(b10.id, b10.status, b10.plan_period, b10.period_start, b10.next_payment, c10(b10.amount) ?? void 0, b10.plan ? gb.fromJSON(b10.plan) : null, b10.plan_id ?? null, b10.created_at, b10.updated_at, b10.period_end, b10.canceled_at, b10.past_due_at, b10.ended_at, b10.payer_id, b10.is_free_trial, c10(b10.lifetime_paid) ?? void 0);
        }
      }, gd = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10) {
          this.id = a11, this.status = b10, this.payerId = c10, this.createdAt = d10, this.updatedAt = e10, this.activeAt = f10, this.pastDueAt = g10, this.subscriptionItems = h10, this.nextPayment = i10, this.eligibleForFreeTrial = j10;
        }
        static fromJSON(b10) {
          let c10 = b10.next_payment ? { date: b10.next_payment.date, amount: { amount: b10.next_payment.amount.amount, amountFormatted: b10.next_payment.amount.amount_formatted, currency: b10.next_payment.amount.currency, currencySymbol: b10.next_payment.amount.currency_symbol } } : null;
          return new a10(b10.id, b10.status, b10.payer_id, b10.created_at, b10.updated_at, b10.active_at ?? null, b10.past_due_at ?? null, (b10.subscription_items ?? []).map((a11) => gc.fromJSON(a11)), c10, b10.eligible_for_free_trial ?? false);
        }
      }, ge = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2) {
          this.id = a11, this.active = b10, this.allowIdpInitiated = c10, this.allowSubdomains = d10, this.disableAdditionalIdentifications = e10, this.domain = f10, this.logoPublicUrl = g10, this.name = h10, this.protocol = i10, this.provider = j10, this.syncUserAttributes = k2, this.createdAt = l2, this.updatedAt = m2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.active, b10.allow_idp_initiated, b10.allow_subdomains, b10.disable_additional_identifications, b10.domain, b10.logo_public_url, b10.name, b10.protocol, b10.provider, b10.sync_user_attributes, b10.created_at, b10.updated_at);
        }
      }, gf = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2) {
          this.id = a11, this.active = b10, this.emailAddress = c10, this.enterpriseConnection = d10, this.firstName = e10, this.lastName = f10, this.protocol = g10, this.provider = h10, this.providerUserId = i10, this.publicMetadata = j10, this.verification = k2, this.lastAuthenticatedAt = l2, this.enterpriseConnectionId = m2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.active, b10.email_address, b10.enterprise_connection && ge.fromJSON(b10.enterprise_connection), b10.first_name, b10.last_name, b10.protocol, b10.provider, b10.provider_user_id, b10.public_metadata, b10.verification && f8.fromJSON(b10.verification), b10.last_authenticated_at, b10.enterprise_connection_id);
        }
      }, gg = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2, n2, o2) {
          this.id = a11, this.name = b10, this.idpEntityId = c10, this.idpSsoUrl = d10, this.idpCertificate = e10, this.idpCertificateIssuedAt = f10, this.idpCertificateExpiresAt = g10, this.idpMetadataUrl = h10, this.idpMetadata = i10, this.acsUrl = j10, this.spEntityId = k2, this.spMetadataUrl = l2, this.syncUserAttributes = m2, this.allowSubdomains = n2, this.allowIdpInitiated = o2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.idp_entity_id, b10.idp_sso_url, b10.idp_certificate, b10.idp_certificate_issued_at, b10.idp_certificate_expires_at, b10.idp_metadata_url, b10.idp_metadata, b10.acs_url, b10.sp_entity_id, b10.sp_metadata_url, b10.sync_user_attributes, b10.allow_subdomains, b10.allow_idp_initiated);
        }
      }, gh = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10) {
          this.id = a11, this.name = b10, this.clientId = c10, this.discoveryUrl = d10, this.logoPublicUrl = e10, this.createdAt = f10, this.updatedAt = g10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.client_id, b10.discovery_url, b10.logo_public_url, b10.created_at, b10.updated_at);
        }
      }, gi = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2) {
          this.id = a11, this.name = b10, this.domains = c10, this.organizationId = d10, this.active = e10, this.syncUserAttributes = f10, this.allowSubdomains = g10, this.disableAdditionalIdentifications = h10, this.createdAt = i10, this.updatedAt = j10, this.samlConnection = k2, this.oauthConfig = l2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.domains, b10.organization_id, b10.active, b10.sync_user_attributes, b10.allow_subdomains, b10.disable_additional_identifications, b10.created_at, b10.updated_at, null != b10.saml_connection ? gg.fromJSON(b10.saml_connection) : null, null != b10.oauth_config ? gh.fromJSON(b10.oauth_config) : null);
        }
      }, gj = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2 = {}, n2, o2, p2) {
          this.id = a11, this.provider = b10, this.providerUserId = c10, this.identificationId = d10, this.externalId = e10, this.approvedScopes = f10, this.emailAddress = g10, this.firstName = h10, this.lastName = i10, this.imageUrl = j10, this.username = k2, this.phoneNumber = l2, this.publicMetadata = m2, this.label = n2, this.verification = o2, this.externalAccountId = p2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.provider, b10.provider_user_id, b10.identification_id, b10.provider_user_id, b10.approved_scopes, b10.email_address, b10.first_name, b10.last_name, b10.image_url || "", b10.username, b10.phone_number, b10.public_metadata, b10.label, b10.verification && f8.fromJSON(b10.verification), b10.external_account_id);
        }
      }, gk = class a10 {
        constructor(a11, b10, c10) {
          this.id = a11, this.environmentType = b10, this.allowedOrigins = c10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.environment_type, b10.allowed_origins);
        }
      }, gl = class a10 {
        constructor(a11, b10, c10, d10, e10) {
          this.allowlist = a11, this.blocklist = b10, this.blockEmailSubaddresses = c10, this.blockDisposableEmailDomains = d10, this.ignoreDotsForGmailAddresses = e10;
        }
        static fromJSON(b10) {
          return new a10(b10.allowlist, b10.blocklist, b10.block_email_subaddresses, b10.block_disposable_email_domains, b10.ignore_dots_for_gmail_addresses);
        }
      }, gm = class a10 {
        constructor(a11, b10, c10, d10, e10) {
          this.id = a11, this.restrictedToAllowlist = b10, this.fromEmailAddress = c10, this.progressiveSignUp = d10, this.enhancedEmailDeliverability = e10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.restricted_to_allowlist, b10.from_email_address, b10.progressive_sign_up, b10.enhanced_email_deliverability);
        }
      }, gn = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10) {
          this.id = a11, this.emailAddress = b10, this.publicMetadata = c10, this.createdAt = d10, this.updatedAt = e10, this.status = f10, this.url = g10, this.revoked = h10, this._raw = null;
        }
        get raw() {
          return this._raw;
        }
        static fromJSON(b10) {
          let c10 = new a10(b10.id, b10.email_address, b10.public_metadata, b10.created_at, b10.updated_at, b10.status, b10.url, b10.revoked);
          return c10._raw = b10, c10;
        }
      }, go = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10) {
          this.id = a11, this.name = b10, this.claims = c10, this.lifetime = d10, this.allowedClockSkew = e10, this.customSigningKey = f10, this.signingAlgorithm = g10, this.createdAt = h10, this.updatedAt = i10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.claims, b10.lifetime, b10.allowed_clock_skew, b10.custom_signing_key, b10.signing_algorithm, b10.created_at, b10.updated_at);
        }
      }, gp = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10) {
          this.id = a11, this.name = b10, this.instanceId = c10, this.createdAt = d10, this.updatedAt = e10, this.scopedMachines = f10, this.defaultTokenTtl = g10, this.secretKey = h10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.instance_id, b10.created_at, b10.updated_at, b10.scoped_machines.map((b11) => new a10(b11.id, b11.name, b11.instance_id, b11.created_at, b11.updated_at, [], b11.default_token_ttl)), b10.default_token_ttl, b10.secret_key);
        }
      }, gq = class a10 {
        constructor(a11, b10, c10, d10) {
          this.fromMachineId = a11, this.toMachineId = b10, this.createdAt = c10, this.deleted = d10;
        }
        static fromJSON(b10) {
          return new a10(b10.from_machine_id, b10.to_machine_id, b10.created_at, b10.deleted);
        }
      }, gr = class a10 {
        constructor(a11) {
          this.secret = a11;
        }
        static fromJSON(b10) {
          return new a10(b10.secret);
        }
      }, gs = class a10 {
        constructor(a11, b10, c10, d10 = {}, e10, f10, g10, h10, i10) {
          this.externalAccountId = a11, this.provider = b10, this.token = c10, this.publicMetadata = d10, this.label = e10, this.scopes = f10, this.tokenSecret = g10, this.expiresAt = h10, this.idToken = i10;
        }
        static fromJSON(b10) {
          return new a10(b10.external_account_id, b10.provider, b10.token, b10.public_metadata, b10.label || "", b10.scopes, b10.token_secret, b10.expires_at, b10.id_token);
        }
      }, gt = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2, n2, o2, p2, q2, r2, s2, t2) {
          this.id = a11, this.instanceId = b10, this.name = c10, this.clientId = d10, this.clientUri = e10, this.clientImageUrl = f10, this.dynamicallyRegistered = g10, this.consentScreenEnabled = h10, this.pkceRequired = i10, this.isPublic = j10, this.scopes = k2, this.redirectUris = l2, this.authorizeUrl = m2, this.tokenFetchUrl = n2, this.userInfoUrl = o2, this.discoveryUrl = p2, this.tokenIntrospectionUrl = q2, this.createdAt = r2, this.updatedAt = s2, this.clientSecret = t2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.instance_id, b10.name, b10.client_id, b10.client_uri, b10.client_image_url, b10.dynamically_registered, b10.consent_screen_enabled, b10.pkce_required, b10.public, b10.scopes, b10.redirect_uris, b10.authorize_url, b10.token_fetch_url, b10.user_info_url, b10.discovery_url, b10.token_introspection_url, b10.created_at, b10.updated_at, b10.client_secret);
        }
      }, gu = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10 = {}, i10 = {}, j10, k2, l2, m2) {
          this.id = a11, this.name = b10, this.slug = c10, this.imageUrl = d10, this.hasImage = e10, this.createdAt = f10, this.updatedAt = g10, this.publicMetadata = h10, this.privateMetadata = i10, this.maxAllowedMemberships = j10, this.adminDeleteEnabled = k2, this.membersCount = l2, this.createdBy = m2, this._raw = null;
        }
        get raw() {
          return this._raw;
        }
        static fromJSON(b10) {
          let c10 = new a10(b10.id, b10.name, b10.slug, b10.image_url || "", b10.has_image, b10.created_at, b10.updated_at, b10.public_metadata, b10.private_metadata, b10.max_allowed_memberships, b10.admin_delete_enabled, b10.members_count, b10.created_by);
          return c10._raw = b10, c10;
        }
      }, gv = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2 = {}, l2 = {}, m2) {
          this.id = a11, this.emailAddress = b10, this.role = c10, this.roleName = d10, this.organizationId = e10, this.createdAt = f10, this.updatedAt = g10, this.expiresAt = h10, this.url = i10, this.status = j10, this.publicMetadata = k2, this.privateMetadata = l2, this.publicOrganizationData = m2, this._raw = null;
        }
        get raw() {
          return this._raw;
        }
        static fromJSON(b10) {
          let c10 = new a10(b10.id, b10.email_address, b10.role, b10.role_name, b10.organization_id, b10.created_at, b10.updated_at, b10.expires_at, b10.url, b10.status, b10.public_metadata, b10.private_metadata, b10.public_organization_data);
          return c10._raw = b10, c10;
        }
      }, gw = class a10 {
        constructor(a11, b10, c10, d10 = {}, e10 = {}, f10, g10, h10, i10) {
          this.id = a11, this.role = b10, this.permissions = c10, this.publicMetadata = d10, this.privateMetadata = e10, this.createdAt = f10, this.updatedAt = g10, this.organization = h10, this.publicUserData = i10, this._raw = null;
        }
        get raw() {
          return this._raw;
        }
        static fromJSON(b10) {
          let c10 = new a10(b10.id, b10.role, b10.permissions, b10.public_metadata, b10.private_metadata, b10.created_at, b10.updated_at, gu.fromJSON(b10.organization), gx.fromJSON(b10.public_user_data));
          return c10._raw = b10, c10;
        }
      }, gx = class a10 {
        constructor(a11, b10, c10, d10, e10, f10) {
          this.identifier = a11, this.firstName = b10, this.lastName = c10, this.imageUrl = d10, this.hasImage = e10, this.userId = f10;
        }
        static fromJSON(b10) {
          return new a10(b10.identifier, b10.first_name, b10.last_name, b10.image_url, b10.has_image, b10.user_id);
        }
      }, gy = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10) {
          this.enabled = a11, this.maxAllowedMemberships = b10, this.maxAllowedRoles = c10, this.maxAllowedPermissions = d10, this.creatorRole = e10, this.adminDeleteEnabled = f10, this.domainsEnabled = g10, this.slugDisabled = h10, this.domainsEnrollmentModes = i10, this.domainsDefaultRole = j10;
        }
        static fromJSON(b10) {
          return new a10(b10.enabled, b10.max_allowed_memberships, b10.max_allowed_roles, b10.max_allowed_permissions, b10.creator_role, b10.admin_delete_enabled, b10.domains_enabled, b10.slug_disabled, b10.domains_enrollment_modes, b10.domains_default_role);
        }
      }, gz = class a10 {
        constructor(a11, b10, c10, d10, e10, f10) {
          this.id = a11, this.name = b10, this.key = c10, this.description = d10, this.createdAt = e10, this.updatedAt = f10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.key, b10.description, b10.created_at, b10.updated_at);
        }
      }, gA = class a10 {
        constructor(a11, b10, c10, d10, e10, f10) {
          this.id = a11, this.phoneNumber = b10, this.reservedForSecondFactor = c10, this.defaultSecondFactor = d10, this.verification = e10, this.linkedTo = f10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.phone_number, b10.reserved_for_second_factor, b10.default_second_factor, b10.verification && f8.fromJSON(b10.verification), b10.linked_to.map((a11) => f7.fromJSON(a11)));
        }
      }, gB = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10) {
          this.id = a11, this.domainId = b10, this.lastRunAt = c10, this.proxyUrl = d10, this.successful = e10, this.createdAt = f10, this.updatedAt = g10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.domain_id, b10.last_run_at, b10.proxy_url, b10.successful, b10.created_at, b10.updated_at);
        }
      }, gC = class a10 {
        constructor(a11, b10, c10, d10) {
          this.id = a11, this.url = b10, this.createdAt = c10, this.updatedAt = d10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.url, b10.created_at, b10.updated_at);
        }
      }, gD = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10) {
          this.id = a11, this.name = b10, this.key = c10, this.description = d10, this.permissions = e10, this.isCreatorEligible = f10, this.createdAt = g10, this.updatedAt = h10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.key, b10.description, (b10.permissions ?? []).map((a11) => gz.fromJSON(a11)), b10.is_creator_eligible, b10.created_at, b10.updated_at);
        }
      }, gE = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10) {
          this.id = a11, this.name = b10, this.key = c10, this.description = d10, this.createdAt = e10, this.updatedAt = f10, this.membersCount = g10, this.hasMembers = h10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.key, b10.description, b10.created_at, b10.updated_at, b10.members_count, b10.has_members);
        }
      }, gF = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2) {
          this.id = a11, this.organizationId = b10, this.instanceId = c10, this.sourceRoleSetId = d10, this.destRoleSetId = e10, this.triggerType = f10, this.status = g10, this.migratedMembers = h10, this.mappings = i10, this.createdAt = j10, this.updatedAt = k2, this.startedAt = l2, this.completedAt = m2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.organization_id, b10.instance_id, b10.source_role_set_id, b10.dest_role_set_id, b10.trigger_type, b10.status, b10.migrated_members, b10.mappings, b10.created_at, b10.updated_at, b10.started_at, b10.completed_at);
        }
      }, gG = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2) {
          this.id = a11, this.name = b10, this.key = c10, this.description = d10, this.roles = e10, this.defaultRole = f10, this.creatorRole = g10, this.type = h10, this.roleSetMigration = i10, this.createdAt = j10, this.updatedAt = k2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.key, b10.description, (b10.roles ?? []).map((a11) => gE.fromJSON(a11)), b10.default_role ? gE.fromJSON(b10.default_role) : null, b10.creator_role ? gE.fromJSON(b10.creator_role) : null, b10.type, b10.role_set_migration ? gF.fromJSON(b10.role_set_migration) : null, b10.created_at, b10.updated_at);
        }
      }, gH = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2, n2, o2, p2, q2, r2, s2, t2, u2, v2, w2) {
          this.id = a11, this.name = b10, this.domain = c10, this.organizationId = d10, this.idpEntityId = e10, this.idpSsoUrl = f10, this.idpCertificate = g10, this.idpCertificateIssuedAt = h10, this.idpCertificateExpiresAt = i10, this.idpMetadataUrl = j10, this.idpMetadata = k2, this.acsUrl = l2, this.spEntityId = m2, this.spMetadataUrl = n2, this.active = o2, this.provider = p2, this.userCount = q2, this.syncUserAttributes = r2, this.allowSubdomains = s2, this.allowIdpInitiated = t2, this.createdAt = u2, this.updatedAt = v2, this.attributeMapping = w2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.name, b10.domain, b10.organization_id, b10.idp_entity_id, b10.idp_sso_url, b10.idp_certificate, b10.idp_certificate_issued_at, b10.idp_certificate_expires_at, b10.idp_metadata_url, b10.idp_metadata, b10.acs_url, b10.sp_entity_id, b10.sp_metadata_url, b10.active, b10.provider, b10.user_count, b10.sync_user_attributes, b10.allow_subdomains, b10.allow_idp_initiated, b10.created_at, b10.updated_at, b10.attribute_mapping && gI.fromJSON(b10.attribute_mapping));
        }
      }, gI = class a10 {
        constructor(a11, b10, c10, d10) {
          this.userId = a11, this.emailAddress = b10, this.firstName = c10, this.lastName = d10;
        }
        static fromJSON(b10) {
          return new a10(b10.user_id, b10.email_address, b10.first_name, b10.last_name);
        }
      }, gJ = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10) {
          this.id = a11, this.userId = b10, this.token = c10, this.status = d10, this.url = e10, this.createdAt = f10, this.updatedAt = g10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.user_id, b10.token, b10.status, b10.url, b10.created_at, b10.updated_at);
        }
      }, gK = class a10 {
        constructor(a11, b10) {
          this.nextAction = a11, this.supportedStrategies = b10;
        }
        static fromJSON(b10) {
          return new a10(b10.next_action, b10.supported_strategies);
        }
      }, gL = class a10 {
        constructor(a11, b10, c10, d10) {
          this.emailAddress = a11, this.phoneNumber = b10, this.web3Wallet = c10, this.externalAccount = d10;
        }
        static fromJSON(b10) {
          return new a10(b10.email_address && gK.fromJSON(b10.email_address), b10.phone_number && gK.fromJSON(b10.phone_number), b10.web3_wallet && gK.fromJSON(b10.web3_wallet), b10.external_account);
        }
      }, gM = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2, n2, o2, p2, q2, r2, s2, t2, u2, v2) {
          this.id = a11, this.status = b10, this.requiredFields = c10, this.optionalFields = d10, this.missingFields = e10, this.unverifiedFields = f10, this.verifications = g10, this.username = h10, this.emailAddress = i10, this.phoneNumber = j10, this.web3Wallet = k2, this.passwordEnabled = l2, this.firstName = m2, this.lastName = n2, this.customAction = o2, this.externalId = p2, this.createdSessionId = q2, this.createdUserId = r2, this.abandonAt = s2, this.legalAcceptedAt = t2, this.publicMetadata = u2, this.unsafeMetadata = v2;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.status, b10.required_fields, b10.optional_fields, b10.missing_fields, b10.unverified_fields, b10.verifications ? gL.fromJSON(b10.verifications) : null, b10.username, b10.email_address, b10.phone_number, b10.web3_wallet, b10.password_enabled, b10.first_name, b10.last_name, b10.custom_action, b10.external_id, b10.created_session_id, b10.created_user_id, b10.abandon_at, b10.legal_accepted_at, b10.public_metadata, b10.unsafe_metadata);
        }
      }, gN = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10) {
          this.id = a11, this.fromPhoneNumber = b10, this.toPhoneNumber = c10, this.message = d10, this.status = e10, this.phoneNumberId = f10, this.data = g10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.from_phone_number, b10.to_phone_number, b10.message, b10.status, b10.phone_number_id, b10.data);
        }
      }, gO = class a10 {
        constructor(a11) {
          this.jwt = a11;
        }
        static fromJSON(b10) {
          return new a10(b10.jwt);
        }
      }, gP = class a10 {
        constructor(a11, b10, c10) {
          this.id = a11, this.web3Wallet = b10, this.verification = c10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.web3_wallet, b10.verification && f8.fromJSON(b10.verification));
        }
      }, gQ = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10, h10, i10, j10, k2, l2, m2, n2, o2, p2, q2, r2, s2, t2 = {}, u2 = {}, v2 = {}, w2 = [], x2 = [], y2 = [], z2 = [], A2 = [], B2, C2, D2 = null, E2, F2, G2) {
          this.id = a11, this.passwordEnabled = b10, this.totpEnabled = c10, this.backupCodeEnabled = d10, this.twoFactorEnabled = e10, this.banned = f10, this.locked = g10, this.createdAt = h10, this.updatedAt = i10, this.imageUrl = j10, this.hasImage = k2, this.primaryEmailAddressId = l2, this.primaryPhoneNumberId = m2, this.primaryWeb3WalletId = n2, this.lastSignInAt = o2, this.externalId = p2, this.username = q2, this.firstName = r2, this.lastName = s2, this.publicMetadata = t2, this.privateMetadata = u2, this.unsafeMetadata = v2, this.emailAddresses = w2, this.phoneNumbers = x2, this.web3Wallets = y2, this.externalAccounts = z2, this.enterpriseAccounts = A2, this.lastActiveAt = B2, this.createOrganizationEnabled = C2, this.createOrganizationsLimit = D2, this.deleteSelfEnabled = E2, this.legalAcceptedAt = F2, this.locale = G2, this._raw = null;
        }
        get raw() {
          return this._raw;
        }
        static fromJSON(b10) {
          let c10 = new a10(b10.id, b10.password_enabled, b10.totp_enabled, b10.backup_code_enabled, b10.two_factor_enabled, b10.banned, b10.locked, b10.created_at, b10.updated_at, b10.image_url, b10.has_image, b10.primary_email_address_id, b10.primary_phone_number_id, b10.primary_web3_wallet_id, b10.last_sign_in_at, b10.external_id, b10.username, b10.first_name, b10.last_name, b10.public_metadata, b10.private_metadata, b10.unsafe_metadata, (b10.email_addresses || []).map((a11) => f9.fromJSON(a11)), (b10.phone_numbers || []).map((a11) => gA.fromJSON(a11)), (b10.web3_wallets || []).map((a11) => gP.fromJSON(a11)), (b10.external_accounts || []).map((a11) => gj.fromJSON(a11)), (b10.enterprise_accounts || []).map((a11) => gf.fromJSON(a11)), b10.last_active_at, b10.create_organization_enabled, b10.create_organizations_limit, b10.delete_self_enabled, b10.legal_accepted_at, b10.locale);
          return c10._raw = b10, c10;
        }
        get primaryEmailAddress() {
          return this.emailAddresses.find(({ id: a11 }) => a11 === this.primaryEmailAddressId) ?? null;
        }
        get primaryPhoneNumber() {
          return this.phoneNumbers.find(({ id: a11 }) => a11 === this.primaryPhoneNumberId) ?? null;
        }
        get primaryWeb3Wallet() {
          return this.web3Wallets.find(({ id: a11 }) => a11 === this.primaryWeb3WalletId) ?? null;
        }
        get fullName() {
          return [this.firstName, this.lastName].join(" ").trim() || null;
        }
      }, gR = class a10 {
        constructor(a11, b10, c10, d10, e10, f10, g10) {
          this.id = a11, this.emailAddress = b10, this.status = c10, this.invitation = d10, this.createdAt = e10, this.updatedAt = f10, this.isLocked = g10;
        }
        static fromJSON(b10) {
          return new a10(b10.id, b10.email_address, b10.status, b10.invitation && gn.fromJSON(b10.invitation), b10.created_at, b10.updated_at, b10.is_locked);
        }
      };
      function gS(a10) {
        if ("string" != typeof a10 && "object" in a10 && "deleted" in a10) return f4.fromJSON(a10);
        switch (a10.object) {
          case "accountless_application":
            return fV.fromJSON(a10);
          case "actor_token":
            return fX.fromJSON(a10);
          case "allowlist_identifier":
            return fY.fromJSON(a10);
          case "api_key":
            return fZ.fromJSON(a10);
          case "blocklist_identifier":
            return f$.fromJSON(a10);
          case "client":
            return f1.fromJSON(a10);
          case "cookies":
            return f3.fromJSON(a10);
          case "domain":
            return f5.fromJSON(a10);
          case "email_address":
            return f9.fromJSON(a10);
          case "enterprise_account":
            return gf.fromJSON(a10);
          case "email":
            return f6.fromJSON(a10);
          case "clerk_idp_oauth_access_token":
            return eF.fromJSON(a10);
          case "instance":
            return gk.fromJSON(a10);
          case "instance_restrictions":
            return gl.fromJSON(a10);
          case "instance_settings":
            return gm.fromJSON(a10);
          case "invitation":
            return gn.fromJSON(a10);
          case "jwt_template":
            return go.fromJSON(a10);
          case "machine":
            return gp.fromJSON(a10);
          case "machine_scope":
            return gq.fromJSON(a10);
          case "machine_secret_key":
            return gr.fromJSON(a10);
          case "machine_to_machine_token":
            return eH.fromJSON(a10);
          case "oauth_access_token":
            return gs.fromJSON(a10);
          case "oauth_application":
            return gt.fromJSON(a10);
          case "organization":
            return gu.fromJSON(a10);
          case "organization_invitation":
            return gv.fromJSON(a10);
          case "organization_membership":
            return gw.fromJSON(a10);
          case "organization_settings":
            return gy.fromJSON(a10);
          case "permission":
            return gz.fromJSON(a10);
          case "phone_number":
            return gA.fromJSON(a10);
          case "proxy_check":
            return gB.fromJSON(a10);
          case "redirect_url":
            return gC.fromJSON(a10);
          case "role":
            return gD.fromJSON(a10);
          case "role_set":
            return gG.fromJSON(a10);
          case "enterprise_connection":
            return gi.fromJSON(a10);
          case "saml_connection":
            return gH.fromJSON(a10);
          case "sign_in_token":
            return gJ.fromJSON(a10);
          case "agent_task":
            return fW.fromJSON(a10);
          case "sign_up_attempt":
            return gM.fromJSON(a10);
          case "session":
            return f0.fromJSON(a10);
          case "sms_message":
            return gN.fromJSON(a10);
          case "token":
            return gO.fromJSON(a10);
          case "total_count":
            return a10.total_count;
          case "user":
            return gQ.fromJSON(a10);
          case "waitlist_entry":
            return gR.fromJSON(a10);
          case "commerce_plan":
            return gb.fromJSON(a10);
          case "commerce_subscription":
            return gd.fromJSON(a10);
          case "commerce_subscription_item":
            return gc.fromJSON(a10);
          case "feature":
            return ga.fromJSON(a10);
          default:
            return a10;
        }
      }
      function gT(a10) {
        var b10;
        return b10 = async (b11) => {
          let c10, { secretKey: d10, machineSecretKey: e10, useMachineSecretKey: f10 = false, requireSecretKey: g10 = true, apiUrl: h10 = du, apiVersion: i10 = "v1", userAgent: j10 = dv, skipApiVersionInUrl: k2 = false } = a10, { path: l2, method: m2, queryParams: n2, headerParams: o2, bodyParams: p2, formData: q2, options: r2 } = b11, { deepSnakecaseBodyParamKeys: s2 = false } = r2 || {};
          g10 && d2(d10);
          let t2 = new URL(k2 ? ea(h10, l2) : ea(h10, i10, l2));
          if (n2) for (let [a11, b12] of Object.entries(fU({ ...n2 }))) b12 && [b12].flat().forEach((b13) => t2.searchParams.append(a11, b13));
          let u2 = new Headers({ "Clerk-API-Version": dw, [dY]: j10, ...o2 }), v2 = dC;
          !u2.has(v2) && (f10 && e10 ? u2.set(v2, `Bearer ${e10}`) : d10 && u2.set(v2, `Bearer ${d10}`));
          try {
            if (q2 ? c10 = await cV.fetch(t2.href, { method: m2, headers: u2, body: q2 }) : (u2.set("Content-Type", "application/json"), c10 = await cV.fetch(t2.href, { method: m2, headers: u2, ...(() => {
              if (!("GET" !== m2 && p2 && Object.keys(p2).length > 0)) return null;
              let a12 = (a13) => fU(a13, { deep: s2 });
              return { body: JSON.stringify(Array.isArray(p2) ? p2.map(a12) : a12(p2)) };
            })() })), 204 === c10.status) return { data: void 0, errors: null };
            let a11 = c10?.headers && c10.headers?.get(dM) === d$, b12 = await (a11 ? c10.json() : c10.text());
            if (!c10.ok) return { data: null, errors: gW(b12), status: c10?.status, statusText: c10?.statusText, clerkTraceId: gU(b12, c10?.headers), retryAfter: gV(c10?.headers) };
            return { ...function(a12) {
              var b13, c11;
              let d11;
              if (Array.isArray(a12)) return { data: a12.map((a13) => gS(a13)) };
              if ((b13 = a12) && "object" == typeof b13 && "m2m_tokens" in b13 && Array.isArray(b13.m2m_tokens)) return { data: d11 = a12.m2m_tokens.map((a13) => gS(a13)), totalCount: a12.total_count };
              return (c11 = a12) && "object" == typeof c11 && "data" in c11 && Array.isArray(c11.data) && void 0 !== c11.data ? { data: d11 = a12.data.map((a13) => gS(a13)), totalCount: a12.total_count } : { data: gS(a12) };
            }(b12), errors: null };
          } catch (a11) {
            if (a11 instanceof Error) return { data: null, errors: [{ code: "unexpected_error", message: a11.message || "Unexpected error" }], clerkTraceId: gU(a11, c10?.headers) };
            return { data: null, errors: gW(a11), status: c10?.status, statusText: c10?.statusText, clerkTraceId: gU(a11, c10?.headers), retryAfter: gV(c10?.headers) };
          }
        }, async (...a11) => {
          let { data: c10, errors: d10, totalCount: e10, status: f10, statusText: g10, clerkTraceId: h10, retryAfter: i10 } = await b10(...a11);
          if (d10) {
            let a12 = new cx(g10 || "", { data: [], status: f10, clerkTraceId: h10, retryAfter: i10 });
            throw a12.errors = d10, a12;
          }
          return void 0 !== e10 ? { data: c10, totalCount: e10 } : c10;
        };
      }
      function gU(a10, b10) {
        return a10 && "object" == typeof a10 && "clerk_trace_id" in a10 && "string" == typeof a10.clerk_trace_id ? a10.clerk_trace_id : b10?.get("cf-ray") || "";
      }
      function gV(a10) {
        let b10 = a10?.get("Retry-After");
        if (!b10) return;
        let c10 = parseInt(b10, 10);
        if (!isNaN(c10)) return c10;
      }
      function gW(a10) {
        if (a10 && "object" == typeof a10 && "errors" in a10) {
          let b10 = a10.errors;
          return b10.length > 0 ? b10.map(cw) : [];
        }
        return [];
      }
      function gX(a10) {
        let b10 = gT(a10);
        return { __experimental_accountlessApplications: new eh(gT({ ...a10, requireSecretKey: false })), actorTokens: new ed(b10), agentTasks: new ef(b10), allowlistIdentifiers: new ej(b10), apiKeys: new el(gT({ ...a10, skipApiVersionInUrl: true })), betaFeatures: new em(b10), blocklistIdentifiers: new eo(b10), billing: new fD(b10), clients: new eq(b10), domains: new es(b10), emailAddresses: new eu(b10), emails: new ev(b10), enterpriseConnections: new ex(b10), idPOAuthAccessToken: new ey(gT({ ...a10, skipApiVersionInUrl: true })), instance: new eA(b10), invitations: new eC(b10), jwks: new e5(b10), jwtTemplates: new e7(b10), machines: new eE(b10), m2m: new e4(gT({ ...a10, skipApiVersionInUrl: true, requireSecretKey: false, useMachineSecretKey: true }), { secretKey: a10.secretKey, apiUrl: a10.apiUrl, jwtKey: a10.jwtKey }), oauthApplications: new ff(b10), organizations: new e9(b10), organizationPermissions: new fb(b10), organizationRoles: new fd(b10), phoneNumbers: new fh(b10), proxyChecks: new fi(b10), redirectUrls: new fk(b10), roleSets: new fm(b10), sessions: new fq(b10), signInTokens: new fs(b10), signUps: new fu(b10), testingTokens: new fv(b10), users: new fx(b10), waitlistEntries: new fz(b10), webhooks: new fB(b10), samlConnections: new fo(b10) };
      }
      var gY = (a10) => () => {
        let b10 = { ...a10 };
        return b10.secretKey = (b10.secretKey || "").substring(0, 7), b10.jwtKey = (b10.jwtKey || "").substring(0, 7), b10.sessionToken = (b10.sessionToken || "").substring(0, 7), b10.tokenInHeader = (b10.tokenInHeader || "").substring(0, 7), b10.sessionTokenInCookie = (b10.sessionTokenInCookie || "").substring(0, 7), b10.refreshTokenInCookie = (b10.refreshTokenInCookie || "").substring(0, 7), b10.devBrowserToken = (b10.devBrowserToken || "").substring(0, 7), b10.handshakeToken = (b10.handshakeToken || "").substring(0, 7), { ...b10 };
      };
      function gZ(a10, b10) {
        return { tokenType: d3, sessionClaims: null, sessionId: null, sessionStatus: b10 ?? null, userId: null, actor: null, orgId: null, orgRole: null, orgSlug: null, orgPermissions: null, factorVerificationAge: null, getToken: () => Promise.resolve(null), has: () => false, debug: gY(a10), isAuthenticated: false };
      }
      function g$(a10, b10) {
        let c10 = { id: null, subject: null, scopes: null, has: () => false, getToken: () => Promise.resolve(null), debug: gY(b10), isAuthenticated: false };
        switch (a10) {
          case d4:
            return { ...c10, tokenType: a10, name: null, claims: null, scopes: null, userId: null, orgId: null };
          case d5:
            return { ...c10, tokenType: a10, claims: null, scopes: null, machineId: null };
          case d6:
            return { ...c10, tokenType: a10, scopes: null, userId: null, clientId: null };
          default:
            throw Error(`Invalid token type: ${a10}`);
        }
      }
      function g_() {
        return { isAuthenticated: false, tokenType: null, getToken: () => Promise.resolve(null), has: () => false, debug: () => ({}) };
      }
      var g0 = ({ authObject: a10, acceptsToken: b10 = d3 }) => {
        if ("any" === b10) return a10;
        if (Array.isArray(b10)) return e$(a10.tokenType, b10) ? a10 : g_();
        if (!e$(a10.tokenType, b10)) return e_.has(b10) ? g$(b10, a10.debug) : gZ(a10.debug);
        return a10;
      }, g1 = "signed-out", g2 = "handshake", g3 = "satellite-needs-syncing", g4 = "session-token-and-uat-missing", g5 = "token-type-mismatch", g6 = "unexpected-error";
      function g7(a10) {
        let { authenticateContext: b10, headers: c10 = new Headers(), token: d10 } = a10;
        return { status: "signed-in", reason: null, message: null, proxyUrl: b10.proxyUrl || "", publishableKey: b10.publishableKey || "", isSatellite: b10.isSatellite || false, domain: b10.domain || "", signInUrl: b10.signInUrl || "", signUpUrl: b10.signUpUrl || "", afterSignInUrl: b10.afterSignInUrl || "", afterSignUpUrl: b10.afterSignUpUrl || "", isSignedIn: true, isAuthenticated: true, tokenType: a10.tokenType, toAuth: ({ treatPendingAsSignedOut: c11 = true } = {}) => {
          if (a10.tokenType === d3) {
            let { sessionClaims: e11 } = a10, f11 = function(a11, b11, c12) {
              let d11, { actor: e12, sessionId: f12, sessionStatus: g11, userId: h10, orgId: i10, orgRole: j10, orgSlug: k2, orgPermissions: l2, factorVerificationAge: m2 } = ((a12) => {
                let b12, c13, d12, e13, f13 = a12.fva ?? null, g12 = a12.sts ?? null;
                if (2 === a12.v) {
                  if (a12.o) {
                    b12 = a12.o?.id, d12 = a12.o?.slg, a12.o?.rol && (c13 = `org:${a12.o?.rol}`);
                    let { org: f14 } = ds(a12.fea), { permissions: g13, featurePermissionMap: h11 } = (({ per: a13, fpm: b13 }) => {
                      if (!a13 || !b13) return { permissions: [], featurePermissionMap: [] };
                      let c14 = a13.split(",").map((a14) => a14.trim());
                      return { permissions: c14, featurePermissionMap: b13.split(",").map((a14) => Number.parseInt(a14.trim(), 10)).map((a14) => a14.toString(2).padStart(c14.length, "0").split("").map((a15) => Number.parseInt(a15, 10)).reverse()).filter(Boolean) };
                    })({ per: a12.o?.per, fpm: a12.o?.fpm });
                    e13 = function({ features: a13, permissions: b13, featurePermissionMap: c14 }) {
                      if (!a13 || !b13 || !c14) return [];
                      let d13 = [];
                      for (let e14 = 0; e14 < a13.length; e14++) {
                        let f15 = a13[e14];
                        if (e14 >= c14.length) continue;
                        let g14 = c14[e14];
                        if (g14) for (let a14 = 0; a14 < g14.length; a14++) 1 === g14[a14] && d13.push(`org:${f15}:${b13[a14]}`);
                      }
                      return d13;
                    }({ features: f14, featurePermissionMap: h11, permissions: g13 });
                  }
                } else b12 = a12.org_id, c13 = a12.org_role, d12 = a12.org_slug, e13 = a12.org_permissions;
                return { sessionClaims: a12, sessionId: a12.sid, sessionStatus: g12, actor: a12.act, userId: a12.sub, orgId: b12, orgRole: c13, orgSlug: d12, orgPermissions: e13, factorVerificationAge: f13 };
              })(c12), n2 = gX(a11), o2 = ((a12) => {
                let { fetcher: b12, sessionToken: c13, sessionId: d12 } = a12 || {};
                return async (a13 = {}) => d12 ? a13.template || void 0 !== a13.expiresInSeconds ? b12(d12, a13.template, a13.expiresInSeconds) : c13 : null;
              })({ sessionId: f12, sessionToken: b11, fetcher: async (a12, b12, c13) => (await n2.sessions.getToken(a12, b12 || "", c13)).jwt });
              return { tokenType: d3, actor: e12, sessionClaims: c12, sessionId: f12, sessionStatus: g11, userId: h10, orgId: i10, orgRole: j10, orgSlug: k2, orgPermissions: l2, factorVerificationAge: m2, getToken: o2, has: (d11 = { orgId: i10, orgRole: j10, orgPermissions: l2, userId: h10, factorVerificationAge: m2, features: c12.fea || "", plans: c12.pla || "" }, (a12) => {
                let b12;
                return !!d11.userId && (b12 = [((a13, b13) => {
                  let { orgId: c13, orgRole: d12, orgPermissions: e13 } = b13, f13 = void 0 !== a13.role, g12 = void 0 !== a13.permission;
                  return f13 || g12 ? f13 && "string" != typeof a13.role || g12 && "string" != typeof a13.permission || !c13 || f13 && ("string" != typeof d12 || !d12 || d12.replace(/^(org:)*/, "org:") !== a13.role.replace(/^(org:)*/, "org:")) || g12 && (!Array.isArray(e13) || !e13.includes(a13.permission.replace(/^(org:)*/, "org:"))) ? "fail" : "pass" : "skip";
                })(a12, d11), ((a13, b13) => {
                  let { features: c13, plans: d12 } = b13, e13 = void 0 !== a13.feature, f13 = void 0 !== a13.plan;
                  if (!e13 && !f13) return "skip";
                  if (e13 && "string" != typeof a13.feature || f13 && "string" != typeof a13.plan) return "fail";
                  if (e13) {
                    if ("string" != typeof c13 || !c13) return "fail";
                    try {
                      if (!dr(c13, a13.feature)) return "fail";
                    } catch {
                      return "fail";
                    }
                  }
                  if (f13) {
                    if ("string" != typeof d12 || !d12) return "fail";
                    try {
                      if (!dr(d12, a13.plan)) return "fail";
                    } catch {
                      return "fail";
                    }
                  }
                  return "pass";
                })(a12, d11), ((a13, { factorVerificationAge: b13 }) => {
                  if (void 0 === a13.reverification) return "skip";
                  if (!b13 || !Array.isArray(b13) || 2 !== b13.length || !dq(b13[0]) || !dq(b13[1])) return "fail";
                  let c13 = ((a14) => {
                    let b14, c14;
                    if (!a14) return false;
                    let d13 = "string" == typeof a14 && dm.has(a14), e14 = "object" == typeof a14 && (b14 = a14.level, dl.has(b14)) && "number" == typeof (c14 = a14.afterMinutes) && c14 > 0;
                    return (!!d13 || !!e14) && ((a15) => "string" == typeof a15 ? dk[a15] : a15).bind(null, a14);
                  })(a13.reverification);
                  if (!c13) return "fail";
                  let { level: d12, afterMinutes: e13 } = c13(), [f13, g12] = b13;
                  if (-1 === f13 && -1 === g12) return "fail";
                  let h11 = -1 !== f13 && e13 > f13, i11 = -1 !== g12 && e13 > g12;
                  switch (d12) {
                    case "first_factor":
                      return h11 ? "pass" : "fail";
                    case "second_factor":
                      if (-1 === g12) return h11 ? "pass" : "fail";
                      return i11 ? "pass" : "fail";
                    case "multi_factor":
                      if (-1 === g12) return h11 ? "pass" : "fail";
                      if (-1 === f13) return "fail";
                      return h11 && i11 ? "pass" : "fail";
                  }
                })(a12, d11)]).some((a13) => "pass" === a13) && b12.every((a13) => "pass" === a13 || "skip" === a13);
              }), debug: gY({ ...a11, sessionToken: b11 }), isAuthenticated: true };
            }(b10, d10, e11);
            return c11 && "pending" === f11.sessionStatus ? gZ(void 0, f11.sessionStatus) : f11;
          }
          let { machineData: e10 } = a10;
          var f10 = a10.tokenType;
          let g10 = { id: e10.id, subject: e10.subject, getToken: () => Promise.resolve(d10), has: () => false, debug: gY(b10), isAuthenticated: true };
          switch (f10) {
            case d4:
              return { ...g10, tokenType: f10, name: e10.name, claims: e10.claims, scopes: e10.scopes, userId: e10.subject.startsWith("user_") ? e10.subject : null, orgId: e10.subject.startsWith("org_") ? e10.subject : null };
            case d5:
              return { ...g10, tokenType: f10, claims: e10.claims, scopes: e10.scopes, machineId: e10.subject };
            case d6:
              return { ...g10, tokenType: f10, scopes: e10.scopes, userId: e10.subject, clientId: e10.clientId };
            default:
              throw Error(`Invalid token type: ${f10}`);
          }
        }, headers: c10, token: d10 };
      }
      function g8(a10) {
        let { authenticateContext: b10, headers: c10 = new Headers(), reason: d10, message: e10 = "", tokenType: f10 } = a10;
        return g9({ status: g1, reason: d10, message: e10, proxyUrl: b10.proxyUrl || "", publishableKey: b10.publishableKey || "", isSatellite: b10.isSatellite || false, domain: b10.domain || "", signInUrl: b10.signInUrl || "", signUpUrl: b10.signUpUrl || "", afterSignInUrl: b10.afterSignInUrl || "", afterSignUpUrl: b10.afterSignUpUrl || "", isSignedIn: false, isAuthenticated: false, tokenType: f10, toAuth: () => f10 === d3 ? gZ({ ...b10, status: g1, reason: d10, message: e10 }) : g$(f10, { reason: d10, message: e10, headers: c10 }), headers: c10, token: null });
      }
      var g9 = (a10) => {
        let b10 = new Headers(a10.headers || {});
        if (a10.message) try {
          b10.set(dB, a10.message);
        } catch {
        }
        if (a10.reason) try {
          b10.set(dD, a10.reason);
        } catch {
        }
        if (a10.status) try {
          b10.set(dF, a10.status);
        } catch {
        }
        return a10.headers = b10, a10;
      }, ha = (l = null != (j = dt()) ? c5(c9(j)) : {}, ((a10, b10, c10, d10) => {
        if (b10 && "object" == typeof b10 || "function" == typeof b10) for (let e10 of c8(b10)) da.call(a10, e10) || e10 === c10 || c6(a10, e10, { get: () => b10[e10], enumerable: !(d10 = c7(b10, e10)) || d10.enumerable });
        return a10;
      })(!k && j && j.__esModule ? l : c6(l, "default", { value: j, enumerable: true }), j)), hb = class extends URL {
        isCrossOrigin(a10) {
          return this.origin !== new URL(a10.toString()).origin;
        }
      }, hc = (...a10) => new hb(...a10), hd = class extends Request {
        constructor(a10, b10) {
          let c10;
          const d10 = "string" != typeof a10 && "url" in a10 ? a10.url : String(a10);
          b10 ? c10 = b10 : "string" != typeof a10 && (c10 = new Proxy(a10, { get(a11, b11) {
            if ("signal" !== b11 && "body" !== b11) return Reflect.get(a11, b11, a11);
          } })), super(d10, c10), this.clerkUrl = this.deriveUrlFromHeaders(this), this.cookies = this.parseCookies(this);
        }
        toJSON() {
          return { url: this.clerkUrl.href, method: this.method, headers: JSON.stringify(Object.fromEntries(this.headers)), clerkUrl: this.clerkUrl.toString(), cookies: JSON.stringify(Object.fromEntries(this.cookies)) };
        }
        deriveUrlFromHeaders(a10) {
          let b10 = new URL(a10.url), c10 = a10.headers.get(dR), d10 = a10.headers.get(dQ), e10 = a10.headers.get(dS), f10 = b10.protocol, g10 = this.getFirstValueFromHeader(d10) ?? e10, h10 = this.getFirstValueFromHeader(c10) ?? f10?.replace(/[:/]/, ""), i10 = g10 && h10 ? `${h10}://${g10}` : b10.origin;
          if (i10 === b10.origin) return hc(b10);
          try {
            return hc(b10.pathname + b10.search, i10);
          } catch {
            return hc(b10);
          }
        }
        getFirstValueFromHeader(a10) {
          return a10?.split(",")[0];
        }
        parseCookies(a10) {
          return new Map(Object.entries((0, ha.parse)(this.decodeCookieValue(a10.headers.get("cookie") || ""))));
        }
        decodeCookieValue(a10) {
          return a10 ? a10.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent) : a10;
        }
      }, he = (...a10) => a10[0] && "object" == typeof a10[0] && "clerkUrl" in a10[0] && "cookies" in a10[0] ? a10[0] : new hd(...a10), hf = (a10) => a10.split(";")[0]?.split("=")[0], hg = (a10) => a10.split(";")[0]?.split("=")[1];
      async function hh(a10, b10) {
        let { data: c10, errors: d10 } = c3(a10);
        if (d10) return { errors: d10 };
        let { header: e10 } = c10, { kid: f10 } = e10;
        try {
          let c11;
          if (b10.jwtKey) c11 = eL({ kid: f10, pem: b10.jwtKey });
          else {
            if (!b10.secretKey) return { errors: [new cO({ action: cN, message: "Failed to resolve JWK during verification.", reason: cK })] };
            c11 = await eM({ ...b10, kid: f10 });
          }
          return await c4(a10, { ...b10, key: c11 });
        } catch (a11) {
          return { errors: [a11] };
        }
      }
      function hi(a10, b10, c10) {
        if (cy(b10)) {
          let d10, e10;
          switch (b10.status) {
            case 401:
              d10 = "secret-key-invalid", e10 = b10.errors[0]?.message || "Invalid secret key";
              break;
            case 404:
              d10 = cP, e10 = c10;
              break;
            default:
              d10 = cQ, e10 = "Unexpected error";
          }
          return { data: void 0, tokenType: a10, errors: [new cS({ message: e10, code: d10, status: b10.status })] };
        }
        return { data: void 0, tokenType: a10, errors: [new cS({ message: "Unexpected error", code: cQ, status: b10.status })] };
      }
      async function hj(a10, b10) {
        try {
          let c10 = gX(b10);
          return { data: await c10.m2m.verify({ token: a10 }), tokenType: d5, errors: void 0 };
        } catch (a11) {
          return hi(d5, a11, "Machine token not found");
        }
      }
      async function hk(a10, b10) {
        try {
          let c10 = gX(b10);
          return { data: await c10.idPOAuthAccessToken.verify(a10), tokenType: d6, errors: void 0 };
        } catch (a11) {
          return hi(d6, a11, "OAuth token not found");
        }
      }
      async function hl(a10, b10) {
        try {
          let c10 = gX(b10);
          return { data: await c10.apiKeys.verify(a10), tokenType: d4, errors: void 0 };
        } catch (a11) {
          return hi(d4, a11, "API key not found");
        }
      }
      async function hm(a10, b10) {
        if (eT(a10)) {
          let c10;
          try {
            let { data: b11, errors: d10 } = c3(a10);
            if (d10) throw d10[0];
            c10 = b11;
          } catch (a11) {
            return { data: void 0, tokenType: d5, errors: [new cS({ code: cP, message: a11.message })] };
          }
          return "string" == typeof c10.payload.sub && c10.payload.sub.startsWith(eP) ? e1(a10, c10, b10) : eU.includes(c10.header.typ) ? e2(a10, c10, b10) : { data: void 0, tokenType: d6, errors: [new cS({ code: cR, message: `Invalid JWT type: ${c10.header.typ ?? "missing"}. Expected one of: ${eU.join(", ")} for OAuth, or sub starting with 'mch_' for M2M` })] };
        }
        if (a10.startsWith("mt_")) return hj(a10, b10);
        if (a10.startsWith(eQ)) return hk(a10, b10);
        if (a10.startsWith("ak_")) return hl(a10, b10);
        throw Error("Unknown machine token type");
      }
      async function hn(a10, { key: b10 }) {
        let { data: c10, errors: d10 } = c3(a10);
        if (d10) throw d10[0];
        let { header: e10, payload: f10 } = c10, { typ: g10, alg: h10 } = e10;
        c0(g10), c1(h10);
        let { data: i10, errors: j10 } = await c2(c10, b10);
        if (j10) throw new cO({ reason: cI, message: `Error verifying handshake token. ${j10[0]}` });
        if (!i10) throw new cO({ reason: cF, message: "Handshake signature is invalid." });
        return f10;
      }
      async function ho(a10, b10) {
        let c10, { secretKey: d10, apiUrl: e10, apiVersion: f10, jwksCacheTtlInMs: g10, jwtKey: h10, skipJwksCache: i10 } = b10, { data: j10, errors: k2 } = c3(a10);
        if (k2) throw k2[0];
        let { kid: l2 } = j10.header;
        if (h10) c10 = eL({ kid: l2, pem: h10 });
        else if (d10) c10 = await eM({ secretKey: d10, apiUrl: e10, apiVersion: f10, kid: l2, jwksCacheTtlInMs: g10, skipJwksCache: i10 });
        else throw new cO({ action: cN, message: "Failed to resolve JWK during handshake verification.", reason: cK });
        return hn(a10, { key: c10 });
      }
      var hp = class {
        constructor(a10, b10, c10) {
          this.authenticateContext = a10, this.options = b10, this.organizationMatcher = c10;
        }
        isRequestEligibleForHandshake() {
          let { accept: a10, method: b10, secFetchDest: c10 } = this.authenticateContext;
          return "GET" === b10 && !!("document" === c10 || "iframe" === c10 || !c10 && a10?.startsWith("text/html"));
        }
        buildRedirectToHandshake(a10) {
          if (!this.authenticateContext?.clerkUrl) throw Error("Missing clerkUrl in authenticateContext");
          let b10 = this.removeDevBrowserFromURL(this.authenticateContext.clerkUrl), c10 = this.authenticateContext.frontendApi.startsWith("http") ? this.authenticateContext.frontendApi : `https://${this.authenticateContext.frontendApi}`, d10 = new URL("v1/client/handshake", c10 = c10.replace(/\/+$/, "") + "/");
          d10.searchParams.append("redirect_url", b10?.href || ""), d10.searchParams.append("__clerk_api_version", dw), d10.searchParams.append(dy.SuffixedCookies, this.authenticateContext.usesSuffixedCookies().toString()), d10.searchParams.append(dy.HandshakeReason, a10), d10.searchParams.append(dy.HandshakeFormat, "nonce"), this.authenticateContext.sessionToken && d10.searchParams.append(dy.Session, this.authenticateContext.sessionToken), "development" === this.authenticateContext.instanceType && this.authenticateContext.devBrowserToken && d10.searchParams.append(dy.DevBrowser, this.authenticateContext.devBrowserToken);
          let e10 = this.getOrganizationSyncTarget(this.authenticateContext.clerkUrl, this.organizationMatcher);
          return e10 && this.getOrganizationSyncQueryParams(e10).forEach((a11, b11) => {
            d10.searchParams.append(b11, a11);
          }), new Headers({ [dT]: d10.href });
        }
        async getCookiesFromHandshake() {
          let a10 = [];
          if (this.authenticateContext.handshakeNonce) try {
            let b10 = await this.authenticateContext.apiClient?.clients.getHandshakePayload({ nonce: this.authenticateContext.handshakeNonce });
            b10 && a10.push(...b10.directives);
          } catch (a11) {
            console.error("Clerk: HandshakeService: error getting handshake payload:", a11);
          }
          else if (this.authenticateContext.handshakeToken) {
            let b10 = await ho(this.authenticateContext.handshakeToken, this.authenticateContext);
            b10 && Array.isArray(b10.handshake) && a10.push(...b10.handshake);
          }
          return a10;
        }
        async resolveHandshake() {
          let a10 = new Headers({ "Access-Control-Allow-Origin": "null", "Access-Control-Allow-Credentials": "true" }), b10 = await this.getCookiesFromHandshake(), c10 = "";
          if (b10.forEach((b11) => {
            a10.append("Set-Cookie", b11), hf(b11).startsWith(dx.Session) && (c10 = hg(b11));
          }), "development" === this.authenticateContext.instanceType) {
            let b11 = new URL(this.authenticateContext.clerkUrl);
            b11.searchParams.delete(dy.Handshake), b11.searchParams.delete(dy.HandshakeHelp), b11.searchParams.delete(dy.DevBrowser), b11.searchParams.delete(dy.HandshakeNonce), a10.append(dT, b11.toString()), a10.set(dH, "no-store");
          }
          if ("" === c10) return g8({ tokenType: d3, authenticateContext: this.authenticateContext, reason: "session-token-missing", message: "", headers: a10 });
          let { data: d10, errors: [e10] = [] } = await hh(c10, this.authenticateContext);
          if (d10) return g7({ tokenType: d3, authenticateContext: this.authenticateContext, sessionClaims: d10, headers: a10, token: c10 });
          if ("development" === this.authenticateContext.instanceType && (e10?.reason === cD || e10?.reason === cG || e10?.reason === cH)) {
            let b11 = new cO({ action: e10.action, message: e10.message, reason: e10.reason });
            b11.tokenCarrier = "cookie", console.error(`Clerk: Clock skew detected. This usually means that your system clock is inaccurate. Clerk will attempt to account for the clock skew in development.

To resolve this issue, make sure your system's clock is set to the correct time (e.g. turn off and on automatic time synchronization).

---

${b11.getFullMessage()}`);
            let { data: d11, errors: [f10] = [] } = await hh(c10, { ...this.authenticateContext, clockSkewInMs: 864e5 });
            if (d11) return g7({ tokenType: d3, authenticateContext: this.authenticateContext, sessionClaims: d11, headers: a10, token: c10 });
            throw Error(f10?.message || "Clerk: Handshake retry failed.");
          }
          throw Error(e10?.message || "Clerk: Handshake failed.");
        }
        handleTokenVerificationErrorInDevelopment(a10) {
          if (a10.reason === cF) throw Error("Clerk: Handshake token verification failed due to an invalid signature. If you have switched Clerk keys locally, clear your cookies and try again.");
          throw Error(`Clerk: Handshake token verification failed: ${a10.getFullMessage()}.`);
        }
        checkAndTrackRedirectLoop(a10) {
          if (3 === this.authenticateContext.handshakeRedirectLoopCounter) return true;
          let b10 = this.authenticateContext.handshakeRedirectLoopCounter + 1, c10 = dx.RedirectCount;
          return a10.append("Set-Cookie", `${c10}=${b10}; SameSite=Lax; HttpOnly; Max-Age=2`), false;
        }
        removeDevBrowserFromURL(a10) {
          let b10 = new URL(a10);
          return b10.searchParams.delete(dy.DevBrowser), b10.searchParams.delete(dy.LegacyDevBrowser), b10;
        }
        getOrganizationSyncTarget(a10, b10) {
          return b10.findTarget(a10);
        }
        getOrganizationSyncQueryParams(a10) {
          let b10 = /* @__PURE__ */ new Map();
          return "personalAccount" === a10.type && b10.set("organization_id", ""), "organization" === a10.type && (a10.organizationId && b10.set("organization_id", a10.organizationId), a10.organizationSlug && b10.set("organization_id", a10.organizationSlug)), b10;
        }
      }, hq = class {
        constructor(a10) {
          this.organizationPattern = this.createMatcher(a10?.organizationPatterns), this.personalAccountPattern = this.createMatcher(a10?.personalAccountPatterns);
        }
        createMatcher(a10) {
          if (!a10) return null;
          try {
            var b10, c10, d10, e10, f10, g10, h10;
            try {
              return b10 = void 0, c10 = [], d10 = b3(a10, c10, b10), e10 = c10, f10 = b10, void 0 === f10 && (f10 = {}), g10 = f10.decode, h10 = void 0 === g10 ? function(a11) {
                return a11;
              } : g10, function(a11) {
                var b11 = d10.exec(a11);
                if (!b11) return false;
                for (var c11 = b11[0], f11 = b11.index, g11 = /* @__PURE__ */ Object.create(null), i10 = 1; i10 < b11.length; i10++) !function(a12) {
                  if (void 0 !== b11[a12]) {
                    var c12 = e10[a12 - 1];
                    "*" === c12.modifier || "+" === c12.modifier ? g11[c12.name] = b11[a12].split(c12.prefix + c12.suffix).map(function(a13) {
                      return h10(a13, c12);
                    }) : g11[c12.name] = h10(b11[a12], c12);
                  }
                }(i10);
                return { path: c11, index: f11, params: g11 };
              };
            } catch (a11) {
              throw Error(`Invalid path and options: Consult the documentation of path-to-regexp here: https://github.com/pillarjs/path-to-regexp/tree/6.x
${a11.message}`);
            }
          } catch (b11) {
            throw Error(`Invalid pattern "${a10}": ${b11}`);
          }
        }
        findTarget(a10) {
          let b10 = this.findOrganizationTarget(a10);
          return b10 || this.findPersonalAccountTarget(a10);
        }
        findOrganizationTarget(a10) {
          if (!this.organizationPattern) return null;
          try {
            let b10 = this.organizationPattern(a10.pathname);
            if (!b10 || !("params" in b10)) return null;
            let c10 = b10.params;
            if (c10.id) return { type: "organization", organizationId: c10.id };
            if (c10.slug) return { type: "organization", organizationSlug: c10.slug };
            return null;
          } catch (a11) {
            return console.error("Failed to match organization pattern:", a11), null;
          }
        }
        findPersonalAccountTarget(a10) {
          if (!this.personalAccountPattern) return null;
          try {
            return this.personalAccountPattern(a10.pathname) ? { type: "personalAccount" } : null;
          } catch (a11) {
            return console.error("Failed to match personal account pattern:", a11), null;
          }
        }
      };
      function hr(a10, b10, c10) {
        return e$(a10, b10) ? null : g8({ tokenType: "string" == typeof b10 ? b10 : a10, authenticateContext: c10, reason: g5 });
      }
      var hs = async (a10, b10) => {
        let c10 = await d8(he(a10), b10), d10 = b10.acceptsToken ?? d3;
        if (d10 !== d5 && (d2(c10.secretKey), c10.isSatellite)) {
          var e10 = c10.signInUrl, f10 = c10.secretKey;
          if (!e10 && cn(f10)) throw Error("Missing signInUrl. Pass a signInUrl for dev instances if an app is satellite");
          if (c10.signInUrl && c10.origin && function(a11, b11) {
            let c11;
            try {
              c11 = new URL(a11);
            } catch {
              throw Error("The signInUrl needs to have a absolute url format.");
            }
            if (c11.origin === b11) throw Error("The signInUrl needs to be on a different origin than your satellite application.");
          }(c10.signInUrl, c10.origin), !(c10.proxyUrl || c10.domain)) throw Error("Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl");
        }
        d10 === d5 && function(a11) {
          if (!a11.machineSecretKey && !a11.secretKey) throw Error("Machine token authentication requires either a Machine secret key or a Clerk secret key. Ensure a Clerk secret key or Machine secret key is set.");
        }(c10);
        let g10 = new hq(b10.organizationSyncOptions), h10 = new hp(c10, { organizationSyncOptions: b10.organizationSyncOptions }, g10);
        async function i10(c11) {
          if (!b10.apiClient) return { data: null, error: { message: "An apiClient is needed to perform token refresh.", cause: { reason: "missing-api-client" } } };
          let { sessionToken: d11, refreshTokenInCookie: e11 } = c11;
          if (!d11) return { data: null, error: { message: "Session token must be provided.", cause: { reason: "missing-session-token" } } };
          if (!e11) return { data: null, error: { message: "Refresh token must be provided.", cause: { reason: "missing-refresh-token" } } };
          let { data: f11, errors: g11 } = c3(d11);
          if (!f11 || g11) return { data: null, error: { message: "Unable to decode the expired session token.", cause: { reason: "expired-session-token-decode-failed", errors: g11 } } };
          if (!f11?.payload?.sid) return { data: null, error: { message: "Expired session token is missing the `sid` claim.", cause: { reason: "expired-session-token-missing-sid-claim" } } };
          try {
            return { data: (await b10.apiClient.sessions.refreshSession(f11.payload.sid, { format: "cookie", suffixed_cookies: c11.usesSuffixedCookies(), expired_token: d11 || "", refresh_token: e11 || "", request_origin: c11.clerkUrl.origin, request_headers: Object.fromEntries(Array.from(a10.headers.entries()).map(([a11, b11]) => [a11, [b11]])) })).cookies, error: null };
          } catch (a11) {
            if (!a11?.errors?.length) return { data: null, error: { message: "Unexpected Server/BAPI error", cause: { reason: "unexpected-bapi-error", errors: [a11] } } };
            if ("unexpected_error" === a11.errors[0].code) return { data: null, error: { message: "Fetch unexpected error", cause: { reason: "fetch-error", errors: a11.errors } } };
            return { data: null, error: { message: a11.errors[0].code, cause: { reason: a11.errors[0].code, errors: a11.errors } } };
          }
        }
        async function j10(a11) {
          let { data: b11, error: c11 } = await i10(a11);
          if (!b11 || 0 === b11.length) return { data: null, error: c11 };
          let d11 = new Headers(), e11 = "";
          b11.forEach((a12) => {
            d11.append("Set-Cookie", a12), hf(a12).startsWith(dx.Session) && (e11 = hg(a12));
          });
          let { data: f11, errors: g11 } = await hh(e11, a11);
          return g11 ? { data: null, error: { message: "Clerk: unable to verify refreshed session token.", cause: { reason: "invalid-session-token", errors: g11 } } } : { data: { jwtPayload: f11, sessionToken: e11, headers: d11 }, error: null };
        }
        function k2(a11, b11, c11, d11) {
          if (!h10.isRequestEligibleForHandshake()) return g8({ tokenType: d3, authenticateContext: a11, reason: b11, message: c11 });
          let e11 = d11 ?? h10.buildRedirectToHandshake(b11);
          return (e11.get(dT) && e11.set(dH, "no-store"), h10.checkAndTrackRedirectLoop(e11)) ? (console.log("Clerk: Refreshing the session token resulted in an infinite redirect loop. This usually means that your Clerk instance keys do not match - make sure to copy the correct publishable and secret keys from the Clerk dashboard."), g8({ tokenType: d3, authenticateContext: a11, reason: b11, message: c11 })) : function(a12, b12, c12 = "", d12) {
            return g9({ status: g2, reason: b12, message: c12, publishableKey: a12.publishableKey || "", isSatellite: a12.isSatellite || false, domain: a12.domain || "", proxyUrl: a12.proxyUrl || "", signInUrl: a12.signInUrl || "", signUpUrl: a12.signUpUrl || "", afterSignInUrl: a12.afterSignInUrl || "", afterSignUpUrl: a12.afterSignUpUrl || "", isSignedIn: false, isAuthenticated: false, tokenType: d3, toAuth: () => null, headers: d12, token: null });
          }(a11, b11, c11, e11);
        }
        async function l2() {
          let { tokenInHeader: a11 } = c10;
          if (eV(a11) || eW(a11)) return g8({ tokenType: d3, authenticateContext: c10, reason: g5, message: "" });
          try {
            let { data: b11, errors: d11 } = await hh(a11, c10);
            if (d11) throw d11[0];
            return g7({ tokenType: d3, authenticateContext: c10, sessionClaims: b11, headers: new Headers(), token: a11 });
          } catch (a12) {
            return n2(a12, "header");
          }
        }
        async function m2() {
          let a11 = c10.clientUat, b11 = !!c10.sessionTokenInCookie, d11 = !!c10.devBrowserToken;
          if (c10.handshakeNonce || c10.handshakeToken) try {
            return await h10.resolveHandshake();
          } catch (a12) {
            a12 instanceof cO && "development" === c10.instanceType ? h10.handleTokenVerificationErrorInDevelopment(a12) : console.error("Clerk: unable to resolve handshake:", a12);
          }
          let e11 = c10.isSatellite && "document" === c10.secFetchDest && "GET" === c10.method, f11 = c10.clerkUrl.searchParams.get(dy.ClerkSynced), i11 = f11 === dz.NeedsSync, j11 = f11 === dz.Completed, l3 = b11 || a11, m3 = true !== c10.satelliteAutoSync && !l3 && !i11;
          if ("production" === c10.instanceType && e11 && !j11) {
            if (m3) return g8({ tokenType: d3, authenticateContext: c10, reason: g4 });
            if (!l3 || i11) return k2(c10, g3, "");
          }
          if ("development" === c10.instanceType && e11 && !j11) {
            if (m3) return g8({ tokenType: d3, authenticateContext: c10, reason: g4 });
            if (!l3 || i11) {
              let a12 = new URL(c10.signInUrl);
              return a12.searchParams.append(dy.ClerkRedirectUrl, c10.clerkUrl.toString()), k2(c10, g3, "", new Headers({ [dT]: a12.toString() }));
            }
          }
          let o3 = new URL(c10.clerkUrl).searchParams.get(dy.ClerkRedirectUrl);
          if ("development" === c10.instanceType && !c10.isSatellite && o3) {
            let a12 = new URL(o3);
            return c10.devBrowserToken && a12.searchParams.append(dy.DevBrowser, c10.devBrowserToken), a12.searchParams.set(dy.ClerkSynced, dz.Completed), k2(c10, "primary-responds-to-syncing", "", new Headers({ [dT]: a12.toString() }));
          }
          if ("development" === c10.instanceType && c10.clerkUrl.searchParams.has(dy.DevBrowser)) return k2(c10, "dev-browser-sync", "");
          if ("development" === c10.instanceType && !d11) return k2(c10, "dev-browser-missing", "");
          if (!a11 && !b11) return g8({ tokenType: d3, authenticateContext: c10, reason: g4 });
          if (!a11 && b11) return k2(c10, "session-token-but-no-client-uat", "");
          if (a11 && !b11) return k2(c10, "client-uat-but-no-session-token", "");
          let { data: p3, errors: q3 } = c3(c10.sessionTokenInCookie);
          if (q3) return n2(q3[0], "cookie");
          if (p3.payload.iat < c10.clientUat) return k2(c10, "session-token-iat-before-client-uat", "");
          try {
            var r2;
            let { data: a12, errors: b12 } = await hh(c10.sessionTokenInCookie, c10);
            if (b12) throw b12[0];
            a12.azp || (r2 = "Clerk: Session token from cookie is missing the azp claim. In a future version of Clerk, this token will be considered invalid. Please contact Clerk support if you see this warning.", dg.has(r2) || (dg.add(r2), console.warn(r2)));
            let d12 = g7({ tokenType: d3, authenticateContext: c10, sessionClaims: a12, headers: new Headers(), token: c10.sessionTokenInCookie });
            if (!c10.isSatellite && "GET" === c10.method && "document" === c10.secFetchDest && c10.isCrossOriginReferrer() && !c10.isKnownClerkReferrer() && 0 === c10.handshakeRedirectLoopCounter) return k2(c10, "primary-domain-cross-origin-sync", "Cross-origin request from satellite domain requires handshake");
            let e12 = d12.toAuth();
            if (e12.userId) {
              let a13 = function(a14, b13) {
                let c11 = g10.findTarget(a14.clerkUrl);
                if (!c11) return null;
                let d13 = false;
                if ("organization" === c11.type && (c11.organizationSlug && c11.organizationSlug !== b13.orgSlug && (d13 = true), c11.organizationId && c11.organizationId !== b13.orgId && (d13 = true)), "personalAccount" === c11.type && b13.orgId && (d13 = true), !d13) return null;
                if (a14.handshakeRedirectLoopCounter >= 3) return console.warn("Clerk: Organization activation handshake loop detected. This is likely due to an invalid organization ID or slug. Skipping organization activation."), null;
                let e13 = k2(a14, "active-organization-mismatch", "");
                return "handshake" !== e13.status ? null : e13;
              }(c10, e12);
              if (a13) return a13;
            }
            return d12;
          } catch (a12) {
            return n2(a12, "cookie");
          }
        }
        async function n2(b11, d11) {
          let e11;
          if (!(b11 instanceof cO)) return g8({ tokenType: d3, authenticateContext: c10, reason: g6 });
          if (b11.reason === cD && c10.refreshTokenInCookie && "GET" === a10.method) {
            let { data: a11, error: b12 } = await j10(c10);
            if (a11) return g7({ tokenType: d3, authenticateContext: c10, sessionClaims: a11.jwtPayload, headers: a11.headers, token: a11.sessionToken });
            e11 = b12?.cause?.reason ? b12.cause.reason : "unexpected-sdk-error";
          } else e11 = "GET" !== a10.method ? "non-eligible-non-get" : c10.refreshTokenInCookie ? null : "non-eligible-no-refresh-cookie";
          return (b11.tokenCarrier = d11, [cD, cG, cH].includes(b11.reason)) ? k2(c10, hu({ tokenError: b11.reason, refreshError: e11 }), b11.getFullMessage()) : g8({ tokenType: d3, authenticateContext: c10, reason: b11.reason, message: b11.getFullMessage() });
        }
        function o2(a11, b11) {
          return b11 instanceof cS ? g8({ tokenType: a11, authenticateContext: c10, reason: b11.code, message: b11.getFullMessage() }) : g8({ tokenType: a11, authenticateContext: c10, reason: g6 });
        }
        async function p2() {
          let { tokenInHeader: a11 } = c10;
          if (!a11) return n2(Error("Missing token in header"), "header");
          if (!eY(a11)) return g8({ tokenType: d10, authenticateContext: c10, reason: g5, message: "" });
          let b11 = hr(eZ(a11), d10, c10);
          if (b11) return b11;
          let { data: e11, tokenType: f11, errors: g11 } = await hm(a11, c10);
          return g11 ? o2(f11, g11[0]) : g7({ tokenType: f11, authenticateContext: c10, machineData: e11, token: a11 });
        }
        async function q2() {
          let { tokenInHeader: a11 } = c10;
          if (!a11) return n2(Error("Missing token in header"), "header");
          if (eY(a11)) {
            let b12 = hr(eZ(a11), d10, c10);
            if (b12) return b12;
            let { data: e12, tokenType: f11, errors: g11 } = await hm(a11, c10);
            return g11 ? o2(f11, g11[0]) : g7({ tokenType: f11, authenticateContext: c10, machineData: e12, token: a11 });
          }
          let { data: b11, errors: e11 } = await hh(a11, c10);
          return e11 ? n2(e11[0], "header") : g7({ tokenType: d3, authenticateContext: c10, sessionClaims: b11, token: a11 });
        }
        if (Array.isArray(d10) && !function(a11, b11) {
          let c11 = null, { tokenInHeader: d11 } = b11;
          return d11 && (c11 = eY(d11) ? eZ(d11) : d3), e$(c11 ?? d3, a11);
        }(d10, c10)) {
          let a11;
          return a11 = g_(), g9({ status: g1, reason: g5, message: "", proxyUrl: "", publishableKey: "", isSatellite: false, domain: "", signInUrl: "", signUpUrl: "", afterSignInUrl: "", afterSignUpUrl: "", isSignedIn: false, isAuthenticated: false, tokenType: null, toAuth: () => a11, headers: new Headers(), token: null });
        }
        return c10.tokenInHeader ? "any" === d10 || Array.isArray(d10) ? q2() : d10 === d3 ? l2() : p2() : d10 === d6 || d10 === d4 || d10 === d5 ? g8({ tokenType: d10, authenticateContext: c10, reason: "No token in header" }) : m2();
      }, ht = (a10) => {
        let { isSignedIn: b10, isAuthenticated: c10, proxyUrl: d10, reason: e10, message: f10, publishableKey: g10, isSatellite: h10, domain: i10 } = a10;
        return { isSignedIn: b10, isAuthenticated: c10, proxyUrl: d10, reason: e10, message: f10, publishableKey: g10, isSatellite: h10, domain: i10 };
      }, hu = ({ tokenError: a10, refreshError: b10 }) => {
        switch (a10) {
          case cD:
            return `session-token-expired-refresh-${b10}`;
          case cG:
            return "session-token-nbf";
          case cH:
            return "session-token-iat-in-the-future";
          default:
            return g6;
        }
      }, hv = { secretKey: "", machineSecretKey: "", jwtKey: "", apiUrl: void 0, apiVersion: void 0, proxyUrl: "", publishableKey: "", isSatellite: false, domain: "", audience: "" }, hw = /* @__PURE__ */ new Set(["connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "te", "trailer", "transfer-encoding", "upgrade"]);
      function hx(a10) {
        let b10 = a10.get("connection");
        return b10 ? new Set(b10.split(",").map((a11) => a11.trim().toLowerCase()).filter((a11) => a11.length > 0)) : /* @__PURE__ */ new Set();
      }
      var hy = /* @__PURE__ */ new Set(["content-encoding", "content-length"]);
      function hz(a10) {
        for (; a10.endsWith("/"); ) a10 = a10.slice(0, -1);
        return a10;
      }
      function hA(a10, b10, c10) {
        return new Response(JSON.stringify({ errors: [{ code: a10, message: b10 }] }), { status: c10, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
      }
      async function hB(a10, b10) {
        let c10, d10, e10, f10 = hz(b10?.proxyPath || cg), g10 = b10?.publishableKey || ("u" > typeof process ? process.env?.CLERK_PUBLISHABLE_KEY : void 0), h10 = b10?.secretKey || ("u" > typeof process ? process.env?.CLERK_SECRET_KEY : void 0);
        if (!g10) return hA("proxy_configuration_error", "Missing publishableKey. Provide it in options or set CLERK_PUBLISHABLE_KEY environment variable.", 500);
        if (!h10) return hA("proxy_configuration_error", "Missing secretKey. Provide it in options or set CLERK_SECRET_KEY environment variable.", 500);
        let i10 = new URL(a10.url);
        if (!(i10.pathname === f10 || i10.pathname.startsWith(f10 + "/"))) return hA("proxy_path_mismatch", `Request path "${i10.pathname}" does not match proxy path "${f10}"`, 400);
        let j10 = (c10 = ck(g10)?.frontendApi, c10?.startsWith("clerk.") && b9.some((a11) => c10?.endsWith(a11)) ? cf : cc.some((a11) => c10?.endsWith(a11)) ? "https://frontend-api.lclclerk.com" : cd.some((a11) => c10?.endsWith(a11)) ? "https://frontend-api.clerkstage.dev" : cf), k2 = new URL(j10).host, l2 = i10.pathname.slice(f10.length) || "/", m2 = new URL(`${j10}${l2}`);
        if (m2.search = i10.search, m2.host !== k2) return hA("proxy_request_failed", "Resolved target does not match the expected host", 400);
        let n2 = new Headers(), o2 = hx(a10.headers);
        a10.headers.forEach((a11, b11) => {
          let c11 = b11.toLowerCase();
          hw.has(c11) || o2.has(c11) || n2.set(b11, a11);
        });
        let p2 = (d10 = a10.headers.get("x-forwarded-proto")?.split(",")[0]?.trim(), e10 = a10.headers.get("x-forwarded-host")?.split(",")[0]?.trim(), d10 && e10 ? `${d10}://${e10}` : i10.origin), q2 = `${p2}${f10}`;
        n2.set("Clerk-Proxy-Url", q2), n2.set("Clerk-Secret-Key", h10), n2.set("Host", k2), n2.set("Accept-Encoding", "identity"), n2.has("X-Forwarded-Host") || n2.set("X-Forwarded-Host", i10.host), n2.has("X-Forwarded-Proto") || n2.set("X-Forwarded-Proto", i10.protocol.replace(":", ""));
        let r2 = function(a11) {
          let b11 = a11.headers.get("cf-connecting-ip");
          if (b11) return b11;
          let c11 = a11.headers.get("x-real-ip");
          if (c11) return c11;
          let d11 = a11.headers.get("x-forwarded-for");
          if (d11) return d11.split(",")[0]?.trim();
        }(a10);
        r2 && n2.set("X-Forwarded-For", r2);
        let s2 = null !== a10.body;
        try {
          let b11 = { method: a10.method, headers: n2, redirect: "manual" };
          s2 && (b11.duplex = "half", b11.body = a10.body);
          let c11 = await fetch(m2.toString(), b11), d11 = hx(c11.headers), e11 = new Headers();
          c11.headers.forEach((a11, b12) => {
            let c12 = b12.toLowerCase();
            hw.has(c12) || hy.has(c12) || d11.has(c12) || ("set-cookie" === c12 ? e11.append(b12, a11) : e11.set(b12, a11));
          });
          let f11 = c11.headers.get("location");
          if (f11) try {
            let a11 = new URL(f11, j10);
            if (a11.host === k2) {
              let b12 = `${q2}${a11.pathname}${a11.search}${a11.hash}`;
              e11.set("Location", b12);
            }
          } catch {
          }
          let g11 = new Response(c11.body, { status: c11.status, statusText: c11.statusText, headers: e11 });
          for (let a11 of hy) g11.headers.delete(a11);
          return g11;
        } catch (b11) {
          let a11 = b11 instanceof Error ? b11.message : "Unknown error";
          return hA("proxy_request_failed", `Failed to proxy request to Clerk FAPI: ${a11}`, 502);
        }
      }
      c(507), c(213), c(319).s;
      var hC = c(833);
      let hD = `${hC.s8};404`;
      c(543).X, c(990), "u" < typeof URLPattern || URLPattern, c(673), c(20), c(743), c(930), c(888);
      let hE = "x-middleware-rewrite", hF = "x-middleware-next", hG = "Location", hH = "next-url", hI = "next-action", hJ = "x-nextjs-data", hK = (a10, b10, c10) => (a10.headers.set(b10, c10), a10), hL = "__clerk_db_jwt", hM = /* @__PURE__ */ new Set(["sessionToken", "tokenInHeader", "sessionTokenInCookie", "secretKey", "jwtKey"]), hN = (a10) => {
        if (!a10 || "string" != typeof a10) return a10;
        try {
          return (a10 || "").replace(/^(sk_(live|test)_)(.+?)(.{3})$/, "$1*********$4");
        } catch {
          return "";
        }
      }, hO = (a10, b10) => b10 && hM.has(b10) && "string" == typeof a10 ? a10.substring(0, 7) : Array.isArray(a10) ? a10.map((a11) => hO(a11)) : a10 && "object" == typeof a10 ? Object.fromEntries(Object.entries(a10).map(([a11, b11]) => [a11, hO(b11, a11)])) : hN(a10), hP = (a10) => (Array.isArray(a10) ? a10 : [a10]).map((a11) => "string" == typeof a11 ? hN(a11) : JSON.stringify(hO(a11), null, 2)).join(", "), hQ = (a10, b10) => (...c10) => {
        let d10 = ("string" == typeof a10 ? () => {
          let b11 = [], c11 = false;
          return { enable: () => {
            c11 = true;
          }, debug: (...a11) => {
            c11 && b11.push(a11.map((a12) => "function" == typeof a12 ? a12() : a12));
          }, commit: () => {
            if (c11) {
              var d11, e11;
              for (let c12 of (console.log((d11 = a10, `[clerk debug start: ${d11}]`)), b11)) {
                let a11 = hP(c12);
                a11 = a11.split("\n").map((a12) => `  ${a12}`).join("\n"), process.env.VERCEL && (a11 = function(a12) {
                  let b12 = new TextEncoder(), c13 = new TextDecoder("utf-8"), d12 = b12.encode(a12).slice(0, 4096);
                  return c13.decode(d12).replace(/\uFFFD/g, "");
                }(a11)), console.log(a11);
              }
              console.log((e11 = a10, `[clerk debug end: ${e11}] (@clerk/nextjs=7.5.13,next=16.2.6,timestamp=${Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3)})`));
            }
          } };
        } : a10)(), e10 = b10(d10);
        try {
          let a11 = e10(...c10);
          if ("object" == typeof a11 && "then" in a11 && "function" == typeof a11.then) return a11.then((a12) => (d10.commit(), a12)).catch((a12) => {
            throw d10.commit(), a12;
          });
          return d10.commit(), a11;
        } catch (a11) {
          throw d10.commit(), a11;
        }
      };
      function hR(a10, b10, c10) {
        return "function" == typeof a10 ? a10(b10) : void 0 !== a10 ? a10 : void 0 !== c10 ? c10 : void 0;
      }
      let hS = (a10) => {
        let b10 = (c10) => {
          if (!c10) return c10;
          if (Array.isArray(c10)) return c10.map((a11) => "object" == typeof a11 || Array.isArray(a11) ? b10(a11) : a11);
          let d10 = { ...c10 };
          for (let c11 of Object.keys(d10)) {
            let e10 = a10(c11.toString());
            e10 !== c11 && (d10[e10] = d10[c11], delete d10[c11]), "object" == typeof d10[e10] && (d10[e10] = b10(d10[e10]));
          }
          return d10;
        };
        return b10;
      };
      function hT(a10) {
        if ("boolean" == typeof a10) return a10;
        if (null == a10) return false;
        if ("string" == typeof a10) {
          if ("true" === a10.toLowerCase()) return true;
          if ("false" === a10.toLowerCase()) return false;
        }
        let b10 = parseInt(a10, 10);
        return !isNaN(b10) && b10 > 0;
      }
      hS(function(a10) {
        return a10 ? a10.replace(/[A-Z]/g, (a11) => `_${a11.toLowerCase()}`) : "";
      }), hS(function(a10) {
        return a10 ? a10.replace(/([-_][a-z])/g, (a11) => a11.toUpperCase().replace(/-|_/, "")) : "";
      }), process.env.NEXT_PUBLIC_CLERK_JS_VERSION, process.env.NEXT_PUBLIC_CLERK_JS_URL, process.env.NEXT_PUBLIC_CLERK_UI_URL, process.env.NEXT_PUBLIC_CLERK_UI_VERSION;
      let hU = process.env.CLERK_API_VERSION || "v1", hV = process.env.CLERK_SECRET_KEY || "", hW = process.env.CLERK_MACHINE_SECRET_KEY || "", hX = "pk_live_Y2xlcmsucHVsc2VwaW5nLnN1Ym5ldG1hc2sudGVjaCQ", hY = process.env.CLERK_ENCRYPTION_KEY || "", hZ = process.env.CLERK_API_URL || (m = ck(hX)?.frontendApi, m?.startsWith("clerk.") && b9.some((a10) => m?.endsWith(a10)) ? ce : cc.some((a10) => m?.endsWith(a10)) ? "https://api.lclclerk.com" : cd.some((a10) => m?.endsWith(a10)) ? "https://api.clerkstage.dev" : ce), h$ = process.env.NEXT_PUBLIC_CLERK_DOMAIN || "", h_ = process.env.NEXT_PUBLIC_CLERK_PROXY_URL || "", h0 = hT(process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE) || false, h1 = "/sign-in", h2 = "/sign-up", h3 = hT(process.env.NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED), h4 = hT(process.env.NEXT_PUBLIC_CLERK_TELEMETRY_DEBUG), h5 = hT(process.env.NEXT_PUBLIC_CLERK_KEYLESS_DISABLED) || false, h6 = false, h7 = Symbol.for("clerk_use_cache_error");
      class h8 extends (iP = Error, iO = h7, iP) {
        constructor(a10, b10) {
          super(a10), this.originalError = b10, this[iO] = true, this.name = "ClerkUseCacheError";
        }
      }
      let h9 = /inside\s+["']use cache["']|["']use cache["'].*(?:headers|cookies)|(?:headers|cookies).*["']use cache["']/i, ia = /cache scope/i, ib = /dynamic data source/i, ic = /Route .*? needs to bail out of prerendering at this point because it used .*?./, id = (a10) => {
        if (!(a10 instanceof Error) || !("message" in a10)) return false;
        let { message: b10 } = a10, c10 = b10.toLowerCase();
        return ic.test(b10) || c10.includes("dynamic server usage") || c10.includes("this page needs to bail out of prerendering") || c10.includes("during prerendering");
      }, ie = `Clerk: auth() and currentUser() cannot be called inside a "use cache" function. These functions access \`headers()\` internally, which is a dynamic API not allowed in cached contexts.

To fix this, call auth() outside the cached function and pass the values you need as arguments:

  import { auth, clerkClient } from '@clerk/nextjs/server';

  async function getCachedUser(userId: string) {
    "use cache";
    const client = await clerkClient();
    return client.users.getUser(userId);
  }

  // In your component/page:
  const { userId } = await auth();
  if (userId) {
    const user = await getCachedUser(userId);
  }`;
      async function ig() {
        try {
          let { headers: a10 } = await Promise.resolve().then(c.bind(c, 582)), b10 = await a10();
          return new _("https://placeholder.com", { headers: b10 });
        } catch (a10) {
          if (a10 && id(a10)) throw a10;
          if (a10 && ((a11) => {
            if (!(a11 instanceof Error)) return false;
            let { message: b10 } = a11;
            return !!(h9.test(b10) || ia.test(b10) && ib.test(b10));
          })(a10)) throw new h8(`${ie}

Original error: ${a10.message}`, a10);
          throw Error(`Clerk: auth(), currentUser() and clerkClient(), are only supported in App Router (/app directory).
If you're using /pages, try getAuth() instead.
Original error: ${a10}`);
        }
      }
      let ih = Symbol.for("@clerk/shared.telemetryNoticeShown"), ii = ["Attention: Clerk collects telemetry data from its SDKs when connected to development instances.", "The data collected is used to inform Clerk's product roadmap.", "To learn more, including how to opt-out from the telemetry program, visit: https://clerk.com/docs/telemetry."];
      var ij = class {
        #b;
        #c = 864e5;
        constructor(a10) {
          this.#b = a10;
        }
        isEventThrottled(a10) {
          let b10 = Date.now(), c10 = this.#d(a10), d10 = this.#b.getItem(c10);
          return !!d10 && !(b10 - d10 > this.#c) || (this.#b.setItem(c10, b10), false);
        }
        #d(a10) {
          let { sk: b10, pk: c10, payload: d10, ...e10 } = a10, f10 = { ...d10, ...e10 };
          return JSON.stringify(Object.keys({ ...d10, ...e10 }).sort().map((a11) => f10[a11]));
        }
      }, ik = class {
        #e = "clerk_telemetry_throttler";
        getItem(a10) {
          return this.#f()[a10];
        }
        setItem(a10, b10) {
          try {
            let c10 = this.#f();
            c10[a10] = b10, localStorage.setItem(this.#e, JSON.stringify(c10));
          } catch (a11) {
            a11 instanceof DOMException && ("QuotaExceededError" === a11.name || "NS_ERROR_DOM_QUOTA_REACHED" === a11.name) && localStorage.length > 0 && localStorage.removeItem(this.#e);
          }
        }
        removeItem(a10) {
          try {
            let b10 = this.#f();
            delete b10[a10], localStorage.setItem(this.#e, JSON.stringify(b10));
          } catch {
          }
        }
        #f() {
          try {
            let a10 = localStorage.getItem(this.#e);
            if (!a10) return {};
            return JSON.parse(a10);
          } catch {
            return {};
          }
        }
        static isSupported() {
          return "u" > typeof window && !!window.localStorage;
        }
      }, il = class {
        #b = /* @__PURE__ */ new Map();
        #g = 1e4;
        getItem(a10) {
          return this.#b.size > this.#g ? void this.#b.clear() : this.#b.get(a10);
        }
        setItem(a10, b10) {
          this.#b.set(a10, b10);
        }
        removeItem(a10) {
          this.#b.delete(a10);
        }
      };
      let im = /* @__PURE__ */ new Set(["error", "warn", "info", "debug", "trace"]);
      var io = class {
        #h;
        #i;
        #j = {};
        #k = [];
        #l = null;
        constructor(a10) {
          this.#h = { maxBufferSize: a10.maxBufferSize ?? 5, samplingRate: a10.samplingRate ?? 1, perEventSampling: a10.perEventSampling ?? true, disabled: a10.disabled ?? false, debug: a10.debug ?? false, endpoint: "https://clerk-telemetry.com" }, !a10.clerkVersion && "u" < typeof window ? this.#j.clerkVersion = "" : this.#j.clerkVersion = a10.clerkVersion ?? "", this.#j.sdk = a10.sdk, this.#j.sdkVersion = a10.sdkVersion, this.#j.publishableKey = a10.publishableKey ?? "";
          const b10 = ck(a10.publishableKey);
          b10 && (this.#j.instanceType = b10.instanceType), a10.secretKey && (this.#j.secretKey = a10.secretKey.substring(0, 16));
          const c10 = ik.isSupported() ? new ik() : new il();
          this.#i = new ij(c10), function(a11 = {}) {
            if (!a11.skip) try {
              if ("u" > typeof window || void 0 !== globalThis.EdgeRuntime || !("u" < typeof process) && process.env && b5.some((a12) => hT(process.env[a12])) || globalThis[ih]) return;
              if ("u" > typeof console && "function" == typeof console.log) {
                for (let a12 of ii) console.log(a12);
                console.log("");
              }
              globalThis[ih] = true;
            } catch {
            }
          }({ skip: !this.isEnabled });
        }
        get isEnabled() {
          return !("development" !== this.#j.instanceType || this.#h.disabled || "u" > typeof process && process.env && hT(process.env.CLERK_TELEMETRY_DISABLED) || "u" > typeof window && window?.navigator?.webdriver);
        }
        get isDebug() {
          return this.#h.debug || "u" > typeof process && process.env && hT(process.env.CLERK_TELEMETRY_DEBUG);
        }
        record(a10) {
          try {
            let b10 = this.#m(a10.event, a10.payload);
            if (this.#n(b10.event, b10), !this.#o(b10, a10.eventSamplingRate)) return;
            this.#k.push({ kind: "event", value: b10 }), this.#p();
          } catch (a11) {
            console.error("[clerk/telemetry] Error recording telemetry event", a11);
          }
        }
        recordLog(a10) {
          try {
            if (!this.#q(a10)) return;
            let b10 = "string" == typeof a10?.level && im.has(a10.level), c10 = "string" == typeof a10?.message && a10.message.trim().length > 0, d10 = null, e10 = a10?.timestamp;
            if ("number" == typeof e10 || "string" == typeof e10) {
              let a11 = new Date(e10);
              Number.isNaN(a11.getTime()) || (d10 = a11);
            }
            if (!b10 || !c10 || null === d10) {
              this.isDebug && "u" > typeof console && console.warn("[clerk/telemetry] Dropping invalid telemetry log entry", { levelIsValid: b10, messageIsValid: c10, timestampIsValid: null !== d10 });
              return;
            }
            let f10 = this.#r(), g10 = { sdk: f10.name, sdkv: f10.version, cv: this.#j.clerkVersion ?? "", lvl: a10.level, msg: a10.message, ts: d10.toISOString(), pk: this.#j.publishableKey || null, payload: this.#s(a10.context) };
            this.#k.push({ kind: "log", value: g10 }), this.#p();
          } catch (a11) {
            console.error("[clerk/telemetry] Error recording telemetry log entry", a11);
          }
        }
        #o(a10, b10) {
          return this.isEnabled && !this.isDebug && this.#t(a10, b10);
        }
        #q(a10) {
          return true;
        }
        #t(a10, b10) {
          let c10 = Math.random();
          return !!(c10 <= this.#h.samplingRate && (false === this.#h.perEventSampling || void 0 === b10 || c10 <= b10)) && !this.#i.isEventThrottled(a10);
        }
        #p() {
          if ("u" < typeof window) return void this.#u();
          if (this.#k.length >= this.#h.maxBufferSize) {
            this.#l && ("u" > typeof cancelIdleCallback ? cancelIdleCallback(Number(this.#l)) : clearTimeout(Number(this.#l))), this.#u();
            return;
          }
          this.#l || ("requestIdleCallback" in window ? this.#l = requestIdleCallback(() => {
            this.#u(), this.#l = null;
          }) : this.#l = setTimeout(() => {
            this.#u(), this.#l = null;
          }, 0));
        }
        #u() {
          let a10 = [...this.#k];
          if (this.#k = [], this.#l = null, 0 === a10.length) return;
          let b10 = a10.filter((a11) => "event" === a11.kind).map((a11) => a11.value), c10 = a10.filter((a11) => "log" === a11.kind).map((a11) => a11.value);
          b10.length > 0 && fetch(new URL("/v1/event", this.#h.endpoint), { headers: { "Content-Type": "application/json" }, keepalive: true, method: "POST", body: JSON.stringify({ events: b10 }) }).catch(() => void 0), c10.length > 0 && fetch(new URL("/v1/logs", this.#h.endpoint), { headers: { "Content-Type": "application/json" }, keepalive: true, method: "POST", body: JSON.stringify({ logs: c10 }) }).catch(() => void 0);
        }
        #n(a10, b10) {
          this.isDebug && (void 0 !== console.groupCollapsed ? (console.groupCollapsed("[clerk/telemetry]", a10), console.log(b10), console.groupEnd()) : console.log("[clerk/telemetry]", a10, b10));
        }
        #r() {
          let a10 = { name: this.#j.sdk, version: this.#j.sdkVersion };
          if ("u" > typeof window) {
            let b10 = window;
            if (b10.Clerk) {
              let c10 = b10.Clerk;
              if ("object" == typeof c10 && null !== c10 && "constructor" in c10 && "function" == typeof c10.constructor && c10.constructor.sdkMetadata) {
                let { name: b11, version: d10 } = c10.constructor.sdkMetadata;
                void 0 !== b11 && (a10.name = b11), void 0 !== d10 && (a10.version = d10);
              }
            }
          }
          return a10;
        }
        #m(a10, b10) {
          let c10 = this.#r();
          return { event: a10, cv: this.#j.clerkVersion ?? "", it: this.#j.instanceType ?? "", sdk: c10.name, sdkv: c10.version, ...this.#j.publishableKey ? { pk: this.#j.publishableKey } : {}, ...this.#j.secretKey ? { sk: this.#j.secretKey } : {}, payload: b10 };
        }
        #s(a10) {
          if (null == a10 || "object" != typeof a10) return null;
          try {
            let b10 = JSON.parse(JSON.stringify(a10));
            if (b10 && "object" == typeof b10 && !Array.isArray(b10)) return b10;
            return null;
          } catch {
            return null;
          }
        }
      };
      let ip = { secretKey: hV, publishableKey: hX, apiUrl: hZ, apiVersion: hU, userAgent: "@clerk/nextjs@7.5.13", proxyUrl: h_, domain: h$, isSatellite: h0, machineSecretKey: hW, sdkMetadata: { name: "@clerk/nextjs", version: "7.5.13", environment: "production" }, telemetry: { disabled: h3, debug: h4 } }, iq = (a10) => {
        var b10;
        let c10, d10, e10, f10, g10, h10;
        return d10 = gX(c10 = { ...ip, ...a10 }), e10 = d1(hv, (b10 = { options: c10, apiClient: d10 }).options), f10 = b10.apiClient, g10 = { authenticateRequest: (a11, b11 = {}) => {
          let { apiUrl: c11, apiVersion: d11 } = e10, g11 = d1(e10, b11);
          return hs(a11, { ...b11, ...g11, apiUrl: c11, apiVersion: d11, apiClient: f10 });
        }, debugRequestState: ht }, h10 = new io({ publishableKey: c10.publishableKey, secretKey: c10.secretKey, samplingRate: 0.1, ...c10.sdkMetadata ? { sdk: c10.sdkMetadata.name, sdkVersion: c10.sdkMetadata.version } : {}, ...c10.telemetry || {} }), { ...d10, ...g10, telemetry: h10 };
      };
      function ir(a10, b10) {
        var c10, d10;
        return function(a11) {
          try {
            let { headers: b11, nextUrl: c11, cookies: d11 } = a11 || {};
            return "function" == typeof (null == b11 ? void 0 : b11.get) && "function" == typeof (null == c11 ? void 0 : c11.searchParams.get) && "function" == typeof (null == d11 ? void 0 : d11.get);
          } catch {
            return false;
          }
        }(a10) || function(a11) {
          try {
            let { headers: b11 } = a11 || {};
            return "function" == typeof (null == b11 ? void 0 : b11.get);
          } catch {
            return false;
          }
        }(a10) ? a10.headers.get(b10) : a10.headers[b10] || a10.headers[b10.toLowerCase()] || (null == (d10 = null == (c10 = a10.socket) ? void 0 : c10._httpMessage) ? void 0 : d10.getHeader(b10));
      }
      var is = c(521);
      let it = /* @__PURE__ */ new Map(), iu = new is.AsyncLocalStorage();
      var iv, iw, ix, iy, iz, iA, iB, iC, iD, iE, iF, iG, iH, iI, iJ, iK, iL, iM, iN, iO, iP, iQ, iR, iS, iT, iU, iV, iW, iX = Object.defineProperty, iY = (null == (iQ = "u" > typeof globalThis ? globalThis : void 0) ? void 0 : iQ.crypto) || (null == (iR = void 0 !== c.g ? c.g : void 0) ? void 0 : iR.crypto) || (null == (iS = "u" > typeof window ? window : void 0) ? void 0 : iS.crypto) || (null == (iT = "u" > typeof self ? self : void 0) ? void 0 : iT.crypto) || (null == (iV = null == (iU = "u" > typeof frames ? frames : void 0) ? void 0 : iU[0]) ? void 0 : iV.crypto);
      iW = iY ? (a10) => {
        let b10 = [];
        for (let c10 = 0; c10 < a10; c10 += 4) b10.push(iY.getRandomValues(new Uint32Array(1))[0]);
        return new i$(b10, a10);
      } : (a10) => {
        let b10 = [], c10 = (a11) => {
          let b11 = a11, c11 = 987654321;
          return () => {
            let a12 = ((c11 = 36969 * (65535 & c11) + (c11 >> 16) | 0) << 16) + (b11 = 18e3 * (65535 & b11) + (b11 >> 16) | 0) | 0;
            return a12 /= 4294967296, (a12 += 0.5) * (Math.random() > 0.5 ? 1 : -1);
          };
        };
        for (let d10 = 0, e10; d10 < a10; d10 += 4) {
          let a11 = c10(4294967296 * (e10 || Math.random()));
          e10 = 987654071 * a11(), b10.push(4294967296 * a11() | 0);
        }
        return new i$(b10, a10);
      };
      var iZ = class {
        static create(...a10) {
          return new this(...a10);
        }
        mixIn(a10) {
          return Object.assign(this, a10);
        }
        clone() {
          let a10 = new this.constructor();
          return Object.assign(a10, this), a10;
        }
      }, i$ = class extends iZ {
        constructor(a10 = [], b10 = 4 * a10.length) {
          super();
          let c10 = a10;
          if (c10 instanceof ArrayBuffer && (c10 = new Uint8Array(c10)), (c10 instanceof Int8Array || c10 instanceof Uint8ClampedArray || c10 instanceof Int16Array || c10 instanceof Uint16Array || c10 instanceof Int32Array || c10 instanceof Uint32Array || c10 instanceof Float32Array || c10 instanceof Float64Array) && (c10 = new Uint8Array(c10.buffer, c10.byteOffset, c10.byteLength)), c10 instanceof Uint8Array) {
            let a11 = c10.byteLength, b11 = [];
            for (let d10 = 0; d10 < a11; d10 += 1) b11[d10 >>> 2] |= c10[d10] << 24 - d10 % 4 * 8;
            this.words = b11, this.sigBytes = a11;
          } else this.words = a10, this.sigBytes = b10;
        }
        toString(a10 = i_) {
          return a10.stringify(this);
        }
        concat(a10) {
          let b10 = this.words, c10 = a10.words, d10 = this.sigBytes, e10 = a10.sigBytes;
          if (this.clamp(), d10 % 4) for (let a11 = 0; a11 < e10; a11 += 1) {
            let e11 = c10[a11 >>> 2] >>> 24 - a11 % 4 * 8 & 255;
            b10[d10 + a11 >>> 2] |= e11 << 24 - (d10 + a11) % 4 * 8;
          }
          else for (let a11 = 0; a11 < e10; a11 += 4) b10[d10 + a11 >>> 2] = c10[a11 >>> 2];
          return this.sigBytes += e10, this;
        }
        clamp() {
          let { words: a10, sigBytes: b10 } = this;
          a10[b10 >>> 2] &= 4294967295 << 32 - b10 % 4 * 8, a10.length = Math.ceil(b10 / 4);
        }
        clone() {
          let a10 = super.clone.call(this);
          return a10.words = this.words.slice(0), a10;
        }
      };
      (n = "symbol" != typeof (o = "random") ? o + "" : o) in i$ ? iX(i$, n, { enumerable: true, configurable: true, writable: true, value: iW }) : i$[n] = iW;
      var i_ = { stringify(a10) {
        let { words: b10, sigBytes: c10 } = a10, d10 = [];
        for (let a11 = 0; a11 < c10; a11 += 1) {
          let c11 = b10[a11 >>> 2] >>> 24 - a11 % 4 * 8 & 255;
          d10.push((c11 >>> 4).toString(16)), d10.push((15 & c11).toString(16));
        }
        return d10.join("");
      }, parse(a10) {
        let b10 = a10.length, c10 = [];
        for (let d10 = 0; d10 < b10; d10 += 2) c10[d10 >>> 3] |= parseInt(a10.substr(d10, 2), 16) << 24 - d10 % 8 * 4;
        return new i$(c10, b10 / 2);
      } }, i0 = { stringify(a10) {
        let { words: b10, sigBytes: c10 } = a10, d10 = [];
        for (let a11 = 0; a11 < c10; a11 += 1) {
          let c11 = b10[a11 >>> 2] >>> 24 - a11 % 4 * 8 & 255;
          d10.push(String.fromCharCode(c11));
        }
        return d10.join("");
      }, parse(a10) {
        let b10 = a10.length, c10 = [];
        for (let d10 = 0; d10 < b10; d10 += 1) c10[d10 >>> 2] |= (255 & a10.charCodeAt(d10)) << 24 - d10 % 4 * 8;
        return new i$(c10, b10);
      } }, i1 = { stringify(a10) {
        try {
          return decodeURIComponent(escape(i0.stringify(a10)));
        } catch {
          throw Error("Malformed UTF-8 data");
        }
      }, parse: (a10) => i0.parse(unescape(encodeURIComponent(a10))) }, i2 = class extends iZ {
        constructor() {
          super(), this._minBufferSize = 0;
        }
        reset() {
          this._data = new i$(), this._nDataBytes = 0;
        }
        _append(a10) {
          let b10 = a10;
          "string" == typeof b10 && (b10 = i1.parse(b10)), this._data.concat(b10), this._nDataBytes += b10.sigBytes;
        }
        _process(a10) {
          let b10, { _data: c10, blockSize: d10 } = this, e10 = c10.words, f10 = c10.sigBytes, g10 = f10 / (4 * d10), h10 = (g10 = a10 ? Math.ceil(g10) : Math.max((0 | g10) - this._minBufferSize, 0)) * d10, i10 = Math.min(4 * h10, f10);
          if (h10) {
            for (let a11 = 0; a11 < h10; a11 += d10) this._doProcessBlock(e10, a11);
            b10 = e10.splice(0, h10), c10.sigBytes -= i10;
          }
          return new i$(b10, i10);
        }
        clone() {
          let a10 = super.clone.call(this);
          return a10._data = this._data.clone(), a10;
        }
      }, i3 = class extends i2 {
        constructor(a10) {
          super(), this.blockSize = 16, this.cfg = Object.assign(new iZ(), a10), this.reset();
        }
        static _createHelper(a10) {
          return (b10, c10) => new a10(c10).finalize(b10);
        }
        static _createHmacHelper(a10) {
          return (b10, c10) => new i4(a10, c10).finalize(b10);
        }
        reset() {
          super.reset.call(this), this._doReset();
        }
        update(a10) {
          return this._append(a10), this._process(), this;
        }
        finalize(a10) {
          return a10 && this._append(a10), this._doFinalize();
        }
      }, i4 = class extends iZ {
        constructor(a10, b10) {
          super();
          let c10 = new a10();
          this._hasher = c10;
          let d10 = b10;
          "string" == typeof d10 && (d10 = i1.parse(d10));
          let e10 = c10.blockSize, f10 = 4 * e10;
          d10.sigBytes > f10 && (d10 = c10.finalize(b10)), d10.clamp();
          let g10 = d10.clone();
          this._oKey = g10;
          let h10 = d10.clone();
          this._iKey = h10;
          let i10 = g10.words, j10 = h10.words;
          for (let a11 = 0; a11 < e10; a11 += 1) i10[a11] ^= 1549556828, j10[a11] ^= 909522486;
          g10.sigBytes = f10, h10.sigBytes = f10, this.reset();
        }
        reset() {
          let a10 = this._hasher;
          a10.reset(), a10.update(this._iKey);
        }
        update(a10) {
          return this._hasher.update(a10), this;
        }
        finalize(a10) {
          let b10 = this._hasher, c10 = b10.finalize(a10);
          return b10.reset(), b10.finalize(this._oKey.clone().concat(c10));
        }
      }, i5 = { stringify(a10) {
        let { words: b10, sigBytes: c10 } = a10, d10 = this._map;
        a10.clamp();
        let e10 = [];
        for (let a11 = 0; a11 < c10; a11 += 3) {
          let f11 = (b10[a11 >>> 2] >>> 24 - a11 % 4 * 8 & 255) << 16 | (b10[a11 + 1 >>> 2] >>> 24 - (a11 + 1) % 4 * 8 & 255) << 8 | b10[a11 + 2 >>> 2] >>> 24 - (a11 + 2) % 4 * 8 & 255;
          for (let b11 = 0; b11 < 4 && a11 + 0.75 * b11 < c10; b11 += 1) e10.push(d10.charAt(f11 >>> 6 * (3 - b11) & 63));
        }
        let f10 = d10.charAt(64);
        if (f10) for (; e10.length % 4; ) e10.push(f10);
        return e10.join("");
      }, parse(a10) {
        let b10 = a10.length, c10 = this._map, d10 = this._reverseMap;
        if (!d10) {
          this._reverseMap = [], d10 = this._reverseMap;
          for (let a11 = 0; a11 < c10.length; a11 += 1) d10[c10.charCodeAt(a11)] = a11;
        }
        let e10 = c10.charAt(64);
        if (e10) {
          let c11 = a10.indexOf(e10);
          -1 !== c11 && (b10 = c11);
        }
        var f10 = b10, g10 = d10;
        let h10 = [], i10 = 0;
        for (let b11 = 0; b11 < f10; b11 += 1) if (b11 % 4) {
          let c11 = g10[a10.charCodeAt(b11 - 1)] << b11 % 4 * 2 | g10[a10.charCodeAt(b11)] >>> 6 - b11 % 4 * 2;
          h10[i10 >>> 2] |= c11 << 24 - i10 % 4 * 8, i10 += 1;
        }
        return i$.create(h10, i10);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" }, i6 = [];
      for (let a10 = 0; a10 < 64; a10 += 1) i6[a10] = 4294967296 * Math.abs(Math.sin(a10 + 1)) | 0;
      var i7 = (a10, b10, c10, d10, e10, f10, g10) => {
        let h10 = a10 + (b10 & c10 | ~b10 & d10) + e10 + g10;
        return (h10 << f10 | h10 >>> 32 - f10) + b10;
      }, i8 = (a10, b10, c10, d10, e10, f10, g10) => {
        let h10 = a10 + (b10 & d10 | c10 & ~d10) + e10 + g10;
        return (h10 << f10 | h10 >>> 32 - f10) + b10;
      }, i9 = (a10, b10, c10, d10, e10, f10, g10) => {
        let h10 = a10 + (b10 ^ c10 ^ d10) + e10 + g10;
        return (h10 << f10 | h10 >>> 32 - f10) + b10;
      }, ja = (a10, b10, c10, d10, e10, f10, g10) => {
        let h10 = a10 + (c10 ^ (b10 | ~d10)) + e10 + g10;
        return (h10 << f10 | h10 >>> 32 - f10) + b10;
      }, jb = class extends i3 {
        _doReset() {
          this._hash = new i$([1732584193, 4023233417, 2562383102, 271733878]);
        }
        _doProcessBlock(a10, b10) {
          for (let c11 = 0; c11 < 16; c11 += 1) {
            let d11 = b10 + c11, e11 = a10[d11];
            a10[d11] = (e11 << 8 | e11 >>> 24) & 16711935 | (e11 << 24 | e11 >>> 8) & 4278255360;
          }
          let c10 = this._hash.words, d10 = a10[b10 + 0], e10 = a10[b10 + 1], f10 = a10[b10 + 2], g10 = a10[b10 + 3], h10 = a10[b10 + 4], i10 = a10[b10 + 5], j10 = a10[b10 + 6], k2 = a10[b10 + 7], l2 = a10[b10 + 8], m2 = a10[b10 + 9], n2 = a10[b10 + 10], o2 = a10[b10 + 11], p2 = a10[b10 + 12], q2 = a10[b10 + 13], r2 = a10[b10 + 14], s2 = a10[b10 + 15], t2 = c10[0], u2 = c10[1], v2 = c10[2], w2 = c10[3];
          t2 = i7(t2, u2, v2, w2, d10, 7, i6[0]), w2 = i7(w2, t2, u2, v2, e10, 12, i6[1]), v2 = i7(v2, w2, t2, u2, f10, 17, i6[2]), u2 = i7(u2, v2, w2, t2, g10, 22, i6[3]), t2 = i7(t2, u2, v2, w2, h10, 7, i6[4]), w2 = i7(w2, t2, u2, v2, i10, 12, i6[5]), v2 = i7(v2, w2, t2, u2, j10, 17, i6[6]), u2 = i7(u2, v2, w2, t2, k2, 22, i6[7]), t2 = i7(t2, u2, v2, w2, l2, 7, i6[8]), w2 = i7(w2, t2, u2, v2, m2, 12, i6[9]), v2 = i7(v2, w2, t2, u2, n2, 17, i6[10]), u2 = i7(u2, v2, w2, t2, o2, 22, i6[11]), t2 = i7(t2, u2, v2, w2, p2, 7, i6[12]), w2 = i7(w2, t2, u2, v2, q2, 12, i6[13]), v2 = i7(v2, w2, t2, u2, r2, 17, i6[14]), u2 = i7(u2, v2, w2, t2, s2, 22, i6[15]), t2 = i8(t2, u2, v2, w2, e10, 5, i6[16]), w2 = i8(w2, t2, u2, v2, j10, 9, i6[17]), v2 = i8(v2, w2, t2, u2, o2, 14, i6[18]), u2 = i8(u2, v2, w2, t2, d10, 20, i6[19]), t2 = i8(t2, u2, v2, w2, i10, 5, i6[20]), w2 = i8(w2, t2, u2, v2, n2, 9, i6[21]), v2 = i8(v2, w2, t2, u2, s2, 14, i6[22]), u2 = i8(u2, v2, w2, t2, h10, 20, i6[23]), t2 = i8(t2, u2, v2, w2, m2, 5, i6[24]), w2 = i8(w2, t2, u2, v2, r2, 9, i6[25]), v2 = i8(v2, w2, t2, u2, g10, 14, i6[26]), u2 = i8(u2, v2, w2, t2, l2, 20, i6[27]), t2 = i8(t2, u2, v2, w2, q2, 5, i6[28]), w2 = i8(w2, t2, u2, v2, f10, 9, i6[29]), v2 = i8(v2, w2, t2, u2, k2, 14, i6[30]), u2 = i8(u2, v2, w2, t2, p2, 20, i6[31]), t2 = i9(t2, u2, v2, w2, i10, 4, i6[32]), w2 = i9(w2, t2, u2, v2, l2, 11, i6[33]), v2 = i9(v2, w2, t2, u2, o2, 16, i6[34]), u2 = i9(u2, v2, w2, t2, r2, 23, i6[35]), t2 = i9(t2, u2, v2, w2, e10, 4, i6[36]), w2 = i9(w2, t2, u2, v2, h10, 11, i6[37]), v2 = i9(v2, w2, t2, u2, k2, 16, i6[38]), u2 = i9(u2, v2, w2, t2, n2, 23, i6[39]), t2 = i9(t2, u2, v2, w2, q2, 4, i6[40]), w2 = i9(w2, t2, u2, v2, d10, 11, i6[41]), v2 = i9(v2, w2, t2, u2, g10, 16, i6[42]), u2 = i9(u2, v2, w2, t2, j10, 23, i6[43]), t2 = i9(t2, u2, v2, w2, m2, 4, i6[44]), w2 = i9(w2, t2, u2, v2, p2, 11, i6[45]), v2 = i9(v2, w2, t2, u2, s2, 16, i6[46]), u2 = i9(u2, v2, w2, t2, f10, 23, i6[47]), t2 = ja(t2, u2, v2, w2, d10, 6, i6[48]), w2 = ja(w2, t2, u2, v2, k2, 10, i6[49]), v2 = ja(v2, w2, t2, u2, r2, 15, i6[50]), u2 = ja(u2, v2, w2, t2, i10, 21, i6[51]), t2 = ja(t2, u2, v2, w2, p2, 6, i6[52]), w2 = ja(w2, t2, u2, v2, g10, 10, i6[53]), v2 = ja(v2, w2, t2, u2, n2, 15, i6[54]), u2 = ja(u2, v2, w2, t2, e10, 21, i6[55]), t2 = ja(t2, u2, v2, w2, l2, 6, i6[56]), w2 = ja(w2, t2, u2, v2, s2, 10, i6[57]), v2 = ja(v2, w2, t2, u2, j10, 15, i6[58]), u2 = ja(u2, v2, w2, t2, q2, 21, i6[59]), t2 = ja(t2, u2, v2, w2, h10, 6, i6[60]), w2 = ja(w2, t2, u2, v2, o2, 10, i6[61]), v2 = ja(v2, w2, t2, u2, f10, 15, i6[62]), u2 = ja(u2, v2, w2, t2, m2, 21, i6[63]), c10[0] = c10[0] + t2 | 0, c10[1] = c10[1] + u2 | 0, c10[2] = c10[2] + v2 | 0, c10[3] = c10[3] + w2 | 0;
        }
        _doFinalize() {
          let a10 = this._data, b10 = a10.words, c10 = 8 * this._nDataBytes, d10 = 8 * a10.sigBytes;
          b10[d10 >>> 5] |= 128 << 24 - d10 % 32;
          let e10 = Math.floor(c10 / 4294967296);
          b10[(d10 + 64 >>> 9 << 4) + 15] = (e10 << 8 | e10 >>> 24) & 16711935 | (e10 << 24 | e10 >>> 8) & 4278255360, b10[(d10 + 64 >>> 9 << 4) + 14] = (c10 << 8 | c10 >>> 24) & 16711935 | (c10 << 24 | c10 >>> 8) & 4278255360, a10.sigBytes = (b10.length + 1) * 4, this._process();
          let f10 = this._hash, g10 = f10.words;
          for (let a11 = 0; a11 < 4; a11 += 1) {
            let b11 = g10[a11];
            g10[a11] = (b11 << 8 | b11 >>> 24) & 16711935 | (b11 << 24 | b11 >>> 8) & 4278255360;
          }
          return f10;
        }
        clone() {
          let a10 = super.clone.call(this);
          return a10._hash = this._hash.clone(), a10;
        }
      };
      i3._createHelper(jb), i3._createHmacHelper(jb);
      var jc = class extends iZ {
        constructor(a10) {
          super(), this.cfg = Object.assign(new iZ(), { keySize: 4, hasher: jb, iterations: 1 }, a10);
        }
        compute(a10, b10) {
          let c10, { cfg: d10 } = this, e10 = d10.hasher.create(), f10 = i$.create(), g10 = f10.words, { keySize: h10, iterations: i10 } = d10;
          for (; g10.length < h10; ) {
            c10 && e10.update(c10), c10 = e10.update(a10).finalize(b10), e10.reset();
            for (let a11 = 1; a11 < i10; a11 += 1) c10 = e10.finalize(c10), e10.reset();
            f10.concat(c10);
          }
          return f10.sigBytes = 4 * h10, f10;
        }
      }, jd = class extends i2 {
        constructor(a10, b10, c10) {
          super(), this.cfg = Object.assign(new iZ(), c10), this._xformMode = a10, this._key = b10, this.reset();
        }
        static createEncryptor(a10, b10) {
          return this.create(this._ENC_XFORM_MODE, a10, b10);
        }
        static createDecryptor(a10, b10) {
          return this.create(this._DEC_XFORM_MODE, a10, b10);
        }
        static _createHelper(a10) {
          let b10 = (a11) => "string" == typeof a11 ? jl : jk;
          return { encrypt: (c10, d10, e10) => b10(d10).encrypt(a10, c10, d10, e10), decrypt: (c10, d10, e10) => b10(d10).decrypt(a10, c10, d10, e10) };
        }
        reset() {
          super.reset.call(this), this._doReset();
        }
        process(a10) {
          return this._append(a10), this._process();
        }
        finalize(a10) {
          return a10 && this._append(a10), this._doFinalize();
        }
      };
      jd._ENC_XFORM_MODE = 1, jd._DEC_XFORM_MODE = 2, jd.keySize = 4, jd.ivSize = 4;
      var je = class extends iZ {
        constructor(a10, b10) {
          super(), this._cipher = a10, this._iv = b10;
        }
        static createEncryptor(a10, b10) {
          return this.Encryptor.create(a10, b10);
        }
        static createDecryptor(a10, b10) {
          return this.Decryptor.create(a10, b10);
        }
      };
      function jf(a10, b10, c10) {
        let d10, e10 = this._iv;
        e10 ? (d10 = e10, this._iv = void 0) : d10 = this._prevBlock;
        for (let e11 = 0; e11 < c10; e11 += 1) a10[b10 + e11] ^= d10[e11];
      }
      var jg = class extends je {
      };
      jg.Encryptor = class extends jg {
        processBlock(a10, b10) {
          let c10 = this._cipher, { blockSize: d10 } = c10;
          jf.call(this, a10, b10, d10), c10.encryptBlock(a10, b10), this._prevBlock = a10.slice(b10, b10 + d10);
        }
      }, jg.Decryptor = class extends jg {
        processBlock(a10, b10) {
          let c10 = this._cipher, { blockSize: d10 } = c10, e10 = a10.slice(b10, b10 + d10);
          c10.decryptBlock(a10, b10), jf.call(this, a10, b10, d10), this._prevBlock = e10;
        }
      };
      var jh = { pad(a10, b10) {
        let c10 = 4 * b10, d10 = c10 - a10.sigBytes % c10, e10 = d10 << 24 | d10 << 16 | d10 << 8 | d10, f10 = [];
        for (let a11 = 0; a11 < d10; a11 += 4) f10.push(e10);
        let g10 = i$.create(f10, d10);
        a10.concat(g10);
      }, unpad(a10) {
        let b10 = 255 & a10.words[a10.sigBytes - 1 >>> 2];
        a10.sigBytes -= b10;
      } }, ji = class extends jd {
        constructor(a10, b10, c10) {
          super(a10, b10, Object.assign({ mode: jg, padding: jh }, c10)), this.blockSize = 4;
        }
        reset() {
          let a10;
          super.reset.call(this);
          let { cfg: b10 } = this, { iv: c10, mode: d10 } = b10;
          this._xformMode === this.constructor._ENC_XFORM_MODE ? a10 = d10.createEncryptor : (a10 = d10.createDecryptor, this._minBufferSize = 1), this._mode = a10.call(d10, this, c10 && c10.words), this._mode.__creator = a10;
        }
        _doProcessBlock(a10, b10) {
          this._mode.processBlock(a10, b10);
        }
        _doFinalize() {
          let a10, { padding: b10 } = this.cfg;
          return this._xformMode === this.constructor._ENC_XFORM_MODE ? (b10.pad(this._data, this.blockSize), a10 = this._process(true)) : (a10 = this._process(true), b10.unpad(a10)), a10;
        }
      }, jj = class extends iZ {
        constructor(a10) {
          super(), this.mixIn(a10);
        }
        toString(a10) {
          return (a10 || this.formatter).stringify(this);
        }
      }, jk = class extends iZ {
        static encrypt(a10, b10, c10, d10) {
          let e10 = Object.assign(new iZ(), this.cfg, d10), f10 = a10.createEncryptor(c10, e10), g10 = f10.finalize(b10), h10 = f10.cfg;
          return jj.create({ ciphertext: g10, key: c10, iv: h10.iv, algorithm: a10, mode: h10.mode, padding: h10.padding, blockSize: f10.blockSize, formatter: e10.format });
        }
        static decrypt(a10, b10, c10, d10) {
          let e10 = b10, f10 = Object.assign(new iZ(), this.cfg, d10);
          return e10 = this._parse(e10, f10.format), a10.createDecryptor(c10, f10).finalize(e10.ciphertext);
        }
        static _parse(a10, b10) {
          return "string" == typeof a10 ? b10.parse(a10, this) : a10;
        }
      };
      jk.cfg = Object.assign(new iZ(), { format: { stringify(a10) {
        let { ciphertext: b10, salt: c10 } = a10;
        return (c10 ? i$.create([1398893684, 1701076831]).concat(c10).concat(b10) : b10).toString(i5);
      }, parse(a10) {
        let b10, c10 = i5.parse(a10), d10 = c10.words;
        return 1398893684 === d10[0] && 1701076831 === d10[1] && (b10 = i$.create(d10.slice(2, 4)), d10.splice(0, 4), c10.sigBytes -= 16), jj.create({ ciphertext: c10, salt: b10 });
      } } });
      var jl = class extends jk {
        static encrypt(a10, b10, c10, d10) {
          let e10 = Object.assign(new iZ(), this.cfg, d10), f10 = e10.kdf.execute(c10, a10.keySize, a10.ivSize, e10.salt, e10.hasher);
          e10.iv = f10.iv;
          let g10 = jk.encrypt.call(this, a10, b10, f10.key, e10);
          return g10.mixIn(f10), g10;
        }
        static decrypt(a10, b10, c10, d10) {
          let e10 = b10, f10 = Object.assign(new iZ(), this.cfg, d10);
          e10 = this._parse(e10, f10.format);
          let g10 = f10.kdf.execute(c10, a10.keySize, a10.ivSize, e10.salt, f10.hasher);
          return f10.iv = g10.iv, jk.decrypt.call(this, a10, e10, g10.key, f10);
        }
      };
      jl.cfg = Object.assign(jk.cfg, { kdf: { execute(a10, b10, c10, d10, e10) {
        let f10, g10 = d10;
        g10 || (g10 = i$.random(8)), f10 = e10 ? jc.create({ keySize: b10 + c10, hasher: e10 }).compute(a10, g10) : jc.create({ keySize: b10 + c10 }).compute(a10, g10);
        let h10 = i$.create(f10.words.slice(b10), 4 * c10);
        return f10.sigBytes = 4 * b10, jj.create({ key: f10, iv: h10, salt: g10 });
      } } });
      var jm = [], jn = [], jo = [], jp = [], jq = [], jr = [], js = [], jt = [], ju = [], jv = [], jw = [];
      for (let a10 = 0; a10 < 256; a10 += 1) a10 < 128 ? jw[a10] = a10 << 1 : jw[a10] = a10 << 1 ^ 283;
      var jx = 0, jy = 0;
      for (let a10 = 0; a10 < 256; a10 += 1) {
        let a11 = jy ^ jy << 1 ^ jy << 2 ^ jy << 3 ^ jy << 4;
        a11 = a11 >>> 8 ^ 255 & a11 ^ 99, jm[jx] = a11, jn[a11] = jx;
        let b10 = jw[jx], c10 = jw[b10], d10 = jw[c10], e10 = 257 * jw[a11] ^ 16843008 * a11;
        jo[jx] = e10 << 24 | e10 >>> 8, jp[jx] = e10 << 16 | e10 >>> 16, jq[jx] = e10 << 8 | e10 >>> 24, jr[jx] = e10, e10 = 16843009 * d10 ^ 65537 * c10 ^ 257 * b10 ^ 16843008 * jx, js[a11] = e10 << 24 | e10 >>> 8, jt[a11] = e10 << 16 | e10 >>> 16, ju[a11] = e10 << 8 | e10 >>> 24, jv[a11] = e10, jx ? (jx = b10 ^ jw[jw[jw[d10 ^ b10]]], jy ^= jw[jw[jy]]) : jx = jy = 1;
      }
      var jz = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], jA = class extends ji {
        _doReset() {
          let a10;
          if (this._nRounds && this._keyPriorReset === this._key) return;
          this._keyPriorReset = this._key;
          let b10 = this._keyPriorReset, c10 = b10.words, d10 = b10.sigBytes / 4;
          this._nRounds = d10 + 6;
          let e10 = (this._nRounds + 1) * 4;
          this._keySchedule = [];
          let f10 = this._keySchedule;
          for (let b11 = 0; b11 < e10; b11 += 1) b11 < d10 ? f10[b11] = c10[b11] : (a10 = f10[b11 - 1], b11 % d10 ? d10 > 6 && b11 % d10 == 4 && (a10 = jm[a10 >>> 24] << 24 | jm[a10 >>> 16 & 255] << 16 | jm[a10 >>> 8 & 255] << 8 | jm[255 & a10]) : a10 = (jm[(a10 = a10 << 8 | a10 >>> 24) >>> 24] << 24 | jm[a10 >>> 16 & 255] << 16 | jm[a10 >>> 8 & 255] << 8 | jm[255 & a10]) ^ jz[b11 / d10 | 0] << 24, f10[b11] = f10[b11 - d10] ^ a10);
          this._invKeySchedule = [];
          let g10 = this._invKeySchedule;
          for (let b11 = 0; b11 < e10; b11 += 1) {
            let c11 = e10 - b11;
            a10 = b11 % 4 ? f10[c11] : f10[c11 - 4], b11 < 4 || c11 <= 4 ? g10[b11] = a10 : g10[b11] = js[jm[a10 >>> 24]] ^ jt[jm[a10 >>> 16 & 255]] ^ ju[jm[a10 >>> 8 & 255]] ^ jv[jm[255 & a10]];
          }
        }
        encryptBlock(a10, b10) {
          this._doCryptBlock(a10, b10, this._keySchedule, jo, jp, jq, jr, jm);
        }
        decryptBlock(a10, b10) {
          let c10 = a10[b10 + 1];
          a10[b10 + 1] = a10[b10 + 3], a10[b10 + 3] = c10, this._doCryptBlock(a10, b10, this._invKeySchedule, js, jt, ju, jv, jn), c10 = a10[b10 + 1], a10[b10 + 1] = a10[b10 + 3], a10[b10 + 3] = c10;
        }
        _doCryptBlock(a10, b10, c10, d10, e10, f10, g10, h10) {
          let i10 = this._nRounds, j10 = a10[b10] ^ c10[0], k2 = a10[b10 + 1] ^ c10[1], l2 = a10[b10 + 2] ^ c10[2], m2 = a10[b10 + 3] ^ c10[3], n2 = 4;
          for (let a11 = 1; a11 < i10; a11 += 1) {
            let a12 = d10[j10 >>> 24] ^ e10[k2 >>> 16 & 255] ^ f10[l2 >>> 8 & 255] ^ g10[255 & m2] ^ c10[n2];
            n2 += 1;
            let b11 = d10[k2 >>> 24] ^ e10[l2 >>> 16 & 255] ^ f10[m2 >>> 8 & 255] ^ g10[255 & j10] ^ c10[n2];
            n2 += 1;
            let h11 = d10[l2 >>> 24] ^ e10[m2 >>> 16 & 255] ^ f10[j10 >>> 8 & 255] ^ g10[255 & k2] ^ c10[n2];
            n2 += 1;
            let i11 = d10[m2 >>> 24] ^ e10[j10 >>> 16 & 255] ^ f10[k2 >>> 8 & 255] ^ g10[255 & l2] ^ c10[n2];
            n2 += 1, j10 = a12, k2 = b11, l2 = h11, m2 = i11;
          }
          let o2 = (h10[j10 >>> 24] << 24 | h10[k2 >>> 16 & 255] << 16 | h10[l2 >>> 8 & 255] << 8 | h10[255 & m2]) ^ c10[n2];
          n2 += 1;
          let p2 = (h10[k2 >>> 24] << 24 | h10[l2 >>> 16 & 255] << 16 | h10[m2 >>> 8 & 255] << 8 | h10[255 & j10]) ^ c10[n2];
          n2 += 1;
          let q2 = (h10[l2 >>> 24] << 24 | h10[m2 >>> 16 & 255] << 16 | h10[j10 >>> 8 & 255] << 8 | h10[255 & k2]) ^ c10[n2];
          n2 += 1;
          let r2 = (h10[m2 >>> 24] << 24 | h10[j10 >>> 16 & 255] << 16 | h10[k2 >>> 8 & 255] << 8 | h10[255 & l2]) ^ c10[n2];
          n2 += 1, a10[b10] = o2, a10[b10 + 1] = p2, a10[b10 + 2] = q2, a10[b10 + 3] = r2;
        }
      };
      jA.keySize = 8;
      var jB = ji._createHelper(jA), jC = [], jD = class extends i3 {
        _doReset() {
          this._hash = new i$([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
        }
        _doProcessBlock(a10, b10) {
          let c10 = this._hash.words, d10 = c10[0], e10 = c10[1], f10 = c10[2], g10 = c10[3], h10 = c10[4];
          for (let c11 = 0; c11 < 80; c11 += 1) {
            if (c11 < 16) jC[c11] = 0 | a10[b10 + c11];
            else {
              let a11 = jC[c11 - 3] ^ jC[c11 - 8] ^ jC[c11 - 14] ^ jC[c11 - 16];
              jC[c11] = a11 << 1 | a11 >>> 31;
            }
            let i10 = (d10 << 5 | d10 >>> 27) + h10 + jC[c11];
            c11 < 20 ? i10 += (e10 & f10 | ~e10 & g10) + 1518500249 : c11 < 40 ? i10 += (e10 ^ f10 ^ g10) + 1859775393 : c11 < 60 ? i10 += (e10 & f10 | e10 & g10 | f10 & g10) - 1894007588 : i10 += (e10 ^ f10 ^ g10) - 899497514, h10 = g10, g10 = f10, f10 = e10 << 30 | e10 >>> 2, e10 = d10, d10 = i10;
          }
          c10[0] = c10[0] + d10 | 0, c10[1] = c10[1] + e10 | 0, c10[2] = c10[2] + f10 | 0, c10[3] = c10[3] + g10 | 0, c10[4] = c10[4] + h10 | 0;
        }
        _doFinalize() {
          let a10 = this._data, b10 = a10.words, c10 = 8 * this._nDataBytes, d10 = 8 * a10.sigBytes;
          return b10[d10 >>> 5] |= 128 << 24 - d10 % 32, b10[(d10 + 64 >>> 9 << 4) + 14] = Math.floor(c10 / 4294967296), b10[(d10 + 64 >>> 9 << 4) + 15] = c10, a10.sigBytes = 4 * b10.length, this._process(), this._hash;
        }
        clone() {
          let a10 = super.clone.call(this);
          return a10._hash = this._hash.clone(), a10;
        }
      }, jE = (i3._createHelper(jD), i3._createHmacHelper(jD));
      let jF = `
Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl.

1) With middleware
   e.g. export default clerkMiddleware({domain:'YOUR_DOMAIN',isSatellite:true});
2) With environment variables e.g.
   NEXT_PUBLIC_CLERK_DOMAIN='YOUR_DOMAIN'
   NEXT_PUBLIC_CLERK_IS_SATELLITE='true'
   `, jG = `
Invalid signInUrl. A satellite application requires a signInUrl for development instances.
Check if signInUrl is missing from your configuration or if it is not an absolute URL

1) With middleware
   e.g. export default clerkMiddleware({signInUrl:'SOME_URL', isSatellite:true});
2) With environment variables e.g.
   NEXT_PUBLIC_CLERK_SIGN_IN_URL='SOME_URL'
   NEXT_PUBLIC_CLERK_IS_SATELLITE='true'`, jH = `Clerk: Unable to decrypt request data.

Refresh the page if your .env file was just updated. If the issue persists, ensure the encryption key is valid and properly set.

For more information, see: https://clerk.com/docs/reference/nextjs/clerk-middleware#dynamic-keys. (code=encryption_key_invalid)`, jI = cA({ packageName: "@clerk/nextjs" }), jJ = "x-middleware-override-headers", jK = "x-middleware-request", jL = (a10, b10, c10) => {
        a10.headers.get(jJ) || (a10.headers.set(jJ, [...b10.headers.keys()]), b10.headers.forEach((b11, c11) => {
          a10.headers.set(`${jK}-${c11}`, b11);
        })), Object.entries(c10).forEach(([b11, c11]) => {
          a10.headers.set(jJ, `${a10.headers.get(jJ)},${b11}`), a10.headers.set(`${jK}-${b11}`, c11);
        });
      }, jM = (a10) => ae.redirect(a10, { headers: { [dI]: "true" } }), jN = "clerk_keyless_dummy_key";
      function jO() {
        if (b6()) throw Error("Clerk: Unable to decrypt request data, this usually means the encryption key is invalid. Ensure the encryption key is properly set. For more information, see: https://clerk.com/docs/reference/nextjs/clerk-middleware#dynamic-keys. (code=encryption_key_invalid)");
        throw Error(jH);
      }
      function jP(a10, b10) {
        return JSON.parse(jB.decrypt(a10, b10).toString(i1));
      }
      let jQ = async () => {
        var a10, b10;
        let c10;
        try {
          let a11 = await ig(), b11 = ir(a11, dJ);
          c10 = function(a12) {
            if (!a12) return {};
            let b12 = b6() ? hY || hV : hY || hV || jN;
            try {
              return jP(a12, b12);
            } catch {
              if (h6) try {
                return jP(a12, jN);
              } catch {
                jO();
              }
              jO();
            }
          }(b11);
        } catch (a11) {
          if (a11 && id(a11) || a11 && a11 instanceof Error && h7 in a11) throw a11;
        }
        let d10 = null != (b10 = null == (a10 = iu.getStore()) ? void 0 : a10.get("requestData")) ? b10 : c10;
        return (null == d10 ? void 0 : d10.secretKey) || (null == d10 ? void 0 : d10.publishableKey) ? iq(d10) : iq({});
      };
      class jR {
        static createDefaultDirectives() {
          return Object.entries(this.DEFAULT_DIRECTIVES).reduce((a10, [b10, c10]) => (a10[b10] = new Set(c10), a10), {});
        }
        static isKeyword(a10) {
          return this.KEYWORDS.has(a10.replace(/^'|'$/g, ""));
        }
        static formatValue(a10) {
          let b10 = a10.replace(/^'|'$/g, "");
          return this.isKeyword(b10) ? `'${b10}'` : a10;
        }
        static handleDirectiveValues(a10) {
          let b10 = /* @__PURE__ */ new Set();
          return a10.includes("'none'") || a10.includes("none") ? b10.add("'none'") : a10.forEach((a11) => b10.add(this.formatValue(a11))), b10;
        }
      }
      jR.KEYWORDS = /* @__PURE__ */ new Set(["none", "self", "strict-dynamic", "unsafe-eval", "unsafe-hashes", "unsafe-inline"]), jR.DEFAULT_DIRECTIVES = { "connect-src": ["self", "https://clerk-telemetry.com", "https://*.clerk-telemetry.com", "https://api.stripe.com", "https://maps.googleapis.com", "https://img.clerk.com", "https://images.clerkstage.dev"], "default-src": ["self"], "form-action": ["self"], "frame-src": ["self", "https://challenges.cloudflare.com", "https://*.js.stripe.com", "https://js.stripe.com", "https://hooks.stripe.com"], "img-src": ["self", "https://img.clerk.com"], "script-src": ["self", "unsafe-inline", "https:", "http:", "https://*.js.stripe.com", "https://js.stripe.com", "https://maps.googleapis.com"], "style-src": ["self", "unsafe-inline"], "worker-src": ["self", "blob:"] };
      let jS = "__clerk_keys_";
      async function jT(a10) {
        let b10 = new TextEncoder().encode(a10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", b10))).map((a11) => a11.toString(16).padStart(2, "0")).join("").slice(0, 16);
      }
      async function jU() {
        let a10 = process.env.PWD;
        if (!a10) return `${jS}0`;
        let b10 = a10.split("/").filter(Boolean).slice(-3).reverse().join("/"), c10 = await jT(b10);
        return `${jS}${c10}`;
      }
      async function jV(a10) {
        let b10;
        if (!h6) return;
        let c10 = await jU();
        try {
          c10 && (b10 = JSON.parse(a10(c10) || "{}"));
        } catch {
          b10 = void 0;
        }
        return b10;
      }
      let jW = "CLERK_PROTECT_REDIRECT_TO_SIGN_IN", jX = "CLERK_PROTECT_REDIRECT_TO_SIGN_UP", jY = { NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 }, jZ = new Set(Object.values(jY)), j$ = "NEXT_HTTP_ERROR_FALLBACK";
      function j_(a10) {
        if (!function(a11) {
          if ("object" != typeof a11 || null === a11 || !("digest" in a11) || "string" != typeof a11.digest) return false;
          let [b11, c10] = a11.digest.split(";");
          return b11 === j$ && jZ.has(Number(c10));
        }(a10)) return;
        let [, b10] = a10.digest.split(";");
        return Number(b10);
      }
      let j0 = "NEXT_REDIRECT";
      function j1(a10, b10, c10 = "replace", d10 = 307) {
        let e10 = Error(j0);
        throw e10.digest = `${j0};${c10};${a10};${d10};`, e10.clerk_digest = "CLERK_PROTECT_REDIRECT_TO_URL", Object.assign(e10, b10), e10;
      }
      function j2(a10, b10) {
        return null === b10 ? "" : b10 || a10;
      }
      function j3(a10) {
        if ("object" != typeof a10 || null === a10 || !("digest" in a10) || "string" != typeof a10.digest) return false;
        let b10 = a10.digest.split(";"), [c10, d10] = b10, e10 = b10.slice(2, -2).join(";"), f10 = Number(b10.at(-2));
        return c10 === j0 && ("replace" === d10 || "push" === d10) && "string" == typeof e10 && !isNaN(f10) && 307 === f10;
      }
      function j4() {
        let a10 = Error(j$);
        throw a10.digest = `${j$};${jY.UNAUTHORIZED}`, a10;
      }
      let j5 = ["role", "permission", "feature", "plan", "reverification"], j6 = (a10) => {
        var b10, c10;
        return !!a10.headers.get(hH) && ((null == (b10 = a10.headers.get(dA)) ? void 0 : b10.includes("text/x-component")) || (null == (c10 = a10.headers.get(dM)) ? void 0 : c10.includes("multipart/form-data")) || !!a10.headers.get(hI));
      }, j7 = (a10) => !!a10.headers.get(hH) && !j6(a10) || j8(), j8 = () => {
        let a10 = globalThis.fetch;
        if (!("__nextPatched" in a10 && true === a10.__nextPatched)) return false;
        let { page: b10 } = a10.__nextGetStaticStore().getStore() || {};
        return !!b10;
      }, j9 = (a10) => !!a10.headers.get(hJ);
      async function ka({ clerkRequest: a10, request: b10, event: c10, requestState: d10, handler: e10, options: f10, resolvedParams: g10, keyless: h10, logger: i10 }) {
        var j10, k2, l2, m2, n2;
        let { publishableKey: o2, secretKey: p2 } = f10;
        i10.debug("requestState", () => ({ status: d10.status, headers: JSON.stringify(Object.fromEntries(d10.headers)), reason: d10.reason }));
        let q2 = d10.headers.get(dT);
        if (q2) {
          !function({ locationHeader: a12, requestStateHeaders: b11, publishableKey: c11 }) {
            let d11 = !("u" < typeof process) && !!process.env && (!!process.env.NETLIFY || !!process.env.NETLIFY_FUNCTIONS_TOKEN || "string" == typeof process.env.URL && process.env.URL.endsWith("netlify.app")), e11 = c11.startsWith("test_") || c11.startsWith("pk_test_");
            if (d11 && e11 && !a12.includes("__clerk_handshake")) {
              let c12 = new URL(a12);
              c12.searchParams.append("__clerk_netlify_cache_bust", Date.now().toString()), b11.set("Location", c12.toString());
            }
          }({ locationHeader: q2, requestStateHeaders: d10.headers, publishableKey: d10.publishableKey });
          let a11 = ae.redirect(d10.headers.get(dT) || q2);
          return d10.headers.forEach((b11, c11) => {
            c11 !== dT && a11.headers.append(c11, b11);
          }), a11;
        }
        if (d10.status === g2) throw Error("Clerk: handshake status without redirect");
        let r2 = d10.toAuth();
        i10.debug("auth", () => ({ auth: r2, debug: r2.debug() }));
        let s2 = kb(a10), t2 = kc(a10), u2 = await kd(a10, r2, s2), v2 = ke(d10, s2, t2);
        v2.protect = u2;
        let w2 = ae.next();
        try {
          w2 = await iu.run(it, async () => null == e10 ? void 0 : e10(v2, b10, c10)) || w2;
        } catch (c11) {
          w2 = kf(c11, a10, b10, d10);
        }
        if (f10.contentSecurityPolicy) {
          let b11, c11, d11, e11, { headers: g11 } = (l2 = (null != (k2 = null == (j10 = ck(o2)) ? void 0 : j10.frontendApi) ? k2 : "").replace("$", ""), m2 = f10.contentSecurityPolicy, b11 = [], d11 = m2.strict ? (c11 = new Uint8Array(16), crypto.getRandomValues(c11), btoa(Array.from(c11, (a11) => String.fromCharCode(a11)).join(""))) : void 0, e11 = function(a11, b12, c12, d12) {
            let e12 = Object.entries(jR.DEFAULT_DIRECTIVES).reduce((a12, [b13, c13]) => (a12[b13] = new Set(c13), a12), {});
            if (e12["connect-src"].add(b12), a11 && (e12["script-src"].delete("http:"), e12["script-src"].delete("https:"), e12["script-src"].add("'strict-dynamic'"), d12 && e12["script-src"].add(`'nonce-${d12}'`)), c12) {
              let a12 = /* @__PURE__ */ new Map();
              Object.entries(c12).forEach(([b13, c13]) => {
                let d13 = Array.isArray(c13) ? c13 : [c13];
                jR.DEFAULT_DIRECTIVES[b13] ? function(a13, b14, c14) {
                  if (c14.includes("'none'") || c14.includes("none")) {
                    a13[b14] = /* @__PURE__ */ new Set(["'none'"]);
                    return;
                  }
                  let d14 = /* @__PURE__ */ new Set();
                  a13[b14].forEach((a14) => {
                    d14.add(jR.formatValue(a14));
                  }), c14.forEach((a14) => {
                    d14.add(jR.formatValue(a14));
                  }), a13[b14] = d14;
                }(e12, b13, d13) : function(a13, b14, c14) {
                  if (c14.includes("'none'") || c14.includes("none")) return a13.set(b14, /* @__PURE__ */ new Set(["'none'"]));
                  let d14 = /* @__PURE__ */ new Set();
                  c14.forEach((a14) => {
                    let b15 = jR.formatValue(a14);
                    d14.add(b15);
                  }), a13.set(b14, d14);
                }(a12, b13, d13);
              }), a12.forEach((a13, b13) => {
                e12[b13] = a13;
              });
            }
            return Object.entries(e12).sort(([a12], [b13]) => a12.localeCompare(b13)).map(([a12, b13]) => {
              let c13 = Array.from(b13).map((a13) => ({ raw: a13, formatted: jR.formatValue(a13) }));
              return `${a12} ${c13.map((a13) => a13.formatted).join(" ")}`;
            }).join("; ");
          }(null != (n2 = m2.strict) && n2, l2, m2.directives, d11), m2.reportTo && (e11 += "; report-to csp-endpoint", b11.push([dZ, `csp-endpoint="${m2.reportTo}"`])), m2.reportOnly ? b11.push([dO, e11]) : b11.push([dN, e11]), d11 && b11.push([dU, d11]), { headers: b11 }), h11 = {};
          g11.forEach(([a11, b12]) => {
            hK(w2, a11, b12), h11[a11] = b12;
          }), jL(w2, a10, h11), i10.debug("Clerk generated CSP", () => ({ headers: g11 }));
        }
        if (d10.headers && d10.headers.forEach((a11, b11) => {
          b11 === dN && i10.debug("Content-Security-Policy detected", () => ({ value: a11 })), w2.headers.append(b11, a11);
        }), w2.headers.get(hG)) return i10.debug("handlerResult is redirect"), ((a11, b11, c11) => {
          let d11 = b11.headers.get("location");
          if ("true" === b11.headers.get(dI) && d11 && cn(c11.secretKey) && a11.clerkUrl.isCrossOrigin(d11)) {
            var e11;
            let c12, f11, g11, h11 = a11.cookies.get(hL) || "", i11 = (e11 = new URL(d11), f11 = (c12 = new URL(e11)).searchParams.get(hL), c12.searchParams.delete(hL), (g11 = f11 || h11) && c12.searchParams.set(hL, g11), c12);
            return ae.redirect(i11.href, b11);
          }
          return b11;
        })(a10, w2, f10);
        f10.debug && jL(w2, a10, { [dP]: "true" });
        let x2 = p2 === (null == h10 ? void 0 : h10.secretKey) ? { publishableKey: null == h10 ? void 0 : h10.publishableKey, secretKey: null == h10 ? void 0 : h10.secretKey } : {};
        return !function(a11, b11, c11, d11, e11, f11) {
          let g11, { reason: h11, message: i11, status: j11, token: k3 } = c11;
          if (b11 || (b11 = ae.next()), b11.headers.get(hG)) return;
          "1" === b11.headers.get(hF) && (b11.headers.delete(hF), g11 = new URL(a11.url));
          let l3 = b11.headers.get(hE);
          if (l3) {
            let b12 = new URL(a11.url);
            if ((g11 = new URL(l3)).origin !== b12.origin) return;
          }
          if (g11) {
            let c12 = function(a12, b12, c13) {
              var d12;
              let e12 = (a13) => !a13 || !Object.values(a13).some((a14) => void 0 !== a14);
              if (e12(a12) && e12(b12) && !c13) return;
              if (a12.secretKey && !hY) throw Error("Clerk: Missing `CLERK_ENCRYPTION_KEY`. Required for propagating `secretKey` middleware option. See docs: https://clerk.com/docs/references/nextjs/clerk-middleware#dynamic-keys. (code=encryption_key_missing)");
              let f12 = b6() ? hY || (d12 = () => jI.throwMissingSecretKeyError(), hV || d12(), hV) : hY || hV || jN;
              return jB.encrypt(JSON.stringify({ ...b12, ...a12, machineAuthObject: null != c13 ? c13 : void 0 }), f12).toString();
            }(d11, e11, f11);
            jL(b11, a11, { [dF]: j11, [dG]: k3 || "", [dE]: k3 ? jE(k3, (null == d11 ? void 0 : d11.secretKey) || hV || e11.secretKey || "").toString() : "", [dB]: i11 || "", [dD]: h11 || "", [dK]: a11.clerkUrl.toString(), ...c12 ? { [dJ]: c12 } : {} }), b11.headers.set(hE, g11.href);
          }
        }(a10, w2, d10, g10, x2, "session_token" === r2.tokenType ? null : ((a11) => {
          let { debug: b11, getToken: c11, has: d11, ...e11 } = a11;
          return e11;
        })(r2)), w2;
      }
      let kb = (a10) => (b10 = {}) => {
        var c10;
        c10 = a10.clerkUrl.toString(), j1(c10, { clerk_digest: jW, returnBackUrl: j2(c10, b10.returnBackUrl) });
      }, kc = (a10) => (b10 = {}) => {
        var c10;
        c10 = a10.clerkUrl.toString(), j1(c10, { clerk_digest: jX, returnBackUrl: j2(c10, b10.returnBackUrl) });
      }, kd = (a10, b10, c10) => async (d10, e10) => function(a11) {
        let { redirectToSignIn: b11, authObject: c11, redirect: d11, notFound: e11, request: f10, unauthorized: g10 } = a11;
        return async (...a12) => {
          var h10, i10, j10, k2, l2, m2, n2, o2;
          let p2 = ((a13) => {
            if (!a13) return;
            if ("function" == typeof a13) return a13;
            let b12 = {};
            for (let c12 of j5) void 0 !== a13[c12] && (b12[c12] = a13[c12]);
            if (0 !== Object.keys(b12).length) return b12;
          })(a12[0]), q2 = (null == (h10 = a12[0]) ? void 0 : h10.unauthenticatedUrl) || (null == (i10 = a12[1]) ? void 0 : i10.unauthenticatedUrl), r2 = (null == (j10 = a12[0]) ? void 0 : j10.unauthorizedUrl) || (null == (k2 = a12[1]) ? void 0 : k2.unauthorizedUrl), s2 = (null == (l2 = a12[0]) ? void 0 : l2.token) || (null == (m2 = a12[1]) ? void 0 : m2.token) || d3, t2 = () => c11.tokenType === d3 && e$(d3, s2) ? r2 ? d11(r2) : e11() : g10();
          if (!e$(c11.tokenType, s2)) return t2();
          if (c11.tokenType !== d3) return c11.isAuthenticated ? c11 : t2();
          if ("pending" === c11.sessionStatus || !c11.userId) {
            return q2 ? d11(q2) : "document" === (n2 = f10).headers.get(dX) || "iframe" === n2.headers.get(dX) || (null == (o2 = n2.headers.get(dA)) ? void 0 : o2.includes("text/html")) || j7(n2) || j9(n2) ? b11() : j6(f10) ? g10() : e11();
          }
          return p2 ? "function" == typeof p2 ? p2(c11.has) ? c11 : t2() : c11.has(p2) ? c11 : t2() : c11;
        };
      }({ request: a10, redirect: (a11) => j1(a11, { redirectUrl: a11 }), notFound: () => function() {
        let a11 = Object.defineProperty(Error(hD), "__NEXT_ERROR_CODE", { value: "E1041", enumerable: false, configurable: true });
        throw a11.digest = hD, a11;
      }(), unauthorized: j4, authObject: g0({ authObject: b10, acceptsToken: (null == d10 ? void 0 : d10.token) || (null == e10 ? void 0 : e10.token) || d3 }), redirectToSignIn: c10 })(d10, e10), ke = (a10, b10, c10) => async (d10) => {
        var e10;
        let f10 = a10.toAuth({ treatPendingAsSignedOut: null == d10 ? void 0 : d10.treatPendingAsSignedOut }), g10 = null != (e10 = null == d10 ? void 0 : d10.acceptsToken) ? e10 : d3, h10 = g0({ authObject: f10, acceptsToken: g10 });
        return h10.tokenType === d3 && e$(d3, g10) ? Object.assign(h10, { redirectToSignIn: b10, redirectToSignUp: c10 }) : h10;
      }, kf = (a10, b10, c10, d10) => {
        var e10;
        if (a10 instanceof Error && "MalformedURLError" === a10.name) return new ae(null, { status: 400, statusText: "Bad Request" });
        if (j_(a10) === jY.UNAUTHORIZED) {
          let a11 = new ae(null, { status: 401 }), b11 = d10.toAuth();
          if (b11 && b11.tokenType === d6) {
            let b12 = ck(d10.publishableKey);
            return hK(a11, "WWW-Authenticate", `Bearer resource_metadata="https://${null == b12 ? void 0 : b12.frontendApi}/.well-known/oauth-protected-resource"`);
          }
          return a11;
        }
        if ("object" == typeof a10 && null !== a10 && "digest" in a10 && "NEXT_NOT_FOUND" === a10.digest || j_(a10) === jY.NOT_FOUND) return hK(ae.rewrite(new URL(`/clerk_${Date.now()}`, c10.url)), dD, "protect-rewrite");
        let f10 = !!j3(a10) && "clerk_digest" in a10 && a10.clerk_digest === jW, g10 = !!j3(a10) && "clerk_digest" in a10 && a10.clerk_digest === jX;
        if (f10 || g10) {
          let c11 = ((a11) => {
            let { publishableKey: b11, redirectAdapter: c12, signInUrl: d11, signUpUrl: e11, baseUrl: f11, sessionStatus: g12, isSatellite: h10 } = a11, i10 = ck(b11), j10 = i10?.frontendApi, k2 = i10?.instanceType === "development", l2 = df(j10), m2 = "pending" === g12, n2 = (b12, { returnBackUrl: d12 }) => c12(d_(f11, `${b12}/tasks`, d12, k2 ? a11.devBrowserToken : null, h10));
            return { redirectToSignUp: ({ returnBackUrl: b12 } = {}) => {
              e11 || l2 || cB.throwMissingPublishableKeyError();
              let g13 = `${l2}/sign-up`, i11 = e11 || function(a12) {
                if (!a12) return;
                let b13 = new URL(a12, f11);
                return b13.pathname = `${b13.pathname}/create`, b13.toString();
              }(d11) || g13;
              return m2 ? n2(i11, { returnBackUrl: b12 }) : c12(d_(f11, i11, b12, k2 ? a11.devBrowserToken : null, h10));
            }, redirectToSignIn: ({ returnBackUrl: b12 } = {}) => {
              d11 || l2 || cB.throwMissingPublishableKeyError();
              let e12 = `${l2}/sign-in`, g13 = d11 || e12;
              return m2 ? n2(g13, { returnBackUrl: b12 }) : c12(d_(f11, g13, b12, k2 ? a11.devBrowserToken : null, h10));
            } };
          })({ redirectAdapter: jM, baseUrl: b10.clerkUrl, signInUrl: d10.signInUrl, signUpUrl: d10.signUpUrl, publishableKey: d10.publishableKey, sessionStatus: null == (e10 = d10.toAuth()) ? void 0 : e10.sessionStatus, isSatellite: d10.isSatellite }), { returnBackUrl: g11 } = a10;
          return c11[f10 ? "redirectToSignIn" : "redirectToSignUp"]({ returnBackUrl: g11 });
        }
        if (j3(a10)) return jM(a10.redirectUrl);
        throw a10;
      }, kg = "experimental-edge", kh = ((a10) => {
        let b10;
        if ("function" == typeof a10) return (b11) => a10(b11);
        let c10 = (b10 = [a10 || ""].flat().filter(Boolean).map((a11) => a11 instanceof RegExp ? a11 : ((a12) => {
          try {
            return b3(a12);
          } catch (b11) {
            throw Error(`Invalid path: ${a12}.
Consult the documentation of path-to-regexp here: https://github.com/pillarjs/path-to-regexp/tree/6.x
${b11.message}`);
          }
        })(a11)), (a11) => b10.some((b11) => b11.test(((a12) => {
          try {
            a12 = decodeURI(a12);
          } catch (b12) {
            throw new b4(a12, b12);
          }
          return a12.replace(/\/\/+/g, "/");
        })(a11))));
        return (a11) => c10(a11.nextUrl.pathname);
      })(["/", "/sign-in(.*)", "/sign-up(.*)", "/status(.*)", "/sitemap.xml", "/robots.txt", "/privacy", "/terms"]), ki = ((...a10) => {
        let b10, c10, [d10, e10] = [(b10 = a10)[0] instanceof Request ? b10[0] : void 0, b10[0] instanceof Request ? b10[1] : void 0], [f10, g10] = ["function" == typeof (c10 = a10)[0] ? c10[0] : void 0, (2 === c10.length ? c10[1] : "function" == typeof c10[0] ? {} : c10[0]) || {}];
        return iu.run(it, () => {
          let a11 = hQ("clerkMiddleware", (a12) => async (b12, c12) => {
            var d11, e11, h11, i10, j10;
            let k2 = "function" == typeof g10 ? await g10(b12) : g10, l2 = await jV((a13) => {
              var c13;
              return null == (c13 = b12.cookies.get(a13)) ? void 0 : c13.value;
            }), m2 = (d11 = k2.publishableKey || hX || (null == l2 ? void 0 : l2.publishableKey), e11 = () => jI.throwMissingPublishableKeyError(), d11 || e11(), d11), n2 = (h11 = k2.secretKey || hV || (null == l2 ? void 0 : l2.secretKey), i10 = () => jI.throwMissingSecretKeyError(), h11 || i10(), h11), o2 = new URL(b12.nextUrl.href), p2 = k2.frontendApiProxy, q2 = k2.proxyUrl || h_ || k2.domain || h$;
            if (!p2 && !q2 && cm(m2) && dj(o2.hostname) && (p2 = { enabled: true }), p2) {
              let a13, c13, { enabled: d12, path: e12 = cg } = p2;
              if (("function" == typeof d12 ? d12(o2) : d12) && (j10 = { proxyPath: e12 }, a13 = hz(j10?.proxyPath || cg), (c13 = new URL(b12.url)).pathname === a13 || c13.pathname.startsWith(a13 + "/"))) return hB(b12, { proxyPath: e12, publishableKey: m2, secretKey: n2 });
            }
            let r2 = { publishableKey: m2, secretKey: n2, signInUrl: k2.signInUrl || h1, signUpUrl: k2.signUpUrl || h2, ...k2 };
            it.set("requestData", r2);
            let s2 = await jQ();
            r2.debug && a12.enable();
            let t2 = he(b12);
            a12.debug("options", r2), a12.debug("url", () => t2.toJSON());
            let u2 = b12.headers.get(dC);
            u2 && u2.startsWith("Basic ") && a12.debug("Basic Auth detected");
            let v2 = b12.headers.get(dN);
            v2 && a12.debug("Content-Security-Policy detected", () => ({ value: v2 }));
            let w2 = await s2.authenticateRequest(t2, ((a13, b13) => {
              let c13 = b13;
              if (b13.frontendApiProxy && !b13.proxyUrl) {
                let { enabled: d12, path: e12 = cg } = b13.frontendApiProxy, f11 = new URL(a13.url);
                if ("function" == typeof d12 ? d12(f11) : d12) {
                  let a14 = `${f11.origin}${e12}`;
                  c13 = { ...b13, proxyUrl: a14 };
                }
              }
              return { ...c13, ...((a14, b14) => {
                let c14, d12 = hR(null == b14 ? void 0 : b14.proxyUrl, a14.clerkUrl, h_);
                c14 = d12 && !dh(d12) ? new URL(d12, a14.clerkUrl).toString() : d12;
                let e12 = hR(b14.isSatellite, new URL(a14.url), h0), f11 = hR(b14.domain, new URL(a14.url), h$), g11 = (null == b14 ? void 0 : b14.signInUrl) || h1;
                if (e12 && !c14 && !f11) throw Error(jF);
                if (e12 && !dh(g11) && cn(b14.secretKey || hV)) throw Error(jG);
                return { proxyUrl: c14, isSatellite: e12, domain: f11, signInUrl: g11 };
              })(a13, c13), acceptsToken: "any" };
            })(t2, r2));
            return ka({ clerkRequest: t2, request: b12, event: c12, requestState: w2, handler: f10, options: r2, resolvedParams: k2, keyless: l2, logger: a12 });
          }), b11 = hQ("clerkMiddleware", (a12) => async (b12, c12) => {
            let d11 = "function" == typeof g10 ? await g10(b12) : g10, e11 = await jV((a13) => {
              var c13;
              return null == (c13 = b12.cookies.get(a13)) ? void 0 : c13.value;
            }), h11 = d11.signInUrl || h1 || "", i10 = d11.signUpUrl || h2 || "", j10 = { publishableKey: "", secretKey: "", signInUrl: h11, signUpUrl: i10, ...d11 };
            it.set("requestData", j10), j10.debug && a12.enable();
            let k2 = he(b12);
            return a12.debug("keyless bootstrap (no publishable key)", () => ({ signInUrl: h11, signUpUrl: i10 })), a12.debug("url", () => k2.toJSON()), ka({ clerkRequest: k2, request: b12, event: c12, requestState: function({ signInUrl: a13 = "", signUpUrl: b13 = "", isSatellite: c13 = false, domain: d12 = "", proxyUrl: e12 = "", reason: f11 = g4, message: g11 = "", headers: h12 = new Headers() } = {}) {
              return g9({ status: g1, reason: f11, message: g11, proxyUrl: e12, publishableKey: "", isSatellite: c13, domain: d12, signInUrl: a13, signUpUrl: b13, afterSignInUrl: "", afterSignUpUrl: "", isSignedIn: false, isAuthenticated: false, tokenType: d3, toAuth: () => gZ({ status: g1, reason: f11, message: g11 }), headers: h12, token: null });
            }({ signInUrl: h11, signUpUrl: i10 }), handler: f10, options: j10, resolvedParams: d11, keyless: e11, logger: a12 });
          }), c11 = async (c12, d11) => {
            var e11, f11, h11;
            if ("/clerk-sync-keyless" === c12.nextUrl.pathname) {
              let a12, b12;
              return a12 = (h11 = c12).nextUrl.searchParams.get("returnUrl"), (b12 = new URL(h11.url)).pathname = "", ae.redirect(a12 || b12.toString());
            }
            let i10 = "function" == typeof g10 ? await g10(c12) : g10, j10 = await jV((a12) => {
              var b12;
              return null == (b12 = c12.cookies.get(a12)) ? void 0 : b12.value;
            }), k2 = !(i10.publishableKey || hX || (null == j10 ? void 0 : j10.publishableKey)), l2 = null != (f11 = null == (e11 = ir(c12, dC)) ? void 0 : e11.replace("Bearer ", "")) ? f11 : "";
            return k2 && !eX(l2) ? b11(c12, d11) : a11(c12, d11);
          }, h10 = async (b12, d11) => h6 ? c11(b12, d11) : a11(b12, d11);
          return d10 && e10 ? h10(d10, e10) : h10;
        });
      })(async (a10, b10) => {
        kh(b10) || await a10.protect();
      }), kj = { matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"] };
      c(789);
      let kk = { ...p }, kl = "/src/middleware", km = (0, kk.middleware || kk.default);
      class kn extends Error {
        constructor(a10) {
          super(a10), this.stack = "";
        }
      }
      if ("function" != typeof km) throw new kn(`The Middleware file "${kl}" must export a function named \`middleware\` or a default function.`);
      let ko = (a10) => bo({ ...a10, IncrementalCache: b0, incrementalCacheHandler: null, page: kl, handler: async (...a11) => {
        try {
          return await km(...a11);
        } catch (e10) {
          let b10 = a11[0], c10 = new URL(b10.url), d10 = c10.pathname + c10.search;
          throw await t(e10, { path: d10, method: b10.method, headers: Object.fromEntries(b10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), e10;
        }
      } });
      async function kp(a10, b10) {
        let c10 = await ko({ request: { url: a10.url, method: a10.method, headers: H(a10.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: kl }, body: "GET" !== a10.method && "HEAD" !== a10.method ? a10.body ?? void 0 : void 0, waitUntil: b10.waitUntil, requestMeta: b10.requestMeta, signal: b10.signal || new AbortController().signal } });
        return null == b10.waitUntil || b10.waitUntil.call(b10, c10.waitUntil), c10.response;
      }
      let kq = ko;
    }, 20: (a, b, c) => {
      "use strict";
      c.d(b, { f: () => d });
      class d extends Error {
        constructor(...a2) {
          super(...a2), this.code = "NEXT_STATIC_GEN_BAILOUT";
        }
      }
    }, 42: (a) => {
      !function() {
        "use strict";
        var b = { 114: function(a2) {
          function b2(a3) {
            if ("string" != typeof a3) throw TypeError("Path must be a string. Received " + JSON.stringify(a3));
          }
          function c2(a3, b3) {
            for (var c3, d3 = "", e = 0, f = -1, g = 0, h = 0; h <= a3.length; ++h) {
              if (h < a3.length) c3 = a3.charCodeAt(h);
              else if (47 === c3) break;
              else c3 = 47;
              if (47 === c3) {
                if (f === h - 1 || 1 === g) ;
                else if (f !== h - 1 && 2 === g) {
                  if (d3.length < 2 || 2 !== e || 46 !== d3.charCodeAt(d3.length - 1) || 46 !== d3.charCodeAt(d3.length - 2)) {
                    if (d3.length > 2) {
                      var i = d3.lastIndexOf("/");
                      if (i !== d3.length - 1) {
                        -1 === i ? (d3 = "", e = 0) : e = (d3 = d3.slice(0, i)).length - 1 - d3.lastIndexOf("/"), f = h, g = 0;
                        continue;
                      }
                    } else if (2 === d3.length || 1 === d3.length) {
                      d3 = "", e = 0, f = h, g = 0;
                      continue;
                    }
                  }
                  b3 && (d3.length > 0 ? d3 += "/.." : d3 = "..", e = 2);
                } else d3.length > 0 ? d3 += "/" + a3.slice(f + 1, h) : d3 = a3.slice(f + 1, h), e = h - f - 1;
                f = h, g = 0;
              } else 46 === c3 && -1 !== g ? ++g : g = -1;
            }
            return d3;
          }
          var d2 = { resolve: function() {
            for (var a3, d3, e = "", f = false, g = arguments.length - 1; g >= -1 && !f; g--) g >= 0 ? d3 = arguments[g] : (void 0 === a3 && (a3 = ""), d3 = a3), b2(d3), 0 !== d3.length && (e = d3 + "/" + e, f = 47 === d3.charCodeAt(0));
            if (e = c2(e, !f), f) if (e.length > 0) return "/" + e;
            else return "/";
            return e.length > 0 ? e : ".";
          }, normalize: function(a3) {
            if (b2(a3), 0 === a3.length) return ".";
            var d3 = 47 === a3.charCodeAt(0), e = 47 === a3.charCodeAt(a3.length - 1);
            return (0 !== (a3 = c2(a3, !d3)).length || d3 || (a3 = "."), a3.length > 0 && e && (a3 += "/"), d3) ? "/" + a3 : a3;
          }, isAbsolute: function(a3) {
            return b2(a3), a3.length > 0 && 47 === a3.charCodeAt(0);
          }, join: function() {
            if (0 == arguments.length) return ".";
            for (var a3, c3 = 0; c3 < arguments.length; ++c3) {
              var e = arguments[c3];
              b2(e), e.length > 0 && (void 0 === a3 ? a3 = e : a3 += "/" + e);
            }
            return void 0 === a3 ? "." : d2.normalize(a3);
          }, relative: function(a3, c3) {
            if (b2(a3), b2(c3), a3 === c3 || (a3 = d2.resolve(a3)) === (c3 = d2.resolve(c3))) return "";
            for (var e = 1; e < a3.length && 47 === a3.charCodeAt(e); ++e) ;
            for (var f = a3.length, g = f - e, h = 1; h < c3.length && 47 === c3.charCodeAt(h); ++h) ;
            for (var i = c3.length - h, j = g < i ? g : i, k = -1, l = 0; l <= j; ++l) {
              if (l === j) {
                if (i > j) {
                  if (47 === c3.charCodeAt(h + l)) return c3.slice(h + l + 1);
                  else if (0 === l) return c3.slice(h + l);
                } else g > j && (47 === a3.charCodeAt(e + l) ? k = l : 0 === l && (k = 0));
                break;
              }
              var m = a3.charCodeAt(e + l);
              if (m !== c3.charCodeAt(h + l)) break;
              47 === m && (k = l);
            }
            var n = "";
            for (l = e + k + 1; l <= f; ++l) (l === f || 47 === a3.charCodeAt(l)) && (0 === n.length ? n += ".." : n += "/..");
            return n.length > 0 ? n + c3.slice(h + k) : (h += k, 47 === c3.charCodeAt(h) && ++h, c3.slice(h));
          }, _makeLong: function(a3) {
            return a3;
          }, dirname: function(a3) {
            if (b2(a3), 0 === a3.length) return ".";
            for (var c3 = a3.charCodeAt(0), d3 = 47 === c3, e = -1, f = true, g = a3.length - 1; g >= 1; --g) if (47 === (c3 = a3.charCodeAt(g))) {
              if (!f) {
                e = g;
                break;
              }
            } else f = false;
            return -1 === e ? d3 ? "/" : "." : d3 && 1 === e ? "//" : a3.slice(0, e);
          }, basename: function(a3, c3) {
            if (void 0 !== c3 && "string" != typeof c3) throw TypeError('"ext" argument must be a string');
            b2(a3);
            var d3, e = 0, f = -1, g = true;
            if (void 0 !== c3 && c3.length > 0 && c3.length <= a3.length) {
              if (c3.length === a3.length && c3 === a3) return "";
              var h = c3.length - 1, i = -1;
              for (d3 = a3.length - 1; d3 >= 0; --d3) {
                var j = a3.charCodeAt(d3);
                if (47 === j) {
                  if (!g) {
                    e = d3 + 1;
                    break;
                  }
                } else -1 === i && (g = false, i = d3 + 1), h >= 0 && (j === c3.charCodeAt(h) ? -1 == --h && (f = d3) : (h = -1, f = i));
              }
              return e === f ? f = i : -1 === f && (f = a3.length), a3.slice(e, f);
            }
            for (d3 = a3.length - 1; d3 >= 0; --d3) if (47 === a3.charCodeAt(d3)) {
              if (!g) {
                e = d3 + 1;
                break;
              }
            } else -1 === f && (g = false, f = d3 + 1);
            return -1 === f ? "" : a3.slice(e, f);
          }, extname: function(a3) {
            b2(a3);
            for (var c3 = -1, d3 = 0, e = -1, f = true, g = 0, h = a3.length - 1; h >= 0; --h) {
              var i = a3.charCodeAt(h);
              if (47 === i) {
                if (!f) {
                  d3 = h + 1;
                  break;
                }
                continue;
              }
              -1 === e && (f = false, e = h + 1), 46 === i ? -1 === c3 ? c3 = h : 1 !== g && (g = 1) : -1 !== c3 && (g = -1);
            }
            return -1 === c3 || -1 === e || 0 === g || 1 === g && c3 === e - 1 && c3 === d3 + 1 ? "" : a3.slice(c3, e);
          }, format: function(a3) {
            var b3, c3;
            if (null === a3 || "object" != typeof a3) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof a3);
            return b3 = a3.dir || a3.root, c3 = a3.base || (a3.name || "") + (a3.ext || ""), b3 ? b3 === a3.root ? b3 + c3 : b3 + "/" + c3 : c3;
          }, parse: function(a3) {
            b2(a3);
            var c3, d3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === a3.length) return d3;
            var e = a3.charCodeAt(0), f = 47 === e;
            f ? (d3.root = "/", c3 = 1) : c3 = 0;
            for (var g = -1, h = 0, i = -1, j = true, k = a3.length - 1, l = 0; k >= c3; --k) {
              if (47 === (e = a3.charCodeAt(k))) {
                if (!j) {
                  h = k + 1;
                  break;
                }
                continue;
              }
              -1 === i && (j = false, i = k + 1), 46 === e ? -1 === g ? g = k : 1 !== l && (l = 1) : -1 !== g && (l = -1);
            }
            return -1 === g || -1 === i || 0 === l || 1 === l && g === i - 1 && g === h + 1 ? -1 !== i && (0 === h && f ? d3.base = d3.name = a3.slice(1, i) : d3.base = d3.name = a3.slice(h, i)) : (0 === h && f ? (d3.name = a3.slice(1, g), d3.base = a3.slice(1, i)) : (d3.name = a3.slice(h, g), d3.base = a3.slice(h, i)), d3.ext = a3.slice(g, i)), h > 0 ? d3.dir = a3.slice(0, h - 1) : f && (d3.dir = "/"), d3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          d2.posix = d2, a2.exports = d2;
        } }, c = {};
        function d(a2) {
          var e = c[a2];
          if (void 0 !== e) return e.exports;
          var f = c[a2] = { exports: {} }, g = true;
          try {
            b[a2](f, f.exports, d), g = false;
          } finally {
            g && delete c[a2];
          }
          return f.exports;
        }
        d.ab = "//", a.exports = d(114);
      }();
    }, 58: (a, b, c) => {
      "use strict";
      c.d(b, { l: () => d });
      class d {
        static get(a2, b2, c2) {
          let d2 = Reflect.get(a2, b2, c2);
          return "function" == typeof d2 ? d2.bind(a2) : d2;
        }
        static set(a2, b2, c2, d2) {
          return Reflect.set(a2, b2, c2, d2);
        }
        static has(a2, b2) {
          return Reflect.has(a2, b2);
        }
        static deleteProperty(a2, b2) {
          return Reflect.deleteProperty(a2, b2);
        }
      }
    }, 213: (a, b, c) => {
      "use strict";
      c.d(b, { n: () => e });
      var d = c(507);
      function e(a2) {
        if ("object" != typeof a2 || null === a2 || !("digest" in a2) || "string" != typeof a2.digest) return false;
        let b2 = a2.digest.split(";"), [c2, e2] = b2, f = b2.slice(2, -2).join(";"), g = Number(b2.at(-2));
        return "NEXT_REDIRECT" === c2 && ("replace" === e2 || "push" === e2) && "string" == typeof f && !isNaN(g) && g in d.Q;
      }
    }, 232: (a) => {
      (() => {
        "use strict";
        var b = { 993: (a2) => {
          var b2 = Object.prototype.hasOwnProperty, c2 = "~";
          function d2() {
          }
          function e2(a3, b3, c3) {
            this.fn = a3, this.context = b3, this.once = c3 || false;
          }
          function f(a3, b3, d3, f2, g2) {
            if ("function" != typeof d3) throw TypeError("The listener must be a function");
            var h2 = new e2(d3, f2 || a3, g2), i = c2 ? c2 + b3 : b3;
            return a3._events[i] ? a3._events[i].fn ? a3._events[i] = [a3._events[i], h2] : a3._events[i].push(h2) : (a3._events[i] = h2, a3._eventsCount++), a3;
          }
          function g(a3, b3) {
            0 == --a3._eventsCount ? a3._events = new d2() : delete a3._events[b3];
          }
          function h() {
            this._events = new d2(), this._eventsCount = 0;
          }
          Object.create && (d2.prototype = /* @__PURE__ */ Object.create(null), new d2().__proto__ || (c2 = false)), h.prototype.eventNames = function() {
            var a3, d3, e3 = [];
            if (0 === this._eventsCount) return e3;
            for (d3 in a3 = this._events) b2.call(a3, d3) && e3.push(c2 ? d3.slice(1) : d3);
            return Object.getOwnPropertySymbols ? e3.concat(Object.getOwnPropertySymbols(a3)) : e3;
          }, h.prototype.listeners = function(a3) {
            var b3 = c2 ? c2 + a3 : a3, d3 = this._events[b3];
            if (!d3) return [];
            if (d3.fn) return [d3.fn];
            for (var e3 = 0, f2 = d3.length, g2 = Array(f2); e3 < f2; e3++) g2[e3] = d3[e3].fn;
            return g2;
          }, h.prototype.listenerCount = function(a3) {
            var b3 = c2 ? c2 + a3 : a3, d3 = this._events[b3];
            return d3 ? d3.fn ? 1 : d3.length : 0;
          }, h.prototype.emit = function(a3, b3, d3, e3, f2, g2) {
            var h2 = c2 ? c2 + a3 : a3;
            if (!this._events[h2]) return false;
            var i, j, k = this._events[h2], l = arguments.length;
            if (k.fn) {
              switch (k.once && this.removeListener(a3, k.fn, void 0, true), l) {
                case 1:
                  return k.fn.call(k.context), true;
                case 2:
                  return k.fn.call(k.context, b3), true;
                case 3:
                  return k.fn.call(k.context, b3, d3), true;
                case 4:
                  return k.fn.call(k.context, b3, d3, e3), true;
                case 5:
                  return k.fn.call(k.context, b3, d3, e3, f2), true;
                case 6:
                  return k.fn.call(k.context, b3, d3, e3, f2, g2), true;
              }
              for (j = 1, i = Array(l - 1); j < l; j++) i[j - 1] = arguments[j];
              k.fn.apply(k.context, i);
            } else {
              var m, n = k.length;
              for (j = 0; j < n; j++) switch (k[j].once && this.removeListener(a3, k[j].fn, void 0, true), l) {
                case 1:
                  k[j].fn.call(k[j].context);
                  break;
                case 2:
                  k[j].fn.call(k[j].context, b3);
                  break;
                case 3:
                  k[j].fn.call(k[j].context, b3, d3);
                  break;
                case 4:
                  k[j].fn.call(k[j].context, b3, d3, e3);
                  break;
                default:
                  if (!i) for (m = 1, i = Array(l - 1); m < l; m++) i[m - 1] = arguments[m];
                  k[j].fn.apply(k[j].context, i);
              }
            }
            return true;
          }, h.prototype.on = function(a3, b3, c3) {
            return f(this, a3, b3, c3, false);
          }, h.prototype.once = function(a3, b3, c3) {
            return f(this, a3, b3, c3, true);
          }, h.prototype.removeListener = function(a3, b3, d3, e3) {
            var f2 = c2 ? c2 + a3 : a3;
            if (!this._events[f2]) return this;
            if (!b3) return g(this, f2), this;
            var h2 = this._events[f2];
            if (h2.fn) h2.fn !== b3 || e3 && !h2.once || d3 && h2.context !== d3 || g(this, f2);
            else {
              for (var i = 0, j = [], k = h2.length; i < k; i++) (h2[i].fn !== b3 || e3 && !h2[i].once || d3 && h2[i].context !== d3) && j.push(h2[i]);
              j.length ? this._events[f2] = 1 === j.length ? j[0] : j : g(this, f2);
            }
            return this;
          }, h.prototype.removeAllListeners = function(a3) {
            var b3;
            return a3 ? (b3 = c2 ? c2 + a3 : a3, this._events[b3] && g(this, b3)) : (this._events = new d2(), this._eventsCount = 0), this;
          }, h.prototype.off = h.prototype.removeListener, h.prototype.addListener = h.prototype.on, h.prefixed = c2, h.EventEmitter = h, a2.exports = h;
        }, 213: (a2) => {
          a2.exports = (a3, b2) => (b2 = b2 || (() => {
          }), a3.then((a4) => new Promise((a5) => {
            a5(b2());
          }).then(() => a4), (a4) => new Promise((a5) => {
            a5(b2());
          }).then(() => {
            throw a4;
          })));
        }, 574: (a2, b2) => {
          Object.defineProperty(b2, "__esModule", { value: true }), b2.default = function(a3, b3, c2) {
            let d2 = 0, e2 = a3.length;
            for (; e2 > 0; ) {
              let f = e2 / 2 | 0, g = d2 + f;
              0 >= c2(a3[g], b3) ? (d2 = ++g, e2 -= f + 1) : e2 = f;
            }
            return d2;
          };
        }, 821: (a2, b2, c2) => {
          Object.defineProperty(b2, "__esModule", { value: true });
          let d2 = c2(574);
          class e2 {
            constructor() {
              this._queue = [];
            }
            enqueue(a3, b3) {
              let c3 = { priority: (b3 = Object.assign({ priority: 0 }, b3)).priority, run: a3 };
              if (this.size && this._queue[this.size - 1].priority >= b3.priority) return void this._queue.push(c3);
              let e3 = d2.default(this._queue, c3, (a4, b4) => b4.priority - a4.priority);
              this._queue.splice(e3, 0, c3);
            }
            dequeue() {
              let a3 = this._queue.shift();
              return null == a3 ? void 0 : a3.run;
            }
            filter(a3) {
              return this._queue.filter((b3) => b3.priority === a3.priority).map((a4) => a4.run);
            }
            get size() {
              return this._queue.length;
            }
          }
          b2.default = e2;
        }, 816: (a2, b2, c2) => {
          let d2 = c2(213);
          class e2 extends Error {
            constructor(a3) {
              super(a3), this.name = "TimeoutError";
            }
          }
          let f = (a3, b3, c3) => new Promise((f2, g) => {
            if ("number" != typeof b3 || b3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (b3 === 1 / 0) return void f2(a3);
            let h = setTimeout(() => {
              if ("function" == typeof c3) {
                try {
                  f2(c3());
                } catch (a4) {
                  g(a4);
                }
                return;
              }
              let d3 = "string" == typeof c3 ? c3 : `Promise timed out after ${b3} milliseconds`, h2 = c3 instanceof Error ? c3 : new e2(d3);
              "function" == typeof a3.cancel && a3.cancel(), g(h2);
            }, b3);
            d2(a3.then(f2, g), () => {
              clearTimeout(h);
            });
          });
          a2.exports = f, a2.exports.default = f, a2.exports.TimeoutError = e2;
        } }, c = {};
        function d(a2) {
          var e2 = c[a2];
          if (void 0 !== e2) return e2.exports;
          var f = c[a2] = { exports: {} }, g = true;
          try {
            b[a2](f, f.exports, d), g = false;
          } finally {
            g && delete c[a2];
          }
          return f.exports;
        }
        d.ab = "//";
        var e = {};
        (() => {
          Object.defineProperty(e, "__esModule", { value: true });
          let a2 = d(993), b2 = d(816), c2 = d(821), f = () => {
          }, g = new b2.TimeoutError();
          class h extends a2 {
            constructor(a3) {
              var b3, d2, e2, g2;
              if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = f, this._resolveIdle = f, !("number" == typeof (a3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: c2.default }, a3)).intervalCap && a3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (d2 = null == (b3 = a3.intervalCap) ? void 0 : b3.toString()) ? d2 : ""}\` (${typeof a3.intervalCap})`);
              if (void 0 === a3.interval || !(Number.isFinite(a3.interval) && a3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (g2 = null == (e2 = a3.interval) ? void 0 : e2.toString()) ? g2 : ""}\` (${typeof a3.interval})`);
              this._carryoverConcurrencyCount = a3.carryoverConcurrencyCount, this._isIntervalIgnored = a3.intervalCap === 1 / 0 || 0 === a3.interval, this._intervalCap = a3.intervalCap, this._interval = a3.interval, this._queue = new a3.queueClass(), this._queueClass = a3.queueClass, this.concurrency = a3.concurrency, this._timeout = a3.timeout, this._throwOnTimeout = true === a3.throwOnTimeout, this._isPaused = false === a3.autoStart;
            }
            get _doesIntervalAllowAnother() {
              return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
              return this._pendingCount < this._concurrency;
            }
            _next() {
              this._pendingCount--, this._tryToStartAnother(), this.emit("next");
            }
            _resolvePromises() {
              this._resolveEmpty(), this._resolveEmpty = f, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = f, this.emit("idle"));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
            }
            _isIntervalPaused() {
              let a3 = Date.now();
              if (void 0 === this._intervalId) {
                let b3 = this._intervalEnd - a3;
                if (!(b3 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                  this._onResumeInterval();
                }, b3)), true;
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
              }
              return false;
            }
            _tryToStartAnother() {
              if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
              if (!this._isPaused) {
                let a3 = !this._isIntervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                  let b3 = this._queue.dequeue();
                  return !!b3 && (this.emit("active"), b3(), a3 && this._initializeIntervalIfNeeded(), true);
                }
              }
              return false;
            }
            _initializeIntervalIfNeeded() {
              this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
                this._onInterval();
              }, this._interval), this._intervalEnd = Date.now() + this._interval);
            }
            _onInterval() {
              0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
            }
            _processQueue() {
              for (; this._tryToStartAnother(); ) ;
            }
            get concurrency() {
              return this._concurrency;
            }
            set concurrency(a3) {
              if (!("number" == typeof a3 && a3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${a3}\` (${typeof a3})`);
              this._concurrency = a3, this._processQueue();
            }
            async add(a3, c3 = {}) {
              return new Promise((d2, e2) => {
                let f2 = async () => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    let f3 = void 0 === this._timeout && void 0 === c3.timeout ? a3() : b2.default(Promise.resolve(a3()), void 0 === c3.timeout ? this._timeout : c3.timeout, () => {
                      (void 0 === c3.throwOnTimeout ? this._throwOnTimeout : c3.throwOnTimeout) && e2(g);
                    });
                    d2(await f3);
                  } catch (a4) {
                    e2(a4);
                  }
                  this._next();
                };
                this._queue.enqueue(f2, c3), this._tryToStartAnother(), this.emit("add");
              });
            }
            async addAll(a3, b3) {
              return Promise.all(a3.map(async (a4) => this.add(a4, b3)));
            }
            start() {
              return this._isPaused && (this._isPaused = false, this._processQueue()), this;
            }
            pause() {
              this._isPaused = true;
            }
            clear() {
              this._queue = new this._queueClass();
            }
            async onEmpty() {
              if (0 !== this._queue.size) return new Promise((a3) => {
                let b3 = this._resolveEmpty;
                this._resolveEmpty = () => {
                  b3(), a3();
                };
              });
            }
            async onIdle() {
              if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((a3) => {
                let b3 = this._resolveIdle;
                this._resolveIdle = () => {
                  b3(), a3();
                };
              });
            }
            get size() {
              return this._queue.size;
            }
            sizeBy(a3) {
              return this._queue.filter(a3).length;
            }
            get pending() {
              return this._pendingCount;
            }
            get isPaused() {
              return this._isPaused;
            }
            get timeout() {
              return this._timeout;
            }
            set timeout(a3) {
              this._timeout = a3;
            }
          }
          e.default = h;
        })(), a.exports = e;
      })();
    }, 259: (a) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var b = {};
        (() => {
          function a2(a3, b2) {
            void 0 === b2 && (b2 = {});
            for (var c2 = function(a4) {
              for (var b3 = [], c3 = 0; c3 < a4.length; ) {
                var d3 = a4[c3];
                if ("*" === d3 || "+" === d3 || "?" === d3) {
                  b3.push({ type: "MODIFIER", index: c3, value: a4[c3++] });
                  continue;
                }
                if ("\\" === d3) {
                  b3.push({ type: "ESCAPED_CHAR", index: c3++, value: a4[c3++] });
                  continue;
                }
                if ("{" === d3) {
                  b3.push({ type: "OPEN", index: c3, value: a4[c3++] });
                  continue;
                }
                if ("}" === d3) {
                  b3.push({ type: "CLOSE", index: c3, value: a4[c3++] });
                  continue;
                }
                if (":" === d3) {
                  for (var e2 = "", f3 = c3 + 1; f3 < a4.length; ) {
                    var g3 = a4.charCodeAt(f3);
                    if (g3 >= 48 && g3 <= 57 || g3 >= 65 && g3 <= 90 || g3 >= 97 && g3 <= 122 || 95 === g3) {
                      e2 += a4[f3++];
                      continue;
                    }
                    break;
                  }
                  if (!e2) throw TypeError("Missing parameter name at ".concat(c3));
                  b3.push({ type: "NAME", index: c3, value: e2 }), c3 = f3;
                  continue;
                }
                if ("(" === d3) {
                  var h3 = 1, i2 = "", f3 = c3 + 1;
                  if ("?" === a4[f3]) throw TypeError('Pattern cannot start with "?" at '.concat(f3));
                  for (; f3 < a4.length; ) {
                    if ("\\" === a4[f3]) {
                      i2 += a4[f3++] + a4[f3++];
                      continue;
                    }
                    if (")" === a4[f3]) {
                      if (0 == --h3) {
                        f3++;
                        break;
                      }
                    } else if ("(" === a4[f3] && (h3++, "?" !== a4[f3 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(f3));
                    i2 += a4[f3++];
                  }
                  if (h3) throw TypeError("Unbalanced pattern at ".concat(c3));
                  if (!i2) throw TypeError("Missing pattern at ".concat(c3));
                  b3.push({ type: "PATTERN", index: c3, value: i2 }), c3 = f3;
                  continue;
                }
                b3.push({ type: "CHAR", index: c3, value: a4[c3++] });
              }
              return b3.push({ type: "END", index: c3, value: "" }), b3;
            }(a3), d2 = b2.prefixes, f2 = void 0 === d2 ? "./" : d2, g2 = b2.delimiter, h2 = void 0 === g2 ? "/#?" : g2, i = [], j = 0, k = 0, l = "", m = function(a4) {
              if (k < c2.length && c2[k].type === a4) return c2[k++].value;
            }, n = function(a4) {
              var b3 = m(a4);
              if (void 0 !== b3) return b3;
              var d3 = c2[k], e2 = d3.type, f3 = d3.index;
              throw TypeError("Unexpected ".concat(e2, " at ").concat(f3, ", expected ").concat(a4));
            }, o = function() {
              for (var a4, b3 = ""; a4 = m("CHAR") || m("ESCAPED_CHAR"); ) b3 += a4;
              return b3;
            }, p = function(a4) {
              for (var b3 = 0; b3 < h2.length; b3++) {
                var c3 = h2[b3];
                if (a4.indexOf(c3) > -1) return true;
              }
              return false;
            }, q = function(a4) {
              var b3 = i[i.length - 1], c3 = a4 || (b3 && "string" == typeof b3 ? b3 : "");
              if (b3 && !c3) throw TypeError('Must have text between two parameters, missing text after "'.concat(b3.name, '"'));
              return !c3 || p(c3) ? "[^".concat(e(h2), "]+?") : "(?:(?!".concat(e(c3), ")[^").concat(e(h2), "])+?");
            }; k < c2.length; ) {
              var r = m("CHAR"), s = m("NAME"), t = m("PATTERN");
              if (s || t) {
                var u = r || "";
                -1 === f2.indexOf(u) && (l += u, u = ""), l && (i.push(l), l = ""), i.push({ name: s || j++, prefix: u, suffix: "", pattern: t || q(u), modifier: m("MODIFIER") || "" });
                continue;
              }
              var v = r || m("ESCAPED_CHAR");
              if (v) {
                l += v;
                continue;
              }
              if (l && (i.push(l), l = ""), m("OPEN")) {
                var u = o(), w = m("NAME") || "", x = m("PATTERN") || "", y = o();
                n("CLOSE"), i.push({ name: w || (x ? j++ : ""), pattern: w && !x ? q(u) : x, prefix: u, suffix: y, modifier: m("MODIFIER") || "" });
                continue;
              }
              n("END");
            }
            return i;
          }
          function c(a3, b2) {
            void 0 === b2 && (b2 = {});
            var c2 = f(b2), d2 = b2.encode, e2 = void 0 === d2 ? function(a4) {
              return a4;
            } : d2, g2 = b2.validate, h2 = void 0 === g2 || g2, i = a3.map(function(a4) {
              if ("object" == typeof a4) return new RegExp("^(?:".concat(a4.pattern, ")$"), c2);
            });
            return function(b3) {
              for (var c3 = "", d3 = 0; d3 < a3.length; d3++) {
                var f2 = a3[d3];
                if ("string" == typeof f2) {
                  c3 += f2;
                  continue;
                }
                var g3 = b3 ? b3[f2.name] : void 0, j = "?" === f2.modifier || "*" === f2.modifier, k = "*" === f2.modifier || "+" === f2.modifier;
                if (Array.isArray(g3)) {
                  if (!k) throw TypeError('Expected "'.concat(f2.name, '" to not repeat, but got an array'));
                  if (0 === g3.length) {
                    if (j) continue;
                    throw TypeError('Expected "'.concat(f2.name, '" to not be empty'));
                  }
                  for (var l = 0; l < g3.length; l++) {
                    var m = e2(g3[l], f2);
                    if (h2 && !i[d3].test(m)) throw TypeError('Expected all "'.concat(f2.name, '" to match "').concat(f2.pattern, '", but got "').concat(m, '"'));
                    c3 += f2.prefix + m + f2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof g3 || "number" == typeof g3) {
                  var m = e2(String(g3), f2);
                  if (h2 && !i[d3].test(m)) throw TypeError('Expected "'.concat(f2.name, '" to match "').concat(f2.pattern, '", but got "').concat(m, '"'));
                  c3 += f2.prefix + m + f2.suffix;
                  continue;
                }
                if (!j) {
                  var n = k ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(f2.name, '" to be ').concat(n));
                }
              }
              return c3;
            };
          }
          function d(a3, b2, c2) {
            void 0 === c2 && (c2 = {});
            var d2 = c2.decode, e2 = void 0 === d2 ? function(a4) {
              return a4;
            } : d2;
            return function(c3) {
              var d3 = a3.exec(c3);
              if (!d3) return false;
              for (var f2 = d3[0], g2 = d3.index, h2 = /* @__PURE__ */ Object.create(null), i = 1; i < d3.length; i++) !function(a4) {
                if (void 0 !== d3[a4]) {
                  var c4 = b2[a4 - 1];
                  "*" === c4.modifier || "+" === c4.modifier ? h2[c4.name] = d3[a4].split(c4.prefix + c4.suffix).map(function(a5) {
                    return e2(a5, c4);
                  }) : h2[c4.name] = e2(d3[a4], c4);
                }
              }(i);
              return { path: f2, index: g2, params: h2 };
            };
          }
          function e(a3) {
            return a3.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function f(a3) {
            return a3 && a3.sensitive ? "" : "i";
          }
          function g(a3, b2, c2) {
            void 0 === c2 && (c2 = {});
            for (var d2 = c2.strict, g2 = void 0 !== d2 && d2, h2 = c2.start, i = c2.end, j = c2.encode, k = void 0 === j ? function(a4) {
              return a4;
            } : j, l = c2.delimiter, m = c2.endsWith, n = "[".concat(e(void 0 === m ? "" : m), "]|$"), o = "[".concat(e(void 0 === l ? "/#?" : l), "]"), p = void 0 === h2 || h2 ? "^" : "", q = 0; q < a3.length; q++) {
              var r = a3[q];
              if ("string" == typeof r) p += e(k(r));
              else {
                var s = e(k(r.prefix)), t = e(k(r.suffix));
                if (r.pattern) if (b2 && b2.push(r), s || t) if ("+" === r.modifier || "*" === r.modifier) {
                  var u = "*" === r.modifier ? "?" : "";
                  p += "(?:".concat(s, "((?:").concat(r.pattern, ")(?:").concat(t).concat(s, "(?:").concat(r.pattern, "))*)").concat(t, ")").concat(u);
                } else p += "(?:".concat(s, "(").concat(r.pattern, ")").concat(t, ")").concat(r.modifier);
                else {
                  if ("+" === r.modifier || "*" === r.modifier) throw TypeError('Can not repeat "'.concat(r.name, '" without a prefix and suffix'));
                  p += "(".concat(r.pattern, ")").concat(r.modifier);
                }
                else p += "(?:".concat(s).concat(t, ")").concat(r.modifier);
              }
            }
            if (void 0 === i || i) g2 || (p += "".concat(o, "?")), p += c2.endsWith ? "(?=".concat(n, ")") : "$";
            else {
              var v = a3[a3.length - 1], w = "string" == typeof v ? o.indexOf(v[v.length - 1]) > -1 : void 0 === v;
              g2 || (p += "(?:".concat(o, "(?=").concat(n, "))?")), w || (p += "(?=".concat(o, "|").concat(n, ")"));
            }
            return new RegExp(p, f(c2));
          }
          function h(b2, c2, d2) {
            if (b2 instanceof RegExp) {
              var e2;
              if (!c2) return b2;
              for (var i = /\((?:\?<(.*?)>)?(?!\?)/g, j = 0, k = i.exec(b2.source); k; ) c2.push({ name: k[1] || j++, prefix: "", suffix: "", modifier: "", pattern: "" }), k = i.exec(b2.source);
              return b2;
            }
            return Array.isArray(b2) ? (e2 = b2.map(function(a3) {
              return h(a3, c2, d2).source;
            }), new RegExp("(?:".concat(e2.join("|"), ")"), f(d2))) : g(a2(b2, d2), c2, d2);
          }
          Object.defineProperty(b, "__esModule", { value: true }), b.pathToRegexp = b.tokensToRegexp = b.regexpToFunction = b.match = b.tokensToFunction = b.compile = b.parse = void 0, b.parse = a2, b.compile = function(b2, d2) {
            return c(a2(b2, d2), d2);
          }, b.tokensToFunction = c, b.match = function(a3, b2) {
            var c2 = [];
            return d(h(a3, c2, b2), c2, b2);
          }, b.regexpToFunction = d, b.tokensToRegexp = g, b.pathToRegexp = h;
        })(), a.exports = b;
      })();
    }, 271: (a, b, c) => {
      "use strict";
      c.d(b, { o: () => f });
      var d = c(58);
      class e extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new e();
        }
      }
      class f extends Headers {
        constructor(a2) {
          super(), this.headers = new Proxy(a2, { get(b2, c2, e2) {
            if ("symbol" == typeof c2) return d.l.get(b2, c2, e2);
            let f2 = c2.toLowerCase(), g = Object.keys(a2).find((a3) => a3.toLowerCase() === f2);
            if (void 0 !== g) return d.l.get(b2, g, e2);
          }, set(b2, c2, e2, f2) {
            if ("symbol" == typeof c2) return d.l.set(b2, c2, e2, f2);
            let g = c2.toLowerCase(), h = Object.keys(a2).find((a3) => a3.toLowerCase() === g);
            return d.l.set(b2, h ?? c2, e2, f2);
          }, has(b2, c2) {
            if ("symbol" == typeof c2) return d.l.has(b2, c2);
            let e2 = c2.toLowerCase(), f2 = Object.keys(a2).find((a3) => a3.toLowerCase() === e2);
            return void 0 !== f2 && d.l.has(b2, f2);
          }, deleteProperty(b2, c2) {
            if ("symbol" == typeof c2) return d.l.deleteProperty(b2, c2);
            let e2 = c2.toLowerCase(), f2 = Object.keys(a2).find((a3) => a3.toLowerCase() === e2);
            return void 0 === f2 || d.l.deleteProperty(b2, f2);
          } });
        }
        static seal(a2) {
          return new Proxy(a2, { get(a3, b2, c2) {
            switch (b2) {
              case "append":
              case "delete":
              case "set":
                return e.callable;
              default:
                return d.l.get(a3, b2, c2);
            }
          } });
        }
        merge(a2) {
          return Array.isArray(a2) ? a2.join(", ") : a2;
        }
        static from(a2) {
          return a2 instanceof Headers ? a2 : new f(a2);
        }
        append(a2, b2) {
          let c2 = this.headers[a2];
          "string" == typeof c2 ? this.headers[a2] = [c2, b2] : Array.isArray(c2) ? c2.push(b2) : this.headers[a2] = b2;
        }
        delete(a2) {
          delete this.headers[a2];
        }
        get(a2) {
          let b2 = this.headers[a2];
          return void 0 !== b2 ? this.merge(b2) : null;
        }
        has(a2) {
          return void 0 !== this.headers[a2];
        }
        set(a2, b2) {
          this.headers[a2] = b2;
        }
        forEach(a2, b2) {
          for (let [c2, d2] of this.entries()) a2.call(b2, d2, c2, this);
        }
        *entries() {
          for (let a2 of Object.keys(this.headers)) {
            let b2 = a2.toLowerCase(), c2 = this.get(b2);
            yield [b2, c2];
          }
        }
        *keys() {
          for (let a2 of Object.keys(this.headers)) {
            let b2 = a2.toLowerCase();
            yield b2;
          }
        }
        *values() {
          for (let a2 of Object.keys(this.headers)) {
            let b2 = this.get(a2);
            yield b2;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
    }, 297: (a, b, c) => {
      "use strict";
      function d(a2) {
        return "object" == typeof a2 && null !== a2 && "digest" in a2 && "BAILOUT_TO_CLIENT_SIDE_RENDERING" === a2.digest;
      }
      c.d(b, { C: () => d });
    }, 318: (a, b, c) => {
      "use strict";
      var d = c(356).Buffer;
      Object.defineProperty(b, "__esModule", { value: true });
      var e = { handleFetch: function() {
        return j;
      }, interceptFetch: function() {
        return k;
      }, reader: function() {
        return h;
      } };
      for (var f in e) Object.defineProperty(b, f, { enumerable: true, get: e[f] });
      let g = c(643), h = { url: (a2) => a2.url, header: (a2, b2) => a2.headers.get(b2) };
      async function i(a2, b2) {
        let { url: c2, method: e2, headers: f2, body: g2, cache: h2, credentials: i2, integrity: j2, mode: k2, redirect: l, referrer: m, referrerPolicy: n } = b2;
        return { testData: a2, api: "fetch", request: { url: c2, method: e2, headers: [...Array.from(f2), ["next-test-stack", function() {
          let a3 = (Error().stack ?? "").split("\n");
          for (let b3 = 1; b3 < a3.length; b3++) if (a3[b3].length > 0) {
            a3 = a3.slice(b3);
            break;
          }
          return (a3 = (a3 = (a3 = a3.filter((a4) => !a4.includes("/next/dist/"))).slice(0, 5)).map((a4) => a4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: g2 ? d.from(await b2.arrayBuffer()).toString("base64") : null, cache: h2, credentials: i2, integrity: j2, mode: k2, redirect: l, referrer: m, referrerPolicy: n } };
      }
      async function j(a2, b2) {
        let c2 = (0, g.getTestReqInfo)(b2, h);
        if (!c2) return a2(b2);
        let { testData: e2, proxyPort: f2 } = c2, j2 = await i(e2, b2), k2 = await a2(`http://localhost:${f2}`, { method: "POST", body: JSON.stringify(j2), next: { internal: true } });
        if (!k2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${k2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let l = await k2.json(), { api: m } = l;
        switch (m) {
          case "continue":
            return a2(b2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${b2.method} ${b2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(a3) {
              let { status: b3, headers: c3, body: e3 } = a3.response;
              return new Response(e3 ? d.from(e3, "base64") : null, { status: b3, headers: new Headers(c3) });
            }(l);
          default:
            return m;
        }
      }
      function k(a2) {
        return c.g.fetch = function(b2, c2) {
          var d2;
          return (null == c2 || null == (d2 = c2.next) ? void 0 : d2.internal) ? a2(b2, c2) : j(a2, new Request(b2, c2));
        }, () => {
          c.g.fetch = a2;
        };
      }
    }, 319: (a, b, c) => {
      "use strict";
      c.d(b, { s: () => d });
      let d = (0, c(677).xl)();
    }, 345: (a, b, c) => {
      "use strict";
      a.exports = c(417);
    }, 356: (a) => {
      "use strict";
      a.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 387: (a, b, c) => {
      "use strict";
      c.d(b, { Ud: () => d.stringifyCookie, VO: () => d.ResponseCookies, tm: () => d.RequestCookies });
      var d = c(918);
    }, 391: (a, b, c) => {
      "use strict";
      c.d(b, { fm: () => i, E0: () => j, fV: () => g, M1: () => h, FP: () => d });
      let d = (0, c(677).xl)();
      var e, f = ((e = {})[e.Before = 1] = "Before", e[e.EarlyStatic = 2] = "EarlyStatic", e[e.Static = 3] = "Static", e[e.EarlyRuntime = 4] = "EarlyRuntime", e[e.Runtime = 5] = "Runtime", e[e.Dynamic = 6] = "Dynamic", e[e.Abandoned = 7] = "Abandoned", e);
      function g(a2) {
        let b2 = a2.stagedRendering;
        return !!b2 && (b2.currentStage === f.EarlyStatic || b2.currentStage === f.EarlyRuntime);
      }
      function h(a2) {
        throw Object.defineProperty(Error(`\`${a2}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E251", enumerable: false, configurable: true });
      }
      function i(a2) {
        switch (a2.type) {
          case "prerender":
          case "prerender-runtime":
          case "prerender-ppr":
          case "prerender-client":
          case "validation-client":
            return a2.prerenderResumeDataCache;
          case "request":
            if (a2.prerenderResumeDataCache) return a2.prerenderResumeDataCache;
          case "prerender-legacy":
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "generate-static-params":
            return null;
          default:
            return a2;
        }
      }
      function j(a2) {
        switch (a2.type) {
          case "request":
          case "prerender":
          case "prerender-runtime":
          case "prerender-client":
          case "validation-client":
            if (a2.renderResumeDataCache) return a2.renderResumeDataCache;
          case "prerender-ppr":
            return a2.prerenderResumeDataCache ?? null;
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "prerender-legacy":
          case "generate-static-params":
            return null;
          default:
            return a2;
        }
      }
    }, 417: (a, b) => {
      "use strict";
      var c = { H: null, A: null };
      function d(a2) {
        var b2 = "https://react.dev/errors/" + a2;
        if (1 < arguments.length) {
          b2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var c2 = 2; c2 < arguments.length; c2++) b2 += "&args[]=" + encodeURIComponent(arguments[c2]);
        }
        return "Minified React error #" + a2 + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var e = Array.isArray;
      function f() {
      }
      var g = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), j = Symbol.for("react.strict_mode"), k = Symbol.for("react.profiler"), l = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), n = Symbol.for("react.memo"), o = Symbol.for("react.lazy"), p = Symbol.for("react.activity"), q = Symbol.for("react.view_transition"), r = Symbol.iterator, s = Object.prototype.hasOwnProperty, t = Object.assign;
      function u(a2, b2, c2) {
        var d2 = c2.ref;
        return { $$typeof: g, type: a2, key: b2, ref: void 0 !== d2 ? d2 : null, props: c2 };
      }
      function v(a2) {
        return "object" == typeof a2 && null !== a2 && a2.$$typeof === g;
      }
      var w = /\/+/g;
      function x(a2, b2) {
        var c2, d2;
        return "object" == typeof a2 && null !== a2 && null != a2.key ? (c2 = "" + a2.key, d2 = { "=": "=0", ":": "=2" }, "$" + c2.replace(/[=:]/g, function(a3) {
          return d2[a3];
        })) : b2.toString(36);
      }
      function y(a2, b2, c2) {
        if (null == a2) return a2;
        var i2 = [], j2 = 0;
        return !function a3(b3, c3, i3, j3, k2) {
          var l2, m2, n2, p2 = typeof b3;
          ("undefined" === p2 || "boolean" === p2) && (b3 = null);
          var q2 = false;
          if (null === b3) q2 = true;
          else switch (p2) {
            case "bigint":
            case "string":
            case "number":
              q2 = true;
              break;
            case "object":
              switch (b3.$$typeof) {
                case g:
                case h:
                  q2 = true;
                  break;
                case o:
                  return a3((q2 = b3._init)(b3._payload), c3, i3, j3, k2);
              }
          }
          if (q2) return k2 = k2(b3), q2 = "" === j3 ? "." + x(b3, 0) : j3, e(k2) ? (i3 = "", null != q2 && (i3 = q2.replace(w, "$&/") + "/"), a3(k2, c3, i3, "", function(a4) {
            return a4;
          })) : null != k2 && (v(k2) && (l2 = k2, m2 = i3 + (null == k2.key || b3 && b3.key === k2.key ? "" : ("" + k2.key).replace(w, "$&/") + "/") + q2, k2 = u(l2.type, m2, l2.props)), c3.push(k2)), 1;
          q2 = 0;
          var s2 = "" === j3 ? "." : j3 + ":";
          if (e(b3)) for (var t2 = 0; t2 < b3.length; t2++) p2 = s2 + x(j3 = b3[t2], t2), q2 += a3(j3, c3, i3, p2, k2);
          else if ("function" == typeof (t2 = null === (n2 = b3) || "object" != typeof n2 ? null : "function" == typeof (n2 = r && n2[r] || n2["@@iterator"]) ? n2 : null)) for (b3 = t2.call(b3), t2 = 0; !(j3 = b3.next()).done; ) p2 = s2 + x(j3 = j3.value, t2++), q2 += a3(j3, c3, i3, p2, k2);
          else if ("object" === p2) {
            if ("function" == typeof b3.then) return a3(function(a4) {
              switch (a4.status) {
                case "fulfilled":
                  return a4.value;
                case "rejected":
                  throw a4.reason;
                default:
                  switch ("string" == typeof a4.status ? a4.then(f, f) : (a4.status = "pending", a4.then(function(b4) {
                    "pending" === a4.status && (a4.status = "fulfilled", a4.value = b4);
                  }, function(b4) {
                    "pending" === a4.status && (a4.status = "rejected", a4.reason = b4);
                  })), a4.status) {
                    case "fulfilled":
                      return a4.value;
                    case "rejected":
                      throw a4.reason;
                  }
              }
              throw a4;
            }(b3), c3, i3, j3, k2);
            throw Error(d(31, "[object Object]" === (c3 = String(b3)) ? "object with keys {" + Object.keys(b3).join(", ") + "}" : c3));
          }
          return q2;
        }(a2, i2, "", "", function(a3) {
          return b2.call(c2, a3, j2++);
        }), i2;
      }
      function z(a2) {
        if (-1 === a2._status) {
          var b2 = (0, a2._result)();
          b2.then(function(c2) {
            (0 === a2._status || -1 === a2._status) && (a2._status = 1, a2._result = c2, void 0 === b2.status && (b2.status = "fulfilled", b2.value = c2));
          }, function(c2) {
            (0 === a2._status || -1 === a2._status) && (a2._status = 2, a2._result = c2, void 0 === b2.status && (b2.status = "rejected", b2.reason = c2));
          }), -1 === a2._status && (a2._status = 0, a2._result = b2);
        }
        if (1 === a2._status) return a2._result.default;
        throw a2._result;
      }
      function A() {
        return /* @__PURE__ */ new WeakMap();
      }
      function B() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      b.Activity = p, b.Children = { map: y, forEach: function(a2, b2, c2) {
        y(a2, function() {
          b2.apply(this, arguments);
        }, c2);
      }, count: function(a2) {
        var b2 = 0;
        return y(a2, function() {
          b2++;
        }), b2;
      }, toArray: function(a2) {
        return y(a2, function(a3) {
          return a3;
        }) || [];
      }, only: function(a2) {
        if (!v(a2)) throw Error(d(143));
        return a2;
      } }, b.Fragment = i, b.Profiler = k, b.StrictMode = j, b.Suspense = m, b.ViewTransition = q, b.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = c, b.cache = function(a2) {
        return function() {
          var b2 = c.A;
          if (!b2) return a2.apply(null, arguments);
          var d2 = b2.getCacheForType(A);
          void 0 === (b2 = d2.get(a2)) && (b2 = B(), d2.set(a2, b2)), d2 = 0;
          for (var e2 = arguments.length; d2 < e2; d2++) {
            var f2 = arguments[d2];
            if ("function" == typeof f2 || "object" == typeof f2 && null !== f2) {
              var g2 = b2.o;
              null === g2 && (b2.o = g2 = /* @__PURE__ */ new WeakMap()), void 0 === (b2 = g2.get(f2)) && (b2 = B(), g2.set(f2, b2));
            } else null === (g2 = b2.p) && (b2.p = g2 = /* @__PURE__ */ new Map()), void 0 === (b2 = g2.get(f2)) && (b2 = B(), g2.set(f2, b2));
          }
          if (1 === b2.s) return b2.v;
          if (2 === b2.s) throw b2.v;
          try {
            var h2 = a2.apply(null, arguments);
            return (d2 = b2).s = 1, d2.v = h2;
          } catch (a3) {
            throw (h2 = b2).s = 2, h2.v = a3, a3;
          }
        };
      }, b.cacheSignal = function() {
        var a2 = c.A;
        return a2 ? a2.cacheSignal() : null;
      }, b.captureOwnerStack = function() {
        return null;
      }, b.cloneElement = function(a2, b2, c2) {
        if (null == a2) throw Error(d(267, a2));
        var e2 = t({}, a2.props), f2 = a2.key;
        if (null != b2) for (g2 in void 0 !== b2.key && (f2 = "" + b2.key), b2) s.call(b2, g2) && "key" !== g2 && "__self" !== g2 && "__source" !== g2 && ("ref" !== g2 || void 0 !== b2.ref) && (e2[g2] = b2[g2]);
        var g2 = arguments.length - 2;
        if (1 === g2) e2.children = c2;
        else if (1 < g2) {
          for (var h2 = Array(g2), i2 = 0; i2 < g2; i2++) h2[i2] = arguments[i2 + 2];
          e2.children = h2;
        }
        return u(a2.type, f2, e2);
      }, b.createElement = function(a2, b2, c2) {
        var d2, e2 = {}, f2 = null;
        if (null != b2) for (d2 in void 0 !== b2.key && (f2 = "" + b2.key), b2) s.call(b2, d2) && "key" !== d2 && "__self" !== d2 && "__source" !== d2 && (e2[d2] = b2[d2]);
        var g2 = arguments.length - 2;
        if (1 === g2) e2.children = c2;
        else if (1 < g2) {
          for (var h2 = Array(g2), i2 = 0; i2 < g2; i2++) h2[i2] = arguments[i2 + 2];
          e2.children = h2;
        }
        if (a2 && a2.defaultProps) for (d2 in g2 = a2.defaultProps) void 0 === e2[d2] && (e2[d2] = g2[d2]);
        return u(a2, f2, e2);
      }, b.createRef = function() {
        return { current: null };
      }, b.forwardRef = function(a2) {
        return { $$typeof: l, render: a2 };
      }, b.isValidElement = v, b.lazy = function(a2) {
        return { $$typeof: o, _payload: { _status: -1, _result: a2 }, _init: z };
      }, b.memo = function(a2, b2) {
        return { $$typeof: n, type: a2, compare: void 0 === b2 ? null : b2 };
      }, b.use = function(a2) {
        return c.H.use(a2);
      }, b.useCallback = function(a2, b2) {
        return c.H.useCallback(a2, b2);
      }, b.useDebugValue = function() {
      }, b.useId = function() {
        return c.H.useId();
      }, b.useMemo = function(a2, b2) {
        return c.H.useMemo(a2, b2);
      }, b.version = "19.3.0-canary-3f0b9e61-20260317";
    }, 446: (a, b, c) => {
      (() => {
        "use strict";
        let b2, d, e, f, g;
        var h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x = { 491: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ContextAPI = void 0;
          let d2 = c2(223), e2 = c2(172), f2 = c2(930), g2 = "context", h2 = new d2.NoopContextManager();
          class i2 {
            static getInstance() {
              return this._instance || (this._instance = new i2()), this._instance;
            }
            setGlobalContextManager(a3) {
              return (0, e2.registerGlobal)(g2, a3, f2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(a3, b4, c3, ...d3) {
              return this._getContextManager().with(a3, b4, c3, ...d3);
            }
            bind(a3, b4) {
              return this._getContextManager().bind(a3, b4);
            }
            _getContextManager() {
              return (0, e2.getGlobal)(g2) || h2;
            }
            disable() {
              this._getContextManager().disable(), (0, e2.unregisterGlobal)(g2, f2.DiagAPI.instance());
            }
          }
          b3.ContextAPI = i2;
        }, 930: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagAPI = void 0;
          let d2 = c2(56), e2 = c2(912), f2 = c2(957), g2 = c2(172);
          class h2 {
            constructor() {
              function a3(a4) {
                return function(...b5) {
                  let c3 = (0, g2.getGlobal)("diag");
                  if (c3) return c3[a4](...b5);
                };
              }
              const b4 = this;
              b4.setLogger = (a4, c3 = { logLevel: f2.DiagLogLevel.INFO }) => {
                var d3, h3, i2;
                if (a4 === b4) {
                  let a5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return b4.error(null != (d3 = a5.stack) ? d3 : a5.message), false;
                }
                "number" == typeof c3 && (c3 = { logLevel: c3 });
                let j2 = (0, g2.getGlobal)("diag"), k2 = (0, e2.createLogLevelDiagLogger)(null != (h3 = c3.logLevel) ? h3 : f2.DiagLogLevel.INFO, a4);
                if (j2 && !c3.suppressOverrideMessage) {
                  let a5 = null != (i2 = Error().stack) ? i2 : "<failed to generate stacktrace>";
                  j2.warn(`Current logger will be overwritten from ${a5}`), k2.warn(`Current logger will overwrite one already registered from ${a5}`);
                }
                return (0, g2.registerGlobal)("diag", k2, b4, true);
              }, b4.disable = () => {
                (0, g2.unregisterGlobal)("diag", b4);
              }, b4.createComponentLogger = (a4) => new d2.DiagComponentLogger(a4), b4.verbose = a3("verbose"), b4.debug = a3("debug"), b4.info = a3("info"), b4.warn = a3("warn"), b4.error = a3("error");
            }
            static instance() {
              return this._instance || (this._instance = new h2()), this._instance;
            }
          }
          b3.DiagAPI = h2;
        }, 653: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.MetricsAPI = void 0;
          let d2 = c2(660), e2 = c2(172), f2 = c2(930), g2 = "metrics";
          class h2 {
            static getInstance() {
              return this._instance || (this._instance = new h2()), this._instance;
            }
            setGlobalMeterProvider(a3) {
              return (0, e2.registerGlobal)(g2, a3, f2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, e2.getGlobal)(g2) || d2.NOOP_METER_PROVIDER;
            }
            getMeter(a3, b4, c3) {
              return this.getMeterProvider().getMeter(a3, b4, c3);
            }
            disable() {
              (0, e2.unregisterGlobal)(g2, f2.DiagAPI.instance());
            }
          }
          b3.MetricsAPI = h2;
        }, 181: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.PropagationAPI = void 0;
          let d2 = c2(172), e2 = c2(874), f2 = c2(194), g2 = c2(277), h2 = c2(369), i2 = c2(930), j2 = "propagation", k2 = new e2.NoopTextMapPropagator();
          class l2 {
            constructor() {
              this.createBaggage = h2.createBaggage, this.getBaggage = g2.getBaggage, this.getActiveBaggage = g2.getActiveBaggage, this.setBaggage = g2.setBaggage, this.deleteBaggage = g2.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new l2()), this._instance;
            }
            setGlobalPropagator(a3) {
              return (0, d2.registerGlobal)(j2, a3, i2.DiagAPI.instance());
            }
            inject(a3, b4, c3 = f2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(a3, b4, c3);
            }
            extract(a3, b4, c3 = f2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(a3, b4, c3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, d2.unregisterGlobal)(j2, i2.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, d2.getGlobal)(j2) || k2;
            }
          }
          b3.PropagationAPI = l2;
        }, 997: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceAPI = void 0;
          let d2 = c2(172), e2 = c2(846), f2 = c2(139), g2 = c2(607), h2 = c2(930), i2 = "trace";
          class j2 {
            constructor() {
              this._proxyTracerProvider = new e2.ProxyTracerProvider(), this.wrapSpanContext = f2.wrapSpanContext, this.isSpanContextValid = f2.isSpanContextValid, this.deleteSpan = g2.deleteSpan, this.getSpan = g2.getSpan, this.getActiveSpan = g2.getActiveSpan, this.getSpanContext = g2.getSpanContext, this.setSpan = g2.setSpan, this.setSpanContext = g2.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new j2()), this._instance;
            }
            setGlobalTracerProvider(a3) {
              let b4 = (0, d2.registerGlobal)(i2, this._proxyTracerProvider, h2.DiagAPI.instance());
              return b4 && this._proxyTracerProvider.setDelegate(a3), b4;
            }
            getTracerProvider() {
              return (0, d2.getGlobal)(i2) || this._proxyTracerProvider;
            }
            getTracer(a3, b4) {
              return this.getTracerProvider().getTracer(a3, b4);
            }
            disable() {
              (0, d2.unregisterGlobal)(i2, h2.DiagAPI.instance()), this._proxyTracerProvider = new e2.ProxyTracerProvider();
            }
          }
          b3.TraceAPI = j2;
        }, 277: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.deleteBaggage = b3.setBaggage = b3.getActiveBaggage = b3.getBaggage = void 0;
          let d2 = c2(491), e2 = (0, c2(780).createContextKey)("OpenTelemetry Baggage Key");
          function f2(a3) {
            return a3.getValue(e2) || void 0;
          }
          b3.getBaggage = f2, b3.getActiveBaggage = function() {
            return f2(d2.ContextAPI.getInstance().active());
          }, b3.setBaggage = function(a3, b4) {
            return a3.setValue(e2, b4);
          }, b3.deleteBaggage = function(a3) {
            return a3.deleteValue(e2);
          };
        }, 993: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.BaggageImpl = void 0;
          class c2 {
            constructor(a3) {
              this._entries = a3 ? new Map(a3) : /* @__PURE__ */ new Map();
            }
            getEntry(a3) {
              let b4 = this._entries.get(a3);
              if (b4) return Object.assign({}, b4);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([a3, b4]) => [a3, b4]);
            }
            setEntry(a3, b4) {
              let d2 = new c2(this._entries);
              return d2._entries.set(a3, b4), d2;
            }
            removeEntry(a3) {
              let b4 = new c2(this._entries);
              return b4._entries.delete(a3), b4;
            }
            removeEntries(...a3) {
              let b4 = new c2(this._entries);
              for (let c3 of a3) b4._entries.delete(c3);
              return b4;
            }
            clear() {
              return new c2();
            }
          }
          b3.BaggageImpl = c2;
        }, 830: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.baggageEntryMetadataSymbol = void 0, b3.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.baggageEntryMetadataFromString = b3.createBaggage = void 0;
          let d2 = c2(930), e2 = c2(993), f2 = c2(830), g2 = d2.DiagAPI.instance();
          b3.createBaggage = function(a3 = {}) {
            return new e2.BaggageImpl(new Map(Object.entries(a3)));
          }, b3.baggageEntryMetadataFromString = function(a3) {
            return "string" != typeof a3 && (g2.error(`Cannot create baggage metadata from unknown type: ${typeof a3}`), a3 = ""), { __TYPE__: f2.baggageEntryMetadataSymbol, toString: () => a3 };
          };
        }, 67: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.context = void 0, b3.context = c2(491).ContextAPI.getInstance();
        }, 223: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopContextManager = void 0;
          let d2 = c2(780);
          class e2 {
            active() {
              return d2.ROOT_CONTEXT;
            }
            with(a3, b4, c3, ...d3) {
              return b4.call(c3, ...d3);
            }
            bind(a3, b4) {
              return b4;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          b3.NoopContextManager = e2;
        }, 780: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ROOT_CONTEXT = b3.createContextKey = void 0, b3.createContextKey = function(a3) {
            return Symbol.for(a3);
          };
          class c2 {
            constructor(a3) {
              const b4 = this;
              b4._currentContext = a3 ? new Map(a3) : /* @__PURE__ */ new Map(), b4.getValue = (a4) => b4._currentContext.get(a4), b4.setValue = (a4, d2) => {
                let e2 = new c2(b4._currentContext);
                return e2._currentContext.set(a4, d2), e2;
              }, b4.deleteValue = (a4) => {
                let d2 = new c2(b4._currentContext);
                return d2._currentContext.delete(a4), d2;
              };
            }
          }
          b3.ROOT_CONTEXT = new c2();
        }, 506: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.diag = void 0, b3.diag = c2(930).DiagAPI.instance();
        }, 56: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagComponentLogger = void 0;
          let d2 = c2(172);
          class e2 {
            constructor(a3) {
              this._namespace = a3.namespace || "DiagComponentLogger";
            }
            debug(...a3) {
              return f2("debug", this._namespace, a3);
            }
            error(...a3) {
              return f2("error", this._namespace, a3);
            }
            info(...a3) {
              return f2("info", this._namespace, a3);
            }
            warn(...a3) {
              return f2("warn", this._namespace, a3);
            }
            verbose(...a3) {
              return f2("verbose", this._namespace, a3);
            }
          }
          function f2(a3, b4, c3) {
            let e3 = (0, d2.getGlobal)("diag");
            if (e3) return c3.unshift(b4), e3[a3](...c3);
          }
          b3.DiagComponentLogger = e2;
        }, 972: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagConsoleLogger = void 0;
          let c2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class d2 {
            constructor() {
              for (let a3 = 0; a3 < c2.length; a3++) this[c2[a3].n] = /* @__PURE__ */ function(a4) {
                return function(...b4) {
                  if (console) {
                    let c3 = console[a4];
                    if ("function" != typeof c3 && (c3 = console.log), "function" == typeof c3) return c3.apply(console, b4);
                  }
                };
              }(c2[a3].c);
            }
          }
          b3.DiagConsoleLogger = d2;
        }, 912: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createLogLevelDiagLogger = void 0;
          let d2 = c2(957);
          b3.createLogLevelDiagLogger = function(a3, b4) {
            function c3(c4, d3) {
              let e2 = b4[c4];
              return "function" == typeof e2 && a3 >= d3 ? e2.bind(b4) : function() {
              };
            }
            return a3 < d2.DiagLogLevel.NONE ? a3 = d2.DiagLogLevel.NONE : a3 > d2.DiagLogLevel.ALL && (a3 = d2.DiagLogLevel.ALL), b4 = b4 || {}, { error: c3("error", d2.DiagLogLevel.ERROR), warn: c3("warn", d2.DiagLogLevel.WARN), info: c3("info", d2.DiagLogLevel.INFO), debug: c3("debug", d2.DiagLogLevel.DEBUG), verbose: c3("verbose", d2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.DiagLogLevel = void 0, (c2 = b3.DiagLogLevel || (b3.DiagLogLevel = {}))[c2.NONE = 0] = "NONE", c2[c2.ERROR = 30] = "ERROR", c2[c2.WARN = 50] = "WARN", c2[c2.INFO = 60] = "INFO", c2[c2.DEBUG = 70] = "DEBUG", c2[c2.VERBOSE = 80] = "VERBOSE", c2[c2.ALL = 9999] = "ALL";
        }, 172: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.unregisterGlobal = b3.getGlobal = b3.registerGlobal = void 0;
          let d2 = c2(200), e2 = c2(521), f2 = c2(130), g2 = e2.VERSION.split(".")[0], h2 = Symbol.for(`opentelemetry.js.api.${g2}`), i2 = d2._globalThis;
          b3.registerGlobal = function(a3, b4, c3, d3 = false) {
            var f3;
            let g3 = i2[h2] = null != (f3 = i2[h2]) ? f3 : { version: e2.VERSION };
            if (!d3 && g3[a3]) {
              let b5 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${a3}`);
              return c3.error(b5.stack || b5.message), false;
            }
            if (g3.version !== e2.VERSION) {
              let b5 = Error(`@opentelemetry/api: Registration of version v${g3.version} for ${a3} does not match previously registered API v${e2.VERSION}`);
              return c3.error(b5.stack || b5.message), false;
            }
            return g3[a3] = b4, c3.debug(`@opentelemetry/api: Registered a global for ${a3} v${e2.VERSION}.`), true;
          }, b3.getGlobal = function(a3) {
            var b4, c3;
            let d3 = null == (b4 = i2[h2]) ? void 0 : b4.version;
            if (d3 && (0, f2.isCompatible)(d3)) return null == (c3 = i2[h2]) ? void 0 : c3[a3];
          }, b3.unregisterGlobal = function(a3, b4) {
            b4.debug(`@opentelemetry/api: Unregistering a global for ${a3} v${e2.VERSION}.`);
            let c3 = i2[h2];
            c3 && delete c3[a3];
          };
        }, 130: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.isCompatible = b3._makeCompatibilityCheck = void 0;
          let d2 = c2(521), e2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function f2(a3) {
            let b4 = /* @__PURE__ */ new Set([a3]), c3 = /* @__PURE__ */ new Set(), d3 = a3.match(e2);
            if (!d3) return () => false;
            let f3 = { major: +d3[1], minor: +d3[2], patch: +d3[3], prerelease: d3[4] };
            if (null != f3.prerelease) return function(b5) {
              return b5 === a3;
            };
            function g2(a4) {
              return c3.add(a4), false;
            }
            return function(a4) {
              if (b4.has(a4)) return true;
              if (c3.has(a4)) return false;
              let d4 = a4.match(e2);
              if (!d4) return g2(a4);
              let h2 = { major: +d4[1], minor: +d4[2], patch: +d4[3], prerelease: d4[4] };
              if (null != h2.prerelease || f3.major !== h2.major) return g2(a4);
              if (0 === f3.major) return f3.minor === h2.minor && f3.patch <= h2.patch ? (b4.add(a4), true) : g2(a4);
              return f3.minor <= h2.minor ? (b4.add(a4), true) : g2(a4);
            };
          }
          b3._makeCompatibilityCheck = f2, b3.isCompatible = f2(d2.VERSION);
        }, 886: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.metrics = void 0, b3.metrics = c2(653).MetricsAPI.getInstance();
        }, 901: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ValueType = void 0, (c2 = b3.ValueType || (b3.ValueType = {}))[c2.INT = 0] = "INT", c2[c2.DOUBLE = 1] = "DOUBLE";
        }, 102: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createNoopMeter = b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = b3.NOOP_OBSERVABLE_GAUGE_METRIC = b3.NOOP_OBSERVABLE_COUNTER_METRIC = b3.NOOP_UP_DOWN_COUNTER_METRIC = b3.NOOP_HISTOGRAM_METRIC = b3.NOOP_COUNTER_METRIC = b3.NOOP_METER = b3.NoopObservableUpDownCounterMetric = b3.NoopObservableGaugeMetric = b3.NoopObservableCounterMetric = b3.NoopObservableMetric = b3.NoopHistogramMetric = b3.NoopUpDownCounterMetric = b3.NoopCounterMetric = b3.NoopMetric = b3.NoopMeter = void 0;
          class c2 {
            createHistogram(a3, c3) {
              return b3.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(a3, c3) {
              return b3.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(a3, c3) {
              return b3.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(a3, c3) {
              return b3.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(a3, c3) {
              return b3.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(a3, c3) {
              return b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(a3, b4) {
            }
            removeBatchObservableCallback(a3) {
            }
          }
          b3.NoopMeter = c2;
          class d2 {
          }
          b3.NoopMetric = d2;
          class e2 extends d2 {
            add(a3, b4) {
            }
          }
          b3.NoopCounterMetric = e2;
          class f2 extends d2 {
            add(a3, b4) {
            }
          }
          b3.NoopUpDownCounterMetric = f2;
          class g2 extends d2 {
            record(a3, b4) {
            }
          }
          b3.NoopHistogramMetric = g2;
          class h2 {
            addCallback(a3) {
            }
            removeCallback(a3) {
            }
          }
          b3.NoopObservableMetric = h2;
          class i2 extends h2 {
          }
          b3.NoopObservableCounterMetric = i2;
          class j2 extends h2 {
          }
          b3.NoopObservableGaugeMetric = j2;
          class k2 extends h2 {
          }
          b3.NoopObservableUpDownCounterMetric = k2, b3.NOOP_METER = new c2(), b3.NOOP_COUNTER_METRIC = new e2(), b3.NOOP_HISTOGRAM_METRIC = new g2(), b3.NOOP_UP_DOWN_COUNTER_METRIC = new f2(), b3.NOOP_OBSERVABLE_COUNTER_METRIC = new i2(), b3.NOOP_OBSERVABLE_GAUGE_METRIC = new j2(), b3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new k2(), b3.createNoopMeter = function() {
            return b3.NOOP_METER;
          };
        }, 660: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NOOP_METER_PROVIDER = b3.NoopMeterProvider = void 0;
          let d2 = c2(102);
          class e2 {
            getMeter(a3, b4, c3) {
              return d2.NOOP_METER;
            }
          }
          b3.NoopMeterProvider = e2, b3.NOOP_METER_PROVIDER = new e2();
        }, 200: function(a2, b3, c2) {
          var d2 = this && this.__createBinding || (Object.create ? function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), Object.defineProperty(a3, d3, { enumerable: true, get: function() {
              return b4[c3];
            } });
          } : function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), a3[d3] = b4[c3];
          }), e2 = this && this.__exportStar || function(a3, b4) {
            for (var c3 in a3) "default" === c3 || Object.prototype.hasOwnProperty.call(b4, c3) || d2(b4, a3, c3);
          };
          Object.defineProperty(b3, "__esModule", { value: true }), e2(c2(46), b3);
        }, 651: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3._globalThis = void 0, b3._globalThis = "object" == typeof globalThis ? globalThis : c.g;
        }, 46: function(a2, b3, c2) {
          var d2 = this && this.__createBinding || (Object.create ? function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), Object.defineProperty(a3, d3, { enumerable: true, get: function() {
              return b4[c3];
            } });
          } : function(a3, b4, c3, d3) {
            void 0 === d3 && (d3 = c3), a3[d3] = b4[c3];
          }), e2 = this && this.__exportStar || function(a3, b4) {
            for (var c3 in a3) "default" === c3 || Object.prototype.hasOwnProperty.call(b4, c3) || d2(b4, a3, c3);
          };
          Object.defineProperty(b3, "__esModule", { value: true }), e2(c2(651), b3);
        }, 939: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.propagation = void 0, b3.propagation = c2(181).PropagationAPI.getInstance();
        }, 874: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTextMapPropagator = void 0;
          class c2 {
            inject(a3, b4) {
            }
            extract(a3, b4) {
              return a3;
            }
            fields() {
              return [];
            }
          }
          b3.NoopTextMapPropagator = c2;
        }, 194: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.defaultTextMapSetter = b3.defaultTextMapGetter = void 0, b3.defaultTextMapGetter = { get(a3, b4) {
            if (null != a3) return a3[b4];
          }, keys: (a3) => null == a3 ? [] : Object.keys(a3) }, b3.defaultTextMapSetter = { set(a3, b4, c2) {
            null != a3 && (a3[b4] = c2);
          } };
        }, 845: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.trace = void 0, b3.trace = c2(997).TraceAPI.getInstance();
        }, 403: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NonRecordingSpan = void 0;
          let d2 = c2(476);
          class e2 {
            constructor(a3 = d2.INVALID_SPAN_CONTEXT) {
              this._spanContext = a3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(a3, b4) {
              return this;
            }
            setAttributes(a3) {
              return this;
            }
            addEvent(a3, b4) {
              return this;
            }
            setStatus(a3) {
              return this;
            }
            updateName(a3) {
              return this;
            }
            end(a3) {
            }
            isRecording() {
              return false;
            }
            recordException(a3, b4) {
            }
          }
          b3.NonRecordingSpan = e2;
        }, 614: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTracer = void 0;
          let d2 = c2(491), e2 = c2(607), f2 = c2(403), g2 = c2(139), h2 = d2.ContextAPI.getInstance();
          class i2 {
            startSpan(a3, b4, c3 = h2.active()) {
              var d3;
              if (null == b4 ? void 0 : b4.root) return new f2.NonRecordingSpan();
              let i3 = c3 && (0, e2.getSpanContext)(c3);
              return "object" == typeof (d3 = i3) && "string" == typeof d3.spanId && "string" == typeof d3.traceId && "number" == typeof d3.traceFlags && (0, g2.isSpanContextValid)(i3) ? new f2.NonRecordingSpan(i3) : new f2.NonRecordingSpan();
            }
            startActiveSpan(a3, b4, c3, d3) {
              let f3, g3, i3;
              if (arguments.length < 2) return;
              2 == arguments.length ? i3 = b4 : 3 == arguments.length ? (f3 = b4, i3 = c3) : (f3 = b4, g3 = c3, i3 = d3);
              let j2 = null != g3 ? g3 : h2.active(), k2 = this.startSpan(a3, f3, j2), l2 = (0, e2.setSpan)(j2, k2);
              return h2.with(l2, i3, void 0, k2);
            }
          }
          b3.NoopTracer = i2;
        }, 124: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.NoopTracerProvider = void 0;
          let d2 = c2(614);
          class e2 {
            getTracer(a3, b4, c3) {
              return new d2.NoopTracer();
            }
          }
          b3.NoopTracerProvider = e2;
        }, 125: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ProxyTracer = void 0;
          let d2 = new (c2(614)).NoopTracer();
          class e2 {
            constructor(a3, b4, c3, d3) {
              this._provider = a3, this.name = b4, this.version = c3, this.options = d3;
            }
            startSpan(a3, b4, c3) {
              return this._getTracer().startSpan(a3, b4, c3);
            }
            startActiveSpan(a3, b4, c3, d3) {
              let e3 = this._getTracer();
              return Reflect.apply(e3.startActiveSpan, e3, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let a3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return a3 ? (this._delegate = a3, this._delegate) : d2;
            }
          }
          b3.ProxyTracer = e2;
        }, 846: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.ProxyTracerProvider = void 0;
          let d2 = c2(125), e2 = new (c2(124)).NoopTracerProvider();
          class f2 {
            getTracer(a3, b4, c3) {
              var e3;
              return null != (e3 = this.getDelegateTracer(a3, b4, c3)) ? e3 : new d2.ProxyTracer(this, a3, b4, c3);
            }
            getDelegate() {
              var a3;
              return null != (a3 = this._delegate) ? a3 : e2;
            }
            setDelegate(a3) {
              this._delegate = a3;
            }
            getDelegateTracer(a3, b4, c3) {
              var d3;
              return null == (d3 = this._delegate) ? void 0 : d3.getTracer(a3, b4, c3);
            }
          }
          b3.ProxyTracerProvider = f2;
        }, 996: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SamplingDecision = void 0, (c2 = b3.SamplingDecision || (b3.SamplingDecision = {}))[c2.NOT_RECORD = 0] = "NOT_RECORD", c2[c2.RECORD = 1] = "RECORD", c2[c2.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
        }, 607: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.getSpanContext = b3.setSpanContext = b3.deleteSpan = b3.setSpan = b3.getActiveSpan = b3.getSpan = void 0;
          let d2 = c2(780), e2 = c2(403), f2 = c2(491), g2 = (0, d2.createContextKey)("OpenTelemetry Context Key SPAN");
          function h2(a3) {
            return a3.getValue(g2) || void 0;
          }
          function i2(a3, b4) {
            return a3.setValue(g2, b4);
          }
          b3.getSpan = h2, b3.getActiveSpan = function() {
            return h2(f2.ContextAPI.getInstance().active());
          }, b3.setSpan = i2, b3.deleteSpan = function(a3) {
            return a3.deleteValue(g2);
          }, b3.setSpanContext = function(a3, b4) {
            return i2(a3, new e2.NonRecordingSpan(b4));
          }, b3.getSpanContext = function(a3) {
            var b4;
            return null == (b4 = h2(a3)) ? void 0 : b4.spanContext();
          };
        }, 325: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceStateImpl = void 0;
          let d2 = c2(564);
          class e2 {
            constructor(a3) {
              this._internalState = /* @__PURE__ */ new Map(), a3 && this._parse(a3);
            }
            set(a3, b4) {
              let c3 = this._clone();
              return c3._internalState.has(a3) && c3._internalState.delete(a3), c3._internalState.set(a3, b4), c3;
            }
            unset(a3) {
              let b4 = this._clone();
              return b4._internalState.delete(a3), b4;
            }
            get(a3) {
              return this._internalState.get(a3);
            }
            serialize() {
              return this._keys().reduce((a3, b4) => (a3.push(b4 + "=" + this.get(b4)), a3), []).join(",");
            }
            _parse(a3) {
              !(a3.length > 512) && (this._internalState = a3.split(",").reverse().reduce((a4, b4) => {
                let c3 = b4.trim(), e3 = c3.indexOf("=");
                if (-1 !== e3) {
                  let f2 = c3.slice(0, e3), g2 = c3.slice(e3 + 1, b4.length);
                  (0, d2.validateKey)(f2) && (0, d2.validateValue)(g2) && a4.set(f2, g2);
                }
                return a4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let a3 = new e2();
              return a3._internalState = new Map(this._internalState), a3;
            }
          }
          b3.TraceStateImpl = e2;
        }, 564: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.validateValue = b3.validateKey = void 0;
          let c2 = "[_0-9a-z-*/]", d2 = `[a-z]${c2}{0,255}`, e2 = `[a-z0-9]${c2}{0,240}@[a-z]${c2}{0,13}`, f2 = RegExp(`^(?:${d2}|${e2})$`), g2 = /^[ -~]{0,255}[!-~]$/, h2 = /,|=/;
          b3.validateKey = function(a3) {
            return f2.test(a3);
          }, b3.validateValue = function(a3) {
            return g2.test(a3) && !h2.test(a3);
          };
        }, 98: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.createTraceState = void 0;
          let d2 = c2(325);
          b3.createTraceState = function(a3) {
            return new d2.TraceStateImpl(a3);
          };
        }, 476: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.INVALID_SPAN_CONTEXT = b3.INVALID_TRACEID = b3.INVALID_SPANID = void 0;
          let d2 = c2(475);
          b3.INVALID_SPANID = "0000000000000000", b3.INVALID_TRACEID = "00000000000000000000000000000000", b3.INVALID_SPAN_CONTEXT = { traceId: b3.INVALID_TRACEID, spanId: b3.INVALID_SPANID, traceFlags: d2.TraceFlags.NONE };
        }, 357: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SpanKind = void 0, (c2 = b3.SpanKind || (b3.SpanKind = {}))[c2.INTERNAL = 0] = "INTERNAL", c2[c2.SERVER = 1] = "SERVER", c2[c2.CLIENT = 2] = "CLIENT", c2[c2.PRODUCER = 3] = "PRODUCER", c2[c2.CONSUMER = 4] = "CONSUMER";
        }, 139: (a2, b3, c2) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.wrapSpanContext = b3.isSpanContextValid = b3.isValidSpanId = b3.isValidTraceId = void 0;
          let d2 = c2(476), e2 = c2(403), f2 = /^([0-9a-f]{32})$/i, g2 = /^[0-9a-f]{16}$/i;
          function h2(a3) {
            return f2.test(a3) && a3 !== d2.INVALID_TRACEID;
          }
          function i2(a3) {
            return g2.test(a3) && a3 !== d2.INVALID_SPANID;
          }
          b3.isValidTraceId = h2, b3.isValidSpanId = i2, b3.isSpanContextValid = function(a3) {
            return h2(a3.traceId) && i2(a3.spanId);
          }, b3.wrapSpanContext = function(a3) {
            return new e2.NonRecordingSpan(a3);
          };
        }, 847: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.SpanStatusCode = void 0, (c2 = b3.SpanStatusCode || (b3.SpanStatusCode = {}))[c2.UNSET = 0] = "UNSET", c2[c2.OK = 1] = "OK", c2[c2.ERROR = 2] = "ERROR";
        }, 475: (a2, b3) => {
          var c2;
          Object.defineProperty(b3, "__esModule", { value: true }), b3.TraceFlags = void 0, (c2 = b3.TraceFlags || (b3.TraceFlags = {}))[c2.NONE = 0] = "NONE", c2[c2.SAMPLED = 1] = "SAMPLED";
        }, 521: (a2, b3) => {
          Object.defineProperty(b3, "__esModule", { value: true }), b3.VERSION = void 0, b3.VERSION = "1.6.0";
        } }, y = {};
        function z(a2) {
          var b3 = y[a2];
          if (void 0 !== b3) return b3.exports;
          var c2 = y[a2] = { exports: {} }, d2 = true;
          try {
            x[a2].call(c2.exports, c2, c2.exports, z), d2 = false;
          } finally {
            d2 && delete y[a2];
          }
          return c2.exports;
        }
        z.ab = "//";
        var A = {};
        Object.defineProperty(A, "__esModule", { value: true }), A.trace = A.propagation = A.metrics = A.diag = A.context = A.INVALID_SPAN_CONTEXT = A.INVALID_TRACEID = A.INVALID_SPANID = A.isValidSpanId = A.isValidTraceId = A.isSpanContextValid = A.createTraceState = A.TraceFlags = A.SpanStatusCode = A.SpanKind = A.SamplingDecision = A.ProxyTracerProvider = A.ProxyTracer = A.defaultTextMapSetter = A.defaultTextMapGetter = A.ValueType = A.createNoopMeter = A.DiagLogLevel = A.DiagConsoleLogger = A.ROOT_CONTEXT = A.createContextKey = A.baggageEntryMetadataFromString = void 0, h = z(369), Object.defineProperty(A, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
          return h.baggageEntryMetadataFromString;
        } }), i = z(780), Object.defineProperty(A, "createContextKey", { enumerable: true, get: function() {
          return i.createContextKey;
        } }), Object.defineProperty(A, "ROOT_CONTEXT", { enumerable: true, get: function() {
          return i.ROOT_CONTEXT;
        } }), j = z(972), Object.defineProperty(A, "DiagConsoleLogger", { enumerable: true, get: function() {
          return j.DiagConsoleLogger;
        } }), k = z(957), Object.defineProperty(A, "DiagLogLevel", { enumerable: true, get: function() {
          return k.DiagLogLevel;
        } }), l = z(102), Object.defineProperty(A, "createNoopMeter", { enumerable: true, get: function() {
          return l.createNoopMeter;
        } }), m = z(901), Object.defineProperty(A, "ValueType", { enumerable: true, get: function() {
          return m.ValueType;
        } }), n = z(194), Object.defineProperty(A, "defaultTextMapGetter", { enumerable: true, get: function() {
          return n.defaultTextMapGetter;
        } }), Object.defineProperty(A, "defaultTextMapSetter", { enumerable: true, get: function() {
          return n.defaultTextMapSetter;
        } }), o = z(125), Object.defineProperty(A, "ProxyTracer", { enumerable: true, get: function() {
          return o.ProxyTracer;
        } }), p = z(846), Object.defineProperty(A, "ProxyTracerProvider", { enumerable: true, get: function() {
          return p.ProxyTracerProvider;
        } }), q = z(996), Object.defineProperty(A, "SamplingDecision", { enumerable: true, get: function() {
          return q.SamplingDecision;
        } }), r = z(357), Object.defineProperty(A, "SpanKind", { enumerable: true, get: function() {
          return r.SpanKind;
        } }), s = z(847), Object.defineProperty(A, "SpanStatusCode", { enumerable: true, get: function() {
          return s.SpanStatusCode;
        } }), t = z(475), Object.defineProperty(A, "TraceFlags", { enumerable: true, get: function() {
          return t.TraceFlags;
        } }), u = z(98), Object.defineProperty(A, "createTraceState", { enumerable: true, get: function() {
          return u.createTraceState;
        } }), v = z(139), Object.defineProperty(A, "isSpanContextValid", { enumerable: true, get: function() {
          return v.isSpanContextValid;
        } }), Object.defineProperty(A, "isValidTraceId", { enumerable: true, get: function() {
          return v.isValidTraceId;
        } }), Object.defineProperty(A, "isValidSpanId", { enumerable: true, get: function() {
          return v.isValidSpanId;
        } }), w = z(476), Object.defineProperty(A, "INVALID_SPANID", { enumerable: true, get: function() {
          return w.INVALID_SPANID;
        } }), Object.defineProperty(A, "INVALID_TRACEID", { enumerable: true, get: function() {
          return w.INVALID_TRACEID;
        } }), Object.defineProperty(A, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
          return w.INVALID_SPAN_CONTEXT;
        } }), b2 = z(67), Object.defineProperty(A, "context", { enumerable: true, get: function() {
          return b2.context;
        } }), d = z(506), Object.defineProperty(A, "diag", { enumerable: true, get: function() {
          return d.diag;
        } }), e = z(886), Object.defineProperty(A, "metrics", { enumerable: true, get: function() {
          return e.metrics;
        } }), f = z(939), Object.defineProperty(A, "propagation", { enumerable: true, get: function() {
          return f.propagation;
        } }), g = z(845), Object.defineProperty(A, "trace", { enumerable: true, get: function() {
          return g.trace;
        } }), A.default = { context: b2.context, diag: d.diag, metrics: e.metrics, propagation: f.propagation, trace: g.trace }, a.exports = A;
      })();
    }, 502: (a, b, c) => {
      "use strict";
      c.d(b, { F: () => e, h: () => f });
      let d = "DYNAMIC_SERVER_USAGE";
      class e extends Error {
        constructor(a2) {
          super(`Dynamic server usage: ${a2}`), this.description = a2, this.digest = d;
        }
      }
      function f(a2) {
        return "object" == typeof a2 && null !== a2 && "digest" in a2 && "string" == typeof a2.digest && a2.digest === d;
      }
    }, 507: (a, b, c) => {
      "use strict";
      c.d(b, { Q: () => e });
      var d, e = ((d = {})[d.SeeOther = 303] = "SeeOther", d[d.TemporaryRedirect = 307] = "TemporaryRedirect", d[d.PermanentRedirect = 308] = "PermanentRedirect", d);
    }, 520: (a, b, c) => {
      "use strict";
      c.d(b, { z: () => d });
      class d extends Error {
        constructor(a2, b2) {
          super(`Invariant: ${a2.endsWith(".") ? a2 : a2 + "."} This is a bug in Next.js.`, b2), this.name = "InvariantError";
        }
      }
    }, 521: (a) => {
      "use strict";
      a.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 543: (a, b, c) => {
      "use strict";
      c.d(b, { X: () => function a2(b2) {
        if ((0, g.p)(b2) || (0, f.C)(b2) || (0, i.h)(b2) || (0, h.I3)(b2) || "object" == typeof b2 && null !== b2 && b2.$$typeof === e || (0, d.Ts)(b2) || (0, h.AA)(b2)) throw b2;
        b2 instanceof Error && "cause" in b2 && a2(b2.cause);
      } });
      var d = c(743);
      let e = Symbol.for("react.postpone");
      var f = c(297), g = c(789), h = c(673), i = c(502);
    }, 582: (a, b, c) => {
      "use strict";
      c.d(b, { headers: () => q }), c(672), c(387);
      var d = c(778), e = c(391), f = c(673), g = c(20), h = c(743), i = c(345);
      let j = { current: null }, k = "function" == typeof i.cache ? i.cache : (a2) => a2, l = console.warn;
      function m(a2) {
        return function(...b2) {
          l(a2(...b2));
        };
      }
      k((a2) => {
        try {
          l(j.current);
        } finally {
          j.current = null;
        }
      });
      var n = c(930), o = c(520);
      c(888), /* @__PURE__ */ new WeakMap(), m(function(a2, b2) {
        let c2 = a2 ? `Route "${a2}" ` : "This route ";
        return Object.defineProperty(Error(`${c2}used ${b2}. \`cookies()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E830", enumerable: false, configurable: true });
      });
      var p = c(271);
      function q() {
        let a2 = "headers", b2 = d.J.getStore(), c2 = e.FP.getStore();
        if (b2) {
          if (c2 && "after" === c2.phase && !(0, n.iC)()) throw Object.defineProperty(Error(`Route ${b2.route} used \`headers()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`headers()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", { value: "E839", enumerable: false, configurable: true });
          if (b2.forceStatic) return s(p.o.seal(new Headers({})));
          if (c2) switch (c2.type) {
            case "cache": {
              let a3 = Object.defineProperty(Error(`Route ${b2.route} used \`headers()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", { value: "E833", enumerable: false, configurable: true });
              throw Error.captureStackTrace(a3, q), b2.invalidDynamicUsageError ??= a3, a3;
            }
            case "unstable-cache":
              throw Object.defineProperty(Error(`Route ${b2.route} used \`headers()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", { value: "E838", enumerable: false, configurable: true });
            case "generate-static-params":
              throw Object.defineProperty(Error(`Route ${b2.route} used \`headers()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E1134", enumerable: false, configurable: true });
          }
          if (b2.dynamicShouldError) throw Object.defineProperty(new g.f(`Route ${b2.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`headers()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E828", enumerable: false, configurable: true });
          if (c2) switch (c2.type) {
            case "prerender":
              var i2 = b2, j2 = c2;
              let d2 = r.get(j2);
              if (d2) return d2;
              let k2 = (0, h.W5)(j2.renderSignal, i2.route, "`headers()`");
              return r.set(j2, k2), k2;
            case "prerender-client":
            case "validation-client":
              let l2 = "`headers`";
              throw Object.defineProperty(new o.z(`${l2} must not be used within a client component. Next.js should be preventing ${l2} from being included in client components statically, but did not in this case.`), "__NEXT_ERROR_CODE", { value: "E1017", enumerable: false, configurable: true });
            case "prerender-ppr":
              return (0, f.Ui)(b2.route, a2, c2.dynamicTracking);
            case "prerender-legacy":
              return (0, f.xI)(a2, b2, c2);
            case "prerender-runtime":
              return (0, h.wi)(c2, s(c2.headers));
            case "private-cache":
              return s(c2.headers);
            case "request":
              if ((0, f.Pk)(c2), c2.asyncApiPromises) return (0, e.fV)(c2) ? c2.asyncApiPromises.earlyHeaders : c2.asyncApiPromises.headers;
              return s(c2.headers);
          }
        }
        (0, e.M1)(a2);
      }
      let r = /* @__PURE__ */ new WeakMap();
      function s(a2) {
        let b2 = r.get(a2);
        if (b2) return b2;
        let c2 = Promise.resolve(a2);
        return r.set(a2, c2), c2;
      }
      m(function(a2, b2) {
        let c2 = a2 ? `Route "${a2}" ` : "This route ";
        return Object.defineProperty(Error(`${c2}used ${b2}. \`headers()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E836", enumerable: false, configurable: true });
      }), c(502), /* @__PURE__ */ new WeakMap(), m(function(a2, b2) {
        let c2 = a2 ? `Route "${a2}" ` : "This route ";
        return Object.defineProperty(Error(`${c2}used ${b2}. \`draftMode()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E835", enumerable: false, configurable: true });
      });
    }, 643: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      var d = { getTestReqInfo: function() {
        return i;
      }, withRequest: function() {
        return h;
      } };
      for (var e in d) Object.defineProperty(b, e, { enumerable: true, get: d[e] });
      let f = new (c(521)).AsyncLocalStorage();
      function g(a2, b2) {
        let c2 = b2.header(a2, "next-test-proxy-port");
        if (!c2) return;
        let d2 = b2.url(a2);
        return { url: d2, proxyPort: Number(c2), testData: b2.header(a2, "next-test-data") || "" };
      }
      function h(a2, b2, c2) {
        let d2 = g(a2, b2);
        return d2 ? f.run(d2, c2) : c2();
      }
      function i(a2, b2) {
        let c2 = f.getStore();
        return c2 || (a2 && b2 ? g(a2, b2) : void 0);
      }
    }, 654: (a, b, c) => {
      "use strict";
      a.exports = c(42);
    }, 662: (a, b, c) => {
      "use strict";
      c.d(b, { Z: () => d });
      let d = (0, c(722).xl)();
    }, 672: (a, b, c) => {
      "use strict";
      c.d(b, { K8: () => j, Ck: () => h, EJ: () => k });
      var d = c(387), e = c(58), f = c(778);
      class g extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new g();
        }
      }
      class h {
        static seal(a2) {
          return new Proxy(a2, { get(a3, b2, c2) {
            switch (b2) {
              case "clear":
              case "delete":
              case "set":
                return g.callable;
              default:
                return e.l.get(a3, b2, c2);
            }
          } });
        }
      }
      let i = Symbol.for("next.mutated.cookies");
      class j {
        static wrap(a2, b2) {
          let c2 = new d.VO(new Headers());
          for (let b3 of a2.getAll()) c2.set(b3);
          let g2 = [], h2 = /* @__PURE__ */ new Set(), j2 = () => {
            let a3 = f.J.getStore();
            if (a3 && (a3.pathWasRevalidated = 1), g2 = c2.getAll().filter((a4) => h2.has(a4.name)), b2) {
              let a4 = [];
              for (let b3 of g2) {
                let c3 = new d.VO(new Headers());
                c3.set(b3), a4.push(c3.toString());
              }
              b2(a4);
            }
          }, k2 = new Proxy(c2, { get(a3, b3, c3) {
            switch (b3) {
              case i:
                return g2;
              case "delete":
                return function(...b4) {
                  h2.add("string" == typeof b4[0] ? b4[0] : b4[0].name);
                  try {
                    return a3.delete(...b4), k2;
                  } finally {
                    j2();
                  }
                };
              case "set":
                return function(...b4) {
                  h2.add("string" == typeof b4[0] ? b4[0] : b4[0].name);
                  try {
                    return a3.set(...b4), k2;
                  } finally {
                    j2();
                  }
                };
              default:
                return e.l.get(a3, b3, c3);
            }
          } });
          return k2;
        }
      }
      function k(a2) {
        let b2 = new Proxy(a2.mutableCookies, { get(c2, d2, f2) {
          switch (d2) {
            case "delete":
              return function(...d3) {
                return l(a2, "cookies().delete"), c2.delete(...d3), b2;
              };
            case "set":
              return function(...d3) {
                return l(a2, "cookies().set"), c2.set(...d3), b2;
              };
            default:
              return e.l.get(c2, d2, f2);
          }
        } });
        return b2;
      }
      function l(a2, b2) {
        if ("action" !== a2.phase) throw new g();
      }
    }, 673: (a, b, c) => {
      "use strict";
      c.d(b, { I3: () => k, AA: () => m, Ui: () => i, xI: () => g, Pk: () => h });
      var d = c(345), e = c(502);
      c(20), c(391), c(778), c(743), c(297), c(520);
      let f = "function" == typeof d.unstable_postpone;
      function g(a2, b2, c2) {
        let d2 = Object.defineProperty(new e.F(`Route ${b2.route} couldn't be rendered statically because it used \`${a2}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", { value: "E558", enumerable: false, configurable: true });
        throw c2.revalidate = 0, b2.dynamicUsageDescription = a2, b2.dynamicUsageStack = d2.stack, d2;
      }
      function h(a2) {
        switch (a2.type) {
          case "cache":
          case "unstable-cache":
          case "private-cache":
            return;
        }
      }
      function i(a2, b2, c2) {
        (function() {
          if (!f) throw Object.defineProperty(Error("Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E224", enumerable: false, configurable: true });
        })(), c2 && c2.dynamicAccesses.push({ stack: c2.isDebugDynamicAccesses ? Error().stack : void 0, expression: b2 }), d.unstable_postpone(j(a2, b2));
      }
      function j(a2, b2) {
        return `Route ${a2} needs to bail out of prerendering at this point because it used ${b2}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
      }
      function k(a2) {
        return "object" == typeof a2 && null !== a2 && "string" == typeof a2.message && l(a2.message);
      }
      function l(a2) {
        return a2.includes("needs to bail out of prerendering at this point because it used") && a2.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error");
      }
      if (false === l(j("%%%", "^^^"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      function m(a2) {
        return "object" == typeof a2 && null !== a2 && "NEXT_PRERENDER_INTERRUPTED" === a2.digest && "name" in a2 && "message" in a2 && a2 instanceof Error;
      }
      RegExp("\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)"), RegExp("\\n\\s+at __next_metadata_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_viewport_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_outlet_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_validation_boundary__[\\n\\s]");
    }, 677: (a, b, c) => {
      "use strict";
      c.d(b, { xl: () => g });
      let d = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class e {
        disable() {
          throw d;
        }
        getStore() {
        }
        run() {
          throw d;
        }
        exit() {
          throw d;
        }
        enterWith() {
          throw d;
        }
        static bind(a2) {
          return a2;
        }
      }
      let f = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function g() {
        return f ? new f() : new e();
      }
    }, 722: (a, b, c) => {
      "use strict";
      c.d(b, { $p: () => i, cg: () => h, xl: () => g });
      let d = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class e {
        disable() {
          throw d;
        }
        getStore() {
        }
        run() {
          throw d;
        }
        exit() {
          throw d;
        }
        enterWith() {
          throw d;
        }
        static bind(a2) {
          return a2;
        }
      }
      let f = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function g() {
        return f ? new f() : new e();
      }
      function h(a2) {
        return f ? f.bind(a2) : e.bind(a2);
      }
      function i() {
        return f ? f.snapshot() : function(a2, ...b2) {
          return a2(...b2);
        };
      }
    }, 743: (a, b, c) => {
      "use strict";
      c.d(b, { Ts: () => e, W5: () => i, wi: () => k });
      var d = c(888);
      function e(a2) {
        return "object" == typeof a2 && null !== a2 && "digest" in a2 && a2.digest === f;
      }
      let f = "HANGING_PROMISE_REJECTION";
      class g extends Error {
        constructor(a2, b2) {
          super(`During prerendering, ${b2} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${b2} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${a2}".`), this.route = a2, this.expression = b2, this.digest = f;
        }
      }
      let h = /* @__PURE__ */ new WeakMap();
      function i(a2, b2, c2) {
        if (a2.aborted) return Promise.reject(new g(b2, c2));
        {
          let d2 = new Promise((d3, e2) => {
            let f2 = e2.bind(null, new g(b2, c2)), i2 = h.get(a2);
            if (i2) i2.push(f2);
            else {
              let b3 = [f2];
              h.set(a2, b3), a2.addEventListener("abort", () => {
                for (let a3 = 0; a3 < b3.length; a3++) b3[a3]();
              }, { once: true });
            }
          });
          return d2.catch(j), d2;
        }
      }
      function j() {
      }
      function k(a2, b2) {
        let { stagedRendering: c2 } = a2;
        return c2 ? c2.waitForStage(c2.currentStage === d.D.EarlyStatic || c2.currentStage === d.D.EarlyRuntime ? d.D.EarlyRuntime : d.D.Runtime).then(() => b2) : b2;
      }
    }, 778: (a, b, c) => {
      "use strict";
      c.d(b, { J: () => d });
      let d = (0, c(677).xl)();
    }, 789: (a, b, c) => {
      "use strict";
      c.d(b, { p: () => f });
      var d = c(833), e = c(213);
      function f(a2) {
        return (0, e.n)(a2) || (0, d.RM)(a2);
      }
    }, 833: (a, b, c) => {
      "use strict";
      c.d(b, { RM: () => f, s8: () => e });
      let d = new Set(Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 })), e = "NEXT_HTTP_ERROR_FALLBACK";
      function f(a2) {
        if ("object" != typeof a2 || null === a2 || !("digest" in a2) || "string" != typeof a2.digest) return false;
        let [b2, c2] = a2.digest.split(";");
        return b2 === e && d.has(Number(c2));
      }
    }, 852: (a) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var b, c, d, e, f = {};
        f.parse = function(a2, c2) {
          if ("string" != typeof a2) throw TypeError("argument str must be a string");
          for (var e2 = {}, f2 = a2.split(d), g = (c2 || {}).decode || b, h = 0; h < f2.length; h++) {
            var i = f2[h], j = i.indexOf("=");
            if (!(j < 0)) {
              var k = i.substr(0, j).trim(), l = i.substr(++j, i.length).trim();
              '"' == l[0] && (l = l.slice(1, -1)), void 0 == e2[k] && (e2[k] = function(a3, b2) {
                try {
                  return b2(a3);
                } catch (b3) {
                  return a3;
                }
              }(l, g));
            }
          }
          return e2;
        }, f.serialize = function(a2, b2, d2) {
          var f2 = d2 || {}, g = f2.encode || c;
          if ("function" != typeof g) throw TypeError("option encode is invalid");
          if (!e.test(a2)) throw TypeError("argument name is invalid");
          var h = g(b2);
          if (h && !e.test(h)) throw TypeError("argument val is invalid");
          var i = a2 + "=" + h;
          if (null != f2.maxAge) {
            var j = f2.maxAge - 0;
            if (isNaN(j) || !isFinite(j)) throw TypeError("option maxAge is invalid");
            i += "; Max-Age=" + Math.floor(j);
          }
          if (f2.domain) {
            if (!e.test(f2.domain)) throw TypeError("option domain is invalid");
            i += "; Domain=" + f2.domain;
          }
          if (f2.path) {
            if (!e.test(f2.path)) throw TypeError("option path is invalid");
            i += "; Path=" + f2.path;
          }
          if (f2.expires) {
            if ("function" != typeof f2.expires.toUTCString) throw TypeError("option expires is invalid");
            i += "; Expires=" + f2.expires.toUTCString();
          }
          if (f2.httpOnly && (i += "; HttpOnly"), f2.secure && (i += "; Secure"), f2.sameSite) switch ("string" == typeof f2.sameSite ? f2.sameSite.toLowerCase() : f2.sameSite) {
            case true:
            case "strict":
              i += "; SameSite=Strict";
              break;
            case "lax":
              i += "; SameSite=Lax";
              break;
            case "none":
              i += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return i;
        }, b = decodeURIComponent, c = encodeURIComponent, d = /; */, e = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, a.exports = f;
      })();
    }, 888: (a, b, c) => {
      "use strict";
      c.d(b, { D: () => e }), c(520);
      var d, e = ((d = {})[d.Before = 1] = "Before", d[d.EarlyStatic = 2] = "EarlyStatic", d[d.Static = 3] = "Static", d[d.EarlyRuntime = 4] = "EarlyRuntime", d[d.Runtime = 5] = "Runtime", d[d.Dynamic = 6] = "Dynamic", d[d.Abandoned = 7] = "Abandoned", d);
    }, 918: (a) => {
      "use strict";
      var b = Object.defineProperty, c = Object.getOwnPropertyDescriptor, d = Object.getOwnPropertyNames, e = Object.prototype.hasOwnProperty, f = {}, g = { RequestCookies: () => n, ResponseCookies: () => o, parseCookie: () => j, parseSetCookie: () => k, stringifyCookie: () => i };
      for (var h in g) b(f, h, { get: g[h], enumerable: true });
      function i(a2) {
        var b2;
        let c2 = ["path" in a2 && a2.path && `Path=${a2.path}`, "expires" in a2 && (a2.expires || 0 === a2.expires) && `Expires=${("number" == typeof a2.expires ? new Date(a2.expires) : a2.expires).toUTCString()}`, "maxAge" in a2 && "number" == typeof a2.maxAge && `Max-Age=${a2.maxAge}`, "domain" in a2 && a2.domain && `Domain=${a2.domain}`, "secure" in a2 && a2.secure && "Secure", "httpOnly" in a2 && a2.httpOnly && "HttpOnly", "sameSite" in a2 && a2.sameSite && `SameSite=${a2.sameSite}`, "partitioned" in a2 && a2.partitioned && "Partitioned", "priority" in a2 && a2.priority && `Priority=${a2.priority}`].filter(Boolean), d2 = `${a2.name}=${encodeURIComponent(null != (b2 = a2.value) ? b2 : "")}`;
        return 0 === c2.length ? d2 : `${d2}; ${c2.join("; ")}`;
      }
      function j(a2) {
        let b2 = /* @__PURE__ */ new Map();
        for (let c2 of a2.split(/; */)) {
          if (!c2) continue;
          let a3 = c2.indexOf("=");
          if (-1 === a3) {
            b2.set(c2, "true");
            continue;
          }
          let [d2, e2] = [c2.slice(0, a3), c2.slice(a3 + 1)];
          try {
            b2.set(d2, decodeURIComponent(null != e2 ? e2 : "true"));
          } catch {
          }
        }
        return b2;
      }
      function k(a2) {
        if (!a2) return;
        let [[b2, c2], ...d2] = j(a2), { domain: e2, expires: f2, httponly: g2, maxage: h2, path: i2, samesite: k2, secure: n2, partitioned: o2, priority: p } = Object.fromEntries(d2.map(([a3, b3]) => [a3.toLowerCase().replace(/-/g, ""), b3]));
        {
          var q, r, s = { name: b2, value: decodeURIComponent(c2), domain: e2, ...f2 && { expires: new Date(f2) }, ...g2 && { httpOnly: true }, ..."string" == typeof h2 && { maxAge: Number(h2) }, path: i2, ...k2 && { sameSite: l.includes(q = (q = k2).toLowerCase()) ? q : void 0 }, ...n2 && { secure: true }, ...p && { priority: m.includes(r = (r = p).toLowerCase()) ? r : void 0 }, ...o2 && { partitioned: true } };
          let a3 = {};
          for (let b3 in s) s[b3] && (a3[b3] = s[b3]);
          return a3;
        }
      }
      a.exports = ((a2, f2, g2, h2) => {
        if (f2 && "object" == typeof f2 || "function" == typeof f2) for (let i2 of d(f2)) e.call(a2, i2) || i2 === g2 || b(a2, i2, { get: () => f2[i2], enumerable: !(h2 = c(f2, i2)) || h2.enumerable });
        return a2;
      })(b({}, "__esModule", { value: true }), f);
      var l = ["strict", "lax", "none"], m = ["low", "medium", "high"], n = class {
        constructor(a2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = a2;
          const b2 = a2.get("cookie");
          if (b2) for (const [a3, c2] of j(b2)) this._parsed.set(a3, { name: a3, value: c2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...a2) {
          let b2 = "string" == typeof a2[0] ? a2[0] : a2[0].name;
          return this._parsed.get(b2);
        }
        getAll(...a2) {
          var b2;
          let c2 = Array.from(this._parsed);
          if (!a2.length) return c2.map(([a3, b3]) => b3);
          let d2 = "string" == typeof a2[0] ? a2[0] : null == (b2 = a2[0]) ? void 0 : b2.name;
          return c2.filter(([a3]) => a3 === d2).map(([a3, b3]) => b3);
        }
        has(a2) {
          return this._parsed.has(a2);
        }
        set(...a2) {
          let [b2, c2] = 1 === a2.length ? [a2[0].name, a2[0].value] : a2, d2 = this._parsed;
          return d2.set(b2, { name: b2, value: c2 }), this._headers.set("cookie", Array.from(d2).map(([a3, b3]) => i(b3)).join("; ")), this;
        }
        delete(a2) {
          let b2 = this._parsed, c2 = Array.isArray(a2) ? a2.map((a3) => b2.delete(a3)) : b2.delete(a2);
          return this._headers.set("cookie", Array.from(b2).map(([a3, b3]) => i(b3)).join("; ")), c2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((a2) => `${a2.name}=${encodeURIComponent(a2.value)}`).join("; ");
        }
      }, o = class {
        constructor(a2) {
          var b2, c2, d2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = a2;
          const e2 = null != (d2 = null != (c2 = null == (b2 = a2.getSetCookie) ? void 0 : b2.call(a2)) ? c2 : a2.get("set-cookie")) ? d2 : [];
          for (const a3 of Array.isArray(e2) ? e2 : function(a4) {
            if (!a4) return [];
            var b3, c3, d3, e3, f2, g2 = [], h2 = 0;
            function i2() {
              for (; h2 < a4.length && /\s/.test(a4.charAt(h2)); ) h2 += 1;
              return h2 < a4.length;
            }
            for (; h2 < a4.length; ) {
              for (b3 = h2, f2 = false; i2(); ) if ("," === (c3 = a4.charAt(h2))) {
                for (d3 = h2, h2 += 1, i2(), e3 = h2; h2 < a4.length && "=" !== (c3 = a4.charAt(h2)) && ";" !== c3 && "," !== c3; ) h2 += 1;
                h2 < a4.length && "=" === a4.charAt(h2) ? (f2 = true, h2 = e3, g2.push(a4.substring(b3, d3)), b3 = h2) : h2 = d3 + 1;
              } else h2 += 1;
              (!f2 || h2 >= a4.length) && g2.push(a4.substring(b3, a4.length));
            }
            return g2;
          }(e2)) {
            const b3 = k(a3);
            b3 && this._parsed.set(b3.name, b3);
          }
        }
        get(...a2) {
          let b2 = "string" == typeof a2[0] ? a2[0] : a2[0].name;
          return this._parsed.get(b2);
        }
        getAll(...a2) {
          var b2;
          let c2 = Array.from(this._parsed.values());
          if (!a2.length) return c2;
          let d2 = "string" == typeof a2[0] ? a2[0] : null == (b2 = a2[0]) ? void 0 : b2.name;
          return c2.filter((a3) => a3.name === d2);
        }
        has(a2) {
          return this._parsed.has(a2);
        }
        set(...a2) {
          let [b2, c2, d2] = 1 === a2.length ? [a2[0].name, a2[0].value, a2[0]] : a2, e2 = this._parsed;
          return e2.set(b2, function(a3 = { name: "", value: "" }) {
            return "number" == typeof a3.expires && (a3.expires = new Date(a3.expires)), a3.maxAge && (a3.expires = new Date(Date.now() + 1e3 * a3.maxAge)), (null === a3.path || void 0 === a3.path) && (a3.path = "/"), a3;
          }({ name: b2, value: c2, ...d2 })), function(a3, b3) {
            for (let [, c3] of (b3.delete("set-cookie"), a3)) {
              let a4 = i(c3);
              b3.append("set-cookie", a4);
            }
          }(e2, this._headers), this;
        }
        delete(...a2) {
          let [b2, c2] = "string" == typeof a2[0] ? [a2[0]] : [a2[0].name, a2[0]];
          return this.set({ ...c2, name: b2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(i).join("; ");
        }
      };
    }, 930: (a, b, c) => {
      "use strict";
      c.d(b, { iC: () => e }), c(20);
      var d = c(662);
      function e() {
        let a2 = d.Z.getStore();
        return (null == a2 ? void 0 : a2.rootTaskSpawnPhase) === "action";
      }
    }, 987: (a, b, c) => {
      "use strict";
      Object.defineProperty(b, "__esModule", { value: true });
      var d = { interceptTestApis: function() {
        return h;
      }, wrapRequestHandler: function() {
        return i;
      } };
      for (var e in d) Object.defineProperty(b, e, { enumerable: true, get: d[e] });
      let f = c(643), g = c(318);
      function h() {
        return (0, g.interceptFetch)(c.g.fetch);
      }
      function i(a2) {
        return (b2, c2) => (0, f.withRequest)(b2, g.reader, () => a2(b2, c2));
      }
    }, 990: (a, b, c) => {
      var d, e = { 226: function(e2, f2) {
        !function(g2) {
          "use strict";
          var h = "function", i = "undefined", j = "object", k = "string", l = "major", m = "model", n = "name", o = "type", p = "vendor", q = "version", r = "architecture", s = "console", t = "mobile", u = "tablet", v = "smarttv", w = "wearable", x = "embedded", y = "Amazon", z = "Apple", A = "ASUS", B = "BlackBerry", C = "Browser", D = "Chrome", E = "Firefox", F = "Google", G = "Huawei", H = "Microsoft", I = "Motorola", J = "Opera", K = "Samsung", L = "Sharp", M = "Sony", N = "Xiaomi", O = "Zebra", P = "Facebook", Q = "Chromium OS", R = "Mac OS", S = function(a2, b2) {
            var c2 = {};
            for (var d2 in a2) b2[d2] && b2[d2].length % 2 == 0 ? c2[d2] = b2[d2].concat(a2[d2]) : c2[d2] = a2[d2];
            return c2;
          }, T = function(a2) {
            for (var b2 = {}, c2 = 0; c2 < a2.length; c2++) b2[a2[c2].toUpperCase()] = a2[c2];
            return b2;
          }, U = function(a2, b2) {
            return typeof a2 === k && -1 !== V(b2).indexOf(V(a2));
          }, V = function(a2) {
            return a2.toLowerCase();
          }, W = function(a2, b2) {
            if (typeof a2 === k) return a2 = a2.replace(/^\s\s*/, ""), typeof b2 === i ? a2 : a2.substring(0, 350);
          }, X = function(a2, b2) {
            for (var c2, d2, e3, f3, g3, i2, k2 = 0; k2 < b2.length && !g3; ) {
              var l2 = b2[k2], m2 = b2[k2 + 1];
              for (c2 = d2 = 0; c2 < l2.length && !g3 && l2[c2]; ) if (g3 = l2[c2++].exec(a2)) for (e3 = 0; e3 < m2.length; e3++) i2 = g3[++d2], typeof (f3 = m2[e3]) === j && f3.length > 0 ? 2 === f3.length ? typeof f3[1] == h ? this[f3[0]] = f3[1].call(this, i2) : this[f3[0]] = f3[1] : 3 === f3.length ? typeof f3[1] !== h || f3[1].exec && f3[1].test ? this[f3[0]] = i2 ? i2.replace(f3[1], f3[2]) : void 0 : this[f3[0]] = i2 ? f3[1].call(this, i2, f3[2]) : void 0 : 4 === f3.length && (this[f3[0]] = i2 ? f3[3].call(this, i2.replace(f3[1], f3[2])) : void 0) : this[f3] = i2 || void 0;
              k2 += 2;
            }
          }, Y = function(a2, b2) {
            for (var c2 in b2) if (typeof b2[c2] === j && b2[c2].length > 0) {
              for (var d2 = 0; d2 < b2[c2].length; d2++) if (U(b2[c2][d2], a2)) return "?" === c2 ? void 0 : c2;
            } else if (U(b2[c2], a2)) return "?" === c2 ? void 0 : c2;
            return a2;
          }, Z = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, $ = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [q, [n, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [q, [n, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [n, q], [/opios[\/ ]+([\w\.]+)/i], [q, [n, J + " Mini"]], [/\bopr\/([\w\.]+)/i], [q, [n, J]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [n, q], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [q, [n, "UC" + C]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [q, [n, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [q, [n, "WeChat"]], [/konqueror\/([\w\.]+)/i], [q, [n, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [q, [n, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [q, [n, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[n, /(.+)/, "$1 Secure " + C], q], [/\bfocus\/([\w\.]+)/i], [q, [n, E + " Focus"]], [/\bopt\/([\w\.]+)/i], [q, [n, J + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [q, [n, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [q, [n, "Dolphin"]], [/coast\/([\w\.]+)/i], [q, [n, J + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [q, [n, "MIUI " + C]], [/fxios\/([-\w\.]+)/i], [q, [n, E]], [/\bqihu|(qi?ho?o?|360)browser/i], [[n, "360 " + C]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[n, /(.+)/, "$1 " + C], q], [/(comodo_dragon)\/([\w\.]+)/i], [[n, /_/g, " "], q], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [n, q], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [n], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[n, P], q], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [n, q], [/\bgsa\/([\w\.]+) .*safari\//i], [q, [n, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [q, [n, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [q, [n, D + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[n, D + " WebView"], q], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [q, [n, "Android " + C]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [n, q], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [q, [n, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [q, n], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [n, [q, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [n, q], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[n, "Netscape"], q], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [q, [n, E + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [n, q], [/(cobalt)\/([\w\.]+)/i], [n, [q, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[r, "amd64"]], [/(ia32(?=;))/i], [[r, V]], [/((?:i[346]|x)86)[;\)]/i], [[r, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[r, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[r, "armhf"]], [/windows (ce|mobile); ppc;/i], [[r, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[r, /ower/, "", V]], [/(sun4\w)[;\)]/i], [[r, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[r, V]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [m, [p, K], [o, u]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [m, [p, K], [o, t]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [m, [p, z], [o, t]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [m, [p, z], [o, u]], [/(macintosh);/i], [m, [p, z]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [m, [p, L], [o, t]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [m, [p, G], [o, u]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [m, [p, G], [o, t]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[m, /_/g, " "], [p, N], [o, t]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[m, /_/g, " "], [p, N], [o, u]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [m, [p, "OPPO"], [o, t]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [m, [p, "Vivo"], [o, t]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [m, [p, "Realme"], [o, t]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [m, [p, I], [o, t]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [m, [p, I], [o, u]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [m, [p, "LG"], [o, u]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [m, [p, "LG"], [o, t]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [m, [p, "Lenovo"], [o, u]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[m, /_/g, " "], [p, "Nokia"], [o, t]], [/(pixel c)\b/i], [m, [p, F], [o, u]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [m, [p, F], [o, t]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [m, [p, M], [o, t]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[m, "Xperia Tablet"], [p, M], [o, u]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [m, [p, "OnePlus"], [o, t]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [m, [p, y], [o, u]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[m, /(.+)/g, "Fire Phone $1"], [p, y], [o, t]], [/(playbook);[-\w\),; ]+(rim)/i], [m, p, [o, u]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [m, [p, B], [o, t]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [m, [p, A], [o, u]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [m, [p, A], [o, t]], [/(nexus 9)/i], [m, [p, "HTC"], [o, u]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [p, [m, /_/g, " "], [o, t]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [m, [p, "Acer"], [o, u]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [m, [p, "Meizu"], [o, t]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [p, m, [o, t]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [p, m, [o, u]], [/(surface duo)/i], [m, [p, H], [o, u]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [m, [p, "Fairphone"], [o, t]], [/(u304aa)/i], [m, [p, "AT&T"], [o, t]], [/\bsie-(\w*)/i], [m, [p, "Siemens"], [o, t]], [/\b(rct\w+) b/i], [m, [p, "RCA"], [o, u]], [/\b(venue[\d ]{2,7}) b/i], [m, [p, "Dell"], [o, u]], [/\b(q(?:mv|ta)\w+) b/i], [m, [p, "Verizon"], [o, u]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [m, [p, "Barnes & Noble"], [o, u]], [/\b(tm\d{3}\w+) b/i], [m, [p, "NuVision"], [o, u]], [/\b(k88) b/i], [m, [p, "ZTE"], [o, u]], [/\b(nx\d{3}j) b/i], [m, [p, "ZTE"], [o, t]], [/\b(gen\d{3}) b.+49h/i], [m, [p, "Swiss"], [o, t]], [/\b(zur\d{3}) b/i], [m, [p, "Swiss"], [o, u]], [/\b((zeki)?tb.*\b) b/i], [m, [p, "Zeki"], [o, u]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[p, "Dragon Touch"], m, [o, u]], [/\b(ns-?\w{0,9}) b/i], [m, [p, "Insignia"], [o, u]], [/\b((nxa|next)-?\w{0,9}) b/i], [m, [p, "NextBook"], [o, u]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[p, "Voice"], m, [o, t]], [/\b(lvtel\-)?(v1[12]) b/i], [[p, "LvTel"], m, [o, t]], [/\b(ph-1) /i], [m, [p, "Essential"], [o, t]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [m, [p, "Envizen"], [o, u]], [/\b(trio[-\w\. ]+) b/i], [m, [p, "MachSpeed"], [o, u]], [/\btu_(1491) b/i], [m, [p, "Rotor"], [o, u]], [/(shield[\w ]+) b/i], [m, [p, "Nvidia"], [o, u]], [/(sprint) (\w+)/i], [p, m, [o, t]], [/(kin\.[onetw]{3})/i], [[m, /\./g, " "], [p, H], [o, t]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [m, [p, O], [o, u]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [m, [p, O], [o, t]], [/smart-tv.+(samsung)/i], [p, [o, v]], [/hbbtv.+maple;(\d+)/i], [[m, /^/, "SmartTV"], [p, K], [o, v]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[p, "LG"], [o, v]], [/(apple) ?tv/i], [p, [m, z + " TV"], [o, v]], [/crkey/i], [[m, D + "cast"], [p, F], [o, v]], [/droid.+aft(\w)( bui|\))/i], [m, [p, y], [o, v]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [m, [p, L], [o, v]], [/(bravia[\w ]+)( bui|\))/i], [m, [p, M], [o, v]], [/(mitv-\w{5}) bui/i], [m, [p, N], [o, v]], [/Hbbtv.*(technisat) (.*);/i], [p, m, [o, v]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[p, W], [m, W], [o, v]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[o, v]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [p, m, [o, s]], [/droid.+; (shield) bui/i], [m, [p, "Nvidia"], [o, s]], [/(playstation [345portablevi]+)/i], [m, [p, M], [o, s]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [m, [p, H], [o, s]], [/((pebble))app/i], [p, m, [o, w]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [m, [p, z], [o, w]], [/droid.+; (glass) \d/i], [m, [p, F], [o, w]], [/droid.+; (wt63?0{2,3})\)/i], [m, [p, O], [o, w]], [/(quest( 2| pro)?)/i], [m, [p, P], [o, w]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [p, [o, x]], [/(aeobc)\b/i], [m, [p, y], [o, x]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [m, [o, t]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [m, [o, u]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[o, u]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[o, t]], [/(android[-\w\. ]{0,9});.+buil/i], [m, [p, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [q, [n, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [q, [n, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [n, q], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [q, n]], os: [[/microsoft (windows) (vista|xp)/i], [n, q], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [n, [q, Y, Z]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[n, "Windows"], [q, Y, Z]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[q, /_/g, "."], [n, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[n, R], [q, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [q, n], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [n, q], [/\(bb(10);/i], [q, [n, B]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [q, [n, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [q, [n, E + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [q, [n, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [q, [n, "watchOS"]], [/crkey\/([\d\.]+)/i], [q, [n, D + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[n, Q], q], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [n, q], [/(sunos) ?([\w\.\d]*)/i], [[n, "Solaris"], q], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [n, q]] }, _ = function(a2, b2) {
            if (typeof a2 === j && (b2 = a2, a2 = void 0), !(this instanceof _)) return new _(a2, b2).getResult();
            var c2 = typeof g2 !== i && g2.navigator ? g2.navigator : void 0, d2 = a2 || (c2 && c2.userAgent ? c2.userAgent : ""), e3 = c2 && c2.userAgentData ? c2.userAgentData : void 0, f3 = b2 ? S($, b2) : $, s2 = c2 && c2.userAgent == d2;
            return this.getBrowser = function() {
              var a3, b3 = {};
              return b3[n] = void 0, b3[q] = void 0, X.call(b3, d2, f3.browser), b3[l] = typeof (a3 = b3[q]) === k ? a3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, s2 && c2 && c2.brave && typeof c2.brave.isBrave == h && (b3[n] = "Brave"), b3;
            }, this.getCPU = function() {
              var a3 = {};
              return a3[r] = void 0, X.call(a3, d2, f3.cpu), a3;
            }, this.getDevice = function() {
              var a3 = {};
              return a3[p] = void 0, a3[m] = void 0, a3[o] = void 0, X.call(a3, d2, f3.device), s2 && !a3[o] && e3 && e3.mobile && (a3[o] = t), s2 && "Macintosh" == a3[m] && c2 && typeof c2.standalone !== i && c2.maxTouchPoints && c2.maxTouchPoints > 2 && (a3[m] = "iPad", a3[o] = u), a3;
            }, this.getEngine = function() {
              var a3 = {};
              return a3[n] = void 0, a3[q] = void 0, X.call(a3, d2, f3.engine), a3;
            }, this.getOS = function() {
              var a3 = {};
              return a3[n] = void 0, a3[q] = void 0, X.call(a3, d2, f3.os), s2 && !a3[n] && e3 && "Unknown" != e3.platform && (a3[n] = e3.platform.replace(/chrome os/i, Q).replace(/macos/i, R)), a3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return d2;
            }, this.setUA = function(a3) {
              return d2 = typeof a3 === k && a3.length > 350 ? W(a3, 350) : a3, this;
            }, this.setUA(d2), this;
          };
          _.VERSION = "1.0.35", _.BROWSER = T([n, q, l]), _.CPU = T([r]), _.DEVICE = T([m, p, o, s, t, v, u, w, x]), _.ENGINE = _.OS = T([n, q]), typeof f2 !== i ? (e2.exports && (f2 = e2.exports = _), f2.UAParser = _) : c.amdO ? void 0 === (d = function() {
            return _;
          }.call(b, c, b, a)) || (a.exports = d) : typeof g2 !== i && (g2.UAParser = _);
          var aa = typeof g2 !== i && (g2.jQuery || g2.Zepto);
          if (aa && !aa.ua) {
            var ab = new _();
            aa.ua = ab.getResult(), aa.ua.get = function() {
              return ab.getUA();
            }, aa.ua.set = function(a2) {
              ab.setUA(a2);
              var b2 = ab.getResult();
              for (var c2 in b2) aa.ua[c2] = b2[c2];
            };
          }
        }("object" == typeof window ? window : this);
      } }, f = {};
      function g(a2) {
        var b2 = f[a2];
        if (void 0 !== b2) return b2.exports;
        var c2 = f[a2] = { exports: {} }, d2 = true;
        try {
          e[a2].call(c2.exports, c2, c2.exports, g), d2 = false;
        } finally {
          d2 && delete f[a2];
        }
        return c2.exports;
      }
      g.ab = "//", a.exports = g(226);
    } }, (a) => {
      var b = a(a.s = 6);
      (_ENTRIES = "u" < typeof _ENTRIES ? {} : _ENTRIES)["middleware_src/middleware"] = b;
    }]);
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "src/middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/(api|trpc))(.*)(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/requestCache.js
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};

// node_modules/@opennextjs/aws/dist/utils/promise.js
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [], "qualities": [75], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "/Users/subharup/Developer/pulseping", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": false, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "partialFallbacks": false, "dynamicOnHover": false, "varyParams": false, "prefetchInlining": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 9, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "serverExternalPackages": ["@prisma/client", "prisma"], "turbopack": { "root": "/Users/subharup/Developer/pulseping" }, "distDirRoot": ".next" };
var BuildId = "Y6AByCSIqhAvTR_P4Vi8a";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/api/create-order", "regex": "^/api/create\\-order(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/create\\-order(?:/)?$" }, { "page": "/api/cron/ping", "regex": "^/api/cron/ping(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/cron/ping(?:/)?$" }, { "page": "/api/verify-payment", "regex": "^/api/verify\\-payment(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/verify\\-payment(?:/)?$" }, { "page": "/dashboard", "regex": "^/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard(?:/)?$" }, { "page": "/dashboard/billing", "regex": "^/dashboard/billing(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/billing(?:/)?$" }, { "page": "/favicon.ico", "regex": "^/favicon\\.ico(?:/)?$", "routeKeys": {}, "namedRegex": "^/favicon\\.ico(?:/)?$" }, { "page": "/privacy", "regex": "^/privacy(?:/)?$", "routeKeys": {}, "namedRegex": "^/privacy(?:/)?$" }, { "page": "/robots.txt", "regex": "^/robots\\.txt(?:/)?$", "routeKeys": {}, "namedRegex": "^/robots\\.txt(?:/)?$" }, { "page": "/sitemap.xml", "regex": "^/sitemap\\.xml(?:/)?$", "routeKeys": {}, "namedRegex": "^/sitemap\\.xml(?:/)?$" }, { "page": "/status", "regex": "^/status(?:/)?$", "routeKeys": {}, "namedRegex": "^/status(?:/)?$" }, { "page": "/terms", "regex": "^/terms(?:/)?$", "routeKeys": {}, "namedRegex": "^/terms(?:/)?$" }], "dynamic": [{ "page": "/sign-in/[[...sign-in]]", "regex": "^/sign\\-in(?:/(.+?))?(?:/)?$", "routeKeys": { "nxtPsignin": "nxtPsign-in" }, "namedRegex": "^/sign\\-in(?:/(?<nxtPsignin>.+?))?(?:/)?$" }, { "page": "/sign-up/[[...sign-up]]", "regex": "^/sign\\-up(?:/(.+?))?(?:/)?$", "routeKeys": { "nxtPsignup": "nxtPsign-up" }, "namedRegex": "^/sign\\-up(?:/(?<nxtPsignup>.+?))?(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/favicon.ico": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/favicon.ico", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/privacy": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/privacy", "dataRoute": "/privacy.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/robots.txt": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "text/plain", "x-next-cache-tags": "_N_T_/layout,_N_T_/robots.txt/layout,_N_T_/robots.txt/route,_N_T_/robots.txt" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/robots.txt", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/sitemap.xml": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "application/xml", "x-next-cache-tags": "_N_T_/layout,_N_T_/sitemap.xml/layout,_N_T_/sitemap.xml/route,_N_T_/sitemap.xml" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/sitemap.xml", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/status": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/status", "dataRoute": "/status.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/terms": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/terms", "dataRoute": "/terms.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "40ee1218f2b443b6faf577a9dcad2d5e", "previewModeSigningKey": "18e78c5775647a9e8dd05f12086e10c36fe4a437dc7edc9c17f40e5c10b5fd9e", "previewModeEncryptionKey": "cebeb7419e7550c8db6c60a0bca7bf84c972a18e7e9f330027ae1a98eabf446d" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/src/middleware.js"], "entrypoint": "server/src/middleware.js", "name": "src/middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", "originalSource": "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)" }, { "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/(api|trpc))(.*)(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", "originalSource": "/(api|trpc)(.*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "Y6AByCSIqhAvTR_P4Vi8a", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "IzINZyEpe9exTz2ZYt19IsTN/kpce9ldZgD7+KgzH9A=", "__NEXT_PREVIEW_MODE_ID": "40ee1218f2b443b6faf577a9dcad2d5e", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "18e78c5775647a9e8dd05f12086e10c36fe4a437dc7edc9c17f40e5c10b5fd9e", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "cebeb7419e7550c8db6c60a0bca7bf84c972a18e7e9f330027ae1a98eabf446d" } } }, "functions": {}, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/_global-error/page": "/_global-error", "/favicon.ico/route": "/favicon.ico", "/robots.txt/route": "/robots.txt", "/sitemap.xml/route": "/sitemap.xml", "/api/create-order/route": "/api/create-order", "/api/verify-payment/route": "/api/verify-payment", "/api/cron/ping/route": "/api/cron/ping", "/page": "/", "/sign-in/[[...sign-in]]/page": "/sign-in/[[...sign-in]]", "/sign-up/[[...sign-up]]/page": "/sign-up/[[...sign-up]]", "/dashboard/billing/page": "/dashboard/billing", "/privacy/page": "/privacy", "/terms/page": "/terms", "/dashboard/page": "/dashboard", "/status/page": "/status" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/404": "pages/404.html", "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    const nextUrl = constructNextUrl(internalEvent.url, `/${detectedLocale}${NextConfig.trailingSlash ? "/" : ""}`);
    const queryString = convertToQueryString(internalEvent.query);
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: `${nextUrl}${queryString}`
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/semver.js
function compareSemver(v1, operator, v2) {
  let versionDiff = 0;
  if (v1 === "latest") {
    versionDiff = 1;
  } else {
    if (/^[^\d]/.test(v1)) {
      v1 = v1.substring(1);
    }
    if (/^[^\d]/.test(v2)) {
      v2 = v2.substring(1);
    }
    const [major1, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
    const [major2, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);
    if (Number.isNaN(major1) || Number.isNaN(major2)) {
      throw new Error("The major version is required.");
    }
    if (major1 !== major2) {
      versionDiff = major1 - major2;
    } else if (minor1 !== minor2) {
      versionDiff = minor1 - minor2;
    } else if (patch1 !== patch2) {
      versionDiff = patch1 - patch2;
    }
  }
  switch (operator) {
    case "=":
      return versionDiff === 0;
    case ">=":
      return versionDiff >= 0;
    case "<=":
      return versionDiff <= 0;
    case ">":
      return versionDiff > 0;
    case "<":
      return versionDiff < 0;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// node_modules/@opennextjs/aws/dist/utils/cache.js
async function isStale(key, tags, lastModified) {
  if (!compareSemver(globalThis.nextVersion, ">=", "16.0.0")) {
    return false;
  }
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.isStale?.(tags, lastModified) ?? false;
  }
  return await globalThis.tagCache.isStale?.(key, lastModified) ?? false;
}
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified, isStaleFromTagCache = false) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  const isSSG = finalRevalidate === CACHE_ONE_YEAR;
  const remainingTtl = Math.max(finalRevalidate - age, 1);
  const isStaleFromTime = !isSSG && remainingTtl === 1;
  const isStale2 = isStaleFromTime || isStaleFromTagCache;
  if (!isSSG || isStaleFromTagCache) {
    const sMaxAge = isStaleFromTagCache ? 1 : remainingTtl;
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate,
      isStaleFromTagCache
    });
    if (isStale2) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale2 ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {}) && !NextConfig.experimental?.prefetchInlining;
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified, isStaleFromTagCache = false) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = event.headers.rsc === "1";
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified, isStaleFromTagCache);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      const tags = getTagsFromValue(cachedData.value);
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const _isStale = cachedData.shouldBypassTagCache ? false : await isStale(localizedPath, tags, cachedData.lastModified ?? Date.now());
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified, _isStale);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !(event.query.__nextDataReq === "1") && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
var NEXT_INTERNAL_HEADERS = [
  "x-middleware-rewrite",
  "x-middleware-redirect",
  "x-middleware-set-cookie",
  "x-middleware-skip",
  "x-middleware-override-headers",
  "x-middleware-next",
  "x-now-route-matches",
  "x-matched-path",
  "x-nextjs-data",
  "x-next-resume-state-length"
];
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      const lowerCaseKey = key.toLowerCase();
      if (lowerCaseKey.startsWith(INTERNAL_HEADER_PREFIX) || lowerCaseKey.startsWith(MIDDLEWARE_HEADER_PREFIX) || NEXT_INTERNAL_HEADERS.includes(lowerCaseKey)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
