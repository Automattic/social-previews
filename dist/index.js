"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/helpers.tsx
var _element = require('@wordpress/element');
var _i18n = require('@wordpress/i18n');
var _jsxruntime = require('react/jsx-runtime');
var baseDomain = (url) => {
  const withoutProtocol = url.replace(/^[^/]+:\/\//, "");
  const slashIndex = withoutProtocol.indexOf("/");
  return slashIndex === -1 ? withoutProtocol : withoutProtocol.substring(0, slashIndex);
};
var codepointLength = (text) => Array.from(text).length;
var codepointSlice = (text, start, end) => Array.from(text).slice(start, end).join("");
var shortEnough = (limit) => (title) => codepointLength(title) <= limit ? title : false;
var truncatedAtSpace = (lower, upper) => (fullTitle) => {
  const title = fullTitle.slice(0, upper);
  const lastSpace = title.lastIndexOf(" ");
  return lastSpace > lower && lastSpace < upper ? title.slice(0, lastSpace).concat("\u2026") : false;
};
var hardTruncation = (limit) => (title) => codepointSlice(title, 0, limit).concat("\u2026");
var firstValid = (...predicates) => (a) => _optionalChain([predicates, 'access', _ => _.find, 'call', _2 => _2((p) => false !== p(a)), 'optionalCall', _3 => _3(a)]);
var stripHtmlTags = (description, allowedTags = []) => {
  const pattern = new RegExp(`(<([^${allowedTags.join("")}>]+)>)`, "gi");
  return description ? description.replace(pattern, "") : "";
};
var getTitleFromDescription = (description) => {
  return stripHtmlTags(description).substring(0, 50);
};
var hasTag = (text, tag) => {
  const pattern = new RegExp(`<${tag}[^>]*>`, "gi");
  return pattern.test(text);
};
var formatNextdoorDate = new Intl.DateTimeFormat("en-GB", {
  // Result: "7 Oct", "31 Dec"
  day: "numeric",
  month: "short"
}).format;
var formatThreadsDate = new Intl.DateTimeFormat("en-US", {
  // Result: "'06/21/2024"
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
}).format;
var formatTweetDate = new Intl.DateTimeFormat("en-US", {
  // Result: "Apr 7", "Dec 31"
  month: "short",
  day: "numeric"
}).format;
var formatMastodonDate = new Intl.DateTimeFormat("en-US", {
  // Result: "Apr 7, 2024", "Dec 31, 2023"
  month: "short",
  day: "numeric",
  year: "numeric"
}).format;
var hashtagUrlMap = {
  twitter: "https://twitter.com/hashtag/%1$s",
  facebook: "https://www.facebook.com/hashtag/%1$s",
  linkedin: "https://www.linkedin.com/feed/hashtag/?keywords=%1$s",
  instagram: "https://www.instagram.com/explore/tags/%1$s",
  mastodon: "https://%2$s/tags/%1$s",
  nextdoor: "https://nextdoor.com/hashtag/%1$s",
  threads: "https://www.threads.net/search?q=%1$s&serp_type=tags",
  tumblr: "https://www.tumblr.com/tagged/%1$s",
  bluesky: "https://bsky.app/hashtag/%1$s"
};
function preparePreviewText(text, options) {
  const {
    platform,
    maxChars,
    maxLines,
    hyperlinkHashtags = true,
    // Instagram doesn't support hyperlink URLs at the moment.
    hyperlinkUrls = "instagram" !== platform
  } = options;
  let result = stripHtmlTags(text);
  result = result.replaceAll(/(?:\s*[\n\r]){2,}/g, "\n\n");
  if (maxChars && codepointLength(result) > maxChars) {
    result = hardTruncation(maxChars)(result);
  }
  if (maxLines) {
    const lines = result.split("\n");
    if (lines.length > maxLines) {
      result = lines.slice(0, maxLines).join("\n");
    }
  }
  const componentMap = {};
  if (hyperlinkUrls) {
    const urls = result.match(/(https?:\/\/\S+)/g) || [];
    urls.forEach((url, index) => {
      componentMap[`Link${index}`] = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { href: url, rel: "noopener noreferrer", target: "_blank", children: url });
      result = result.replace(url, `<Link${index} />`);
    });
  }
  if (hyperlinkHashtags && hashtagUrlMap[platform]) {
    const hashtags = result.matchAll(/(^|\s)#(\w+)/g);
    const hashtagUrl = hashtagUrlMap[platform];
    [...hashtags].forEach(([fullMatch, whitespace, hashtag], index) => {
      const url = _i18n.sprintf.call(void 0, hashtagUrl, hashtag, options.hashtagDomain);
      componentMap[`Hashtag${index}`] = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { href: url, rel: "noopener noreferrer", target: "_blank", children: `#${hashtag}` });
      result = result.replace(fullMatch, `${whitespace}<Hashtag${index} />`);
    });
  }
  result = result.replace(/\n/g, "<br />");
  componentMap.br = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "br", {});
  return _element.createInterpolateElement.call(void 0, result, componentMap);
}

// src/site-icon-with-fallback.tsx
var _react = require('react');

// src/icons/globe-icon.tsx

function GlobeIcon(props) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "svg",
    {
      focusable: "false",
      "aria-hidden": "true",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      width: "14",
      height: "14",
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "path",
        {
          fill: "currentColor",
          d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
        }
      )
    }
  );
}

// src/site-icon-with-fallback.tsx

function DefaultSiteIcon({ className }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "span",
    {
      className,
      "aria-hidden": "true",
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e8eaed",
        color: "#5f6368",
        borderRadius: "50%"
      },
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, GlobeIcon, { style: { width: "60%", height: "60%" } })
    }
  );
}
function SiteIconWithFallback({
  src: siteIconUrl,
  alt = "",
  className,
  fallback = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DefaultSiteIcon, { className })
}) {
  const [imageUrlWithError, setImageUrlWithError] = _react.useState.call(void 0, "");
  const onError = _react.useCallback.call(void 0, (event) => {
    setImageUrlWithError(event.target.src);
  }, []);
  const showIcon = siteIconUrl && // Check if the image URL with error is different from the provided site icon URL
  // to ensure that a change in siteIconUrl resets the error state
  imageUrlWithError !== siteIconUrl;
  return showIcon ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src: siteIconUrl, alt, onError, className }) : fallback;
}

// src/google-search-preview/index.tsx

var URL_LENGTH = 68;
var TITLE_LENGTH = 63;
var DESCRIPTION_LENGTH = 160;
var googleUrl = (url) => {
  const protocol = url.startsWith("https://") ? "https://" : "http://";
  const breadcrumb = protocol + url.replace(protocol, "").split("/").join(" \u203A ");
  const truncateBreadcrumb = firstValid(shortEnough(URL_LENGTH), hardTruncation(URL_LENGTH));
  return truncateBreadcrumb(breadcrumb);
};
var googleTitle = firstValid(
  shortEnough(TITLE_LENGTH),
  truncatedAtSpace(TITLE_LENGTH - 40, TITLE_LENGTH + 10),
  hardTruncation(TITLE_LENGTH)
);
var googleDescription = firstValid(
  shortEnough(DESCRIPTION_LENGTH),
  truncatedAtSpace(DESCRIPTION_LENGTH - 80, DESCRIPTION_LENGTH + 10),
  hardTruncation(DESCRIPTION_LENGTH)
);
var GoogleSearchPreview = ({
  description = "",
  siteIcon,
  siteTitle,
  title = "",
  url = ""
}) => {
  const domain = baseDomain(url);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "search-preview", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "search-preview__display", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "search-preview__header", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "search-preview__branding", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SiteIconWithFallback, { className: "search-preview__icon", src: siteIcon }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "search-preview__site", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "search-preview__site--title", children: siteTitle || domain }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "search-preview__url", children: googleUrl(url) })
        ] })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "search-preview__menu", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { focusable: "false", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }) }) })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "search-preview__title", children: googleTitle(title) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "search-preview__description", children: googleDescription(stripHtmlTags(description)) })
  ] }) });
};

// src/twitter-preview/card.tsx
var _clsx = require('clsx'); var _clsx2 = _interopRequireDefault(_clsx);

var DESCRIPTION_LENGTH2 = 280;
var twitterDescription = firstValid(
  shortEnough(DESCRIPTION_LENGTH2),
  hardTruncation(DESCRIPTION_LENGTH2)
);
var Card = ({
  description,
  image,
  title,
  cardType,
  url
}) => {
  const cardClassNames = _clsx2.default.call(void 0, `twitter-preview__card-${cardType}`, {
    "twitter-preview__card-has-image": !!image
  });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "twitter-preview__card", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: cardClassNames, children: [
    image && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { className: "twitter-preview__card-image", src: image, alt: "" }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "twitter-preview__card-body", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "twitter-preview__card-url", children: baseDomain(url || "") }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "twitter-preview__card-title", children: title }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "twitter-preview__card-description", children: twitterDescription(stripHtmlTags(description)) })
    ] })
  ] }) });
};

// src/twitter-preview/footer.tsx

var Footer = () => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "twitter-preview__footer", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "twitter-preview__icon-replies", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" }) }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "twitter-preview__icon-retweets", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" }) }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "twitter-preview__icon-likes", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" }) }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "twitter-preview__icon-analytics", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" }) }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "twitter-preview__icon-share", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" }) }) })
  ] });
};

// src/twitter-preview/header.tsx


var Header = ({ name, screenName, date }) => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "twitter-preview__header", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "twitter-preview__name", children: name || _i18n.__.call(void 0, "Account Name", "social-previews") }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "twitter-preview__screen-name", children: screenName || "@account" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: "\xB7" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "twitter-preview__date", children: formatTweetDate(date || Date.now()) })
  ] });
};

// src/twitter-preview/media.tsx



var Media = ({ media }) => {
  const filteredMedia = media.filter(
    (mediaItem) => mediaItem.type.startsWith("image/") || mediaItem.type.startsWith("video/")
  ).filter((mediaItem, idx, array) => {
    if (0 === idx) {
      return true;
    }
    if (array[0].type.startsWith("video/") || "image/gif" === array[0].type) {
      return false;
    }
    if (mediaItem.type.startsWith("video/") || "image/gif" === mediaItem.type) {
      return false;
    }
    return true;
  }).slice(0, 4);
  if (0 === filteredMedia.length) {
    return null;
  }
  const isVideo = filteredMedia[0].type.startsWith("video/");
  const mediaClasses = _clsx2.default.call(void 0, [
    "twitter-preview__media",
    "twitter-preview__media-children-" + filteredMedia.length
  ]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: mediaClasses, children: filteredMedia.map((mediaItem, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react.Fragment, { children: isVideo ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "video", { controls: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "source", { src: mediaItem.url, type: mediaItem.type }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { alt: mediaItem.alt || "", src: mediaItem.url }) }, `twitter-preview__media-item-${index}`)) });
};

// src/twitter-preview/quote-tweet.tsx
var _components = require('@wordpress/components');

var QuoteTweet = ({ tweetUrl }) => {
  if (!tweetUrl) {
    return null;
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "twitter-preview__quote-tweet", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      _components.SandBox,
      {
        html: `<blockquote class="twitter-tweet" data-conversation="none" data-dnt="true"><a href="${tweetUrl}"></a></blockquote>`,
        scripts: ["https://platform.twitter.com/widgets.js"],
        title: "Embedded tweet"
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "twitter-preview__quote-tweet-overlay" })
  ] });
};

// src/avatar-with-fallback.tsx


