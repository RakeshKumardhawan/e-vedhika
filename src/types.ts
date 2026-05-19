
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  categories?: string[];
  subCategory?: string;
  tags?: string[];
  websiteName?: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaName?: string;
  likes: number;
  views: number;
  comments: Comment[];
  commentCount?: number;
  likedBy?: string[];
  viewedBy?: string[];
  userName?: string;
  userPhoto?: string;
  time: number;
  uid: string;
  status?: string;
  pinned?: boolean;
  isAdminPost?: boolean;
  version?: string;
  versionStatus?: "New" | "Old";
  attachments?: { name: string; url: string; version?: string; status?: "New" | "Old" }[];
  downloadStyle?: "classic" | "techspot";
}

export interface Comment {
  user: string;
  msg: string;
  time: number;
}

export interface UserProfile {
  id: string;
  username: string;
  surname?: string;
  name?: string;
  designation?: string;
  gender?: string;
  status?: string;
  state?: string;
  district?: string;
  mandal?: string;
  village?: string;
  mobile?: string;
  email?: string;
  photoURL?: string;
  office?: string;
  role?: string;
  hidden?: boolean;
  theme?: "light" | "dark" | "system";
  notifications?: boolean;
  time: number;
}

export interface Suggestion {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  time: number;
  status?: string;
}

export interface UserNotification {
  id: string;
  uid: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  time: number;
}

export interface ChatMessage {
  id: string;
  msg: string;
  time: number;
  uid: string;
  userName?: string;
}
