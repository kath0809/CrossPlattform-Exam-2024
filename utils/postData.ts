import { LocationObjectCoords } from "expo-location";


// Interface for the data that will be provided to the server when a new post is created.
export interface PostData {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  postCoordinates: LocationObjectCoords | null;
  category: string;
  author: string;
  likes: string[];
  isLiked: boolean;
  comments: string[];
}


    