function DefaultAvatar(props) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 340 340",
      width: "36",
      height: "36",
      "aria-hidden": "true",
      ...props,
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "path",
        {
          fill: "#DDD",
          d: "m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 1 1-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"
        }
      )
    }
  );
}
function AvatarWithFallback({
  src: avatarUrl,
  alt = "",
  className,
  fallback = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DefaultAvatar, { className })
}) {
  const [imageUrlWithError, setImageUrlWithError] = _react.useState.call(void 0, "");
  const onError = _react.useCallback.call(void 0, (event) => {
    setImageUrlWithError(event.target.src);
  }, []);
  const showAvatar = !!avatarUrl && // Check if the image URL with error is different from the provided avatar URL
  // to ensure that a change in avatarUrl resets the error state
  imageUrlWithError !== avatarUrl;
  return showAvatar ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src: avatarUrl, alt, onError, className }) : fallback;
}

// src/twitter-preview/sidebar.tsx

var Sidebar = ({ profileImage, showThreadConnector }) => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "twitter-preview__sidebar", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "twitter-preview__profile-image", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AvatarWithFallback, { src: profileImage }) }),
    showThreadConnector && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "twitter-preview__connector" })
  ] });
};

// src/twitter-preview/text.tsx

var Text = ({ text }) => {
  if (!text) {
    return null;
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "twitter-preview__text", children: preparePreviewText(text, { platform: "twitter" }) });
};

// src/twitter-preview/post-preview.tsx

var TwitterPostPreview = ({
  date,
  description,
  image,
  media,
  name,
  profileImage,
  screenName,
  showThreadConnector,
  text,
  title,
  tweetUrl,
  cardType,
  url
}) => {
  const hasMedia = !!_optionalChain([media, 'optionalAccess', _4 => _4.length]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "twitter-preview__wrapper", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "twitter-preview__container", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Sidebar, { profileImage, showThreadConnector }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "twitter-preview__main", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Header, { name, screenName, date }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "twitter-preview__content", children: [
        text ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Text, { text }) : null,
        hasMedia ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Media, { media }) : null,
        tweetUrl ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, QuoteTweet, { tweetUrl }) : null,
        !hasMedia && url && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          Card,
          {
            description: description || "",
            image,
            title: title || "",
            cardType: cardType || "",
            url
          }
        )
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Footer, {})
    ] })
  ] }) });
};

// src/twitter-preview/link-preview.tsx

var TwitterLinkPreview = (props) => {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    TwitterPostPreview,
    {
      ...props,
      text: "",
      media: void 0
    }
  );
};

// src/twitter-preview/previews.tsx


// src/shared/section-heading/index.tsx

var HEADING_LEVELS = [2, 3, 4, 5, 6];
var SectionHeading = ({
  className,
  level,
  children
}) => {
  const Tag = `h${level && HEADING_LEVELS.includes(level) ? level : 3}`;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Tag, { className: `social-preview__section-heading ${_nullishCoalesce(className, () => ( ""))}`, children });
};
var section_heading_default = SectionHeading;

// src/twitter-preview/previews.tsx

var TwitterPreviews = ({
  headingLevel,
  hideLinkPreview,
  hidePostPreview,
  tweets
}) => {
  if (!_optionalChain([tweets, 'optionalAccess', _5 => _5.length])) {
    return null;
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "social-preview twitter-preview", children: [
    !hidePostPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section twitter-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
        level: headingLevel,
        // translators: refers to a social post on Twitter
        children: _i18n.__.call(void 0, "Your post", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, "This is what your social post will look like on X:", "social-previews") }),
      tweets.map((tweet, index) => {
        const isLast = index + 1 === tweets.length;
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          TwitterPostPreview,
          {
            ...tweet,
            showThreadConnector: !isLast
          },
          `twitter-preview__tweet-${index}`
        );
      })
    ] }),
    !hideLinkPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section twitter-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
        level: headingLevel,
        // translators: refers to a link to a Twitter post
        children: _i18n.__.call(void 0, "Link preview", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
        "This is what it will look like when someone shares the link to your WordPress post on X.",
        "social-previews"
      ) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TwitterLinkPreview, { ...tweets[0], name: "", profileImage: "", screenName: "" })
    ] })
  ] });
};

// src/linkedin-preview/post-preview.tsx


// src/shared/expandable-text/index.tsx




var EXPAND_THRESHOLD_CHARS = 400;
function codepointLength2(text) {
  return Array.from(text).length;
}
function truncateAtWordBoundary(text, limit) {
  const codepoints = Array.from(text);
  if (codepoints.length <= limit) {
    return text;
  }
  const slice = codepoints.slice(0, limit).join("");
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > limit - 80 ? lastSpace : slice.length;
  return slice.slice(0, cut);
}
function ExpandableText(props) {
  const { text, children } = props;
  const [expanded, toggle] = _react.useReducer.call(void 0, (state) => !state, false);
  const stripped = stripHtmlTags(text);
  if (codepointLength2(stripped) <= EXPAND_THRESHOLD_CHARS) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _jsxruntime.Fragment, { children: children(text) });
  }
  if (expanded) {
    return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
      children(text),
      " ",
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _components.Button, { variant: "link", className: "social-previews__expand-toggle", onClick: toggle, children: _i18n.__.call(void 0, "See less", "social-previews") })
    ] });
  }
  const truncated = truncateAtWordBoundary(stripped, EXPAND_THRESHOLD_CHARS);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    children(truncated),
    "\u2026 ",
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _components.Button, { variant: "link", className: "social-previews__expand-toggle", onClick: toggle, children: _i18n.__.call(void 0, "See more", "social-previews") })
  ] });
}

// src/linkedin-preview/constants.ts
var FEED_TEXT_MAX_LENGTH = 3e3;

// src/linkedin-preview/post-preview.tsx

function LinkedInPostPreview({
  articleReadTime = 5,
  image,
  jobTitle,
  name,
  profileImage,
  description,
  media,
  title,
  url
}) {
  const hasMedia = !!_optionalChain([media, 'optionalAccess', _6 => _6.length]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "linkedin-preview__wrapper", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: `linkedin-preview__container ${hasMedia ? "has-media" : ""}`, children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "linkedin-preview__header", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "linkedin-preview__header--avatar", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AvatarWithFallback, { src: profileImage }) }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "linkedin-preview__header--profile", children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "linkedin-preview__header--profile-info", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "linkedin-preview__header--profile-name", children: name || _i18n.__.call(void 0, "Account Name", "social-previews") }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: "\u2022" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", {
            className: "linkedin-preview__header--profile-actor",
            // translators: refers to the actor level of the post being shared, e.g. "1st", "2nd", "3rd", etc.
            children: _i18n.__.call(void 0, "1st", "social-previews")
          })
        ] }),
        jobTitle ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "linkedin-preview__header--profile-title", children: jobTitle }) : null,
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "linkedin-preview__header--profile-meta", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", {
            // translators: refers to the time since the post was published, e.g. "1h"
            children: _i18n.__.call(void 0, "1h", "social-previews")
          }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: "\u2022" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 16 16", fill: "currentColor", width: "16", height: "16", focusable: "false", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0L9 7.5l.38-.7a1 1 0 00.12-.48v-.85a.78.78 0 01.21-.53l1.07-1.09a5 5 0 01-1.54 9z" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "linkedin-preview__content", children: [
      description ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "linkedin-preview__caption", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExpandableText, { text: description, children: (visibleText) => preparePreviewText(visibleText, {
          platform: "linkedin",
          maxChars: FEED_TEXT_MAX_LENGTH
        }) }) }),
        hasMedia && url && !description.includes(url) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          " - ",
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { href: url, rel: "nofollow noopener noreferrer", target: "_blank", children: url })
        ] })
      ] }) : null,
      hasMedia ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "linkedin-preview__media", children: media.map((mediaItem, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          className: "linkedin-preview__media-item",
          children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "video", { controls: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "source", { src: mediaItem.url, type: mediaItem.type }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { alt: mediaItem.alt || "", src: mediaItem.url })
        },
        `linkedin-preview__media-item-${index}`
      )) }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "article", { children: [
        image ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { className: "linkedin-preview__image", src: image, alt: "" }) : null,
        url ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "linkedin-preview__description", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h2", { className: "linkedin-preview__description--title", children: title || getTitleFromDescription(description) }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "linkedin-preview__description--meta", children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "linkedin-preview__description--url", children: baseDomain(url) }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: "\u2022" }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: _i18n.sprintf.call(void 0, 
              // translators: %d is the number of minutes it takes to read the article
              _i18n.__.call(void 0, "%d min read", "social-previews"),
              articleReadTime
            ) })
          ] })
        ] }) : null
      ] })
    ] })
  ] }) });
}

// src/linkedin-preview/link-preview.tsx

function LinkedInLinkPreview(props) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    LinkedInPostPreview,
    {
      name: "",
      profileImage: "",
      ...props,
      description: "",
      media: void 0,
      title: props.title || getTitleFromDescription(props.description)
    }
  );
}

// src/linkedin-preview/previews.tsx


var LinkedInPreviews = ({
  headingLevel,
  hideLinkPreview,
  hidePostPreview,
  ...props
}) => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "social-preview linkedin-preview", children: [
    !hidePostPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section linkedin-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
        level: headingLevel,
        // translators: refers to a social post on LinkedIn
        children: _i18n.__.call(void 0, "Your post", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, "This is what your social post will look like on LinkedIn:", "social-previews") }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, LinkedInPostPreview, { ...props })
    ] }),
    !hideLinkPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section linkedin-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
        level: headingLevel,
        // translators: refers to a link to a LinkedIn post
        children: _i18n.__.call(void 0, "Link preview", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
        "This is what it will look like when someone shares the link to your WordPress post on LinkedIn.",
        "social-previews"
      ) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, LinkedInLinkPreview, { ...props, name: "", profileImage: "" })
    ] })
  ] });
};

// src/tumblr-preview/link-preview.tsx


// src/tumblr-preview/helpers.ts
var TITLE_LENGTH2 = 1e3;
var DESCRIPTION_LENGTH3 = 4096;
var tumblrTitle = (text) => firstValid(
  shortEnough(TITLE_LENGTH2),
  hardTruncation(TITLE_LENGTH2)
)(stripHtmlTags(text)) || "";
var tumblrDescription = (text) => {
  let processedText = text;
  let startIndex = processedText.indexOf("<!--");
  while (startIndex !== -1) {
    const endIndex = processedText.indexOf("-->", startIndex);
    if (endIndex === -1) {
      processedText = processedText.substring(0, startIndex);
      break;
    }
    processedText = processedText.substring(0, startIndex) + processedText.substring(endIndex + 3);
    startIndex = processedText.indexOf("<!--");
  }
  processedText = processedText.replace(/<\/p>/g, "</p>\n\n");
  return firstValid(
    shortEnough(DESCRIPTION_LENGTH3),
    hardTruncation(DESCRIPTION_LENGTH3)
  )(stripHtmlTags(processedText)) || "";
};

// src/tumblr-preview/post/actions/index.tsx


// src/tumblr-preview/post/icons/index.tsx

