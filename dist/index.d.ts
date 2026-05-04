import * as react_jsx_runtime from 'react/jsx-runtime';

declare const HEADING_LEVELS: readonly [2, 3, 4, 5, 6];
type SectionHeadingProps = {
    className?: string;
    level?: (typeof HEADING_LEVELS)[number];
    children?: React.ReactNode;
};

interface SocialPreviewBaseProps {
    /**
     * The URL of the post/page to preview.
     */
    url: string;
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

type GoogleSearchPreviewProps = Omit<SocialPreviewBaseProps, 'image'> & {
    siteIcon?: string;
    siteTitle?: string;
};
declare const GoogleSearchPreview: React.FC<Partial<GoogleSearchPreviewProps>>;

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

declare const TwitterLinkPreview: React.FC<TwitterPreviewProps>;

declare const TwitterPostPreview: React.FC<TwitterPreviewProps>;

declare const TwitterPreviews: React.FC<TwitterPreviewsProps>;

type LinkedInPreviewProps = SocialPreviewBaseProps & {
    jobTitle?: string;
    name: string;
    profileImage: string;
    articleReadTime?: number;
};
type LinkedInPreviewsProps = LinkedInPreviewProps & SocialPreviewsBaseProps;

type OptionalProps$1 = Partial<Pick<LinkedInPreviewProps, 'name' | 'profileImage'>>;
type LinkedInLinkPreviewProps = Omit<LinkedInPreviewProps, keyof OptionalProps$1> & OptionalProps$1;
/**
 * LinkedIn Link Preview Component
 * @param {LinkedInLinkPreviewProps} props - The props for the LinkedIn link preview.
 * @return The LinkedIn link preview component.
 */
declare function LinkedInLinkPreview(props: LinkedInLinkPreviewProps): react_jsx_runtime.JSX.Element;

/**
 * LinkedIn Post Preview Component
 *
 * @param {LinkedInPreviewProps} props - The props for the LinkedIn post preview.
 *
 * @return The LinkedIn post preview component.
 */
declare function LinkedInPostPreview({ articleReadTime, image, jobTitle, name, profileImage, description, media, title, url, }: LinkedInPreviewProps): react_jsx_runtime.JSX.Element;

declare const LinkedInPreviews: React.FC<LinkedInPreviewsProps>;

type TumblrUser = {
    displayName: string;
    avatarUrl?: string;
};
type TumblrPreviewProps = SocialPreviewBaseProps & {
    user?: TumblrUser;
};

declare const TumblrLinkPreview: React.FC<TumblrPreviewProps>;

declare const TumblrPostPreview: React.FC<TumblrPreviewProps>;

type TumblrPreviewsProps = TumblrPreviewProps & SocialPreviewsBaseProps;
declare const TumblrPreviews: React.FC<TumblrPreviewsProps>;

declare const AUTO_SHARED_SOCIAL_POST_PREVIEW = "AUTO_SHARED_SOCIAL_POST_PREVIEW";
declare const AUTO_SHARED_LINK_PREVIEW = "AUTO_SHARED_LINK_PREVIEW";
declare const DEFAULT_LINK_PREVIEW = "DEFAULT_LINK_PREVIEW";
declare const TYPE_WEBSITE = "website";
declare const TYPE_ARTICLE = "article";
declare const LANDSCAPE_MODE = "landscape";
declare const PORTRAIT_MODE = "portrait";

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

type FacebookPreviewsProps = FacebookPreviewProps & SocialPreviewsBaseProps;
declare const FacebookPreviews: React.FC<FacebookPreviewsProps>;

type FacebookLinkPreviewProps = FacebookPreviewProps & {
    compactDescription?: boolean;
};
declare const FacebookLinkPreview: React.FC<FacebookLinkPreviewProps>;

declare const FacebookPostPreview: React.FC<FacebookPreviewProps>;

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

declare const MastodonLinkPreview: React.FC<MastodonPreviewProps>;

declare const MastodonPostPreview: React.FC<MastodonPreviewProps>;

type MastodonPreviewsProps = MastodonPreviewProps & SocialPreviewsBaseProps;
declare const MastodonPreviews: React.FC<MastodonPreviewsProps>;

type NextdoorPreviewProps = SocialPreviewBaseProps & {
    neighborhood?: string;
    name: string;
    profileImage: string;
};
type NextdoorPreviewsProps = NextdoorPreviewProps & SocialPreviewsBaseProps;

type OptionalProps = Partial<Pick<NextdoorPreviewProps, 'name' | 'profileImage'>>;
type NextdoorLinkPreviewProps = Omit<NextdoorPreviewProps, keyof OptionalProps> & OptionalProps;
/**
 * Nextdoor Link Preview Component
 *
 * @param {NextdoorLinkPreviewProps} props - The props for the Nextdoor link preview.
 *
 * @return The Nextdoor link preview component.
 */
declare function NextdoorLinkPreview(props: NextdoorLinkPreviewProps): react_jsx_runtime.JSX.Element;

/**
 * Nextdoor Post Preview Component.
 *
 * @param {NextdoorPreviewProps} props - The preview properties.
 * @return The Nextdoor post preview component.
 */
declare function NextdoorPostPreview({ image, name, profileImage, description, neighborhood, media, title, url, }: NextdoorPreviewProps): react_jsx_runtime.JSX.Element;

declare const NextdoorPreviews: React.FC<NextdoorPreviewsProps>;

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

declare const BlueskyLinkPreview: React.FC<BlueskyPreviewProps>;

declare const BlueskyPostPreview: React.FC<BlueskyPreviewProps>;

type BlueskyPreviewsProps = BlueskyPreviewProps & SocialPreviewsBaseProps;
declare const BlueskyPreviews: React.FC<BlueskyPreviewsProps>;

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

declare const ThreadsLinkPreview: React.FC<ThreadsPreviewProps>;

declare const ThreadsPostPreview: React.FC<ThreadsPreviewProps>;

declare const ThreadsPreviews: React.FC<ThreadsPreviewsProps>;

type InstagramPreviewProps = Pick<SocialPreviewBaseProps, 'image' | 'media' | 'url'> & {
    name: string;
    profileImage: string;
    caption?: string;
};
type InstagramPreviewsProps = InstagramPreviewProps & SocialPreviewsBaseProps;

/**
 * Instagram Post Preview Component
 *
 * @param {InstagramPreviewProps} props - The props for the Instagram post preview.
 *
 * @return  The Instagram post preview component.
 */
declare function InstagramPostPreview({ image, media, name, profileImage, caption, url, }: InstagramPreviewProps): react_jsx_runtime.JSX.Element;

declare const InstagramPreviews: React.FC<InstagramPreviewsProps>;

export { AUTO_SHARED_LINK_PREVIEW, AUTO_SHARED_SOCIAL_POST_PREVIEW, BlueskyLinkPreview, BlueskyPostPreview, BlueskyPreviews, type BlueskyPreviewsProps, DEFAULT_LINK_PREVIEW, FacebookLinkPreview, type FacebookLinkPreviewProps, FacebookPostPreview, FacebookPreviews, type FacebookPreviewsProps, GoogleSearchPreview, type GoogleSearchPreviewProps, InstagramPostPreview, InstagramPreviews, LANDSCAPE_MODE, LinkedInLinkPreview, type LinkedInLinkPreviewProps, LinkedInPostPreview, LinkedInPreviews, MastodonLinkPreview, MastodonPostPreview, MastodonPreviews, type MastodonPreviewsProps, type MediaItem, NextdoorLinkPreview, type NextdoorLinkPreviewProps, NextdoorPostPreview, NextdoorPreviews, PORTRAIT_MODE, type SocialPreviewBaseProps, type SocialPreviewsBaseProps, TYPE_ARTICLE, TYPE_WEBSITE, ThreadsLinkPreview, ThreadsPostPreview, ThreadsPreviews, TumblrLinkPreview, TumblrPostPreview, TumblrPreviews, type TumblrPreviewsProps, TwitterLinkPreview, TwitterPostPreview, TwitterPreviews };
