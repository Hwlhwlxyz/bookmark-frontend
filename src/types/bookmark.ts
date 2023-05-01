export interface Bookmark {
  id: number;
  url: string;
  title: string;
  excerpt: string;
  author: string;
  public: number;
  modified: string;
  imageURL: string;
  hasContent: boolean;
  hasArchive: boolean;
  tags: BookmarkTag[];
}

export interface BookmarkTag {
  id: number;
  name: string;
}