var TumblrPostIcon = ({ name }) => {
  let svg;
  switch (name) {
    case "blaze":
      svg = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 25 22", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "m7.5059-0.24414c-0.79843 0.057223-1.2169 0.88587-1.1635 1.6128-0.2266 2.0449-1.4898 3.8696-3.1975 4.9778-3.0182 2.414-4.2201 6.8066-2.8033 10.411 0.92417 2.4679 2.9589 4.5674 5.4768 5.3928 0.95914 0.16102 1.7233-0.94358 1.3074-1.8059-0.11578-0.51062-0.17482-0.96516-0.17845-1.487 1.0413 1.5607 2.5484 2.8986 4.341 3.4975 1.0396-0.0154 1.98-0.64458 2.8516-1.1608 3.3821-2.1786 4.9604-6.7097 3.6597-10.518-0.49144-1.4599-1.2948-2.8935-2.5028-3.8698-0.7512-0.45498-1.661 0.09677-1.9202 0.86038-0.12274 0.16822-0.70352 1.1955-0.6191 0.61976 0.25488-3.4397-1.6789-7.0066-4.8123-8.4958-0.14322-0.037843-0.292-0.049464-0.43945-0.035156zm1.0586 3.5605c1.8947 2.0016 2.2326 5.1984 0.89062 7.5879-0.38498 0.96148 0.71762 2.0063 1.6567 1.5681 1.4159-0.4624 2.6998-1.3259 3.6577-2.4665 1.6442 2.5888 1.1465 6.2819-1.0629 8.3379-0.62378 0.60782-1.3666 1.0945-2.1754 1.4179-1.9543-0.989-3.3534-3.0966-3.5625-5.3125-0.25636-1.0253-1.81-1.2013-2.2852-0.25781-0.75058 1.3054-1.1846 2.7948-1.2305 4.3008-2.2396-1.9852-2.8468-5.4435-1.4609-8.0527 0.58926-1.239 1.651-2.13 2.724-2.9329 1.2958-1.1271 2.2791-2.62 2.7682-4.2683l0.071578 0.069832z" }) });
      break;
    case "delete":
      svg = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "svg", { viewBox: "0 0 14 17", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M12 5v9c.1.7-.3 1-1 1H3c-.5 0-.9-.3-1-1V5c0-.6-.4-1-1-1-.5 0-1 .4-1 1v9.5C0 16.1 1.4 17 3 17h8c1.8 0 3-.8 3-2.5V5c0-.6-.5-1-1-1-.6 0-1 .5-1 1z" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M4 12s0 1 1 1 1-1 1-1V5c0-.5-.4-1-1-1-.5 0-1 .5-1 1v7zm4 0s0 1 1 1 1-1 1-1V5c0-.5-.4-1-1-1-.5 0-1 .5-1 1v7zm5-10c.5 0 1-.4 1-1 0-.5-.4-.9-1-1H1C.5.1 0 .5 0 1c0 .6.6 1 1.1 1H13z" })
      ] });
      break;
    case "edit":
      svg = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 17.6 17.6", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M5.3 13.8l-2.1.7.7-2.1L10.3 6l1.4 1.4-6.4 6.4zm6.4-9.3l-1.4-1.4-1.4 1.4-6.7 6.7-.2.5-2 5.9 3.8-1.3 2.1-.7.4-.1.3-.3 7.8-7.8c.1 0-2.7-2.9-2.7-2.9zm5.6-1.4L14.5.3c-.4-.4-1-.4-1.4 0l-1.4 1.4L15.9 6l1.4-1.4c.4-.5.4-1.1 0-1.5" }) });
      break;
    case "share":
      svg = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 24 24", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M12.6173 1.07612C12.991 0.921338 13.4211 1.00689 13.7071 1.29289L22.7071 10.2929C23.0832 10.669 23.0991 11.2736 22.7433 11.669L13.7433 21.669C13.4663 21.9767 13.0283 22.082 12.6417 21.9336C12.2552 21.7853 12 21.414 12 21V16H11.5C7.31775 16 3.92896 18.2486 2.95256 21.3044C2.80256 21.7738 2.33292 22.064 1.84598 21.9881C1.35904 21.9122 1 21.4928 1 21V18.5C1 12.3162 5.88069 7.27245 12 7.01067V2C12 1.59554 12.2436 1.2309 12.6173 1.07612ZM14 4.41421V8C14 8.55228 13.5523 9 13 9H12.5C7.64534 9 3.64117 12.6414 3.06988 17.3419C5.09636 15.2366 8.18218 14 11.5 14H13C13.5523 14 14 14.4477 14 15V18.394L20.622 11.0362L14 4.41421Z" }) });
      break;
    case "reply":
      svg = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 17 17", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M8.7 0C4.1 0 .4 3.7.4 8.3c0 1.2.2 2.3.7 3.4-.2.6-.4 1.5-.7 2.5L0 15.8c-.2.7.5 1.4 1.2 1.2l1.6-.4 2.4-.7c1.1.5 2.2.7 3.4.7 4.6 0 8.3-3.7 8.3-8.3C17 3.7 13.3 0 8.7 0zM15 8.3c0 3.5-2.8 6.3-6.4 6.3-1.2 0-2.3-.3-3.2-.9l-3.2.9.9-3.2c-.5-.9-.9-2-.9-3.2.1-3.4 3-6.2 6.5-6.2S15 4.8 15 8.3z" }) });
      break;
    case "reblog":
      svg = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 17 18.1", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M12.8.2c-.4-.4-.8-.2-.8.4v2H2c-2 0-2 2-2 2v5s0 1 1 1 1-1 1-1v-4c0-1 .5-1 1-1h9v2c0 .6.3.7.8.4L17 3.6 12.8.2zM4.2 17.9c.5.4.8.2.8-.3v-2h10c2 0 2-2 2-2v-5s0-1-1-1-1 1-1 1v4c0 1-.5 1-1 1H5v-2c0-.6-.3-.7-.8-.4L0 14.6l4.2 3.3z" }) });
      break;
    case "like":
      svg = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 20 18", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M14.658 0c-1.625 0-3.21.767-4.463 2.156-.06.064-.127.138-.197.225-.074-.085-.137-.159-.196-.225C8.547.766 6.966 0 5.35 0 4.215 0 3.114.387 2.162 1.117c-2.773 2.13-2.611 5.89-1.017 8.5 2.158 3.535 6.556 7.18 7.416 7.875A2.3 2.3 0 0 0 9.998 18c.519 0 1.028-.18 1.436-.508.859-.695 5.257-4.34 7.416-7.875 1.595-2.616 1.765-6.376-1-8.5C16.895.387 15.792 0 14.657 0h.001zm0 2.124c.645 0 1.298.208 1.916.683 1.903 1.461 1.457 4.099.484 5.695-1.973 3.23-6.16 6.7-6.94 7.331a.191.191 0 0 1-.241 0c-.779-.631-4.966-4.101-6.94-7.332-.972-1.595-1.4-4.233.5-5.694.619-.475 1.27-.683 1.911-.683 1.064 0 2.095.574 2.898 1.461.495.549 1.658 2.082 1.753 2.203.095-.12 1.259-1.654 1.752-2.203.8-.887 1.842-1.461 2.908-1.461h-.001z" }) });
      break;
    case "ellipsis":
      svg = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { viewBox: "0 0 17.5 3.9", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M17.5 1.9c0 1.1-.9 1.9-1.9 1.9-1.1 0-1.9-.9-1.9-1.9S14.5 0 15.6 0c1 0 1.9.9 1.9 1.9m-6.8 0c0 1.1-.9 1.9-1.9 1.9-1.1.1-2-.8-2-1.9 0-1 .9-1.9 2-1.9s1.9.9 1.9 1.9m-6.8 0c0 1.1-.9 2-2 2-1 0-1.9-.9-1.9-2S.9 0 1.9 0c1.1 0 2 .9 2 1.9" }) });
      break;
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: `tumblr-preview__post-icon tumblr-preview__post-icon-${name}`, children: svg });
};
var icons_default = TumblrPostIcon;

// src/tumblr-preview/post/actions/index.tsx

var TumblrPostActions = () => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__post-actions", children: [
  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__post-manage-actions", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__post-actions-blaze", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, icons_default, { name: "blaze" }),
      "\xA0Blaze"
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { children: [
      {
        icon: "delete",
        // translators: "Delete" action on a Tumblr post
        label: _i18n.__.call(void 0, "Delete", "social-previews")
      },
      {
        icon: "edit",
        // translators: "Edit" action on a Tumblr post
        label: _i18n.__.call(void 0, "Edit", "social-previews")
      }
    ].map(({ icon, label }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { "aria-label": label, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, icons_default, { name: icon }) }, icon)) })
  ] }),
  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__post-social-actions", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", {
      // translators: count of notes on a Tumblr post
      children: _i18n.__.call(void 0, "0 notes", "social-previews")
    }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { children: [
      {
        icon: "share",
        // translators: "Share" action on a Tumblr post
        label: _i18n.__.call(void 0, "Share", "social-previews")
      },
      {
        icon: "reply",
        // translators: "Reply" action on a Tumblr post
        label: _i18n.__.call(void 0, "Reply", "social-previews")
      },
      {
        icon: "reblog",
        // translators: "Reblog" action on a Tumblr post
        label: _i18n.__.call(void 0, "Reblog", "social-previews")
      },
      {
        icon: "like",
        // translators: "Like" action on a Tumblr post
        label: _i18n.__.call(void 0, "Like", "social-previews")
      }
    ].map(({ icon, label }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { "aria-label": label, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, icons_default, { name: icon }) }, icon)) })
  ] })
] });
var actions_default = TumblrPostActions;

// src/tumblr-preview/post/header/index.tsx


var TumblrPostHeader = ({ user }) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__post-header", children: [
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "tumblr-preview__post-header-username", children: _optionalChain([user, 'optionalAccess', _7 => _7.displayName]) || // translators: username of a fictional Tumblr User
  _i18n.__.call(void 0, "anonymous-user", "social-previews") }),
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, icons_default, { name: "ellipsis" })
] });
var header_default = TumblrPostHeader;

// src/tumblr-preview/link-preview.tsx

var TumblrLinkPreview = ({
  title,
  description,
  image,
  user,
  url
}) => {
  const avatarUrl = _optionalChain([user, 'optionalAccess', _8 => _8.avatarUrl]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__post", children: [
    avatarUrl && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { className: "tumblr-preview__avatar", src: avatarUrl, alt: "" }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__card", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, header_default, { user }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__window", children: [
        image && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__window-top", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "tumblr-preview__overlay", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "tumblr-preview__title", children: tumblrTitle(title) }) }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "img",
            {
              className: "tumblr-preview__image",
              src: image,
              alt: _i18n.__.call(void 0, "Tumblr preview thumbnail", "social-previews")
            }
          )
        ] }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: `tumblr-preview__window-bottom ${!image ? "is-full" : ""}`, children: [
          !image && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "tumblr-preview__title", children: tumblrTitle(title) }),
          description && image && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "tumblr-preview__description", children: tumblrDescription(description) }),
          url && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "tumblr-preview__site-name", children: baseDomain(url) })
        ] })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, actions_default, {})
    ] })
  ] });
};

// src/tumblr-preview/post-preview.tsx


var TumblrPostPreview = ({
  title,
  description,
  image,
  user,
  url,
  media
}) => {
  const avatarUrl = _optionalChain([user, 'optionalAccess', _9 => _9.avatarUrl]);
  const mediaItem = _optionalChain([media, 'optionalAccess', _10 => _10[0]]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__post", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AvatarWithFallback, { className: "tumblr-preview__avatar", src: avatarUrl }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__card", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, header_default, { user }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "tumblr-preview__body", children: [
        title ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "tumblr-preview__title", children: tumblrTitle(title) }) : null,
        description && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "tumblr-preview__description", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExpandableText, { text: description, children: (visibleText) => preparePreviewText(tumblrDescription(visibleText), {
          platform: "tumblr"
        }) }) }),
        mediaItem ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "tumblr-preview__media-item", children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "video", { controls: true, className: "tumblr-preview__media--video", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "source", { src: mediaItem.url, type: mediaItem.type }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { className: "tumblr-preview__image", src: mediaItem.url, alt: "" }) }) : image && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "img",
          {
            className: "tumblr-preview__image",
            src: image,
            alt: _i18n.__.call(void 0, "Tumblr preview thumbnail", "social-previews")
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { className: "tumblr-preview__url", href: url, target: "_blank", rel: "noreferrer", children: _i18n.__.call(void 0, "View On WordPress", "social-previews") })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, actions_default, {})
    ] })
  ] });
};

