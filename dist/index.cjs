Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let _wordpress_element = require("@wordpress/element");
let _wordpress_i18n = require("@wordpress/i18n");
let react_jsx_runtime = require("react/jsx-runtime");
let react = require("react");
let clsx = require("clsx");
clsx = __toESM(clsx);
let _wordpress_components = require("@wordpress/components");
//#region src/helpers.tsx
const baseDomain = (url) => {
	const withoutProtocol = url.replace(/^[^/]+:\/\//, "");
	const slashIndex = withoutProtocol.indexOf("/");
	return slashIndex === -1 ? withoutProtocol : withoutProtocol.substring(0, slashIndex);
};
/**
* Counts Unicode codepoints rather than UTF-16 code units, so an emoji like 🚀
* is one character (matching PHP `mb_strlen`) rather than two. Lets the JS
* preview's truncation align with the backend's logical-char counting.
*
* @param text - The string to measure.
* @return The codepoint count.
*/
const codepointLength$1 = (text) => Array.from(text).length;
/**
* Slices a string by Unicode codepoints rather than UTF-16 code units, so
* surrogate pairs (most emoji) are never split mid-character.
*
* @param text  - The string to slice.
* @param start - Start index, in codepoints.
* @param end   - End index, in codepoints (exclusive).
* @return The sliced string.
*/
const codepointSlice = (text, start, end) => Array.from(text).slice(start, end).join("");
const shortEnough = (limit) => (title) => codepointLength$1(title) <= limit ? title : false;
const truncatedAtSpace = (lower, upper) => (fullTitle) => {
	const title = fullTitle.slice(0, upper);
	const lastSpace = title.lastIndexOf(" ");
	return lastSpace > lower && lastSpace < upper ? title.slice(0, lastSpace).concat("…") : false;
};
const hardTruncation = (limit) => (title) => codepointSlice(title, 0, limit).concat("…");
const firstValid = (...predicates) => (a) => predicates.find((p) => false !== p(a))?.(a);
const stripHtmlTags = (description, allowedTags = []) => {
	const pattern = new RegExp(`(<([^${allowedTags.join("")}>]+)>)`, "gi");
	return description ? description.replace(pattern, "") : "";
};
/**
* For social note posts we use the first 50 characters of the description.
* @param description - The post description.
* @return The first 50 characters of the description.
*/
const getTitleFromDescription = (description) => {
	return stripHtmlTags(description).substring(0, 50);
};
const hasTag = (text, tag) => {
	return new RegExp(`<${tag}[^>]*>`, "gi").test(text);
};
const formatNextdoorDate = new Intl.DateTimeFormat("en-GB", {
	day: "numeric",
	month: "short"
}).format;
const formatThreadsDate = new Intl.DateTimeFormat("en-US", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric"
}).format;
const formatTweetDate = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric"
}).format;
const formatMastodonDate = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric"
}).format;
const collapseWhitespace = (text) => text.replace(/\s+/g, " ").trim();
const countOccurrences = (haystack, needle) => {
	let count = 0;
	for (let pos = haystack.indexOf(needle); pos !== -1; pos = haystack.indexOf(needle, pos + 1)) count++;
	return count;
};
const nthIndexOf = (haystack, needle, n) => {
	let pos = haystack.indexOf(needle);
	while (pos !== -1 && n > 0) {
		n--;
		pos = haystack.indexOf(needle, pos + 1);
	}
	return pos;
};
/**
* Extracts `(text, href)` pairs from `<a href="…">text</a>` in HTML, skipping
* autolinks (text already equals the URL) and non-http(s) hrefs. Mirrors the
* backend `ExtractorUtils::get_anchor_links_from_html` so the preview links the
* same anchors the published share will.
*
* @param html - Raw post content HTML.
* @return The editor hyperlinks found, in document order.
*/
function parseHyperlinks(html) {
	if (!html) return [];
	const doc = document.implementation.createHTMLDocument("");
	doc.body.innerHTML = html;
	const links = [];
	for (const anchor of Array.from(doc.body.querySelectorAll("a[href]"))) {
		const href = anchor.getAttribute("href") ?? "";
		const text = collapseWhitespace(anchor.textContent ?? "");
		if (!/^https?:\/\//i.test(href) || "" === text || text === href) continue;
		const range = doc.createRange();
		range.selectNodeContents(doc.body);
		range.setEndBefore(anchor);
		const occurrence = countOccurrences(collapseWhitespace(range.toString()), text);
		links.push({
			text,
			href,
			occurrence
		});
	}
	return links;
}
const hashtagUrlMap = {
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
/**
* Prepares the text for the preview.
* @param {string}             text    - The text to prepare.
* @param {PreviewTextOptions} options - The options for preparing the text.
* @return The prepared text as React nodes.
*/
function preparePreviewText(text, options) {
	const { platform, maxChars, maxLines, hyperlinkHashtags = true, hyperlinkUrls = "instagram" !== platform, hyperlinks } = options;
	let result = stripHtmlTags(text);
	result = result.replaceAll(/(?:\s*[\n\r]){2,}/g, "\n\n");
	if (maxChars && codepointLength$1(result) > maxChars) result = hardTruncation(maxChars)(result);
	if (maxLines) {
		const lines = result.split("\n");
		if (lines.length > maxLines) result = lines.slice(0, maxLines).join("\n");
	}
	const componentMap = {};
	const replacements = [];
	const overlapsReplacement = (start, end) => replacements.some((replacement) => start < replacement.end && replacement.start < end);
	if (hyperlinkUrls)
 /**
	* BEFORE:
	* result = 'Check out this cool site: https://wordpress.org and this one: https://wordpress.com'
	*/
	[...result.matchAll(/https?:\/\/\S+/g)].forEach((match, index) => {
		const url = match[0];
		const start = match.index ?? 0;
		componentMap[`Link${index}`] = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
			href: url,
			rel: "noopener noreferrer",
			target: "_blank",
			children: url
		});
		replacements.push({
			start,
			end: start + url.length,
			value: `<Link${index} />`
		});
	});
	if (hyperlinkHashtags && hashtagUrlMap[platform]) {
		/**
		* We need to ensure that only the standalone hashtags are matched.
		* For example, we don't want to match the hash in the URL.
		* Thus we need to match the whitespace character before the hashtag or the beginning of the string.
		*/
		const hashtags = [...result.matchAll(/(^|\s)#(\w+)/g)];
		const hashtagUrl = hashtagUrlMap[platform];
		/**
		* BEFORE:
		* result = `#breaking text with a #hashtag on the #web
		* with a url https://github.com/Automattic/wp-calypso#security that has a hash in it`
		*/
		hashtags.forEach((match, index) => {
			const [, whitespace, hashtag] = match;
			const start = (match.index ?? 0) + whitespace.length;
			const end = start + hashtag.length + 1;
			if (overlapsReplacement(start, end)) return;
			const url = (0, _wordpress_i18n.sprintf)(hashtagUrl, hashtag, options.hashtagDomain);
			componentMap[`Hashtag${index}`] = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
				href: url,
				rel: "noopener noreferrer",
				target: "_blank",
				children: `#${hashtag}`
			});
			replacements.push({
				start,
				end,
				value: `<Hashtag${index} />`
			});
		});
	}
	if (hyperlinks?.length) hyperlinks.forEach(({ text: anchorText, href, occurrence = 0 }, index) => {
		if (!anchorText) return;
		const pos = nthIndexOf(result, anchorText, occurrence);
		if (pos === -1) return;
		const end = pos + anchorText.length;
		if (overlapsReplacement(pos, end)) return;
		const token = `Hyperlink${index}`;
		componentMap[token] = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
			href,
			rel: "noopener noreferrer",
			target: "_blank"
		});
		replacements.push({
			start: pos,
			end,
			value: `<${token}>${anchorText}</${token}>`
		});
	});
	replacements.sort((a, b) => b.start - a.start);
	for (const { start, end, value } of replacements) result = result.slice(0, start) + value + result.slice(end);
	/**
	* BEFORE:
	* result = 'This is a text\nwith a newline\nin it'
	*/
	result = result.replace(/\n/g, "<br />");
	componentMap.br = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("br", {});
	/**
	* AFTER:
	* result = 'This is a text<br />with a newline<br />in it'
	* componentMap = { br: <br /> }
	*/
	return (0, _wordpress_element.createInterpolateElement)(result, componentMap);
}
//#endregion
//#region src/icons/globe-icon.tsx
/**
* Globe Icon Component.
*
* Uses Google's globe icon to match what Google Search results show for sites
* without a favicon.
*
* Accepts any standard SVG props (e.g. `width`, `height`, `className`, `style`)
* so consumers can size and style it to fit their context.
*
* @param props - Standard SVG props.
* @return The Globe SVG icon component.
*/
function GlobeIcon$2(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		focusable: "false",
		"aria-hidden": "true",
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		width: "14",
		height: "14",
		...props,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
		})
	});
}
//#endregion
//#region src/site-icon-with-fallback.tsx
/**
* Renders a default site icon: a neutral grey circle with a globe glyph,
* matching what Google's search results show for sites without a favicon.
* The wrapping span adopts the caller's `className` so the size is inherited
* from whatever rule the preview already has on that class.
*
* @param {Pick< SiteIconWithFallbackProps, 'className' >} props - The wrapper props.
* @return The DefaultSiteIcon component.
*/
function DefaultSiteIcon({ className }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
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
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(GlobeIcon$2, { style: {
			width: "60%",
			height: "60%"
		} })
	});
}
/**
* Renders a site icon image with a fallback to a default globe icon if no URL
* is provided or the URL fails to load.
*
* @param {SiteIconWithFallbackProps} props - The props for the SiteIconWithFallback component.
*
* @return The SiteIconWithFallback component.
*/
function SiteIconWithFallback({ src: siteIconUrl, alt = "", className, fallback = /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DefaultSiteIcon, { className }) }) {
	const [imageUrlWithError, setImageUrlWithError] = (0, react.useState)("");
	const onError = (0, react.useCallback)((event) => {
		setImageUrlWithError(event.target.src);
	}, []);
	return siteIconUrl && imageUrlWithError !== siteIconUrl ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
		src: siteIconUrl,
		alt,
		onError,
		className
	}) : fallback;
}
//#endregion
//#region src/google-search-preview/index.tsx
const URL_LENGTH$1 = 68;
const TITLE_LENGTH$5 = 63;
const DESCRIPTION_LENGTH$3 = 160;
const googleUrl = (url) => {
	const protocol = url.startsWith("https://") ? "https://" : "http://";
	const breadcrumb = protocol + url.replace(protocol, "").split("/").join(" › ");
	return firstValid(shortEnough(URL_LENGTH$1), hardTruncation(URL_LENGTH$1))(breadcrumb);
};
const googleTitle = firstValid(shortEnough(TITLE_LENGTH$5), truncatedAtSpace(TITLE_LENGTH$5 - 40, 73), hardTruncation(TITLE_LENGTH$5));
const googleDescription = firstValid(shortEnough(DESCRIPTION_LENGTH$3), truncatedAtSpace(DESCRIPTION_LENGTH$3 - 80, 170), hardTruncation(DESCRIPTION_LENGTH$3));
const GoogleSearchPreview = ({ description = "", siteIcon, siteTitle, title = "", url = "" }) => {
	const domain = baseDomain(url);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "search-preview",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "search-preview__display",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "search-preview__header",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "search-preview__branding",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SiteIconWithFallback, {
							className: "search-preview__icon",
							src: siteIcon
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "search-preview__site",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "search-preview__site--title",
								children: siteTitle || domain
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "search-preview__url",
								children: googleUrl(url)
							})]
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "search-preview__menu",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
							focusable: "false",
							xmlns: "http://www.w3.org/2000/svg",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" })
						})
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "search-preview__title",
					children: googleTitle(title)
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "search-preview__description",
					children: googleDescription(stripHtmlTags(description))
				})
			]
		})
	});
};
//#endregion
//#region src/shared/media-image/index.tsx
/**
* MediaImage
*
* A thin wrapper over `<img>` that renders an optional focal point as an inline
* `object-position`, so the visible crop (under `object-fit: cover`) keeps the
* focal point in view.
*
* The crop model is "focal point at the center of the crop, clamped to the
* image edges" — the same model image CDNs use when they generate the cropped
* share image. CSS `object-position` percentages are *alignment*, not centering
* (they only match a centered crop at 50%), so we remap the focal point into the
* `object-position` value that reproduces a centered crop. The remap needs the
* image's natural aspect ratio and the rendered box's aspect ratio, both read
* from the element itself, so callers pass only a `focalPoint`.
*
* Before those sizes are known (initial render, or a non-layout environment like
* tests) it falls back to the raw focal point; the value is corrected once the
* image loads.
*/
const clamp = (value) => Math.min(Math.max(value, 0), 1);
/**
* Remaps one axis of a focal point into the `object-position` fraction that
* reproduces a centered-and-clamped crop, given that axis's overflow ratio.
*
* @param {number} focal - The focal coordinate on the overflowing axis (0-1).
* @param {number} ratio - Visible fraction of the image on that axis (boxShorter / imageLonger).
* @return {number} The object-position fraction (0-1).
*/
const remapAxis = (focal, ratio) => {
	if (ratio >= 1) return focal;
	return clamp((focal - ratio / 2) / (1 - ratio));
};
/**
* Converts a focal point into the `object-position` point that reproduces a
* centered-and-clamped crop under `object-fit: cover`.
*
* @param {FocalPoint} focalPoint  - The focal point, both axes 0-1.
* @param {number}     imageAspect - The image's natural aspect ratio (w/h).
* @param {number}     boxAspect   - The rendered box's aspect ratio (w/h).
* @return {FocalPoint} The object-position point, both axes 0-1.
*/
const focalPointToObjectPosition = (focalPoint, imageAspect, boxAspect) => {
	if (imageAspect < boxAspect) return {
		x: focalPoint.x,
		y: remapAxis(focalPoint.y, imageAspect / boxAspect)
	};
	if (imageAspect > boxAspect) return {
		x: remapAxis(focalPoint.x, boxAspect / imageAspect),
		y: focalPoint.y
	};
	return focalPoint;
};
const MediaImage = ({ focalPoint, style, onLoad, ...props }) => {
	const ref = (0, react.useRef)(null);
	const [aspects, setAspects] = (0, react.useState)(null);
	const measure = (0, react.useCallback)(() => {
		const el = ref.current;
		if (!el) return;
		const { naturalWidth, naturalHeight, clientWidth, clientHeight } = el;
		if (naturalWidth && naturalHeight && clientWidth && clientHeight) setAspects({
			image: naturalWidth / naturalHeight,
			box: clientWidth / clientHeight
		});
	}, []);
	(0, react.useEffect)(() => {
		measure();
		const el = ref.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
	}, [measure]);
	const handleLoad = (0, react.useCallback)((event) => {
		measure();
		onLoad?.(event);
	}, [measure, onLoad]);
	const position = focalPoint && aspects ? focalPointToObjectPosition(focalPoint, aspects.image, aspects.box) : focalPoint;
	const focalPointStyle = position ? { objectPosition: `${position.x * 100}% ${position.y * 100}%` } : void 0;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
		...props,
		ref,
		onLoad: handleLoad,
		style: focalPointStyle || style ? {
			...style,
			...focalPointStyle
		} : void 0
	});
};
//#endregion
//#region src/twitter-preview/card.tsx
const DESCRIPTION_LENGTH$2 = 280;
const twitterDescription = firstValid(shortEnough(DESCRIPTION_LENGTH$2), hardTruncation(DESCRIPTION_LENGTH$2));
const Card$1 = ({ description, image, imageFocalPoint, title, cardType, url }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "twitter-preview__card",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: (0, clsx.default)(`twitter-preview__card-${cardType}`, { "twitter-preview__card-has-image": !!image }),
			children: [image && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
				className: "twitter-preview__card-image",
				src: image,
				alt: "",
				focalPoint: imageFocalPoint
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "twitter-preview__card-body",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "twitter-preview__card-url",
						children: baseDomain(url || "")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "twitter-preview__card-title",
						children: title
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "twitter-preview__card-description",
						children: twitterDescription(stripHtmlTags(description))
					})
				]
			})]
		})
	});
};
//#endregion
//#region src/twitter-preview/footer.tsx
const Footer$1 = () => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "twitter-preview__footer",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "twitter-preview__icon-replies",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" })
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "twitter-preview__icon-retweets",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" })
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "twitter-preview__icon-likes",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" })
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "twitter-preview__icon-analytics",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" })
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "twitter-preview__icon-share",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 24 24",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" })
				})
			})
		]
	});
};
//#endregion
//#region src/twitter-preview/header.tsx
const Header$1 = ({ name, screenName, date }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "twitter-preview__header",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "twitter-preview__name",
				children: name || (0, _wordpress_i18n.__)("Account Name", "social-previews")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "twitter-preview__screen-name",
				children: screenName || "@account"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "·" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "twitter-preview__date",
				children: formatTweetDate(date || Date.now())
			})
		]
	});
};
//#endregion
//#region src/twitter-preview/media.tsx
const Media$1 = ({ media }) => {
	const filteredMedia = media.filter((mediaItem) => mediaItem.type.startsWith("image/") || mediaItem.type.startsWith("video/")).filter((mediaItem, idx, array) => {
		if (0 === idx) return true;
		if (array[0].type.startsWith("video/") || "image/gif" === array[0].type) return false;
		if (mediaItem.type.startsWith("video/") || "image/gif" === mediaItem.type) return false;
		return true;
	}).slice(0, 4);
	if (0 === filteredMedia.length) return null;
	const isVideo = filteredMedia[0].type.startsWith("video/");
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: (0, clsx.default)(["twitter-preview__media", "twitter-preview__media-children-" + filteredMedia.length]),
		children: filteredMedia.map((mediaItem, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react.Fragment, { children: isVideo ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
			controls: true,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("source", {
				src: mediaItem.url,
				type: mediaItem.type
			})
		}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
			alt: mediaItem.alt || "",
			src: mediaItem.url
		}) }, `twitter-preview__media-item-${index}`))
	});
};
//#endregion
//#region src/twitter-preview/quote-tweet.tsx
const QuoteTweet = ({ tweetUrl }) => {
	if (!tweetUrl) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "twitter-preview__quote-tweet",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_wordpress_components.SandBox, {
			html: `<blockquote class="twitter-tweet" data-conversation="none" data-dnt="true"><a href="${tweetUrl}"></a></blockquote>`,
			scripts: ["https://platform.twitter.com/widgets.js"],
			title: "Embedded tweet"
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: "twitter-preview__quote-tweet-overlay" })]
	});
};
//#endregion
//#region src/avatar-with-fallback.tsx
/**
* Renders a default avatar SVG.
*
* @param {Pick< AvatarWithFallbackProps, 'className' >} props - The SVG props.
* @return The DefaultAvatar component.
*/
function DefaultAvatar(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 340 340",
		width: "36",
		height: "36",
		"aria-hidden": "true",
		...props,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			fill: "#DDD",
			d: "m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 1 1-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"
		})
	});
}
/**
* Renders an avatar image with a fallback to a default avatar if no URL is provided or if the URL fails to load.
*
* @param {AvatarWithFallbackProps} props - The props for the AvatarWithFallback component.
*
* @return The AvatarWithFallback component.
*/
function AvatarWithFallback({ src: avatarUrl, alt = "", className, fallback = /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DefaultAvatar, { className }) }) {
	const [imageUrlWithError, setImageUrlWithError] = (0, react.useState)("");
	const onError = (0, react.useCallback)((event) => {
		setImageUrlWithError(event.target.src);
	}, []);
	return !!avatarUrl && imageUrlWithError !== avatarUrl ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
		src: avatarUrl,
		alt,
		onError,
		className
	}) : fallback;
}
//#endregion
//#region src/twitter-preview/sidebar.tsx
const Sidebar$1 = ({ profileImage, showThreadConnector }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "twitter-preview__sidebar",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "twitter-preview__profile-image",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AvatarWithFallback, { src: profileImage })
		}), showThreadConnector && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: "twitter-preview__connector" })]
	});
};
//#endregion
//#region src/twitter-preview/text.tsx
const Text = ({ text }) => {
	if (!text) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "twitter-preview__text",
		children: preparePreviewText(text, { platform: "twitter" })
	});
};
//#endregion
//#region src/twitter-preview/post-preview.tsx
const TwitterPostPreview = ({ date, description, image, imageFocalPoint, media, name, profileImage, screenName, showThreadConnector, text, title, tweetUrl, cardType, url }) => {
	const hasMedia = !!media?.length;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "twitter-preview__wrapper",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "twitter-preview__container",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Sidebar$1, {
				profileImage,
				showThreadConnector
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "twitter-preview__main",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Header$1, {
						name,
						screenName,
						date
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "twitter-preview__content",
						children: [
							text ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Text, { text }) : null,
							hasMedia ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Media$1, { media }) : null,
							tweetUrl ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QuoteTweet, { tweetUrl }) : null,
							!hasMedia && url && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Card$1, {
								description: description || "",
								image,
								imageFocalPoint,
								title: title || "",
								cardType: cardType || "",
								url
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Footer$1, {})
				]
			})]
		})
	});
};
//#endregion
//#region src/twitter-preview/link-preview.tsx
const TwitterLinkPreview = (props) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TwitterPostPreview, {
		...props,
		text: "",
		media: void 0
	});
};
//#endregion
//#region src/shared/section-heading/index.tsx
const HEADING_LEVELS = [
	2,
	3,
	4,
	5,
	6
];
const SectionHeading = ({ className, level, children }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(`h${level && HEADING_LEVELS.includes(level) ? level : 3}`, {
		className: `social-preview__section-heading ${className ?? ""}`,
		children
	});
};
//#endregion
//#region src/twitter-preview/previews.tsx
const TwitterPreviews = ({ headingLevel, hideLinkPreview, hidePostPreview, tweets }) => {
	if (!tweets?.length) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "social-preview twitter-preview",
		children: [!hidePostPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section twitter-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Your post", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what your social post will look like on X:", "social-previews")
				}),
				tweets.map((tweet, index) => {
					const isLast = index + 1 === tweets.length;
					return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TwitterPostPreview, {
						...tweet,
						showThreadConnector: !isLast
					}, `twitter-preview__tweet-${index}`);
				})
			]
		}), !hideLinkPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section twitter-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Link preview", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what it will look like when someone shares the link to your WordPress post on X.", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TwitterLinkPreview, {
					...tweets[0],
					name: "",
					profileImage: "",
					screenName: ""
				})
			]
		})]
	});
};
/**
* Counts Unicode codepoints rather than UTF-16 code units, so an emoji like 🚀 is one character (matching PHP `mb_strlen`).
*
* @param text - The string to measure.
* @return The codepoint count.
*/
function codepointLength(text) {
	return Array.from(text).length;
}
/**
* Truncates `text` to at most `limit` codepoints, preferring the last space
* within the final 80 codepoints so we don't slice mid-word.
*
* @param text  - The string to truncate.
* @param limit - Maximum codepoint length of the returned string.
* @return The truncated string (without an ellipsis).
*/
function truncateAtWordBoundary(text, limit) {
	const codepoints = Array.from(text);
	if (codepoints.length <= limit) return text;
	const slice = codepoints.slice(0, limit).join("");
	const lastSpace = slice.lastIndexOf(" ");
	const cut = lastSpace > limit - 80 ? lastSpace : slice.length;
	return slice.slice(0, cut);
}
/**
* Wraps a body-text formatter with a "See more" / "See less" toggle when the
* input exceeds {@link EXPAND_THRESHOLD_CHARS} visible (HTML-stripped)
* characters.
*
* @param props - {@link ExpandableTextProps}.
* @return The body text node, optionally followed by a See more/See less toggle.
*/
function ExpandableText(props) {
	const { text, children } = props;
	const [expanded, toggle] = (0, react.useReducer)((state) => !state, false);
	const stripped = stripHtmlTags(text);
	if (codepointLength(stripped) <= 400) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: children(text) });
	if (expanded) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
		children(text),
		" ",
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_wordpress_components.Button, {
			variant: "link",
			className: "social-previews__expand-toggle",
			onClick: toggle,
			children: (0, _wordpress_i18n.__)("See less", "social-previews")
		})
	] });
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
		children(truncateAtWordBoundary(stripped, 400)),
		"… ",
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_wordpress_components.Button, {
			variant: "link",
			className: "social-previews__expand-toggle",
			onClick: toggle,
			children: (0, _wordpress_i18n.__)("See more", "social-previews")
		})
	] });
}
//#endregion
//#region src/linkedin-preview/constants.ts
const FEED_TEXT_MAX_LENGTH$2 = 3e3;
//#endregion
//#region src/linkedin-preview/post-preview.tsx
/**
* LinkedIn Post Preview Component
*
* @param {LinkedInPreviewProps} props - The props for the LinkedIn post preview.
*
* @return The LinkedIn post preview component.
*/
function LinkedInPostPreview({ articleReadTime = 5, image, imageFocalPoint, jobTitle, name, profileImage, description, media, title, url }) {
	const hasMedia = !!media?.length;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "linkedin-preview__wrapper",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: `linkedin-preview__container ${hasMedia ? "has-media" : ""}`,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "linkedin-preview__header",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "linkedin-preview__header--avatar",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AvatarWithFallback, { src: profileImage })
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "linkedin-preview__header--profile",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "linkedin-preview__header--profile-info",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "linkedin-preview__header--profile-name",
									children: name || (0, _wordpress_i18n.__)("Account Name", "social-previews")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "linkedin-preview__header--profile-actor",
									children: (0, _wordpress_i18n.__)("1st", "social-previews")
								})
							]
						}),
						jobTitle ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "linkedin-preview__header--profile-title",
							children: jobTitle
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "linkedin-preview__header--profile-meta",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: (0, _wordpress_i18n.__)("1h", "social-previews") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 16 16",
									fill: "currentColor",
									width: "16",
									height: "16",
									focusable: "false",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0L9 7.5l.38-.7a1 1 0 00.12-.48v-.85a.78.78 0 01.21-.53l1.07-1.09a5 5 0 01-1.54 9z" })
								})
							]
						})
					]
				})]
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "linkedin-preview__content",
				children: [description ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "linkedin-preview__caption",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandableText, {
						text: description,
						children: (visibleText) => preparePreviewText(visibleText, {
							platform: "linkedin",
							maxChars: FEED_TEXT_MAX_LENGTH$2
						})
					}) }), hasMedia && url && !description.includes(url) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [" - ", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
						href: url,
						rel: "nofollow noopener noreferrer",
						target: "_blank",
						children: url
					})] })]
				}) : null, hasMedia ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "linkedin-preview__media",
					children: media.map((mediaItem, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "linkedin-preview__media-item",
						children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
							controls: true,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("source", {
								src: mediaItem.url,
								type: mediaItem.type
							})
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
							alt: mediaItem.alt || "",
							src: mediaItem.url
						})
					}, `linkedin-preview__media-item-${index}`))
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", { children: [image ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
					className: "linkedin-preview__image",
					src: image,
					alt: "",
					focalPoint: imageFocalPoint
				}) : null, url ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "linkedin-preview__description",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						className: "linkedin-preview__description--title",
						children: title || getTitleFromDescription(description)
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "linkedin-preview__description--meta",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "linkedin-preview__description--url",
								children: baseDomain(url)
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "•" }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: (0, _wordpress_i18n.sprintf)((0, _wordpress_i18n.__)("%d min read", "social-previews"), articleReadTime) })
						]
					})]
				}) : null] })]
			})]
		})
	});
}
//#endregion
//#region src/linkedin-preview/link-preview.tsx
/**
* LinkedIn Link Preview Component
* @param {LinkedInLinkPreviewProps} props - The props for the LinkedIn link preview.
* @return The LinkedIn link preview component.
*/
function LinkedInLinkPreview(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(LinkedInPostPreview, {
		name: "",
		profileImage: "",
		...props,
		description: "",
		media: void 0,
		title: props.title || getTitleFromDescription(props.description)
	});
}
//#endregion
//#region src/linkedin-preview/previews.tsx
const LinkedInPreviews = ({ headingLevel, hideLinkPreview, hidePostPreview, ...props }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "social-preview linkedin-preview",
		children: [!hidePostPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section linkedin-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Your post", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what your social post will look like on LinkedIn:", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(LinkedInPostPreview, { ...props })
			]
		}), !hideLinkPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section linkedin-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Link preview", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what it will look like when someone shares the link to your WordPress post on LinkedIn.", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(LinkedInLinkPreview, {
					...props,
					name: "",
					profileImage: ""
				})
			]
		})]
	});
};
//#endregion
//#region src/tumblr-preview/helpers.ts
const TITLE_LENGTH$4 = 1e3;
const DESCRIPTION_LENGTH$1 = 4096;
const tumblrTitle = (text) => firstValid(shortEnough(TITLE_LENGTH$4), hardTruncation(TITLE_LENGTH$4))(stripHtmlTags(text)) || "";
const tumblrDescription = (text) => {
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
	return firstValid(shortEnough(DESCRIPTION_LENGTH$1), hardTruncation(DESCRIPTION_LENGTH$1))(stripHtmlTags(processedText)) || "";
};
//#endregion
//#region src/tumblr-preview/post/icons/index.tsx
const TumblrPostIcon = ({ name }) => {
	let svg;
	switch (name) {
		case "blaze":
			svg = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 25 22",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m7.5059-0.24414c-0.79843 0.057223-1.2169 0.88587-1.1635 1.6128-0.2266 2.0449-1.4898 3.8696-3.1975 4.9778-3.0182 2.414-4.2201 6.8066-2.8033 10.411 0.92417 2.4679 2.9589 4.5674 5.4768 5.3928 0.95914 0.16102 1.7233-0.94358 1.3074-1.8059-0.11578-0.51062-0.17482-0.96516-0.17845-1.487 1.0413 1.5607 2.5484 2.8986 4.341 3.4975 1.0396-0.0154 1.98-0.64458 2.8516-1.1608 3.3821-2.1786 4.9604-6.7097 3.6597-10.518-0.49144-1.4599-1.2948-2.8935-2.5028-3.8698-0.7512-0.45498-1.661 0.09677-1.9202 0.86038-0.12274 0.16822-0.70352 1.1955-0.6191 0.61976 0.25488-3.4397-1.6789-7.0066-4.8123-8.4958-0.14322-0.037843-0.292-0.049464-0.43945-0.035156zm1.0586 3.5605c1.8947 2.0016 2.2326 5.1984 0.89062 7.5879-0.38498 0.96148 0.71762 2.0063 1.6567 1.5681 1.4159-0.4624 2.6998-1.3259 3.6577-2.4665 1.6442 2.5888 1.1465 6.2819-1.0629 8.3379-0.62378 0.60782-1.3666 1.0945-2.1754 1.4179-1.9543-0.989-3.3534-3.0966-3.5625-5.3125-0.25636-1.0253-1.81-1.2013-2.2852-0.25781-0.75058 1.3054-1.1846 2.7948-1.2305 4.3008-2.2396-1.9852-2.8468-5.4435-1.4609-8.0527 0.58926-1.239 1.651-2.13 2.724-2.9329 1.2958-1.1271 2.2791-2.62 2.7682-4.2683l0.071578 0.069832z" })
			});
			break;
		case "delete":
			svg = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 14 17",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12 5v9c.1.7-.3 1-1 1H3c-.5 0-.9-.3-1-1V5c0-.6-.4-1-1-1-.5 0-1 .4-1 1v9.5C0 16.1 1.4 17 3 17h8c1.8 0 3-.8 3-2.5V5c0-.6-.5-1-1-1-.6 0-1 .5-1 1z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M4 12s0 1 1 1 1-1 1-1V5c0-.5-.4-1-1-1-.5 0-1 .5-1 1v7zm4 0s0 1 1 1 1-1 1-1V5c0-.5-.4-1-1-1-.5 0-1 .5-1 1v7zm5-10c.5 0 1-.4 1-1 0-.5-.4-.9-1-1H1C.5.1 0 .5 0 1c0 .6.6 1 1.1 1H13z" })]
			});
			break;
		case "edit":
			svg = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 17.6 17.6",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M5.3 13.8l-2.1.7.7-2.1L10.3 6l1.4 1.4-6.4 6.4zm6.4-9.3l-1.4-1.4-1.4 1.4-6.7 6.7-.2.5-2 5.9 3.8-1.3 2.1-.7.4-.1.3-.3 7.8-7.8c.1 0-2.7-2.9-2.7-2.9zm5.6-1.4L14.5.3c-.4-.4-1-.4-1.4 0l-1.4 1.4L15.9 6l1.4-1.4c.4-.5.4-1.1 0-1.5" })
			});
			break;
		case "share":
			svg = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 24 24",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12.6173 1.07612C12.991 0.921338 13.4211 1.00689 13.7071 1.29289L22.7071 10.2929C23.0832 10.669 23.0991 11.2736 22.7433 11.669L13.7433 21.669C13.4663 21.9767 13.0283 22.082 12.6417 21.9336C12.2552 21.7853 12 21.414 12 21V16H11.5C7.31775 16 3.92896 18.2486 2.95256 21.3044C2.80256 21.7738 2.33292 22.064 1.84598 21.9881C1.35904 21.9122 1 21.4928 1 21V18.5C1 12.3162 5.88069 7.27245 12 7.01067V2C12 1.59554 12.2436 1.2309 12.6173 1.07612ZM14 4.41421V8C14 8.55228 13.5523 9 13 9H12.5C7.64534 9 3.64117 12.6414 3.06988 17.3419C5.09636 15.2366 8.18218 14 11.5 14H13C13.5523 14 14 14.4477 14 15V18.394L20.622 11.0362L14 4.41421Z" })
			});
			break;
		case "reply":
			svg = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 17 17",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8.7 0C4.1 0 .4 3.7.4 8.3c0 1.2.2 2.3.7 3.4-.2.6-.4 1.5-.7 2.5L0 15.8c-.2.7.5 1.4 1.2 1.2l1.6-.4 2.4-.7c1.1.5 2.2.7 3.4.7 4.6 0 8.3-3.7 8.3-8.3C17 3.7 13.3 0 8.7 0zM15 8.3c0 3.5-2.8 6.3-6.4 6.3-1.2 0-2.3-.3-3.2-.9l-3.2.9.9-3.2c-.5-.9-.9-2-.9-3.2.1-3.4 3-6.2 6.5-6.2S15 4.8 15 8.3z" })
			});
			break;
		case "reblog":
			svg = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 17 18.1",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M12.8.2c-.4-.4-.8-.2-.8.4v2H2c-2 0-2 2-2 2v5s0 1 1 1 1-1 1-1v-4c0-1 .5-1 1-1h9v2c0 .6.3.7.8.4L17 3.6 12.8.2zM4.2 17.9c.5.4.8.2.8-.3v-2h10c2 0 2-2 2-2v-5s0-1-1-1-1 1-1 1v4c0 1-.5 1-1 1H5v-2c0-.6-.3-.7-.8-.4L0 14.6l4.2 3.3z" })
			});
			break;
		case "like":
			svg = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 20 18",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M14.658 0c-1.625 0-3.21.767-4.463 2.156-.06.064-.127.138-.197.225-.074-.085-.137-.159-.196-.225C8.547.766 6.966 0 5.35 0 4.215 0 3.114.387 2.162 1.117c-2.773 2.13-2.611 5.89-1.017 8.5 2.158 3.535 6.556 7.18 7.416 7.875A2.3 2.3 0 0 0 9.998 18c.519 0 1.028-.18 1.436-.508.859-.695 5.257-4.34 7.416-7.875 1.595-2.616 1.765-6.376-1-8.5C16.895.387 15.792 0 14.657 0h.001zm0 2.124c.645 0 1.298.208 1.916.683 1.903 1.461 1.457 4.099.484 5.695-1.973 3.23-6.16 6.7-6.94 7.331a.191.191 0 0 1-.241 0c-.779-.631-4.966-4.101-6.94-7.332-.972-1.595-1.4-4.233.5-5.694.619-.475 1.27-.683 1.911-.683 1.064 0 2.095.574 2.898 1.461.495.549 1.658 2.082 1.753 2.203.095-.12 1.259-1.654 1.752-2.203.8-.887 1.842-1.461 2.908-1.461h-.001z" })
			});
			break;
		case "ellipsis":
			svg = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 17.5 3.9",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M17.5 1.9c0 1.1-.9 1.9-1.9 1.9-1.1 0-1.9-.9-1.9-1.9S14.5 0 15.6 0c1 0 1.9.9 1.9 1.9m-6.8 0c0 1.1-.9 1.9-1.9 1.9-1.1.1-2-.8-2-1.9 0-1 .9-1.9 2-1.9s1.9.9 1.9 1.9m-6.8 0c0 1.1-.9 2-2 2-1 0-1.9-.9-1.9-2S.9 0 1.9 0c1.1 0 2 .9 2 1.9" })
			});
			break;
	}
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
		className: `tumblr-preview__post-icon tumblr-preview__post-icon-${name}`,
		children: svg
	});
};
//#endregion
//#region src/tumblr-preview/post/actions/index.tsx
const TumblrPostActions = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
	className: "tumblr-preview__post-actions",
	children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "tumblr-preview__post-manage-actions",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "tumblr-preview__post-actions-blaze",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrPostIcon, { name: "blaze" }), "\xA0Blaze"]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: [{
			icon: "delete",
			label: (0, _wordpress_i18n.__)("Delete", "social-previews")
		}, {
			icon: "edit",
			label: (0, _wordpress_i18n.__)("Edit", "social-previews")
		}].map(({ icon, label }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
			"aria-label": label,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrPostIcon, { name: icon })
		}, icon)) })]
	}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "tumblr-preview__post-social-actions",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: (0, _wordpress_i18n.__)("0 notes", "social-previews") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", { children: [
			{
				icon: "share",
				label: (0, _wordpress_i18n.__)("Share", "social-previews")
			},
			{
				icon: "reply",
				label: (0, _wordpress_i18n.__)("Reply", "social-previews")
			},
			{
				icon: "reblog",
				label: (0, _wordpress_i18n.__)("Reblog", "social-previews")
			},
			{
				icon: "like",
				label: (0, _wordpress_i18n.__)("Like", "social-previews")
			}
		].map(({ icon, label }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
			"aria-label": label,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrPostIcon, { name: icon })
		}, icon)) })]
	})]
});
//#endregion
//#region src/tumblr-preview/post/header/index.tsx
const TumblrPostHeader = ({ user }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
	className: "tumblr-preview__post-header",
	children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "tumblr-preview__post-header-username",
		children: user?.displayName || (0, _wordpress_i18n.__)("anonymous-user", "social-previews")
	}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrPostIcon, { name: "ellipsis" })]
});
//#endregion
//#region src/tumblr-preview/link-preview.tsx
const TumblrLinkPreview = ({ title, description, image, user, url, imageFocalPoint }) => {
	const avatarUrl = user?.avatarUrl;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "tumblr-preview__post",
		children: [avatarUrl && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
			className: "tumblr-preview__avatar",
			src: avatarUrl,
			alt: ""
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "tumblr-preview__card",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrPostHeader, { user }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "tumblr-preview__window",
					children: [image && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "tumblr-preview__window-top",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "tumblr-preview__overlay",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "tumblr-preview__title",
								children: tumblrTitle(title)
							})
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
							className: "tumblr-preview__image",
							src: image,
							alt: (0, _wordpress_i18n.__)("Tumblr preview thumbnail", "social-previews"),
							focalPoint: imageFocalPoint
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: `tumblr-preview__window-bottom ${!image ? "is-full" : ""}`,
						children: [
							!image && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "tumblr-preview__title",
								children: tumblrTitle(title)
							}),
							description && image && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "tumblr-preview__description",
								children: tumblrDescription(description)
							}),
							url && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "tumblr-preview__site-name",
								children: baseDomain(url)
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrPostActions, {})
			]
		})]
	});
};
//#endregion
//#region src/tumblr-preview/post-preview.tsx
const TumblrPostPreview = ({ title, description, image, user, url, media, hyperlinks, imageFocalPoint }) => {
	const avatarUrl = user?.avatarUrl;
	const mediaItem = media?.[0];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "tumblr-preview__post",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AvatarWithFallback, {
			className: "tumblr-preview__avatar",
			src: avatarUrl
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "tumblr-preview__card",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrPostHeader, { user }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "tumblr-preview__body",
					children: [
						title ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "tumblr-preview__title",
							children: tumblrTitle(title)
						}) : null,
						description && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "tumblr-preview__description",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandableText, {
								text: description,
								children: (visibleText) => preparePreviewText(tumblrDescription(visibleText), {
									platform: "tumblr",
									hyperlinks
								})
							})
						}),
						mediaItem ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "tumblr-preview__media-item",
							children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
								controls: true,
								className: "tumblr-preview__media--video",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("source", {
									src: mediaItem.url,
									type: mediaItem.type
								})
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
								className: "tumblr-preview__image",
								src: mediaItem.url,
								alt: ""
							})
						}) : image && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
							className: "tumblr-preview__image",
							src: image,
							alt: (0, _wordpress_i18n.__)("Tumblr preview thumbnail", "social-previews"),
							focalPoint: imageFocalPoint
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
							className: "tumblr-preview__url",
							href: url,
							target: "_blank",
							rel: "noreferrer",
							children: (0, _wordpress_i18n.__)("View On WordPress", "social-previews")
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrPostActions, {})
			]
		})]
	});
};
//#endregion
//#region src/tumblr-preview/previews.tsx
const TumblrPreviews = ({ headingLevel, hideLinkPreview, hidePostPreview, ...props }) => {
	const hasMedia = !!props.media?.length;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "social-preview tumblr-preview",
		children: [!hidePostPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section tumblr-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Your post", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what your social post will look like on Tumblr:", "social-previews")
				}),
				hasMedia ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrPostPreview, { ...props }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrLinkPreview, { ...props })
			]
		}), !hideLinkPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section tumblr-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Link preview", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what it will look like when someone shares the link to your WordPress post on Tumblr.", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TumblrLinkPreview, {
					...props,
					user: void 0
				})
			]
		})]
	});
};
//#endregion
//#region src/constants.ts
const AUTO_SHARED_SOCIAL_POST_PREVIEW = "AUTO_SHARED_SOCIAL_POST_PREVIEW";
const AUTO_SHARED_LINK_PREVIEW = "AUTO_SHARED_LINK_PREVIEW";
const DEFAULT_LINK_PREVIEW = "DEFAULT_LINK_PREVIEW";
const TYPE_WEBSITE = "website";
const TYPE_ARTICLE = "article";
const LANDSCAPE_MODE = "landscape";
const PORTRAIT_MODE = "portrait";
//#endregion
//#region src/facebook-preview/helpers.ts
const TITLE_LENGTH$3 = 110;
const DESCRIPTION_LENGTH = 200;
const CUSTOM_TEXT_LENGTH = 63206;
const facebookTitle = (text) => firstValid(shortEnough(TITLE_LENGTH$3), hardTruncation(TITLE_LENGTH$3))(stripHtmlTags(text)) || "";
const facebookDescription = (text) => firstValid(shortEnough(DESCRIPTION_LENGTH), hardTruncation(DESCRIPTION_LENGTH))(stripHtmlTags(text)) || "";
//#endregion
//#region src/facebook-preview/custom-text.tsx
const CustomText = ({ text, url, forceUrlDisplay }) => {
	let postLink;
	if (hasTag(text, "a") || forceUrlDisplay && !!url && !text.includes(url)) postLink = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
		className: "facebook-preview__custom-text-post-url",
		href: url,
		rel: "nofollow noopener noreferrer",
		target: "_blank",
		children: url
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
		className: "facebook-preview__custom-text",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandableText, {
			text,
			children: (visibleText) => preparePreviewText(visibleText, {
				platform: "facebook",
				maxChars: CUSTOM_TEXT_LENGTH
			})
		}) }), postLink]
	});
};
//#endregion
//#region src/facebook-preview/hooks/use-image-hook.ts
const useImage = ({ mode: initialMode }) => {
	const [mode, setMode] = (0, react.useState)(initialMode);
	const [isLoadingImage, setLoadingImage] = (0, react.useState)(true);
	const onLoad = (0, react.useCallback)(({ target }) => {
		if (!mode) {
			const image = target;
			setMode(image.naturalWidth > image.naturalHeight ? LANDSCAPE_MODE : PORTRAIT_MODE);
		}
		setLoadingImage(false);
	}, [mode]);
	const onError = (0, react.useCallback)(() => setLoadingImage(false), []);
	return [
		mode,
		isLoadingImage,
		{
			alt: (0, _wordpress_i18n.__)("Facebook Preview Thumbnail", "social-previews"),
			onLoad,
			onError
		}
	];
};
//#endregion
//#region src/facebook-preview/post/icons/index.tsx
const FacebookPostIcon = ({ name }) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("i", { className: `facebook-preview__post-icon facebook-preview__post-icon-${name}` });
//#endregion
//#region src/facebook-preview/post/actions/index.tsx
const FacebookPostActions = () => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
	className: "facebook-preview__post-actions",
	children: [
		{
			icon: "like",
			label: (0, _wordpress_i18n.__)("Like", "social-previews")
		},
		{
			icon: "comment",
			label: (0, _wordpress_i18n.__)("Comment", "social-previews")
		},
		{
			icon: "share",
			label: (0, _wordpress_i18n.__)("Share", "social-previews")
		}
	].map(({ icon, label }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostIcon, { name: icon }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label })] }, icon))
});
//#endregion
//#region src/facebook-preview/post/header/index.tsx
const FacebookPostHeader = ({ user, timeElapsed, hideOptions }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "facebook-preview__post-header",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "facebook-preview__post-header-content",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AvatarWithFallback, {
				className: "facebook-preview__post-header-avatar",
				src: user?.avatarUrl
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "facebook-preview__post-header-name",
				children: user?.displayName || (0, _wordpress_i18n.__)("Anonymous User", "social-previews")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "facebook-preview__post-header-share",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "facebook-preview__post-header-time",
						children: timeElapsed ? (0, _wordpress_i18n.__)("1h", "social-previews") : (0, _wordpress_i18n._x)("Just now", "", "social-previews")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "facebook-preview__post-header-dot",
						"aria-hidden": "true",
						children: "·"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostIcon, { name: "public" })
				]
			})] })]
		}), !hideOptions && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: "facebook-preview__post-header-more" })]
	});
};
//#endregion
//#region src/facebook-preview/link-preview.tsx
const FacebookLinkPreview = ({ url, title, description, image, imageFocalPoint, user, customText, type, imageMode, compactDescription }) => {
	const [mode, isLoadingImage, imgProps] = useImage({ mode: imageMode });
	const isArticle = type === TYPE_ARTICLE;
	const modeClass = `is-${isArticle && !image || mode === "portrait" ? "portrait" : "landscape"}`;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "facebook-preview__post",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostHeader, { user }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "facebook-preview__content",
				children: [customText && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CustomText, {
					text: customText,
					url
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `facebook-preview__body ${modeClass} ${image && isLoadingImage ? "is-loading" : ""}`,
					children: [(image || isArticle) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: `facebook-preview__image ${image ? "" : "is-empty"} ${modeClass}`,
						children: image && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
							src: image,
							focalPoint: imageFocalPoint,
							...imgProps
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "facebook-preview__text",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "facebook-preview__text-wrapper",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "facebook-preview__url",
									children: baseDomain(url)
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "facebook-preview__title",
									children: facebookTitle(title) || baseDomain(url)
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: `facebook-preview__description ${compactDescription ? "is-compact" : ""}`,
									children: [description && facebookDescription(description), isArticle && !description && (0, _wordpress_i18n.__)("Visit the post for more.", "social-previews")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "facebook-preview__info",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostIcon, { name: "info" })
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostActions, {})
		]
	});
};
//#endregion
//#region src/facebook-preview/link-preview-details.tsx
const LinkPreviewDetails = ({ url, customImage, imageFocalPoint, user, customText, imageMode }) => {
	const [mode, isLoadingImage, imgProps] = useImage({ mode: imageMode });
	const modeClass = `is-${mode === "portrait" ? "portrait" : "landscape"}`;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "facebook-preview__post",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostHeader, { user: void 0 }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "facebook-preview__content",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `facebook-preview__window ${modeClass} ${customImage && isLoadingImage ? "is-loading" : ""}`,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: `facebook-preview__custom-image ${modeClass}`,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
								src: customImage,
								focalPoint: imageFocalPoint,
								...imgProps
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostHeader, {
							user,
							timeElapsed: true,
							hideOptions: true
						}),
						customText && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CustomText, {
							text: customText,
							url,
							forceUrlDisplay: true
						})
					]
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostActions, {})
		]
	});
};
//#endregion
//#region src/facebook-preview/post-preview.tsx
const FacebookPostPreview = ({ url, user, customText, media, imageMode }) => {
	const [mode] = useImage({ mode: imageMode });
	const modeClass = `is-${mode === "portrait" ? "portrait" : "landscape"}`;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "facebook-preview__post",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostHeader, { user }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "facebook-preview__content",
				children: [customText && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CustomText, {
					text: customText,
					url
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "facebook-preview__body",
					children: media ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: `facebook-preview__media ${modeClass}`,
						children: media.map((mediaItem, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: `facebook-preview__media-item ${modeClass}`,
							children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
								controls: true,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("source", {
									src: mediaItem.url,
									type: mediaItem.type
								})
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
								alt: mediaItem.alt || "",
								src: mediaItem.url
							})
						}, `facebook-preview__media-item-${index}`))
					}) : null
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostActions, {})
		]
	});
};
//#endregion
//#region src/facebook-preview/previews.tsx
const FacebookPreviews = ({ headingLevel, hideLinkPreview, hidePostPreview, ...props }) => {
	const hasMedia = !!props.media?.length;
	const hasCustomImage = !!props.customImage;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "social-preview facebook-preview",
		children: [!hidePostPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section facebook-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Your post", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what your social post will look like on Facebook:", "social-previews")
				}),
				hasMedia ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookPostPreview, { ...props }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookLinkPreview, { ...props })
			]
		}), !hideLinkPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section facebook-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Link preview", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what it will look like when someone shares the link to your WordPress post on Facebook.", "social-previews")
				}),
				hasCustomImage ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(LinkPreviewDetails, { ...props }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FacebookLinkPreview, {
					...props,
					compactDescription: true,
					customText: "",
					user: void 0
				})
			]
		})]
	});
};
//#endregion
//#region src/mastodon-preview/post/actions/index.tsx
const MastodonPostActions = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
	className: "mastodon-preview__post-actions",
	children: [
		/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				height: "24",
				viewBox: "0 -960 960 960",
				width: "24",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z" })
			}),
			"\xA0",
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: 0 })
		] }),
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			height: "24",
			viewBox: "0 -960 960 960",
			width: "24",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z" })
		}) }),
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			height: "24",
			viewBox: "0 -960 960 960",
			width: "24",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" })
		}) }),
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			height: "24",
			viewBox: "0 -960 960 960",
			width: "24",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" })
		}) }),
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			height: "24",
			viewBox: "0 -960 960 960",
			width: "24",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" })
		}) })
	]
});
//#endregion
//#region src/mastodon-preview/helpers.ts
const TITLE_LENGTH$2 = 200;
const BODY_LENGTH$1 = 500;
const ADDRESS_PATTERN = /^@([^@]*)@([^@]*)$/i;
const mastodonTitle = (text) => firstValid(shortEnough(TITLE_LENGTH$2), hardTruncation(TITLE_LENGTH$2))(stripHtmlTags(text)) || "";
const mastodonBody = (text, options) => {
	const { instance, offset } = options;
	return preparePreviewText(text, {
		platform: "mastodon",
		maxChars: BODY_LENGTH$1 - offset,
		hashtagDomain: instance
	});
};
const getMastodonAddressDetails = (address) => {
	const matches = address.match(ADDRESS_PATTERN);
	return {
		username: matches?.[1] || "",
		instance: matches?.[2] || "mastodon.social"
	};
};
//#endregion
//#region src/mastodon-preview/post/card/index.tsx
const MastodonPostCard = ({ siteName, title, description, url, image, customImage, imageFocalPoint }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: (0, clsx.default)("mastodon-preview__card", { "has-image": image }),
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "mastodon-preview__card-img",
			children: image || customImage ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
				src: image || customImage,
				alt: (0, _wordpress_i18n.__)("Mastodon preview thumbnail", "social-previews"),
				focalPoint: imageFocalPoint
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "mastodon-preview__card-img--fallback",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					xmlns: "http://www.w3.org/2000/svg",
					height: "24",
					viewBox: "0 -960 960 960",
					width: "24",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520h200L520-800v200Z" })
				})
			})
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "mastodon-preview__card-text",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "mastodon-preview__card-site",
					children: siteName || baseDomain(url)
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "mastodon-preview__card-title",
					children: mastodonTitle(title) || getTitleFromDescription(description)
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "mastodon-preview__card-description",
					children: stripHtmlTags(description)
				})
			]
		})]
	});
};
//#endregion
//#region src/mastodon-preview/post/icons/index.tsx
/**
* Globe Icon Component
*
* @return The Globe SVG icon component.
*/
function GlobeIcon$1() {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		height: "15",
		viewBox: "0 -960 960 960",
		width: "15",
		role: "img",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" })
	});
}
//#endregion
//#region src/mastodon-preview/post/header/index.tsx
const MastodonPostHeader = ({ user }) => {
	const { displayName, address, avatarUrl } = user || {};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "mastodon-preview__post-header",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "mastodon-preview__post-header-user",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(AvatarWithFallback, {
				className: "mastodon-preview__post-avatar",
				src: avatarUrl
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "mastodon-preview__post-header-displayname",
				children: displayName || (0, _wordpress_i18n.__)("anonymous-user", "social-previews")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "mastodon-preview__post-header-username",
				children: address?.replace(`@mastodon.social`, "") || "@username"
			})] })]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "mastodon-preview__post-header-audience",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GlobeIcon$1, {}), formatMastodonDate(/* @__PURE__ */ new Date())]
		})]
	});
};
//#endregion
//#region src/mastodon-preview/link-preview.tsx
const MastodonLinkPreview = (props) => {
	const { user } = props;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "mastodon-preview__post",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MastodonPostHeader, { user }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MastodonPostCard, {
				...props,
				customImage: ""
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MastodonPostActions, {})
		]
	});
};
//#endregion
//#region src/mastodon-preview/post/body/index.tsx
const MastonPostBody = (props) => {
	const { title, description, customText, user, children } = props;
	const options = {
		instance: user?.address ? getMastodonAddressDetails(user.address).instance : "",
		offset: 0
	};
	let bodyTxt;
	if (customText) bodyTxt = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandableText, {
		text: customText,
		children: (visibleText) => mastodonBody(visibleText, options)
	}) });
	else if (description) if (title) {
		const renderedTitle = stripHtmlTags(title);
		options.offset = renderedTitle.length;
		bodyTxt = /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: renderedTitle }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandableText, {
			text: description,
			children: (visibleText) => mastodonBody(visibleText, options)
		}) })] });
	} else bodyTxt = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandableText, {
		text: description,
		children: (visibleText) => mastodonBody(visibleText, options)
	}) });
	else bodyTxt = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: mastodonBody(title, options) });
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "mastodon-preview__body",
		children: [bodyTxt, children]
	});
};
//#endregion
//#region src/mastodon-preview/post-preview.tsx
const MastodonPostPreview = (props) => {
	const { user, media } = props;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "mastodon-preview__post",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MastodonPostHeader, { user }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MastonPostBody, {
				...props,
				children: media?.length ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: (0, clsx.default)("mastodon-preview__media", { "as-grid": media.length > 1 }),
					children: media.map((mediaItem, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "mastodon-preview__media-item",
						children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
							controls: true,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("source", {
								src: mediaItem.url,
								type: mediaItem.type
							})
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
							alt: mediaItem.alt || "",
							src: mediaItem.url
						})
					}, `mastodon-preview__media-item-${index}`))
				}) : null
			}),
			!media?.length && props.customText?.includes(props.url) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MastodonPostCard, { ...props }) : null,
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MastodonPostActions, {})
		]
	});
};
//#endregion
//#region src/mastodon-preview/previews.tsx
const MastodonPreviews = ({ headingLevel, hidePostPreview, hideLinkPreview, ...props }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "social-preview mastodon-preview",
		children: [!hidePostPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section mastodon-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Your post", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what your social post will look like on Mastodon:", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MastodonPostPreview, { ...props })
			]
		}), !hideLinkPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section mastodon-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Link preview", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what it will look like when someone shares the link to your WordPress post on Mastodon.", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MastodonLinkPreview, {
					...props,
					user: void 0
				})
			]
		})]
	});
};
//#endregion
//#region src/nextdoor-preview/constants.ts
const FEED_TEXT_MAX_LENGTH$1 = 65e3;
//#endregion
//#region src/nextdoor-preview/icons/comment-icon.tsx
/**
* Comment Icon Component
*
* @return The Comment SVG icon component.
*/
function CommentIcon() {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		width: "20",
		height: "20",
		fill: "none",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			fillRule: "evenodd",
			d: "M2 10.031C2 5.596 5.574 2 10 2h4c4.427 0 8 3.596 8 8.031 0 4.435-3.573 8.031-8 8.031h-1.52a17.033 17.033 0 0 1-1.377 1.467c-.991.938-2.456 2.079-4.086 2.437a1.403 1.403 0 0 1-1.458-.565 1.55 1.55 0 0 1-.195-1.394c.28-.823.395-1.734.434-2.464.014-.257.018-.485.018-.672A8.017 8.017 0 0 1 2 10.031Zm5.798 6.178a7.02 7.02 0 0 1 .016.418c.005.252.004.606-.019 1.023-.03.573-.103 1.285-.266 2.024.775-.377 1.54-.974 2.202-1.598a15.066 15.066 0 0 0 1.448-1.586l.017-.022.003-.004a1 1 0 0 1 .801-.402h2c3.314 0 6-2.692 6-6.03C20 6.691 17.314 4 14 4h-4c-3.314 0-6 2.692-6 6.031 0 2.336 1.32 4.36 3.258 5.359.308.159.515.474.54.82Z",
			clipRule: "evenodd"
		})
	});
}
//#endregion
//#region src/nextdoor-preview/icons/like-icon.tsx
/**
* Like Icon component.
*
* @return Like Icon component.
*/
function LikeIcon() {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		width: "20",
		height: "20",
		fill: "none",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			fillRule: "evenodd",
			d: "M13.275 8.752a1.5 1.5 0 0 1-2.55 0C9.75 7.18 8.719 5.617 6.565 6.074 5.248 6.352 4 7.433 4 9.644c0 2.153 1.348 4.592 4.259 7.236A28.475 28.475 0 0 0 12 19.74a28.475 28.475 0 0 0 3.741-2.86C18.651 14.236 20 11.797 20 9.643c0-2.21-1.25-3.29-2.564-3.57-2.155-.456-3.187 1.106-4.16 2.68Zm-2.581-3.48C7.634 2.58 2 4.217 2 9.643c0 2.996 1.85 5.934 4.914 8.717 1.478 1.343 3.1 2.585 4.839 3.575a.5.5 0 0 0 .494 0c1.739-.99 3.361-2.232 4.84-3.575C20.148 15.577 22 12.64 22 9.643c0-5.426-5.634-7.062-8.694-4.371A5.287 5.287 0 0 0 12 7.04a5.287 5.287 0 0 0-1.306-1.77Z",
			clipRule: "evenodd"
		})
	});
}
//#endregion
//#region src/nextdoor-preview/icons/share-icon.tsx
/**
* Share Icon Component
*
* @return The Share SVG icon component.
*/
function ShareIcon() {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		width: "20",
		height: "20",
		fill: "none",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			fillRule: "evenodd",
			d: "M11.617 2.076a1 1 0 0 1 1.09.217l9 9a1 1 0 0 1 0 1.414l-9 9A1 1 0 0 1 11 21v-4.436c-2.849.366-5.261 2.271-6.384 4.837a1 1 0 0 1-1.856-.06C2.338 20.182 2 18.86 2 17.5a9.959 9.959 0 0 1 9-9.951V3a1 1 0 0 1 .617-.924ZM13 5.414V8.5a1 1 0 0 1-1 1c-4.448 0-8 3.552-8 8 0 .31.023.625.066.94C5.905 16.067 8.776 14.5 12 14.5a1 1 0 0 1 1 1v3.086L19.586 12 13 5.414Z",
			clipRule: "evenodd"
		})
	});
}
//#endregion
//#region src/nextdoor-preview/footer-actions.tsx
/**
* Footer Actions Component
*
* @return The Nextdoor footer actions component.
*/
function FooterActions() {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "nextdoor-preview__footer--actions",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "nextdoor-preview__footer--actions-item",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(LikeIcon, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: (0, _wordpress_i18n.__)("Like", "social-previews") })]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "nextdoor-preview__footer--actions-item",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CommentIcon, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: (0, _wordpress_i18n.__)("Comment", "social-previews") })]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "nextdoor-preview__footer--actions-item",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ShareIcon, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: (0, _wordpress_i18n.__)("Share", "social-previews") })]
			})
		]
	});
}
//#endregion
//#region src/nextdoor-preview/icons/chevron-icon.tsx
/**
* Chevron Icon Component
*
* @return The Chevron SVG icon component.
*/
function ChevronIcon() {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		width: "20",
		height: "20",
		viewBox: "0 0 20 20",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			fill: "#dfe1e4",
			fillRule: "evenodd",
			d: "M7.127 13.876a.732.732 0 1 0 1.035 1.035l4.75-4.749a.732.732 0 0 0 0-1.035L8.123 4.34A.732.732 0 0 0 7.09 5.375l4.27 4.27-4.232 4.23Z"
		})
	});
}
//#endregion
//#region src/nextdoor-preview/icons/default-image.tsx
/**
* Default Image Icon Component
*
* @return The Default Image SVG icon component.
*/
function DefaultImage() {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "nextdoor-preview__default-image",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			width: "24",
			height: "24",
			fill: "none",
			viewBox: "0 0 24 24",
			"aria-hidden": "true",
			color: "#055c00",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M13.207 5.207c1.51-1.51 4.076-1.51 5.586 0 1.51 1.51 1.51 4.076 0 5.586l-2.1 2.1c-1.51 1.51-4.077 1.51-5.586 0a1 1 0 1 0-1.414 1.414c2.29 2.29 6.123 2.29 8.414 0l2.1-2.1c2.29-2.29 2.29-6.124 0-8.414s-6.124-2.29-8.414 0l-.7.7a1 1 0 0 0 1.414 1.414l.7-.7Z"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M7.307 11.107c1.51-1.51 4.076-1.51 5.586 0a1 1 0 0 0 1.414-1.414c-2.29-2.29-6.124-2.29-8.414 0l-2.1 2.1c-2.29 2.29-2.29 6.123 0 8.414 2.29 2.29 6.124 2.29 8.414 0l.7-.7a1 1 0 0 0-1.414-1.414l-.7.7c-1.51 1.51-4.076 1.51-5.586 0-1.51-1.51-1.51-4.076 0-5.586l2.1-2.1Z"
			})]
		})
	});
}
//#endregion
//#region src/nextdoor-preview/icons/globe-icon.tsx
/**
* Globe Icon Component
*
* @return The Globe SVG icon component.
*/
function GlobeIcon() {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		width: "14",
		height: "14",
		fill: "none",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			fillRule: "evenodd",
			d: "M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.495-7.643c.286-.335.46-.357.505-.357.045 0 .219.022.505.357.282.33.581.868.852 1.619.464 1.283.79 3.034.872 5.024H9.771c.082-1.99.408-3.741.871-5.024.272-.751.571-1.289.854-1.62ZM7.77 11c.084-2.181.439-4.171.992-5.704.093-.255.192-.502.298-.738A8.009 8.009 0 0 0 4.062 11h3.707Zm-3.707 2h3.707c.084 2.181.439 4.171.992 5.704.093.255.192.502.298.738A8.009 8.009 0 0 1 4.062 13Zm15.876-2a8.009 8.009 0 0 0-4.997-6.442c.106.236.205.483.298.738.553 1.533.908 3.523.992 5.704h3.707Zm-3.707 2h3.707a8.009 8.009 0 0 1-4.997 6.442c.106-.236.205-.483.298-.738.553-1.533.908-3.523.992-5.704Zm-2.002 0c-.082 1.99-.408 3.741-.871 5.024-.272.751-.571 1.289-.854 1.62-.285.334-.46.356-.504.356-.045 0-.219-.022-.505-.357-.282-.33-.581-.868-.852-1.619-.464-1.283-.79-3.034-.872-5.024h4.458Z",
			clipRule: "evenodd"
		})
	});
}
//#endregion
//#region src/nextdoor-preview/post-preview.tsx
/**
* Nextdoor Post Preview Component.
*
* @param {NextdoorPreviewProps} props - The preview properties.
* @return The Nextdoor post preview component.
*/
function NextdoorPostPreview({ image, imageFocalPoint, name, profileImage, description, neighborhood, media, title, url }) {
	const hasMedia = !!media?.length;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "nextdoor-preview__wrapper",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("section", {
			className: `nextdoor-preview__container ${hasMedia ? "has-media" : ""}`,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "nextdoor-preview__content",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "nextdoor-preview__header",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "nextdoor-preview__header--avatar",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AvatarWithFallback, { src: profileImage })
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "nextdoor-preview__header--details",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "nextdoor-preview__header--name",
								children: name || (0, _wordpress_i18n.__)("Account Name", "social-previews")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "nextdoor-preview__header--meta",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: neighborhood || (0, _wordpress_i18n.__)("Neighborhood", "social-previews") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "•" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: formatNextdoorDate(Date.now()) }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "•" }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GlobeIcon, {})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "nextdoor-preview__body",
						children: [
							description ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "nextdoor-preview__caption",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandableText, {
									text: description,
									children: (visibleText) => preparePreviewText(visibleText, {
										platform: "nextdoor",
										maxChars: FEED_TEXT_MAX_LENGTH$1
									})
								}) })
							}) : null,
							hasMedia ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "nextdoor-preview__media",
								children: media.map((mediaItem, index) => {
									return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "nextdoor-preview__media-item",
										children: mediaItem?.type?.startsWith("video/") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
											controls: true,
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("source", {
												src: mediaItem.url,
												type: mediaItem.type
											})
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
											alt: mediaItem.alt || "",
											src: mediaItem.url
										})
									}, `nextdoor-preview__media-item-${index}`);
								})
							}) : null,
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
								className: (0, clsx.default)("nextdoor-preview__card", { "small-preview": !image || hasMedia }),
								children: [
									image ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
										className: "nextdoor-preview__image",
										src: image,
										alt: "",
										focalPoint: imageFocalPoint
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DefaultImage, {}),
									url ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: "nextdoor-preview__description",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
											className: "nextdoor-preview__description--title",
											children: title || getTitleFromDescription(description)
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: "nextdoor-preview__description--url",
											children: baseDomain(url)
										})]
									}) : null,
									hasMedia ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: "nextdoor-preview__card--chevron-wrapper",
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChevronIcon, {})
									}) : null
								]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "nextdoor-preview__footer",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FooterActions, {})
					})
				]
			})
		})
	});
}
//#endregion
//#region src/nextdoor-preview/link-preview.tsx
/**
* Nextdoor Link Preview Component
*
* @param {NextdoorLinkPreviewProps} props - The props for the Nextdoor link preview.
*
* @return The Nextdoor link preview component.
*/
function NextdoorLinkPreview(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(NextdoorPostPreview, {
		name: "",
		profileImage: "",
		...props,
		description: "",
		media: void 0,
		title: props.title || getTitleFromDescription(props.description)
	});
}
//#endregion
//#region src/nextdoor-preview/previews.tsx
const NextdoorPreviews = ({ headingLevel, hideLinkPreview, hidePostPreview, ...props }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "social-preview nextdoor-preview",
		children: [!hidePostPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section nextdoor-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Your post", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what your social post will look like on Nextdoor:", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NextdoorPostPreview, { ...props })
			]
		}), !hideLinkPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section nextdoor-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Link preview", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what it will look like when someone shares the link to your WordPress post on Nextdoor.", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NextdoorLinkPreview, {
					...props,
					name: "",
					profileImage: ""
				})
			]
		})]
	});
};
//#endregion
//#region src/bluesky-preview/post/actions/index.tsx
const BlueskyPostActions = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
	className: "bluesky-preview__post-actions",
	children: [
		/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			fill: "none",
			width: "18",
			viewBox: "0 0 24 24",
			height: "18",
			style: { color: "rgb(111, 134, 159)" },
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				fill: "hsl(211, 20%, 53%)",
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z"
			})
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: 0 })] }),
		/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			fill: "none",
			width: "18",
			viewBox: "0 0 24 24",
			height: "18",
			style: { color: "rgb(111, 134, 159)" },
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				fill: "hsl(211, 20%, 53%)",
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z"
			})
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: 0 })] }),
		/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			fill: "none",
			width: "18",
			viewBox: "0 0 24 24",
			height: "18",
			style: { color: "rgb(111, 134, 159)" },
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				fill: "hsl(211, 20%, 53%)",
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M16.734 5.091c-1.238-.276-2.708.047-4.022 1.38a1 1 0 0 1-1.424 0C9.974 5.137 8.504 4.814 7.266 5.09c-1.263.282-2.379 1.206-2.92 2.556C3.33 10.18 4.252 14.84 12 19.348c7.747-4.508 8.67-9.168 7.654-11.7-.541-1.351-1.657-2.275-2.92-2.557Zm4.777 1.812c1.604 4-.494 9.69-9.022 14.47a1 1 0 0 1-.978 0C2.983 16.592.885 10.902 2.49 6.902c.779-1.942 2.414-3.334 4.342-3.764 1.697-.378 3.552.003 5.169 1.286 1.617-1.283 3.472-1.664 5.17-1.286 1.927.43 3.562 1.822 4.34 3.764Z"
			})
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: 0 })] }),
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			fill: "none",
			viewBox: "0 0 24 24",
			width: "20",
			height: "20",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				fill: "hsl(211, 20%, 53%)",
				fillRule: "evenodd",
				clipRule: "evenodd",
				d: "M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm16 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
			})
		}) })
	]
});
//#endregion
//#region src/bluesky-preview/helpers.ts
const TITLE_LENGTH$1 = 200;
const BODY_LENGTH = 300;
const URL_LENGTH = 40;
const blueskyTitle = (text) => firstValid(shortEnough(TITLE_LENGTH$1), hardTruncation(TITLE_LENGTH$1))(stripHtmlTags(text)) || "";
const blueskyBody = (text, options = {}) => {
	const { offset = 0, reserveUrlSpace = true, hyperlinks } = options;
	return preparePreviewText(text, {
		platform: "bluesky",
		maxChars: BODY_LENGTH - (reserveUrlSpace ? URL_LENGTH : 0) - offset,
		hyperlinks
	});
};
const blueskyUrl = (text) => firstValid(shortEnough(URL_LENGTH), hardTruncation(URL_LENGTH))(stripHtmlTags(text)) || "";
//#endregion
//#region src/bluesky-preview/post/body/index.tsx
const BlueskyPostBody = ({ customText, url, children, appendUrl, hyperlinks }) => {
	const showUrl = appendUrl && !!url && !customText?.includes(url);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "bluesky-preview__body",
		children: [customText ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: blueskyBody(customText, {
			reserveUrlSpace: showUrl,
			hyperlinks
		}) }), showUrl ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("br", {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
			href: url,
			target: "_blank",
			rel: "noreferrer noopener",
			children: blueskyUrl(url.replace(/^https?:\/\//, ""))
		})] }) : null] }) : null, children]
	});
};
//#endregion
//#region src/bluesky-preview/post/card/index.tsx
const BlueskyPostCard = ({ title, description, url, image, imageFocalPoint }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "bluesky-preview__card",
		children: [image ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "bluesky-preview__card-image",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
				src: image,
				alt: "",
				focalPoint: imageFocalPoint
			})
		}) : null, /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "bluesky-preview__card-text",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "bluesky-preview__card-site",
					children: baseDomain(url)
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "bluesky-preview__card-title",
					children: blueskyTitle(title) || getTitleFromDescription(description)
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "bluesky-preview__card-description",
					children: stripHtmlTags(description)
				})
			]
		})]
	});
};
//#endregion
//#region src/bluesky-preview/post/header/index.tsx
const BlueskyPostHeader = ({ user }) => {
	const { displayName, address } = user || {};
	let handle = address || "username.bsky.social";
	if (!handle.startsWith("@")) handle = "@" + handle;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "bluesky-preview__post-header",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "bluesky-preview__post-header-user",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "bluesky-preview__post-header--displayname",
					children: displayName || (0, _wordpress_i18n.__)("Account name", "social-previews")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "bluesky-preview__post-header--username",
					children: handle
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "bluesky-preview__post-header--separator",
				children: "·"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "bluesky-preview__post-header--date",
				children: (0, _wordpress_i18n._x)("1h", "refers to the time since the post was published, e.g. \"1h\"", "social-previews")
			})
		]
	});
};
//#endregion
//#region src/bluesky-preview/post/sidebar/index.tsx
const BlueskyPostSidebar = ({ user }) => {
	const { avatarUrl } = user || {};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "bluesky-preview__post-sidebar",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "bluesky-preview__post-sidebar-user",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AvatarWithFallback, {
				className: "bluesky-preview__post-avatar",
				src: avatarUrl
			})
		})
	});
};
//#endregion
//#region src/bluesky-preview/post-preview.tsx
const BlueskyPostPreview = (props) => {
	const { user, media } = props;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "bluesky-preview__post",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BlueskyPostSidebar, { user }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BlueskyPostHeader, { user }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BlueskyPostBody, {
				...props,
				children: media?.length ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: (0, clsx.default)("bluesky-preview__media", { "as-grid": media.length > 1 }),
					children: media.map((mediaItem, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "bluesky-preview__media-item",
						children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
							controls: true,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("source", {
								src: mediaItem.url,
								type: mediaItem.type
							})
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
							alt: mediaItem.alt || "",
							src: mediaItem.url
						})
					}, `bluesky-preview__media-item-${index}`))
				}) : null
			}),
			!media?.length ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BlueskyPostCard, { ...props }) : null,
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BlueskyPostActions, {})
		] })]
	});
};
//#endregion
//#region src/bluesky-preview/link-preview.tsx
const BlueskyLinkPreview = (props) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BlueskyPostPreview, {
		...props,
		user: void 0,
		media: void 0,
		customText: ""
	});
};
//#endregion
//#region src/bluesky-preview/previews.tsx
const BlueskyPreviews = ({ headingLevel, hidePostPreview, hideLinkPreview, ...props }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "social-preview bluesky-preview",
		children: [!hidePostPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section bluesky-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Your post", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what your social post will look like on Bluesky:", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BlueskyPostPreview, { ...props })
			]
		}), !hideLinkPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section bluesky-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Link preview", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what it will look like when someone shares the link to your WordPress post on Bluesky.", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BlueskyLinkPreview, { ...props })
			]
		})]
	});
};
//#endregion
//#region src/threads-preview/helpers.ts
const TITLE_LENGTH = 120;
const threadsTitle = (text) => firstValid(shortEnough(TITLE_LENGTH), hardTruncation(TITLE_LENGTH))(stripHtmlTags(text)) || "";
//#endregion
//#region src/threads-preview/card.tsx
const Card = ({ image, imageFocalPoint, title, url }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "threads-preview__card",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: (0, clsx.default)({ "threads-preview__card-has-image": !!image }),
			children: [image && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
				className: "threads-preview__card-image",
				src: image,
				alt: "",
				focalPoint: imageFocalPoint
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "threads-preview__card-body",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "threads-preview__card-url",
					children: baseDomain(url || "")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "threads-preview__card-title",
					children: threadsTitle(title)
				})]
			})]
		})
	});
};
//#endregion
//#region src/threads-preview/footer.tsx
const Footer = () => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "threads-preview__footer",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "threads-preview__icon--like",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					role: "img",
					viewBox: "0 0 18 18",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M1.34375 7.53125L1.34375 7.54043C1.34374 8.04211 1.34372 8.76295 1.6611 9.65585C1.9795 10.5516 2.60026 11.5779 3.77681 12.7544C5.59273 14.5704 7.58105 16.0215 8.33387 16.5497C8.73525 16.8313 9.26573 16.8313 9.66705 16.5496C10.4197 16.0213 12.4074 14.5703 14.2232 12.7544C15.3997 11.5779 16.0205 10.5516 16.3389 9.65585C16.6563 8.76296 16.6563 8.04211 16.6562 7.54043V7.53125C16.6562 5.23466 15.0849 3.25 12.6562 3.25C11.5214 3.25 10.6433 3.78244 9.99228 4.45476C9.59009 4.87012 9.26356 5.3491 9 5.81533C8.73645 5.3491 8.40991 4.87012 8.00772 4.45476C7.35672 3.78244 6.47861 3.25 5.34375 3.25C2.9151 3.25 1.34375 5.23466 1.34375 7.53125Z",
						strokeWidth: "1.25"
					})
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "threads-preview__icon--reply",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
					role: "img",
					viewBox: "0 0 18 18",
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M15.376 13.2177L16.2861 16.7955L12.7106 15.8848C12.6781 15.8848 12.6131 15.8848 12.5806 15.8848C11.3779 16.5678 9.94767 16.8931 8.41995 16.7955C4.94194 16.5353 2.08152 13.7381 1.72397 10.2578C1.2689 5.63919 5.13697 1.76863 9.75264 2.22399C13.2307 2.58177 16.0261 5.41151 16.2861 8.92429C16.4161 10.453 16.0586 11.8841 15.376 13.0876C15.376 13.1526 15.376 13.1852 15.376 13.2177Z",
						strokeLinejoin: "round",
						strokeWidth: "1.25"
					})
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "threads-preview__icon--repost",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					role: "img",
					viewBox: "0 0 18 18",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M6.41256 1.23531C6.6349 0.971277 7.02918 0.937481 7.29321 1.15982L9.96509 3.40982C10.1022 3.52528 10.1831 3.69404 10.1873 3.87324C10.1915 4.05243 10.1186 4.2248 9.98706 4.34656L7.31518 6.81971C7.06186 7.05419 6.66643 7.03892 6.43196 6.7856C6.19748 6.53228 6.21275 6.13685 6.46607 5.90237L7.9672 4.51289H5.20312C3.68434 4.51289 2.45312 5.74411 2.45312 7.26289V9.51289V11.7629C2.45312 13.2817 3.68434 14.5129 5.20312 14.5129C5.5483 14.5129 5.82812 14.7927 5.82812 15.1379C5.82812 15.4831 5.5483 15.7629 5.20312 15.7629C2.99399 15.7629 1.20312 13.972 1.20312 11.7629V9.51289V7.26289C1.20312 5.05375 2.99399 3.26289 5.20312 3.26289H7.85002L6.48804 2.11596C6.22401 1.89362 6.19021 1.49934 6.41256 1.23531Z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M11.5874 17.7904C11.3651 18.0545 10.9708 18.0883 10.7068 17.8659L8.03491 15.6159C7.89781 15.5005 7.81687 15.3317 7.81267 15.1525C7.80847 14.9733 7.8814 14.801 8.01294 14.6792L10.6848 12.206C10.9381 11.9716 11.3336 11.9868 11.568 12.2402C11.8025 12.4935 11.7872 12.8889 11.5339 13.1234L10.0328 14.5129H12.7969C14.3157 14.5129 15.5469 13.2816 15.5469 11.7629V9.51286V7.26286C15.5469 5.74408 14.3157 4.51286 12.7969 4.51286C12.4517 4.51286 12.1719 4.23304 12.1719 3.88786C12.1719 3.54269 12.4517 3.26286 12.7969 3.26286C15.006 3.26286 16.7969 5.05373 16.7969 7.26286V9.51286V11.7629C16.7969 13.972 15.006 15.7629 12.7969 15.7629H10.15L11.512 16.9098C11.776 17.1321 11.8098 17.5264 11.5874 17.7904Z" })]
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: "threads-preview__icon--share",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
					role: "img",
					viewBox: "0 0 18 18",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M15.6097 4.09082L6.65039 9.11104",
						strokeLinejoin: "round",
						strokeWidth: "1.25"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M7.79128 14.439C8.00463 15.3275 8.11131 15.7718 8.33426 15.932C8.52764 16.071 8.77617 16.1081 9.00173 16.0318C9.26179 15.9438 9.49373 15.5501 9.95761 14.7628L15.5444 5.2809C15.8883 4.69727 16.0603 4.40546 16.0365 4.16566C16.0159 3.95653 15.9071 3.76612 15.7374 3.64215C15.5428 3.5 15.2041 3.5 14.5267 3.5H3.71404C2.81451 3.5 2.36474 3.5 2.15744 3.67754C1.97758 3.83158 1.88253 4.06254 1.90186 4.29856C1.92415 4.57059 2.24363 4.88716 2.88259 5.52032L6.11593 8.7243C6.26394 8.87097 6.33795 8.94431 6.39784 9.02755C6.451 9.10144 6.4958 9.18101 6.53142 9.26479C6.57153 9.35916 6.59586 9.46047 6.64451 9.66309L7.79128 14.439Z",
						strokeLinejoin: "round",
						strokeWidth: "1.25"
					})]
				})
			})
		]
	});
};
//#endregion
//#region src/threads-preview/header.tsx
const Header = ({ name, date }) => {
	const postDate = date || /* @__PURE__ */ new Date();
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "threads-preview__header",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: "threads-preview__name",
			children: name || (0, _wordpress_i18n.__)("Account Name", "social-previews")
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("time", {
			className: "threads-preview__date",
			dateTime: postDate.toISOString(),
			children: formatThreadsDate(postDate)
		})]
	});
};
//#endregion
//#region src/threads-preview/media.tsx
const Media = ({ media }) => {
	const filteredMedia = media.filter((mediaItem) => mediaItem.type.startsWith("image/") || mediaItem.type.startsWith("video/")).filter((mediaItem, idx, array) => {
		if (0 === idx) return true;
		if (array[0].type.startsWith("video/") || "image/gif" === array[0].type) return false;
		if (mediaItem.type.startsWith("video/") || "image/gif" === mediaItem.type) return false;
		return true;
	}).slice(0, 4);
	if (0 === filteredMedia.length) return null;
	const isVideo = filteredMedia[0].type.startsWith("video/");
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: (0, clsx.default)(["threads-preview__media", "threads-preview__media-children-" + filteredMedia.length]),
		children: filteredMedia.map((mediaItem, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react.Fragment, { children: isVideo ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
			controls: true,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("source", {
				src: mediaItem.url,
				type: mediaItem.type
			})
		}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
			alt: mediaItem.alt || "",
			src: mediaItem.url
		}) }, `threads-preview__media-item-${index}`))
	});
};
//#endregion
//#region src/threads-preview/sidebar.tsx
const Sidebar = ({ profileImage, showThreadConnector }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "threads-preview__sidebar",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: "threads-preview__profile-image",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AvatarWithFallback, {
				alt: (0, _wordpress_i18n.__)("Threads profile image", "social-previews"),
				src: profileImage
			})
		}), showThreadConnector && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: "threads-preview__connector" })]
	});
};
//#endregion
//#region src/threads-preview/post-preview.tsx
const ThreadsPostPreview = ({ caption, date, image, imageFocalPoint, media, name, profileImage, showThreadConnector, title, url }) => {
	const hasMedia = !!media?.length;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "threads-preview__wrapper",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "threads-preview__container",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Sidebar, {
				profileImage,
				showThreadConnector
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "threads-preview__main",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Header, {
						name,
						date
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "threads-preview__content",
						children: [
							caption ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "threads-preview__text",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandableText, {
									text: caption,
									children: (visibleText) => preparePreviewText(visibleText, {
										platform: "threads",
										maxChars: 500
									})
								})
							}) : null,
							hasMedia ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Media, { media }) : null,
							url && image && !hasMedia ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Card, {
								image,
								imageFocalPoint,
								title: title || "",
								url
							}) : null
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Footer, {})
				]
			})]
		})
	});
};
//#endregion
//#region src/threads-preview/link-preview.tsx
const ThreadsLinkPreview = (props) => {
	if (!props.image) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
		className: "social-preview__section-desc",
		children: (0, _wordpress_i18n.__)("Threads link preview requires an image to be set for the post. Please add an image to see the preview.", "social-previews")
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ThreadsPostPreview, {
		...props,
		caption: "",
		media: void 0
	});
};
//#endregion
//#region src/threads-preview/previews.tsx
const ThreadsPreviews = ({ headingLevel, hideLinkPreview, hidePostPreview, posts }) => {
	if (!posts?.length) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: "social-preview threads-preview",
		children: [!hidePostPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section threads-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Your post", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what your social post will look like on Threads:", "social-previews")
				}),
				posts.map((post, index) => {
					const isLast = index + 1 === posts.length;
					return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ThreadsPostPreview, {
						...post,
						showThreadConnector: !isLast
					}, `threads-preview__post-${index}`);
				})
			]
		}), !hideLinkPreview ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section threads-preview__section",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
				level: headingLevel,
				children: (0, _wordpress_i18n.__)("Link preview", "social-previews")
			}), posts[0].image ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: "social-preview__section-desc",
				children: (0, _wordpress_i18n.__)("This is what it will look like when someone shares the link to your WordPress post on Threads.", "social-previews")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ThreadsLinkPreview, {
				...posts[0],
				name: "",
				profileImage: ""
			})] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: "social-preview__section-desc",
				children: (0, _wordpress_i18n.__)("Threads link preview requires an image to be set for the post. Please add an image to see the preview.", "social-previews")
			})]
		}) : null]
	});
};
//#endregion
//#region src/instagram-preview/constants.tsx
const FEED_TEXT_MAX_LENGTH = 2200;
//#endregion
//#region src/instagram-preview/icons/bookmark.tsx
const Bookmark = () => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		color: "rgb(38, 38, 38)",
		fill: "rgb(38, 38, 38)",
		height: "24",
		role: "img",
		viewBox: "0 0 24 24",
		width: "24",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("polygon", {
			fill: "none",
			points: "20 21 12 13.44 4 21 4 3 20 3 20 21",
			stroke: "currentColor",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			strokeWidth: "2"
		})
	});
};
//#endregion
//#region src/instagram-preview/icons/comment.tsx
const Comment = () => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		color: "rgb(38, 38, 38)",
		fill: "rgb(38, 38, 38)",
		height: "24",
		role: "img",
		viewBox: "0 0 24 24",
		width: "24",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
			d: "M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z",
			fill: "none",
			stroke: "currentColor",
			strokeLinejoin: "round",
			strokeWidth: "2"
		})
	});
};
//#endregion
//#region src/instagram-preview/icons/heart.tsx
const Heart = () => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
		color: "rgb(38, 38, 38)",
		fill: "rgb(38, 38, 38)",
		height: "24",
		role: "img",
		viewBox: "0 0 24 24",
		width: "24",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" })
	});
};
//#endregion
//#region src/instagram-preview/icons/menu.tsx
const Menu = () => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		width: "17",
		height: "5",
		viewBox: "0 0 17 5",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M2.11865 3.5C2.67094 3.5 3.11865 3.05228 3.11865 2.5C3.11865 1.94772 2.67094 1.5 2.11865 1.5C1.56637 1.5 1.11865 1.94772 1.11865 2.5C1.11865 3.05228 1.56637 3.5 2.11865 3.5Z",
				fill: "black",
				stroke: "black",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M8.55933 3.5C9.11161 3.5 9.55933 3.05228 9.55933 2.5C9.55933 1.94772 9.11161 1.5 8.55933 1.5C8.00704 1.5 7.55933 1.94772 7.55933 2.5C7.55933 3.05228 8.00704 3.5 8.55933 3.5Z",
				fill: "black",
				stroke: "black",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M15 3.5C15.5523 3.5 16 3.05228 16 2.5C16 1.94772 15.5523 1.5 15 1.5C14.4477 1.5 14 1.94772 14 2.5C14 3.05228 14.4477 3.5 15 3.5Z",
				fill: "black",
				stroke: "black",
				strokeWidth: "2"
			})
		]
	});
};
//#endregion
//#region src/instagram-preview/icons/share.tsx
const Share = () => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
		color: "rgb(38, 38, 38)",
		fill: "rgb(38, 38, 38)",
		height: "24",
		role: "img",
		viewBox: "0 0 24 24",
		width: "24",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("line", {
			fill: "none",
			stroke: "currentColor",
			strokeLinejoin: "round",
			strokeWidth: "2",
			x1: "22",
			x2: "9.218",
			y1: "3",
			y2: "10.083"
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("polygon", {
			fill: "none",
			points: "11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334",
			stroke: "currentColor",
			strokeLinejoin: "round",
			strokeWidth: "2"
		})]
	});
};
//#endregion
//#region src/instagram-preview/post-preview.tsx
/**
* Instagram Post Preview Component
*
* @param {InstagramPreviewProps} props - The props for the Instagram post preview.
*
* @return  The Instagram post preview component.
*/
function InstagramPostPreview({ image, imageFocalPoint, media, name, profileImage, caption }) {
	const username = name || "username";
	const mediaItem = media?.[0];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "instagram-preview__wrapper",
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "instagram-preview__container",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "instagram-preview__header",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "instagram-preview__header--avatar",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AvatarWithFallback, { src: profileImage })
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "instagram-preview__header--profile",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "instagram-preview__header--profile-name",
							children: username
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "instagram-preview__header--profile-menu",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Menu, {})
						})]
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "instagram-preview__media",
					children: mediaItem ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "instagram-preview__media-item",
						children: mediaItem.type.startsWith("video/") ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("video", {
							controls: false,
							className: "instagram-preview__media--video",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("source", {
								src: mediaItem.url,
								type: mediaItem.type
							})
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
							className: "instagram-preview__media--image",
							src: mediaItem.url,
							alt: ""
						})
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MediaImage, {
						className: "instagram-preview__media--image",
						src: image,
						alt: "",
						focalPoint: imageFocalPoint
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "instagram-preview__content",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: "instagram-preview__content--actions",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "instagram-preview__content--actions-primary",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Heart, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Comment, {}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Share, {})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "instagram-preview__content--actions-secondary",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Bookmark, {})
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "instagram-preview__content--body",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "instagram-preview__content--name",
									children: username
								}),
								"\xA0",
								caption ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: "instagram-preview__content--text",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExpandableText, {
										text: caption,
										children: (visibleText) => preparePreviewText(visibleText, {
											platform: "instagram",
											maxChars: FEED_TEXT_MAX_LENGTH
										})
									})
								}) : null
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "instagram-preview__content--footer",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: (0, _wordpress_i18n.__)("View one comment", "social-previews") })
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/instagram-preview/previews.tsx
const InstagramPreviews = ({ headingLevel, hidePostPreview, ...props }) => {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: "social-preview instagram-preview",
		children: !hidePostPreview && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
			className: "social-preview__section instagram-preview__section",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHeading, {
					level: headingLevel,
					children: (0, _wordpress_i18n.__)("Your post", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "social-preview__section-desc",
					children: (0, _wordpress_i18n.__)("This is what your social post will look like on Instagram:", "social-previews")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(InstagramPostPreview, { ...props })
			]
		})
	});
};
//#endregion
exports.AUTO_SHARED_LINK_PREVIEW = AUTO_SHARED_LINK_PREVIEW;
exports.AUTO_SHARED_SOCIAL_POST_PREVIEW = AUTO_SHARED_SOCIAL_POST_PREVIEW;
exports.BlueskyLinkPreview = BlueskyLinkPreview;
exports.BlueskyPostPreview = BlueskyPostPreview;
exports.BlueskyPreviews = BlueskyPreviews;
exports.DEFAULT_LINK_PREVIEW = DEFAULT_LINK_PREVIEW;
exports.FacebookLinkPreview = FacebookLinkPreview;
exports.FacebookPostPreview = FacebookPostPreview;
exports.FacebookPreviews = FacebookPreviews;
exports.GoogleSearchPreview = GoogleSearchPreview;
exports.InstagramPostPreview = InstagramPostPreview;
exports.InstagramPreviews = InstagramPreviews;
exports.LANDSCAPE_MODE = LANDSCAPE_MODE;
exports.LinkedInLinkPreview = LinkedInLinkPreview;
exports.LinkedInPostPreview = LinkedInPostPreview;
exports.LinkedInPreviews = LinkedInPreviews;
exports.MastodonLinkPreview = MastodonLinkPreview;
exports.MastodonPostPreview = MastodonPostPreview;
exports.MastodonPreviews = MastodonPreviews;
exports.NextdoorLinkPreview = NextdoorLinkPreview;
exports.NextdoorPostPreview = NextdoorPostPreview;
exports.NextdoorPreviews = NextdoorPreviews;
exports.PORTRAIT_MODE = PORTRAIT_MODE;
exports.TYPE_ARTICLE = TYPE_ARTICLE;
exports.TYPE_WEBSITE = TYPE_WEBSITE;
exports.ThreadsLinkPreview = ThreadsLinkPreview;
exports.ThreadsPostPreview = ThreadsPostPreview;
exports.ThreadsPreviews = ThreadsPreviews;
exports.TumblrLinkPreview = TumblrLinkPreview;
exports.TumblrPostPreview = TumblrPostPreview;
exports.TumblrPreviews = TumblrPreviews;
exports.TwitterLinkPreview = TwitterLinkPreview;
exports.TwitterPostPreview = TwitterPostPreview;
exports.TwitterPreviews = TwitterPreviews;
exports.parseHyperlinks = parseHyperlinks;

//# sourceMappingURL=index.cjs.map