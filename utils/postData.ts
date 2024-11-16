import { LocationObjectCoords } from "expo-location";

// Interface for the data that will be provided to the server when a new post is created.
export interface PostData {
  id: string;
  title: string;
  description: string;
  imageURLs: string[];
  postCoordinates: LocationObjectCoords | null;
  category: string;
  author: string;
  authorId: string;
  likes: string[];
  isLiked: boolean;
  comments: string[];
  createdAt: Date;
}


export interface CommentObject {
  id: string;
  comment: CommentData;
}

export interface CommentData {
  authorId: string;
  authorName: string;
  comment: string;
}

export interface Author {
  authorId: string;
  authorName: string;
  profileImage: string;
}