// src/tumblr-preview/previews.tsx


var TumblrPreviews = ({
  headingLevel,
  hideLinkPreview,
  hidePostPreview,
  ...props
}) => {
  const hasMedia = !!_optionalChain([props, 'access', _11 => _11.media, 'optionalAccess', _12 => _12.length]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "social-preview tumblr-preview", children: [
    !hidePostPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section tumblr-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SectionHeading, {
        level: headingLevel,
        // translators: refers to a social post on Tumblr
        children: _i18n.__.call(void 0, "Your post", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, "This is what your social post will look like on Tumblr:", "social-previews") }),
      hasMedia ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TumblrPostPreview, { ...props }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TumblrLinkPreview, { ...props })
    ] }),
    !hideLinkPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section tumblr-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SectionHeading, {
        level: headingLevel,
        // translators: refers to a link on Tumblr
        children: _i18n.__.call(void 0, "Link preview", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
        "This is what it will look like when someone shares the link to your WordPress post on Tumblr.",
        "social-previews"
      ) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TumblrLinkPreview, { ...props, user: void 0 })
    ] })
  ] });
};

// src/facebook-preview/previews.tsx


// src/facebook-preview/link-preview.tsx


// src/constants.ts
var AUTO_SHARED_SOCIAL_POST_PREVIEW = "AUTO_SHARED_SOCIAL_POST_PREVIEW";
var AUTO_SHARED_LINK_PREVIEW = "AUTO_SHARED_LINK_PREVIEW";
var DEFAULT_LINK_PREVIEW = "DEFAULT_LINK_PREVIEW";
var TYPE_WEBSITE = "website";
var TYPE_ARTICLE = "article";
var LANDSCAPE_MODE = "landscape";
var PORTRAIT_MODE = "portrait";

// src/facebook-preview/helpers.ts
var TITLE_LENGTH3 = 110;
var DESCRIPTION_LENGTH4 = 200;
var CUSTOM_TEXT_LENGTH = 63206;
var facebookTitle = (text) => firstValid(
  shortEnough(TITLE_LENGTH3),
  hardTruncation(TITLE_LENGTH3)
)(stripHtmlTags(text)) || "";
var facebookDescription = (text) => firstValid(
  shortEnough(DESCRIPTION_LENGTH4),
  hardTruncation(DESCRIPTION_LENGTH4)
)(stripHtmlTags(text)) || "";

// src/facebook-preview/custom-text.tsx

var CustomText = ({ text, url, forceUrlDisplay }) => {
  let postLink;
  const showPostLink = hasTag(text, "a") || forceUrlDisplay && !!url && !text.includes(url);
  if (showPostLink) {
    postLink = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "a",
      {
        className: "facebook-preview__custom-text-post-url",
        href: url,
        rel: "nofollow noopener noreferrer",
        target: "_blank",
        children: url
      }
    );
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "p", { className: "facebook-preview__custom-text", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExpandableText, { text, children: (visibleText) => preparePreviewText(visibleText, {
      platform: "facebook",
      maxChars: CUSTOM_TEXT_LENGTH
    }) }) }),
    postLink
  ] });
};
var custom_text_default = CustomText;

// src/facebook-preview/hooks/use-image-hook.ts


var useImage = ({ mode: initialMode }) => {
  const [mode, setMode] = _react.useState.call(void 0, initialMode);
  const [isLoadingImage, setLoadingImage] = _react.useState.call(void 0, true);
  const onLoad = _react.useCallback.call(void 0, 
    ({ target }) => {
      if (!mode) {
        const image = target;
        setMode(image.naturalWidth > image.naturalHeight ? LANDSCAPE_MODE : PORTRAIT_MODE);
      }
      setLoadingImage(false);
    },
    [mode]
  );
  const onError = _react.useCallback.call(void 0, () => setLoadingImage(false), []);
  return [
    mode,
    isLoadingImage,
    {
      alt: _i18n.__.call(void 0, "Facebook Preview Thumbnail", "social-previews"),
      onLoad,
      onError
    }
  ];
};
var use_image_hook_default = useImage;

// src/facebook-preview/post/actions/index.tsx


// src/facebook-preview/post/icons/index.tsx

var FacebookPostIcon = ({ name }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "i", { className: `facebook-preview__post-icon facebook-preview__post-icon-${name}` });
var icons_default2 = FacebookPostIcon;

// src/facebook-preview/post/actions/index.tsx

var FacebookPostActions = () => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "ul", { className: "facebook-preview__post-actions", children: [
  {
    icon: "like",
    // translators: Facebook "Like" action
    label: _i18n.__.call(void 0, "Like", "social-previews")
  },
  {
    icon: "comment",
    // translators: Facebook "Comment" action
    label: _i18n.__.call(void 0, "Comment", "social-previews")
  },
  {
    icon: "share",
    // translators: Facebook "Share" action
    label: _i18n.__.call(void 0, "Share", "social-previews")
  }
].map(({ icon, label }) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "li", { children: [
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, icons_default2, { name: icon }),
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: label })
] }, icon)) });
var actions_default2 = FacebookPostActions;

// src/facebook-preview/post/header/index.tsx


var FacebookPostHeader = ({ user, timeElapsed, hideOptions }) => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "facebook-preview__post-header", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "facebook-preview__post-header-content", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        AvatarWithFallback,
        {
          className: "facebook-preview__post-header-avatar",
          src: _optionalChain([user, 'optionalAccess', _13 => _13.avatarUrl])
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "facebook-preview__post-header-name", children: _optionalChain([user, 'optionalAccess', _14 => _14.displayName]) || // translators: name of a fictional Facebook User
        _i18n.__.call(void 0, "Anonymous User", "social-previews") }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "facebook-preview__post-header-share", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "facebook-preview__post-header-time", children: timeElapsed ? _i18n.__.call(void 0, 
            // translators: short version of `1 hour`
            "1h",
            "social-previews"
          ) : _i18n._x.call(void 0, 
            // translators: temporal indication of when a post was published
            "Just now",
            "",
            "social-previews"
          ) }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "facebook-preview__post-header-dot", "aria-hidden": "true", children: "\xB7" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, icons_default2, { name: "public" })
        ] })
      ] })
    ] }),
    !hideOptions && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "facebook-preview__post-header-more" })
  ] });
};
var header_default2 = FacebookPostHeader;

// src/facebook-preview/link-preview.tsx

var FacebookLinkPreview = ({
  url,
  title,
  description,
  image,
  user,
  customText,
  type,
  imageMode,
  compactDescription
}) => {
  const [mode, isLoadingImage, imgProps] = use_image_hook_default({ mode: imageMode });
  const isArticle = type === TYPE_ARTICLE;
  const portraitMode = isArticle && !image || mode === PORTRAIT_MODE;
  const modeClass = `is-${portraitMode ? "portrait" : "landscape"}`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "facebook-preview__post", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, header_default2, { user }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "facebook-preview__content", children: [
      customText && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, custom_text_default, { text: customText, url }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "div",
        {
          className: `facebook-preview__body ${modeClass} ${image && isLoadingImage ? "is-loading" : ""}`,
          children: [
            (image || isArticle) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "div",
              {
                className: `facebook-preview__image ${image ? "" : "is-empty"} ${modeClass}`,
                children: image && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src: image, ...imgProps })
              }
            ),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "facebook-preview__text", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "facebook-preview__text-wrapper", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "facebook-preview__url", children: baseDomain(url) }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "facebook-preview__title", children: facebookTitle(title) || baseDomain(url) }),
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                "div",
                {
                  className: `facebook-preview__description ${compactDescription ? "is-compact" : ""}`,
                  children: [
                    description && facebookDescription(description),
                    isArticle && !description && // translators: Default description for a Facebook post
                    _i18n.__.call(void 0, "Visit the post for more.", "social-previews")
                  ]
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "facebook-preview__info", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, icons_default2, { name: "info" }) })
            ] }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, actions_default2, {})
  ] });
};

// src/facebook-preview/link-preview-details.tsx

var LinkPreviewDetails = ({
  url,
  customImage,
  user,
  customText,
  imageMode
}) => {
  const [mode, isLoadingImage, imgProps] = use_image_hook_default({ mode: imageMode });
  const modeClass = `is-${mode === PORTRAIT_MODE ? "portrait" : "landscape"}`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "facebook-preview__post", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, header_default2, { user: void 0 }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "facebook-preview__content", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "div",
      {
        className: `facebook-preview__window ${modeClass} ${customImage && isLoadingImage ? "is-loading" : ""}`,
        children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: `facebook-preview__custom-image ${modeClass}`, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src: customImage, ...imgProps }) }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, header_default2, { user, timeElapsed: true, hideOptions: true }),
          customText && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, custom_text_default, { text: customText, url, forceUrlDisplay: true })
        ]
      }
    ) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, actions_default2, {})
  ] });
};

// src/facebook-preview/post-preview.tsx

var FacebookPostPreview = ({
  url,
  user,
  customText,
  media,
  imageMode
}) => {
  const [mode] = use_image_hook_default({ mode: imageMode });
  const modeClass = `is-${mode === PORTRAIT_MODE ? "portrait" : "landscape"}`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "facebook-preview__post", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, header_default2, { user }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "facebook-preview__content", children: [
      customText && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, custom_text_default, { text: customText, url, forceUrlDisplay: true }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "facebook-preview__body", children: media ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: `facebook-preview__media ${modeClass}`, children: media.map((mediaItem, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          className: `facebook-preview__media-item ${modeClass}`,
          children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "video", { controls: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "source", { src: mediaItem.url, type: mediaItem.type }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { alt: mediaItem.alt || "", src: mediaItem.url })
        },
        `facebook-preview__media-item-${index}`
      )) }) : null })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, actions_default2, {})
  ] });
};

// src/facebook-preview/previews.tsx

var FacebookPreviews = ({
  headingLevel,
  hideLinkPreview,
  hidePostPreview,
  ...props
}) => {
  const hasMedia = !!_optionalChain([props, 'access', _15 => _15.media, 'optionalAccess', _16 => _16.length]);
  const hasCustomImage = !!props.customImage;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "social-preview facebook-preview", children: [
    !hidePostPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section facebook-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
        level: headingLevel,
        // translators: refers to a social post on Facebook
        children: _i18n.__.call(void 0, "Your post", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, "This is what your social post will look like on Facebook:", "social-previews") }),
      hasMedia ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FacebookPostPreview, { ...props }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FacebookLinkPreview, { ...props })
    ] }),
    !hideLinkPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section facebook-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
        level: headingLevel,
        // translators: refers to a link to a Facebook post
        children: _i18n.__.call(void 0, "Link preview", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
        "This is what it will look like when someone shares the link to your WordPress post on Facebook.",
        "social-previews"
      ) }),
      hasCustomImage ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, LinkPreviewDetails, { ...props }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FacebookLinkPreview, { ...props, compactDescription: true, customText: "", user: void 0 })
    ] })
  ] });
};

// src/mastodon-preview/post/actions/index.tsx

