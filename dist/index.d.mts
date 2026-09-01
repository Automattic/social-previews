//#region src/helpers.d.ts
/**
 * An editor hyperlink: the visible anchor text and the URL it points to.
 */
type Hyperlink = {
  text: string;
  href: string;
  /**
   * Zero-based index of this anchor among identical occurrences of `text` in
   * the content, so repeated texts link the right duplicate. Defaults to 0.
   */
  occurrence?: number;
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
declare function parseHyperlinks(html: string): Hyperlink[];
//#endregion
//#region src/shared/section-heading/index.d.ts
declare const HEADING_LEVELS: readonly [2, 3, 4, 5, 6];
type SectionHeadingProps = {
  className?: string;
  level?: (typeof HEADING_LEVELS)[number];
  children?: React.ReactNode;
};
//#endregion
//#region src/types.d.ts
interface SocialPreviewBaseProps {
  /**
   * The URL of the post/page to preview.
   */
  url: string;
  /**
   * Editor hyperlinks rendered over the matching body text on the networks
   * that support inline links (Bluesky, Tumblr). Other networks ignore this.
   */
  hyperlinks?: Hyperlink[];
  /**
   * The title of the post/page to preview.
   */
  title: string;
  /**
   * The description of the post/page to preview.
   */
  description?: string;
  /**
   * The URL of the image to use in the post/page preview.
   */
  image?: string;
  /**
   * The focal point of the link-preview image (`image`/`customImage`), both
   * axes 0-1. When set, the preview crops around this point via
   * `object-position`. Omitted → centered, matching today's behavior.
   */
  imageFocalPoint?: FocalPoint;
  /**
   * The array of media items to use in the preview.
   */
  media?: Array<MediaItem>;
  /**
   * The caption.
   */
  caption?: string;
}
interface SocialPreviewsBaseProps {
  /**
   * The heading level to use for the preview section title
   */
  headingLevel?: SectionHeadingProps['level'];
  /**
   * Whether to hide the "Your post" section
   */
  hidePostPreview?: boolean;
  /**
   * Whether to hide the "Link preview" section
   */
  hideLinkPreview?: boolean;
}
/**
 * A focal point on an image. Both axes are 0-1, where `{ x: 0, y: 0 }` is the
 * top-left corner and `{ x: 1, y: 1 }` is the bottom-right.
 */
type FocalPoint = {
  x: number;
  y: number;
};
type MediaItem = {
  /**
   * The alt text for the image.
   */
  alt?: string;
  /**
   * The mime type of the media
   */
  type: string;
  /**
   * The URL of the media.
   */
  url: string;
};
//#endregion
//#region src/google-search-preview/index.d.ts
type GoogleSearchPreviewProps = Omit<SocialPreviewBaseProps, 'image'> & {
  siteIcon?: string;
  siteTitle?: string;
};
declare const GoogleSearchPreview: React.FC<Partial<GoogleSearchPreviewProps>>;
//#endregion
//#region src/twitter-preview/types.d.ts
type TwitterPreviewsProps = SocialPreviewsBaseProps & {
  tweets: Array<TwitterPreviewProps>;
};
type TwitterCardProps = SocialPreviewBaseProps & {
  cardType: string;
};
type SidebarProps$1 = {
  showThreadConnector?: boolean;
  profileImage?: string;
};
type HeaderProps$1 = {
  name?: string;
  date?: Date | number;
  screenName?: string;
};
type QuoteTweetProps = {
  tweetUrl: string;
};
type TextProps = {
  text: string;
};
type TwitterPreviewProps = SidebarProps$1 & HeaderProps$1 & Partial<QuoteTweetProps & TwitterCardProps & Pick<TextProps, 'text'>>;
//#endregion
//#region src/twitter-preview/link-preview.d.ts
declare const TwitterLinkPreview: React.FC<TwitterPreviewProps>;
//#endregion
//#region src/twitter-preview/post-preview.d.ts
declare const TwitterPostPreview: React.FC<TwitterPreviewProps>;
//#endregion
//#region src/twitter-preview/previews.d.ts
declare const TwitterPreviews: React.FC<TwitterPreviewsProps>;
//#endregion
//#region src/linkedin-preview/types.d.ts
type LinkedInPreviewProps = SocialPreviewBaseProps & {
  jobTitle?: string;
  name: string;
  profileImage: string;
  articleReadTime?: number;
};
type LinkedInPreviewsProps = LinkedInPreviewProps & SocialPreviewsBaseProps;
//#endregion
//#region src/linkedin-preview/link-preview.d.ts
type OptionalProps$1 = Partial<Pick<LinkedInPreviewProps, 'name' | 'profileImage'>>;
type LinkedInLinkPreviewProps = Omit<LinkedInPreviewProps, keyof OptionalProps$1> & OptionalProps$1;
/**
 * LinkedIn Link Preview Component
 * @param {LinkedInLinkPreviewProps} props - The props for the LinkedIn link preview.
 * @return The LinkedIn link preview component.
 */
declare function LinkedInLinkPreview(props: LinkedInLinkPreviewProps): import("react").JSX.Element;
//#endregion
//#region src/linkedin-preview/post-preview.d.ts
/**
 * LinkedIn Post Preview Component
 *
 * @param {LinkedInPreviewProps} props - The props for the LinkedIn post preview.
 *
 * @return The LinkedIn post preview component.
 */
declare function LinkedInPostPreview({ articleReadTime, image, imageFocalPoint, jobTitle, name, profileImage, description, media, title, url }: LinkedInPreviewProps): import("react").JSX.Element;
//#endregion
//#region src/linkedin-preview/previews.d.ts
declare const LinkedInPreviews: React.FC<LinkedInPreviewsProps>;
//#endregion
//#region src/tumblr-preview/types.d.ts
type TumblrUser = {
  displayName: string;
  avatarUrl?: string;
};
type TumblrPreviewProps = SocialPreviewBaseProps & {
  user?: TumblrUser;
};
//#endregion
//#region src/tumblr-preview/link-preview.d.ts
declare const TumblrLinkPreview: React.FC<TumblrPreviewProps>;
//#endregion
//#region src/tumblr-preview/post-preview.d.ts
declare const TumblrPostPreview: React.FC<TumblrPreviewProps>;
//#endregion
//#region src/tumblr-preview/previews.d.ts
type TumblrPreviewsProps = TumblrPreviewProps & SocialPreviewsBaseProps;
declare const TumblrPreviews: React.FC<TumblrPreviewsProps>;
//#endregion
//#region src/constants.d.ts
declare const AUTO_SHARED_SOCIAL_POST_PREVIEW = "AUTO_SHARED_SOCIAL_POST_PREVIEW";
declare const AUTO_SHARED_LINK_PREVIEW = "AUTO_SHARED_LINK_PREVIEW";
declare const DEFAULT_LINK_PREVIEW = "DEFAULT_LINK_PREVIEW";
declare const TYPE_WEBSITE = "website";
declare const TYPE_ARTICLE = "article";
declare const LANDSCAPE_MODE = "landscape";
declare const PORTRAIT_MODE = "portrait";
//#endregion
//#region src/facebook-preview/types.d.ts
type ImageMode = typeof LANDSCAPE_MODE | typeof PORTRAIT_MODE;
type FacebookUser = {
  displayName: string;
  avatarUrl?: string;
};
type FacebookPreviewProps = SocialPreviewBaseProps & {
  user?: FacebookUser;
  type?: typeof TYPE_WEBSITE | typeof TYPE_ARTICLE;
  customText?: string;
  customImage?: string;
  imageMode?: ImageMode;
};
//#endregion
//#region src/facebook-preview/previews.d.ts
type FacebookPreviewsProps = FacebookPreviewProps & SocialPreviewsBaseProps;
declare const FacebookPreviews: React.FC<FacebookPreviewsProps>;
//#endregion
//#region src/facebook-preview/link-preview.d.ts
type FacebookLinkPreviewProps = FacebookPreviewProps & {
  compactDescription?: boolean;
};
declare const FacebookLinkPreview: React.FC<FacebookLinkPreviewProps>;
//#endregion
//#region src/facebook-preview/post-preview.d.ts
declare const FacebookPostPreview: React.FC<FacebookPreviewProps>;
//#endregion
//#region src/mastodon-preview/types.d.ts
type MastodonUser = {
  displayName: string;
  avatarUrl: string;
  address: string;
};
type MastodonPreviewProps = SocialPreviewBaseProps & {
  user?: MastodonUser;
  customText?: string;
  customImage?: string;
  siteName?: string;
};
//#endregion
//#region src/mastodon-preview/link-preview.d.ts
declare const MastodonLinkPreview: React.FC<MastodonPreviewProps>;
//#endregion
//#region src/mastodon-preview/post-preview.d.ts
declare const MastodonPostPreview: React.FC<MastodonPreviewProps>;
//#endregion
//#region src/mastodon-preview/previews.d.ts
type MastodonPreviewsProps = MastodonPreviewProps & SocialPreviewsBaseProps;
declare const MastodonPreviews: React.FC<MastodonPreviewsProps>;
//#endregion
//#region src/nextdoor-preview/types.d.ts
type NextdoorPreviewProps = SocialPreviewBaseProps & {
  neighborhood?: string;
  name: string;
  profileImage: string;
};
type NextdoorPreviewsProps = NextdoorPreviewProps & SocialPreviewsBaseProps;
//#endregion
//#region src/nextdoor-preview/link-preview.d.ts
type OptionalProps = Partial<Pick<NextdoorPreviewProps, 'name' | 'profileImage'>>;
type NextdoorLinkPreviewProps = Omit<NextdoorPreviewProps, keyof OptionalProps> & OptionalProps;
/**
 * Nextdoor Link Preview Component
 *
 * @param {NextdoorLinkPreviewProps} props - The props for the Nextdoor link preview.
 *
 * @return The Nextdoor link preview component.
 */
declare function NextdoorLinkPreview(props: NextdoorLinkPreviewProps): import("react").JSX.Element;
//#endregion
//#region src/nextdoor-preview/post-preview.d.ts
/**
 * Nextdoor Post Preview Component.
 *
 * @param {NextdoorPreviewProps} props - The preview properties.
 * @return The Nextdoor post preview component.
 */
declare function NextdoorPostPreview({ image, imageFocalPoint, name, profileImage, description, neighborhood, media, title, url }: NextdoorPreviewProps): import("react").JSX.Element;
//#endregion
//#region src/nextdoor-preview/previews.d.ts
declare const NextdoorPreviews: React.FC<NextdoorPreviewsProps>;
//#endregion
//#region src/bluesky-preview/types.d.ts
type BlueskyUser = {
  displayName: string;
  avatarUrl: string;
  address: string;
};
type BlueskyPreviewProps = SocialPreviewBaseProps & {
  appendUrl?: boolean;
  user?: BlueskyUser;
  customText?: string;
  customImage?: string;
};
//#endregion
//#region src/bluesky-preview/link-preview.d.ts
declare const BlueskyLinkPreview: React.FC<BlueskyPreviewProps>;
//#endregion
//#region src/bluesky-preview/post-preview.d.ts
declare const BlueskyPostPreview: React.FC<BlueskyPreviewProps>;
//#endregion
//#region src/bluesky-preview/previews.d.ts
type BlueskyPreviewsProps = BlueskyPreviewProps & SocialPreviewsBaseProps;
declare const BlueskyPreviews: React.FC<BlueskyPreviewsProps>;
//#endregion
//#region src/threads-preview/types.d.ts
type ThreadsPreviewsProps = SocialPreviewsBaseProps & {
  posts: Array<ThreadsPreviewProps>;
};
type ThreadsCardProps = Omit<SocialPreviewBaseProps, 'description'>;
type SidebarProps = {
  showThreadConnector?: boolean;
  profileImage?: string;
};
type HeaderProps = {
  name?: string;
  date?: Date;
};
type ThreadsPreviewProps = SidebarProps & HeaderProps & Partial<ThreadsCardProps>;
//#endregion
//#region src/threads-preview/link-preview.d.ts
declare const ThreadsLinkPreview: React.FC<ThreadsPreviewProps>;
//#endregion
//#region src/threads-preview/post-preview.d.ts
declare const ThreadsPostPreview: React.FC<ThreadsPreviewProps>;
//#endregion
//#region src/threads-preview/previews.d.ts
declare const ThreadsPreviews: React.FC<ThreadsPreviewsProps>;
//#endregion
//#region src/instagram-preview/types.d.ts
type InstagramPreviewProps = Pick<SocialPreviewBaseProps, 'image' | 'imageFocalPoint' | 'media' | 'url'> & {
  name: string;
  profileImage: string;
  caption?: string;
};
type InstagramPreviewsProps = InstagramPreviewProps & SocialPreviewsBaseProps;
//#endregion
//#region src/instagram-preview/post-preview.d.ts
/**
 * Instagram Post Preview Component
 *
 * @param {InstagramPreviewProps} props - The props for the Instagram post preview.
 *
 * @return  The Instagram post preview component.
 */
declare function InstagramPostPreview({ image, imageFocalPoint, media, name, profileImage, caption }: InstagramPreviewProps): import("react").JSX.Element;
//#endregion
//#region src/instagram-preview/previews.d.ts
declare const InstagramPreviews: React.FC<InstagramPreviewsProps>;
//#endregion
export { AUTO_SHARED_LINK_PREVIEW, AUTO_SHARED_SOCIAL_POST_PREVIEW, BlueskyLinkPreview, BlueskyPostPreview, BlueskyPreviews, BlueskyPreviewsProps, DEFAULT_LINK_PREVIEW, FacebookLinkPreview, FacebookLinkPreviewProps, FacebookPostPreview, FacebookPreviews, FacebookPreviewsProps, FocalPoint, GoogleSearchPreview, GoogleSearchPreviewProps, type Hyperlink, InstagramPostPreview, InstagramPreviews, LANDSCAPE_MODE, LinkedInLinkPreview, LinkedInLinkPreviewProps, LinkedInPostPreview, LinkedInPreviews, MastodonLinkPreview, MastodonPostPreview, MastodonPreviews, MastodonPreviewsProps, MediaItem, NextdoorLinkPreview, NextdoorLinkPreviewProps, NextdoorPostPreview, NextdoorPreviews, PORTRAIT_MODE, SocialPreviewBaseProps, SocialPreviewsBaseProps, TYPE_ARTICLE, TYPE_WEBSITE, ThreadsLinkPreview, ThreadsPostPreview, ThreadsPreviews, TumblrLinkPreview, TumblrPostPreview, TumblrPreviews, TumblrPreviewsProps, TwitterLinkPreview, TwitterPostPreview, TwitterPreviews, parseHyperlinks };
//# sourceMappingURL=index.d.mts.map