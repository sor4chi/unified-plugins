export interface LinkMeta {
  title: string;
  description: string;
  iconUrl: string;
  thumbnailUrl: string;
}

export interface RemarkLinkMetaOptions {
  /**
   * Whether to also retrieve meta information for inline links
   * @default false
   */
  inline?: boolean;
}