var MastodonPostActions = () => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "mastodon-preview__post-actions", children: [
  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        height: "24",
        viewBox: "0 -960 960 960",
        width: "24",
        "aria-hidden": "true",
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z" })
      }
    ),
    "\xA0",
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: 0 })
  ] }),
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      height: "24",
      viewBox: "0 -960 960 960",
      width: "24",
      "aria-hidden": "true",
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z" })
    }
  ) }),
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      height: "24",
      viewBox: "0 -960 960 960",
      width: "24",
      "aria-hidden": "true",
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" })
    }
  ) }),
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      height: "24",
      viewBox: "0 -960 960 960",
      width: "24",
      "aria-hidden": "true",
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" })
    }
  ) }),
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      height: "24",
      viewBox: "0 -960 960 960",
      width: "24",
      "aria-hidden": "true",
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" })
    }
  ) })
] });
var actions_default3 = MastodonPostActions;

// src/mastodon-preview/post/card/index.tsx



// src/mastodon-preview/constants.ts
var DEFAULT_MASTODON_INSTANCE = "mastodon.social";

// src/mastodon-preview/helpers.ts
var TITLE_LENGTH4 = 200;
var BODY_LENGTH = 500;
var URL_LENGTH2 = 30;
var BODY_CHAR_LIMIT = BODY_LENGTH - URL_LENGTH2;
var ADDRESS_PATTERN = /^@([^@]*)@([^@]*)$/i;
var mastodonTitle = (text) => firstValid(
  shortEnough(TITLE_LENGTH4),
  hardTruncation(TITLE_LENGTH4)
)(stripHtmlTags(text)) || "";
var mastodonBody = (text, options) => {
  const { instance, offset } = options;
  return preparePreviewText(text, {
    platform: "mastodon",
    maxChars: BODY_LENGTH - URL_LENGTH2 - offset,
    hashtagDomain: instance
  });
};
var mastodonUrl = (text) => firstValid(shortEnough(URL_LENGTH2), hardTruncation(URL_LENGTH2))(stripHtmlTags(text)) || "";
var getMastodonAddressDetails = (address) => {
  const matches = address.match(ADDRESS_PATTERN);
  return {
    username: _optionalChain([matches, 'optionalAccess', _17 => _17[1]]) || "",
    instance: _optionalChain([matches, 'optionalAccess', _18 => _18[2]]) || DEFAULT_MASTODON_INSTANCE
  };
};

// src/mastodon-preview/post/card/index.tsx

var MastodonPostCard = ({
  siteName,
  title,
  description,
  url,
  image,
  customImage
}) => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: _clsx2.default.call(void 0, "mastodon-preview__card", { "has-image": image }), children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mastodon-preview__card-img", children: image || customImage ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "img",
      {
        src: image || customImage,
        alt: _i18n.__.call(void 0, "Mastodon preview thumbnail", "social-previews")
      }
    ) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mastodon-preview__card-img--fallback", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        height: "24",
        viewBox: "0 -960 960 960",
        width: "24",
        "aria-hidden": "true",
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z" })
      }
    ) }) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "mastodon-preview__card-text", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "mastodon-preview__card-site", children: siteName || baseDomain(url) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "mastodon-preview__card-title", children: mastodonTitle(title) || getTitleFromDescription(description) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "mastodon-preview__card-description", children: stripHtmlTags(description) })
    ] })
  ] });
};
var card_default = MastodonPostCard;

// src/mastodon-preview/post/header/index.tsx


// src/mastodon-preview/post/icons/index.tsx

function GlobeIcon2() {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      height: "15",
      viewBox: "0 -960 960 960",
      width: "15",
      role: "img",
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" })
    }
  );
}

// src/mastodon-preview/post/header/index.tsx

var MastodonPostHeader = ({ user }) => {
  const { displayName, address, avatarUrl } = user || {};
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "mastodon-preview__post-header", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "mastodon-preview__post-header-user", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AvatarWithFallback, { className: "mastodon-preview__post-avatar", src: avatarUrl }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mastodon-preview__post-header-displayname", children: displayName || // translators: username of a fictional Mastodon User
        _i18n.__.call(void 0, "anonymous-user", "social-previews") }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "mastodon-preview__post-header-username", children: _optionalChain([address, 'optionalAccess', _19 => _19.replace, 'call', _20 => _20(`@${DEFAULT_MASTODON_INSTANCE}`, "")]) || "@username" })
      ] })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "mastodon-preview__post-header-audience", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, GlobeIcon2, {}),
      formatMastodonDate(/* @__PURE__ */ new Date())
    ] })
  ] });
};
var header_default3 = MastodonPostHeader;

// src/mastodon-preview/link-preview.tsx

var MastodonLinkPreview = (props) => {
  const { user } = props;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "mastodon-preview__post", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, header_default3, { user }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, card_default, { ...props, customImage: "" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, actions_default3, {})
  ] });
};

// src/mastodon-preview/post-preview.tsx


// src/mastodon-preview/post/body/index.tsx

var MastonPostBody = (props) => {
  const { title, description, customText, url, user, children } = props;
  const instance = _optionalChain([user, 'optionalAccess', _21 => _21.address]) ? getMastodonAddressDetails(user.address).instance : "";
  const options = {
    instance,
    offset: 0
  };
  let bodyTxt;
  if (customText) {
    bodyTxt = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExpandableText, { text: customText, children: (visibleText) => mastodonBody(visibleText, options) }) });
  } else if (description) {
    if (title) {
      const renderedTitle = stripHtmlTags(title);
      options.offset = renderedTitle.length;
      bodyTxt = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { children: renderedTitle }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExpandableText, { text: description, children: (visibleText) => mastodonBody(visibleText, options) }) })
      ] });
    } else {
      bodyTxt = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExpandableText, { text: description, children: (visibleText) => mastodonBody(visibleText, options) }) });
    }
  } else {
    bodyTxt = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { children: mastodonBody(title, options) });
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "mastodon-preview__body", children: [
    bodyTxt,
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { href: url, target: "_blank", rel: "noreferrer noopener", children: mastodonUrl(url.replace(/^https?:\/\//, "")) }),
    children
  ] });
};
var body_default = MastonPostBody;

// src/mastodon-preview/post-preview.tsx

var MastodonPostPreview = (props) => {
  const { user, media } = props;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "mastodon-preview__post", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, header_default3, { user }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, body_default, { ...props, children: _optionalChain([media, 'optionalAccess', _22 => _22.length]) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: _clsx2.default.call(void 0, "mastodon-preview__media", { "as-grid": media.length > 1 }), children: media.map((mediaItem, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "div",
      {
        className: "mastodon-preview__media-item",
        children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "video", { controls: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "source", { src: mediaItem.url, type: mediaItem.type }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { alt: mediaItem.alt || "", src: mediaItem.url })
      },
      `mastodon-preview__media-item-${index}`
    )) }) : null }),
    !_optionalChain([media, 'optionalAccess', _23 => _23.length]) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, card_default, { ...props }) : null,
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, actions_default3, {})
  ] });
};

// src/mastodon-preview/previews.tsx


var MastodonPreviews = ({
  headingLevel,
  hidePostPreview,
  hideLinkPreview,
  ...props
}) => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "social-preview mastodon-preview", children: [
    !hidePostPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section mastodon-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SectionHeading, {
        level: headingLevel,
        // translators: refers to a social post on Mastodon
        children: _i18n.__.call(void 0, "Your post", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, "This is what your social post will look like on Mastodon:", "social-previews") }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, MastodonPostPreview, { ...props })
    ] }),
    !hideLinkPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section mastodon-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SectionHeading, {
        level: headingLevel,
        // translators: refers to a link to a Mastodon post
        children: _i18n.__.call(void 0, "Link preview", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
        "This is what it will look like when someone shares the link to your WordPress post on Mastodon.",
        "social-previews"
      ) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, MastodonLinkPreview, { ...props, user: void 0 })
    ] })
  ] });
};

// src/nextdoor-preview/post-preview.tsx



// src/nextdoor-preview/constants.ts
var FEED_TEXT_MAX_LENGTH2 = 65e3;

// src/nextdoor-preview/footer-actions.tsx


// src/nextdoor-preview/icons/comment-icon.tsx

function CommentIcon() {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { width: "20", height: "20", fill: "none", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "path",
    {
      fill: "currentColor",
      fillRule: "evenodd",
      d: "M2 10.031C2 5.596 5.574 2 10 2h4c4.427 0 8 3.596 8 8.031 0 4.435-3.573 8.031-8 8.031h-1.52a17.033 17.033 0 0 1-1.377 1.467c-.991.938-2.456 2.079-4.086 2.437a1.403 1.403 0 0 1-1.458-.565 1.55 1.55 0 0 1-.195-1.394c.28-.823.395-1.734.434-2.464.014-.257.018-.485.018-.672A8.017 8.017 0 0 1 2 10.031Zm5.798 6.178a7.02 7.02 0 0 1 .016.418c.005.252.004.606-.019 1.023-.03.573-.103 1.285-.266 2.024.775-.377 1.54-.974 2.202-1.598a15.066 15.066 0 0 0 1.448-1.586l.017-.022.003-.004a1 1 0 0 1 .801-.402h2c3.314 0 6-2.692 6-6.03C20 6.691 17.314 4 14 4h-4c-3.314 0-6 2.692-6 6.031 0 2.336 1.32 4.36 3.258 5.359.308.159.515.474.54.82Z",
      clipRule: "evenodd"
    }
  ) });
}

// src/nextdoor-preview/icons/like-icon.tsx

function LikeIcon() {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { width: "20", height: "20", fill: "none", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "path",
    {
      fill: "currentColor",
      fillRule: "evenodd",
      d: "M13.275 8.752a1.5 1.5 0 0 1-2.55 0C9.75 7.18 8.719 5.617 6.565 6.074 5.248 6.352 4 7.433 4 9.644c0 2.153 1.348 4.592 4.259 7.236A28.475 28.475 0 0 0 12 19.74a28.475 28.475 0 0 0 3.741-2.86C18.651 14.236 20 11.797 20 9.643c0-2.21-1.25-3.29-2.564-3.57-2.155-.456-3.187 1.106-4.16 2.68Zm-2.581-3.48C7.634 2.58 2 4.217 2 9.643c0 2.996 1.85 5.934 4.914 8.717 1.478 1.343 3.1 2.585 4.839 3.575a.5.5 0 0 0 .494 0c1.739-.99 3.361-2.232 4.84-3.575C20.148 15.577 22 12.64 22 9.643c0-5.426-5.634-7.062-8.694-4.371A5.287 5.287 0 0 0 12 7.04a5.287 5.287 0 0 0-1.306-1.77Z",
      clipRule: "evenodd"
    }
  ) });
}

// src/nextdoor-preview/icons/share-icon.tsx

function ShareIcon() {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { width: "20", height: "20", fill: "none", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "path",
    {
      fill: "currentColor",
      fillRule: "evenodd",
      d: "M11.617 2.076a1 1 0 0 1 1.09.217l9 9a1 1 0 0 1 0 1.414l-9 9A1 1 0 0 1 11 21v-4.436c-2.849.366-5.261 2.271-6.384 4.837a1 1 0 0 1-1.856-.06C2.338 20.182 2 18.86 2 17.5a9.959 9.959 0 0 1 9-9.951V3a1 1 0 0 1 .617-.924ZM13 5.414V8.5a1 1 0 0 1-1 1c-4.448 0-8 3.552-8 8 0 .31.023.625.066.94C5.905 16.067 8.776 14.5 12 14.5a1 1 0 0 1 1 1v3.086L19.586 12 13 5.414Z",
      clipRule: "evenodd"
    }
  ) });
}

// src/nextdoor-preview/footer-actions.tsx

