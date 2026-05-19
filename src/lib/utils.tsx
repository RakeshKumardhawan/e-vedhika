
import React from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc, doc, updateDoc, query, where, getDoc, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { OperationType, FirestoreErrorInfo } from "../types";

export function getValidTime(obj: any): number {
  if (!obj) return Date.now();
  if (typeof obj.time === "number") return obj.time;
  if (obj.time?.seconds) return obj.time.seconds * 1000;
  return Date.now();
}

export const formatPostTitle = (title: string | undefined | null) => {
  if (!title) return "";
  return title.charAt(0).toUpperCase() + title.slice(1);
};

export const handleForceDownload = async (e: React.MouseEvent, url: string, fileName: string) => {
  e.preventDefault();
  e.stopPropagation();
  window.open(`/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(fileName)}`, "_blank");
};

export const handleShare = async (
  title: string,
  text: string,
  url: string,
  onCopy: () => void,
  mediaUrl?: string,
  mediaType?: string
) => {
  if (navigator.share) {
    try {
      let shareData: ShareData = { title, text, url };
      
      if (mediaUrl && mediaType?.startsWith("image") && navigator.canShare) {
        try {
          const response = await fetch(mediaUrl);
          const blob = await response.blob();
          const file = new File([blob], "share-image.jpg", { type: blob.type });
          if (navigator.canShare({ files: [file] })) {
            shareData.files = [file];
          }
        } catch (e) {
          console.log("Media share failed, falling back to text", e);
        }
      }
      
      await navigator.share(shareData);
      return;
    } catch (err) {
      if ((err as Error).name !== "AbortError") console.error("Share failed", err);
    }
  }

  try {
    await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
    onCopy();
  } catch (err) {
    console.error("Clipboard failed", err);
  }
};

export const getLatestAttachment = (attachments: any[]) => {
  if (!attachments || attachments.length === 0) return null;
  const sorted = [...attachments].sort((a, b) => {
    const vA = parseFloat(a.version || "0");
    const vB = parseFloat(b.version || "0");
    return vB - vA;
  });
  return sorted[0];
};

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  const lowerErr = errInfo.error.toLowerCase();

  console.error("Firestore Error: ", JSON.stringify(errInfo));

  if (lowerErr.includes("permission") || lowerErr.includes("insufficient")) {
    console.warn(
      `PERMISSION ERROR ON PATH: ${path}. User might need to update Firebase Security Rules for this collection.`,
    );
  }

  throw new Error(JSON.stringify(errInfo));
}

export function getFriendlyError(err: any): string {
  let msg = err.message || String(err);
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error) msg = parsed.error;
  } catch (e) {

  }

  if (msg.includes("Missing or insufficient permissions")) {
    return "మీకు ఈ యాక్షన్‌ని చేయడానికి పర్మిషన్ లేదు / You don't have permission to perform this action.";
  }
  if (msg.includes("offline") || msg.includes("network-request-failed") || msg.includes("Failed to get document because the client is offline")) {
    return "ఇంటర్నెట్ కనెక్షన్ లేదు. దయచేసి నెట్‌వర్క్ చెక్ చేయండి / No internet connection. Please check your network.";
  }
  if (msg.includes("Quota exceeded")) {
    return "సిస్టమ్ పరిమితి దాటింది. దయచేసి రేపు మళ్ళీ ప్రయత్నించండి / Quota exceeded. Please try again tomorrow.";
  }
  if (msg.includes("invalid-credential") || msg.includes("user-not-found") || msg.includes("wrong-password")) {
    return "లాగిన్ వివరాలు తప్పు. దయచేసి సరియైన లాగిన్ వివరాలు ప్రయత్నించండి / Invalid credentials. Please try again.";
  }
  if (msg.includes("popup-closed-by-user") || msg.includes("cancelled-popup-request")) {
    return "లాగిన్ విండో మూసివేయబడింది. దయచేసి మళ్ళీ ప్రయత్నించండి / The login popup was closed before completion.";
  }
  
  return msg;
}

export function requireLoginAlert(userObj?: any): boolean {
  const account = userObj || auth.currentUser;
  if (!account || account.isAnonymous) {
    Swal.fire({
      text: "లాగిన్ అయ్యాక మీకు యాక్సెస్ ఉంటుంది",
      icon: "info",
      confirmButtonText: "సరే (OK)",
      confirmButtonColor: "#0d3b66",
    });
    return true;
  }
  return false;
}

export async function sendCommentNotifications(
  postId: string,
  commentText: string,
  authorUid: string,
  authorName: string
) {
  try {
    const time = Date.now();
    

    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const mentions = [...commentText.matchAll(mentionRegex)].map((m) => m[1].toLowerCase());
    const uniqueMentions = [...new Set(mentions)];
    
    for (const username of uniqueMentions) {
       try {
          const userDoc = await getDoc(doc(db, "usernames", username));
          if (userDoc.exists()) {
             const targetUid = userDoc.data().uid;
             if (targetUid && targetUid !== authorUid) {
                await addDoc(collection(db, "notifications"), {
                   uid: targetUid,
                   title: "కొత్త మెన్షన్ (New Mention)",
                   message: `${authorName} మిమ్మల్ని ఒక కామెంట్‌లో మెన్షన్ చేశారు.`,
                   type: "mention",
                   read: false,
                   time: time,
                });
             }
          }
       } catch (err) { console.error(err); }
    }

    const commentsSnap = await getDocs(collection(db, "posts", postId, "comments"));
    const uids = new Set<string>();
    commentsSnap.forEach((d) => {
       const data = d.data();
       if (data.uid) uids.add(data.uid);
    });
    

    uids.delete(authorUid);
    
    for (const targetUid of Array.from(uids)) {
       try {
          await addDoc(collection(db, "notifications"), {
             uid: targetUid,
             title: "కొత్త కామెంట్ (New Comment)",
             message: `${authorName} మీరు కామెంట్ చేసిన పోస్టులో కొత్త కామెంట్ చేశారు.`,
             type: "comment",
             read: false,
             time: time,
          });
       } catch(err) { console.error(err); }
    }
  } catch (err) {
    console.error("Error sending notifications", err);
  }
}

export function formatDistanceToNow(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}