function FooterActions() {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__footer--actions", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__footer--actions-item", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, LikeIcon, {}),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: _i18n.__.call(void 0, "Like", "social-previews") })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__footer--actions-item", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, CommentIcon, {}),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: _i18n.__.call(void 0, "Comment", "social-previews") })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__footer--actions-item", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ShareIcon, {}),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: _i18n.__.call(void 0, "Share", "social-previews") })
    ] })
  ] });
}

// src/nextdoor-preview/icons/chevron-icon.tsx

function ChevronIcon() {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { width: "20", height: "20", viewBox: "0 0 20 20", "aria-hidden": "true", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "path",
    {
      fill: "#dfe1e4",
      fillRule: "evenodd",
      d: "M7.127 13.876a.732.732 0 1 0 1.035 1.035l4.75-4.749a.732.732 0 0 0 0-1.035L8.123 4.34A.732.732 0 0 0 7.09 5.375l4.27 4.27-4.232 4.23Z"
    }
  ) });
}

// src/nextdoor-preview/icons/default-image.tsx

function DefaultImage() {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "nextdoor-preview__default-image", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "svg",
    {
      width: "24",
      height: "24",
      fill: "none",
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      color: "#055c00",
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "path",
          {
            fill: "currentColor",
            d: "M13.207 5.207c1.51-1.51 4.076-1.51 5.586 0 1.51 1.51 1.51 4.076 0 5.586l-2.1 2.1c-1.51 1.51-4.077 1.51-5.586 0a1 1 0 1 0-1.414 1.414c2.29 2.29 6.123 2.29 8.414 0l2.1-2.1c2.29-2.29 2.29-6.124 0-8.414s-6.124-2.29-8.414 0l-.7.7a1 1 0 0 0 1.414 1.414l.7-.7Z"
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "path",
          {
            fill: "currentColor",
            d: "M7.307 11.107c1.51-1.51 4.076-1.51 5.586 0a1 1 0 0 0 1.414-1.414c-2.29-2.29-6.124-2.29-8.414 0l-2.1 2.1c-2.29 2.29-2.29 6.123 0 8.414 2.29 2.29 6.124 2.29 8.414 0l.7-.7a1 1 0 0 0-1.414-1.414l-.7.7c-1.51 1.51-4.076 1.51-5.586 0-1.51-1.51-1.51-4.076 0-5.586l2.1-2.1Z"
          }
        )
      ]
    }
  ) });
}

// src/nextdoor-preview/icons/globe-icon.tsx

function GlobeIcon3() {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { width: "14", height: "14", fill: "none", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "path",
    {
      fill: "currentColor",
      fillRule: "evenodd",
      d: "M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.495-7.643c.286-.335.46-.357.505-.357.045 0 .219.022.505.357.282.33.581.868.852 1.619.464 1.283.79 3.034.872 5.024H9.771c.082-1.99.408-3.741.871-5.024.272-.751.571-1.289.854-1.62ZM7.77 11c.084-2.181.439-4.171.992-5.704.093-.255.192-.502.298-.738A8.009 8.009 0 0 0 4.062 11h3.707Zm-3.707 2h3.707c.084 2.181.439 4.171.992 5.704.093.255.192.502.298.738A8.009 8.009 0 0 1 4.062 13Zm15.876-2a8.009 8.009 0 0 0-4.997-6.442c.106.236.205.483.298.738.553 1.533.908 3.523.992 5.704h3.707Zm-3.707 2h3.707a8.009 8.009 0 0 1-4.997 6.442c.106-.236.205-.483.298-.738.553-1.533.908-3.523.992-5.704Zm-2.002 0c-.082 1.99-.408 3.741-.871 5.024-.272.751-.571 1.289-.854 1.62-.285.334-.46.356-.504.356-.045 0-.219-.022-.505-.357-.282-.33-.581-.868-.852-1.619-.464-1.283-.79-3.034-.872-5.024h4.458Z",
      clipRule: "evenodd"
    }
  ) });
}

// src/nextdoor-preview/post-preview.tsx

function NextdoorPostPreview({
  image,
  name,
  profileImage,
  description,
  neighborhood,
  media,
  title,
  url
}) {
  const hasMedia = !!_optionalChain([media, 'optionalAccess', _24 => _24.length]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "nextdoor-preview__wrapper", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "section", { className: `nextdoor-preview__container ${hasMedia ? "has-media" : ""}`, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__content", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__header", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "nextdoor-preview__header--avatar", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AvatarWithFallback, { src: profileImage }) }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__header--details", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "nextdoor-preview__header--name", children: name || _i18n.__.call(void 0, "Account Name", "social-previews") }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__header--meta", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: neighborhood || _i18n.__.call(void 0, "Neighborhood", "social-previews") }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: "\u2022" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: formatNextdoorDate(Date.now()) }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: "\u2022" }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, GlobeIcon3, {})
        ] })
      ] })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__body", children: [
      description ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__caption", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExpandableText, { text: description, children: (visibleText) => preparePreviewText(visibleText, {
          platform: "nextdoor",
          maxChars: FEED_TEXT_MAX_LENGTH2
        }) }) }),
        !hasMedia && url && !description.includes(url) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "br", {}),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "br", {}),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { href: url, rel: "nofollow noopener noreferrer", target: "_blank", children: url })
        ] })
      ] }) : null,
      hasMedia ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "nextdoor-preview__media", children: media.map((mediaItem, index) => {
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            className: "nextdoor-preview__media-item",
            children: _optionalChain([mediaItem, 'optionalAccess', _25 => _25.type, 'optionalAccess', _26 => _26.startsWith, 'call', _27 => _27("video/")]) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "video", { controls: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "source", { src: mediaItem.url, type: mediaItem.type }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { alt: mediaItem.alt || "", src: mediaItem.url })
          },
          `nextdoor-preview__media-item-${index}`
        );
      }) }) : null,
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "article",
        {
          className: _clsx2.default.call(void 0, "nextdoor-preview__card", {
            "small-preview": !image || hasMedia
          }),
          children: [
            image ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { className: "nextdoor-preview__image", src: image, alt: "" }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DefaultImage, {}),
            url ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "nextdoor-preview__description", children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h2", { className: "nextdoor-preview__description--title", children: title || getTitleFromDescription(description) }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "nextdoor-preview__description--url", children: baseDomain(url) })
            ] }) : null,
            hasMedia ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "nextdoor-preview__card--chevron-wrapper", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ChevronIcon, {}) }) : null
          ]
        }
      )
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "nextdoor-preview__footer", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, FooterActions, {}) })
  ] }) }) });
}

// src/nextdoor-preview/link-preview.tsx

function NextdoorLinkPreview(props) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    NextdoorPostPreview,
    {
      name: "",
      profileImage: "",
      ...props,
      description: "",
      media: void 0,
      title: props.title || getTitleFromDescription(props.description)
    }
  );
}

// src/nextdoor-preview/previews.tsx


var NextdoorPreviews = ({
  headingLevel,
  hideLinkPreview,
  hidePostPreview,
  ...props
}) => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "social-preview nextdoor-preview", children: [
    !hidePostPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section nextdoor-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
        level: headingLevel,
        // translators: refers to a social post on Nextdoor
        children: _i18n.__.call(void 0, "Your post", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, "This is what your social post will look like on Nextdoor:", "social-previews") }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, NextdoorPostPreview, { ...props })
    ] }),
    !hideLinkPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section nextdoor-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
        level: headingLevel,
        // translators: refers to a link to a Nextdoor post
        children: _i18n.__.call(void 0, "Link preview", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
        "This is what it will look like when someone shares the link to your WordPress post on Nextdoor.",
        "social-previews"
      ) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, NextdoorLinkPreview, { ...props, name: "", profileImage: "" })
    ] })
  ] });
};

// src/bluesky-preview/post-preview.tsx


// src/bluesky-preview/post/actions/index.tsx

var BlueskyPostActions = () => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "bluesky-preview__post-actions", children: [
  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "svg",
      {
        fill: "none",
        width: "18",
        viewBox: "0 0 24 24",
        height: "18",
        style: { color: "rgb(111, 134, 159)" },
        "aria-hidden": "true",
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "path",
          {
            fill: "hsl(211, 20%, 53%)",
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z"
          }
        )
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: 0 })
  ] }),
  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "svg",
      {
        fill: "none",
        width: "18",
        viewBox: "0 0 24 24",
        height: "18",
        style: { color: "rgb(111, 134, 159)" },
        "aria-hidden": "true",
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "path",
          {
            fill: "hsl(211, 20%, 53%)",
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z"
          }
        )
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: 0 })
  ] }),
  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "svg",
      {
        fill: "none",
        width: "18",
        viewBox: "0 0 24 24",
        height: "18",
        style: { color: "rgb(111, 134, 159)" },
        "aria-hidden": "true",
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "path",
          {
            fill: "hsl(211, 20%, 53%)",
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M16.734 5.091c-1.238-.276-2.708.047-4.022 1.38a1 1 0 0 1-1.424 0C9.974 5.137 8.504 4.814 7.266 5.09c-1.263.282-2.379 1.206-2.92 2.556C3.33 10.18 4.252 14.84 12 19.348c7.747-4.508 8.67-9.168 7.654-11.7-.541-1.351-1.657-2.275-2.92-2.557Zm4.777 1.812c1.604 4-.494 9.69-9.022 14.47a1 1 0 0 1-.978 0C2.983 16.592.885 10.902 2.49 6.902c.779-1.942 2.414-3.334 4.342-3.764 1.697-.378 3.552.003 5.169 1.286 1.617-1.283 3.472-1.664 5.17-1.286 1.927.43 3.562 1.822 4.34 3.764Z"
          }
        )
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: 0 })
  ] }),
  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { fill: "none", viewBox: "0 0 24 24", width: "20", height: "20", "aria-hidden": "true", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "path",
    {
      fill: "hsl(211, 20%, 53%)",
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm16 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
    }
  ) }) })
] });
var actions_default4 = BlueskyPostActions;

// src/bluesky-preview/helpers.ts
var TITLE_LENGTH5 = 200;
var BODY_LENGTH2 = 300;
var URL_LENGTH3 = 40;
var BODY_CHAR_LIMIT2 = BODY_LENGTH2 - URL_LENGTH3;
var blueskyTitle = (text) => firstValid(
  shortEnough(TITLE_LENGTH5),
  hardTruncation(TITLE_LENGTH5)
)(stripHtmlTags(text)) || "";
var blueskyBody = (text, options = {}) => {
  const { offset = 0, reserveUrlSpace = true } = options;
  return preparePreviewText(text, {
    platform: "bluesky",
    maxChars: BODY_LENGTH2 - (reserveUrlSpace ? URL_LENGTH3 : 0) - offset
  });
};
var blueskyUrl = (text) => firstValid(shortEnough(URL_LENGTH3), hardTruncation(URL_LENGTH3))(stripHtmlTags(text)) || "";

// src/bluesky-preview/post/body/index.tsx

var BlueskyPostBody = ({ customText, url, children, appendUrl }) => {
  const showUrl = appendUrl && !!url && !_optionalChain([customText, 'optionalAccess', _28 => _28.includes, 'call', _29 => _29(url)]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "bluesky-preview__body", children: [
    customText ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { children: blueskyBody(customText, { reserveUrlSpace: showUrl }) }),
      showUrl ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "br", {}),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { href: url, target: "_blank", rel: "noreferrer noopener", children: blueskyUrl(url.replace(/^https?:\/\//, "")) })
      ] }) : null
    ] }) : null,
    children
  ] });
};
var body_default2 = BlueskyPostBody;

// src/bluesky-preview/post/card/index.tsx

var BlueskyPostCard = ({ title, description, url, image }) => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "bluesky-preview__card", children: [
    image ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "bluesky-preview__card-image", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { src: image, alt: "" }) }) : null,
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "bluesky-preview__card-text", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "bluesky-preview__card-site", children: baseDomain(url) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "bluesky-preview__card-title", children: blueskyTitle(title) || getTitleFromDescription(description) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "bluesky-preview__card-description", children: stripHtmlTags(description) })
    ] })
  ] });
};
var card_default2 = BlueskyPostCard;

// src/bluesky-preview/post/header/index.tsx


var BlueskyPostHeader = ({ user }) => {
  const { displayName, address } = user || {};
  let handle = address || "username.bsky.social";
  if (!handle.startsWith("@")) {
    handle = "@" + handle;
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "bluesky-preview__post-header", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "bluesky-preview__post-header-user", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "bluesky-preview__post-header--displayname", children: displayName || _i18n.__.call(void 0, "Account name", "social-previews") }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "bluesky-preview__post-header--username", children: handle })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "bluesky-preview__post-header--separator", children: "\xB7" }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "bluesky-preview__post-header--date", children: _i18n._x.call(void 0, 
      "1h",
      'refers to the time since the post was published, e.g. "1h"',
      "social-previews"
    ) })
  ] });
};
var header_default4 = BlueskyPostHeader;

// src/bluesky-preview/post/sidebar/index.tsx

var BlueskyPostSidebar = ({ user }) => {
  const { avatarUrl } = user || {};
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "bluesky-preview__post-sidebar", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "bluesky-preview__post-sidebar-user", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AvatarWithFallback, { className: "bluesky-preview__post-avatar", src: avatarUrl }) }) });
};

// src/bluesky-preview/post-preview.tsx

var BlueskyPostPreview = (props) => {
  const { user, media, appendUrl } = props;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "bluesky-preview__post", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BlueskyPostSidebar, { user }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, header_default4, { user }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, body_default2, { ...props, appendUrl: _nullishCoalesce(appendUrl, () => ( Boolean(_optionalChain([media, 'optionalAccess', _30 => _30.length])))), children: _optionalChain([media, 'optionalAccess', _31 => _31.length]) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: _clsx2.default.call(void 0, "bluesky-preview__media", { "as-grid": media.length > 1 }), children: media.map((mediaItem, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "div",
        {
          className: "bluesky-preview__media-item",
          children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "video", { controls: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "source", { src: mediaItem.url, type: mediaItem.type }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { alt: mediaItem.alt || "", src: mediaItem.url })
        },
        `bluesky-preview__media-item-${index}`
      )) }) : null }),
      !_optionalChain([media, 'optionalAccess', _32 => _32.length]) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, card_default2, { ...props }) : null,
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, actions_default4, {})
    ] })
  ] });
};

// src/bluesky-preview/link-preview.tsx

var BlueskyLinkPreview = (props) => {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BlueskyPostPreview, { ...props, user: void 0, media: void 0, customText: "" });
};

// src/bluesky-preview/previews.tsx


var BlueskyPreviews = ({
  headingLevel,
  hidePostPreview,
  hideLinkPreview,
  ...props
}) => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "social-preview bluesky-preview", children: [
    !hidePostPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section bluesky-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SectionHeading, {
        level: headingLevel,
        // translators: refers to a social post on Bluesky
        children: _i18n.__.call(void 0, "Your post", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, "This is what your social post will look like on Bluesky:", "social-previews") }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BlueskyPostPreview, { ...props })
    ] }),
    !hideLinkPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section bluesky-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, SectionHeading, {
        level: headingLevel,
        // translators: refers to a link to a Bluesky post
        children: _i18n.__.call(void 0, "Link preview", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
        "This is what it will look like when someone shares the link to your WordPress post on Bluesky.",
        "social-previews"
      ) }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BlueskyLinkPreview, { ...props })
    ] })
  ] });
};

// src/threads-preview/link-preview.tsx


// src/threads-preview/card.tsx


// src/threads-preview/helpers.ts
var TITLE_LENGTH6 = 120;
var CAPTION_MAX_CHARS = 500;
var threadsTitle = (text) => firstValid(
  shortEnough(TITLE_LENGTH6),
  hardTruncation(TITLE_LENGTH6)
)(stripHtmlTags(text)) || "";

// src/threads-preview/card.tsx

var Card2 = ({ image, title, url }) => {
  const cardClassNames = _clsx2.default.call(void 0, {
    "threads-preview__card-has-image": !!image
  });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "threads-preview__card", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: cardClassNames, children: [
    image && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { className: "threads-preview__card-image", src: image, alt: "" }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "threads-preview__card-body", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "threads-preview__card-url", children: baseDomain(url || "") }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "threads-preview__card-title", children: threadsTitle(title) })
    ] })
  ] }) });
};

// src/threads-preview/footer.tsx

var Footer2 = () => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "threads-preview__footer", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "threads-preview__icon--like", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { role: "img", viewBox: "0 0 18 18", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "path",
      {
        d: "M1.34375 7.53125L1.34375 7.54043C1.34374 8.04211 1.34372 8.76295 1.6611 9.65585C1.9795 10.5516 2.60026 11.5779 3.77681 12.7544C5.59273 14.5704 7.58105 16.0215 8.33387 16.5497C8.73525 16.8313 9.26573 16.8313 9.66705 16.5496C10.4197 16.0213 12.4074 14.5703 14.2232 12.7544C15.3997 11.5779 16.0205 10.5516 16.3389 9.65585C16.6563 8.76296 16.6563 8.04211 16.6562 7.54043V7.53125C16.6562 5.23466 15.0849 3.25 12.6562 3.25C11.5214 3.25 10.6433 3.78244 9.99228 4.45476C9.59009 4.87012 9.26356 5.3491 9 5.81533C8.73645 5.3491 8.40991 4.87012 8.00772 4.45476C7.35672 3.78244 6.47861 3.25 5.34375 3.25C2.9151 3.25 1.34375 5.23466 1.34375 7.53125Z",
        strokeWidth: "1.25"
      }
    ) }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "threads-preview__icon--reply", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "svg", { role: "img", viewBox: "0 0 18 18", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "path",
      {
        d: "M15.376 13.2177L16.2861 16.7955L12.7106 15.8848C12.6781 15.8848 12.6131 15.8848 12.5806 15.8848C11.3779 16.5678 9.94767 16.8931 8.41995 16.7955C4.94194 16.5353 2.08152 13.7381 1.72397 10.2578C1.2689 5.63919 5.13697 1.76863 9.75264 2.22399C13.2307 2.58177 16.0261 5.41151 16.2861 8.92429C16.4161 10.453 16.0586 11.8841 15.376 13.0876C15.376 13.1526 15.376 13.1852 15.376 13.2177Z",
        strokeLinejoin: "round",
        strokeWidth: "1.25"
      }
    ) }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "threads-preview__icon--repost", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "svg", { role: "img", viewBox: "0 0 18 18", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M6.41256 1.23531C6.6349 0.971277 7.02918 0.937481 7.29321 1.15982L9.96509 3.40982C10.1022 3.52528 10.1831 3.69404 10.1873 3.87324C10.1915 4.05243 10.1186 4.2248 9.98706 4.34656L7.31518 6.81971C7.06186 7.05419 6.66643 7.03892 6.43196 6.7856C6.19748 6.53228 6.21275 6.13685 6.46607 5.90237L7.9672 4.51289H5.20312C3.68434 4.51289 2.45312 5.74411 2.45312 7.26289V9.51289V11.7629C2.45312 13.2817 3.68434 14.5129 5.20312 14.5129C5.5483 14.5129 5.82812 14.7927 5.82812 15.1379C5.82812 15.4831 5.5483 15.7629 5.20312 15.7629C2.99399 15.7629 1.20312 13.972 1.20312 11.7629V9.51289V7.26289C1.20312 5.05375 2.99399 3.26289 5.20312 3.26289H7.85002L6.48804 2.11596C6.22401 1.89362 6.19021 1.49934 6.41256 1.23531Z" }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M11.5874 17.7904C11.3651 18.0545 10.9708 18.0883 10.7068 17.8659L8.03491 15.6159C7.89781 15.5005 7.81687 15.3317 7.81267 15.1525C7.80847 14.9733 7.8814 14.801 8.01294 14.6792L10.6848 12.206C10.9381 11.9716 11.3336 11.9868 11.568 12.2402C11.8025 12.4935 11.7872 12.8889 11.5339 13.1234L10.0328 14.5129H12.7969C14.3157 14.5129 15.5469 13.2816 15.5469 11.7629V9.51286V7.26286C15.5469 5.74408 14.3157 4.51286 12.7969 4.51286C12.4517 4.51286 12.1719 4.23304 12.1719 3.88786C12.1719 3.54269 12.4517 3.26286 12.7969 3.26286C15.006 3.26286 16.7969 5.05373 16.7969 7.26286V9.51286V11.7629C16.7969 13.972 15.006 15.7629 12.7969 15.7629H10.15L11.512 16.9098C11.776 17.1321 11.8098 17.5264 11.5874 17.7904Z" })
    ] }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "threads-preview__icon--share", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "svg", { role: "img", viewBox: "0 0 18 18", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "path",
        {
          d: "M15.6097 4.09082L6.65039 9.11104",
          strokeLinejoin: "round",
          strokeWidth: "1.25"
        }
      ),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "path",
        {
          d: "M7.79128 14.439C8.00463 15.3275 8.11131 15.7718 8.33426 15.932C8.52764 16.071 8.77617 16.1081 9.00173 16.0318C9.26179 15.9438 9.49373 15.5501 9.95761 14.7628L15.5444 5.2809C15.8883 4.69727 16.0603 4.40546 16.0365 4.16566C16.0159 3.95653 15.9071 3.76612 15.7374 3.64215C15.5428 3.5 15.2041 3.5 14.5267 3.5H3.71404C2.81451 3.5 2.36474 3.5 2.15744 3.67754C1.97758 3.83158 1.88253 4.06254 1.90186 4.29856C1.92415 4.57059 2.24363 4.88716 2.88259 5.52032L6.11593 8.7243C6.26394 8.87097 6.33795 8.94431 6.39784 9.02755C6.451 9.10144 6.4958 9.18101 6.53142 9.26479C6.57153 9.35916 6.59586 9.46047 6.64451 9.66309L7.79128 14.439Z",
          strokeLinejoin: "round",
          strokeWidth: "1.25"
        }
      )
    ] }) })
  ] });
};

// src/threads-preview/header.tsx


var Header2 = ({ name, date }) => {
  const postDate = date || /* @__PURE__ */ new Date();
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "threads-preview__header", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { className: "threads-preview__name", children: name || _i18n.__.call(void 0, "Account Name", "social-previews") }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "time", { className: "threads-preview__date", dateTime: postDate.toISOString(), children: formatThreadsDate(postDate) })
  ] });
};

// src/threads-preview/media.tsx



var Media2 = ({ media }) => {
  const filteredMedia = media.filter(
    (mediaItem) => mediaItem.type.startsWith("image/") || mediaItem.type.startsWith("video/")
  ).filter((mediaItem, idx, array) => {
    if (0 === idx) {
      return true;
    }
    if (array[0].type.startsWith("video/") || "image/gif" === array[0].type) {
      return false;
    }
    if (mediaItem.type.startsWith("video/") || "image/gif" === mediaItem.type) {
      return false;
    }
    return true;
  }).slice(0, 4);
  if (0 === filteredMedia.length) {
    return null;
  }
  const isVideo = filteredMedia[0].type.startsWith("video/");
  const mediaClasses = _clsx2.default.call(void 0, [
    "threads-preview__media",
    "threads-preview__media-children-" + filteredMedia.length
  ]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: mediaClasses, children: filteredMedia.map((mediaItem, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react.Fragment, { children: isVideo ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "video", { controls: true, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "source", { src: mediaItem.url, type: mediaItem.type }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { alt: mediaItem.alt || "", src: mediaItem.url }) }, `threads-preview__media-item-${index}`)) });
};

// src/threads-preview/sidebar.tsx


var Sidebar2 = ({ profileImage, showThreadConnector }) => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "threads-preview__sidebar", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "threads-preview__profile-image", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      AvatarWithFallback,
      {
        alt: _i18n.__.call(void 0, "Threads profile image", "social-previews"),
        src: profileImage
      }
    ) }),
    showThreadConnector && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "threads-preview__connector" })
  ] });
};

// src/threads-preview/post-preview.tsx

var ThreadsPostPreview = ({
  caption,
  date,
  image,
  media,
  name,
  profileImage,
  showThreadConnector,
  title,
  url
}) => {
  const hasMedia = !!_optionalChain([media, 'optionalAccess', _33 => _33.length]);
  const displayAsCard = url && image && !hasMedia;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "threads-preview__wrapper", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "threads-preview__container", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Sidebar2, { profileImage, showThreadConnector }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "threads-preview__main", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Header2, { name, date }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "threads-preview__content", children: [
        caption ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "threads-preview__text", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExpandableText, { text: caption, children: (visibleText) => preparePreviewText(visibleText, {
          platform: "threads",
          maxChars: CAPTION_MAX_CHARS
        }) }) }) : null,
        hasMedia ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Media2, { media }) : null,
        displayAsCard ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Card2, { image, title: title || "", url }) : null
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Footer2, {})
    ] })
  ] }) });
};

// src/threads-preview/link-preview.tsx

var ThreadsLinkPreview = (props) => {
  if (!props.image) {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
      "Threads link preview requires an image to be set for the post. Please add an image to see the preview.",
      "social-previews"
    ) });
  }
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    ThreadsPostPreview,
    {
      ...props,
      caption: "",
      media: void 0
    }
  );
};

// src/threads-preview/previews.tsx


var ThreadsPreviews = ({
  headingLevel,
  hideLinkPreview,
  hidePostPreview,
  posts
}) => {
  if (!_optionalChain([posts, 'optionalAccess', _34 => _34.length])) {
    return null;
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "social-preview threads-preview", children: [
    !hidePostPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section threads-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
        level: headingLevel,
        // translators: refers to a social post on Threads
        children: _i18n.__.call(void 0, "Your post", "social-previews")
      }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, "This is what your social post will look like on Threads:", "social-previews") }),
      posts.map((post, index) => {
        const isLast = index + 1 === posts.length;
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          ThreadsPostPreview,
          {
            ...post,
            showThreadConnector: !isLast
          },
          `threads-preview__post-${index}`
        );
      })
    ] }),
    !hideLinkPreview ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section threads-preview__section", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
        level: headingLevel,
        // translators: refers to a link to a Threads post
        children: _i18n.__.call(void 0, "Link preview", "social-previews")
      }),
      posts[0].image ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
          "This is what it will look like when someone shares the link to your WordPress post on Threads.",
          "social-previews"
        ) }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ThreadsLinkPreview, { ...posts[0], name: "", profileImage: "" })
      ] }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
        "Threads link preview requires an image to be set for the post. Please add an image to see the preview.",
        "social-previews"
      ) })
    ] }) : null
  ] });
};

// src/instagram-preview/post-preview.tsx


// src/instagram-preview/constants.tsx
var FEED_TEXT_MAX_LENGTH3 = 2200;

// src/instagram-preview/icons/bookmark.tsx

var Bookmark = () => {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "svg",
    {
      color: "rgb(38, 38, 38)",
      fill: "rgb(38, 38, 38)",
      height: "24",
      role: "img",
      viewBox: "0 0 24 24",
      width: "24",
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "polygon",
        {
          fill: "none",
          points: "20 21 12 13.44 4 21 4 3 20 3 20 21",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "2"
        }
      )
    }
  );
};

// src/instagram-preview/icons/comment.tsx

var Comment = () => {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "svg",
    {
      color: "rgb(38, 38, 38)",
      fill: "rgb(38, 38, 38)",
      height: "24",
      role: "img",
      viewBox: "0 0 24 24",
      width: "24",
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
        "path",
        {
          d: "M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z",
          fill: "none",
          stroke: "currentColor",
          strokeLinejoin: "round",
          strokeWidth: "2"
        }
      )
    }
  );
};

// src/instagram-preview/icons/heart.tsx

var Heart = () => {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "svg",
    {
      color: "rgb(38, 38, 38)",
      fill: "rgb(38, 38, 38)",
      height: "24",
      role: "img",
      viewBox: "0 0 24 24",
      width: "24",
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" })
    }
  );
};

// src/instagram-preview/icons/menu.tsx

var Menu = () => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "svg", { width: "17", height: "5", viewBox: "0 0 17 5", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "path",
      {
        d: "M2.11865 3.5C2.67094 3.5 3.11865 3.05228 3.11865 2.5C3.11865 1.94772 2.67094 1.5 2.11865 1.5C1.56637 1.5 1.11865 1.94772 1.11865 2.5C1.11865 3.05228 1.56637 3.5 2.11865 3.5Z",
        fill: "black",
        stroke: "black",
        strokeWidth: "2"
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "path",
      {
        d: "M8.55933 3.5C9.11161 3.5 9.55933 3.05228 9.55933 2.5C9.55933 1.94772 9.11161 1.5 8.55933 1.5C8.00704 1.5 7.55933 1.94772 7.55933 2.5C7.55933 3.05228 8.00704 3.5 8.55933 3.5Z",
        fill: "black",
        stroke: "black",
        strokeWidth: "2"
      }
    ),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "path",
      {
        d: "M15 3.5C15.5523 3.5 16 3.05228 16 2.5C16 1.94772 15.5523 1.5 15 1.5C14.4477 1.5 14 1.94772 14 2.5C14 3.05228 14.4477 3.5 15 3.5Z",
        fill: "black",
        stroke: "black",
        strokeWidth: "2"
      }
    )
  ] });
};

// src/instagram-preview/icons/share.tsx

var Share = () => {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "svg",
    {
      color: "rgb(38, 38, 38)",
      fill: "rgb(38, 38, 38)",
      height: "24",
      role: "img",
      viewBox: "0 0 24 24",
      width: "24",
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "line",
          {
            fill: "none",
            stroke: "currentColor",
            strokeLinejoin: "round",
            strokeWidth: "2",
            x1: "22",
            x2: "9.218",
            y1: "3",
            y2: "10.083"
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "polygon",
          {
            fill: "none",
            points: "11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334",
            stroke: "currentColor",
            strokeLinejoin: "round",
            strokeWidth: "2"
          }
        )
      ]
    }
  );
};

// src/instagram-preview/post-preview.tsx

function InstagramPostPreview({
  image,
  media,
  name,
  profileImage,
  caption,
  url
}) {
  const username = name || "username";
  const mediaItem = _optionalChain([media, 'optionalAccess', _35 => _35[0]]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "instagram-preview__wrapper", children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "instagram-preview__container", children: [
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "instagram-preview__header", children: [
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "instagram-preview__header--avatar", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, AvatarWithFallback, { src: profileImage }) }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "instagram-preview__header--profile", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "instagram-preview__header--profile-name", children: username }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "instagram-preview__header--profile-menu", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Menu, {}) })
      ] })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "instagram-preview__media", children: mediaItem ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "instagram-preview__media-item", children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "video", { controls: false, className: "instagram-preview__media--video", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "source", { src: mediaItem.url, type: mediaItem.type }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { className: "instagram-preview__media--image", src: mediaItem.url, alt: "" }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "img", { className: "instagram-preview__media--image", src: image, alt: "" }) }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "instagram-preview__content", children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "instagram-preview__content--actions", children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "instagram-preview__content--actions-primary", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heart, {}),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Comment, {}),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Share, {})
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "instagram-preview__content--actions-secondary", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Bookmark, {}) })
      ] }),
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "instagram-preview__content--body", children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "instagram-preview__content--name", children: username }),
        "\xA0",
        caption ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "instagram-preview__content--text", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ExpandableText, { text: caption, children: (visibleText) => preparePreviewText(visibleText, {
            platform: "instagram",
            maxChars: FEED_TEXT_MAX_LENGTH3
          }) }),
          media && url && !caption.includes(url) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "br", {}),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "br", {}),
            url
          ] })
        ] }) : null
      ] }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "instagram-preview__content--footer", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: _i18n.__.call(void 0, "View one comment", "social-previews") }) })
    ] })
  ] }) });
}

// src/instagram-preview/previews.tsx


var InstagramPreviews = ({
  headingLevel,
  hidePostPreview,
  ...props
}) => {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "social-preview instagram-preview", children: !hidePostPreview && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "section", { className: "social-preview__section instagram-preview__section", children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, section_heading_default, {
      level: headingLevel,
      // translators: refers to a social post on Instagram
      children: _i18n.__.call(void 0, "Your post", "social-previews")
    }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "p", { className: "social-preview__section-desc", children: _i18n.__.call(void 0, 
      "This is what your social post will look like on Instagram:",
      "social-previews"
    ) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, InstagramPostPreview, { ...props })
  ] }) });
};



































exports.AUTO_SHARED_LINK_PREVIEW = AUTO_SHARED_LINK_PREVIEW; exports.AUTO_SHARED_SOCIAL_POST_PREVIEW = AUTO_SHARED_SOCIAL_POST_PREVIEW; exports.BlueskyLinkPreview = BlueskyLinkPreview; exports.BlueskyPostPreview = BlueskyPostPreview; exports.BlueskyPreviews = BlueskyPreviews; exports.DEFAULT_LINK_PREVIEW = DEFAULT_LINK_PREVIEW; exports.FacebookLinkPreview = FacebookLinkPreview; exports.FacebookPostPreview = FacebookPostPreview; exports.FacebookPreviews = FacebookPreviews; exports.GoogleSearchPreview = GoogleSearchPreview; exports.InstagramPostPreview = InstagramPostPreview; exports.InstagramPreviews = InstagramPreviews; exports.LANDSCAPE_MODE = LANDSCAPE_MODE; exports.LinkedInLinkPreview = LinkedInLinkPreview; exports.LinkedInPostPreview = LinkedInPostPreview; exports.LinkedInPreviews = LinkedInPreviews; exports.MastodonLinkPreview = MastodonLinkPreview; exports.MastodonPostPreview = MastodonPostPreview; exports.MastodonPreviews = MastodonPreviews; exports.NextdoorLinkPreview = NextdoorLinkPreview; exports.NextdoorPostPreview = NextdoorPostPreview; exports.NextdoorPreviews = NextdoorPreviews; exports.PORTRAIT_MODE = PORTRAIT_MODE; exports.TYPE_ARTICLE = TYPE_ARTICLE; exports.TYPE_WEBSITE = TYPE_WEBSITE; exports.ThreadsLinkPreview = ThreadsLinkPreview; exports.ThreadsPostPreview = ThreadsPostPreview; exports.ThreadsPreviews = ThreadsPreviews; exports.TumblrLinkPreview = TumblrLinkPreview; exports.TumblrPostPreview = TumblrPostPreview; exports.TumblrPreviews = TumblrPreviews; exports.TwitterLinkPreview = TwitterLinkPreview; exports.TwitterPostPreview = TwitterPostPreview; exports.TwitterPreviews = TwitterPreviews;
//# sourceMappingURL=index.js.map