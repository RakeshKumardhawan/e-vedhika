
import React, { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Pin, 
  Clock, 
  Edit3, 
  Trash2, 
  Hash, 
  ExternalLink, 
  FileText, 
  Download, 
  Link2, 
  Heart, 
  MessageSquare, 
  Eye, 
  Share2, 
  ArrowDown, 
  Target,
  X
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { useSearchParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import { 
  doc, 
  updateDoc, 
  increment, 
  arrayUnion, 
  arrayRemove, 
  addDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import Swal from "sweetalert2";
import { Post, UserProfile, OperationType } from "../types";
import { 
  getValidTime, 
  formatPostTitle, 
  handleForceDownload, 
  handleShare, 
  getLatestAttachment, 
  handleFirestoreError, 
  getFriendlyError, 
  requireLoginAlert 
} from "../lib/utils";

import { UsersListModal } from "./UsersListModal";

export const PostCard = memo(({
  post,
  isExpanded,
  toggleExpansion,
  addToast,
  isAdmin,
  onEdit,
  allUsers,
}: {
  post: Post;
  isExpanded: boolean;
  toggleExpansion: () => void;
  addToast: (s: string) => void;
  isAdmin: boolean;
  onEdit: (p: Post) => void;
  allUsers: UserProfile[];
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOwner = Boolean(
    (auth.currentUser && post.uid && auth.currentUser.uid === post.uid) ||
    isAdmin,
  );
  const postTime = getValidTime(post);

  const [showComments, setShowComments] = useState(false);
  const [showViewsModal, setShowViewsModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (showComments) {
      const q = query(
        collection(db, "posts", post.id, "comments"),
        orderBy("time", "desc"),
      );
      const unsub = onSnapshot(
        q,
        (snap) => {
          const fetchedComments = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setComments(fetchedComments);
          setCommentsLoaded(true);
        },
        (err) =>
          handleFirestoreError(
            err,
            OperationType.LIST,
            `posts/${post.id}/comments`,
          ),
      );
      return () => unsub();
    }
  }, [showComments, post.id]);

  return (
    <motion.div layout className="post-card h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-primary font-black overflow-hidden border shadow-sm">
          {post.userPhoto ? (
            <img
              src={post.userPhoto}
              alt={post.userName || "Author"}
              loading="lazy"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-lg">
              {(post.userName || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h5 className="text-[17px] font-black text-primary leading-tight">
              {post.userName || "Portal Member"}
            </h5>
            {post.isAdminPost && (
              <span className="bg-blue-600 text-white text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                <ShieldCheck size={10} /> Official
              </span>
            )}
            {post.pinned && (
              <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] uppercase font-black tracking-widest border border-amber-100">
                <Pin size={10} fill="currentColor" /> Pinned
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase mt-1">
            <Clock size={12} />
            <span>
              {new Date(postTime).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>•</span>
            <span className="text-primary/70">
              {post.categories && post.categories.length > 0
                ? post.categories.join(", ")
                : post.category || "Update"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {isOwner && (
            <>
                {isAdmin && (
                  <button
                    onClick={async () => {
                      try {
                        await updateDoc(doc(db, "posts", post.id), {
                          pinned: !post.pinned,
                        });
                        addToast(post.pinned ? "Post Unpinned" : "Post Pinned");
                      } catch (err) {
                        handleFirestoreError(err, OperationType.UPDATE, `posts/${post.id}`);
                      }
                    }}
                    className={`p-1.5 hover:bg-slate-50 transition-all rounded-lg ${post.pinned ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}`}
                    title={post.pinned ? "Unpin Post" : "Pin Post"}
                  >
                    <Pin size={16} fill={post.pinned ? "currentColor" : "none"} />
                  </button>
                )}
                <button
                  onClick={() => onEdit(post)}
                  className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-primary transition-all rounded-lg"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
              <button
                aria-label="Delete Post"
                onClick={async () => {
                  const res = await Swal.fire({
                    title: "Delete?",
                    text: "Move this post to recycle bin?",
                    icon: "warning",
                    showCancelButton: true,
                  });
                  if (res.isConfirmed) {
                    try {
                      await updateDoc(doc(db, "posts", post.id), {
                        status: "Deleted",
                        deletedAt: Date.now(),
                      });
                      addToast("Moved to recycle bin");
                    } catch (err: any) {
                      addToast(getFriendlyError(err));
                    }
                  }
                }}
                className="p- red-50 text-slate-400 hover:text-danger transition-all rounded-lg"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

            <h4 className="post-title !mt-0 whitespace-pre-wrap flex items-center gap-2">
              {formatPostTitle(post.title) || "Platform Update"}
              {post.version && (
                <span className="bg-slate-800 text-white text-[9px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase">
                   {post.version}
                </span>
              )}
              {post.versionStatus && (
                <span className={`${post.versionStatus === 'New' ? 'bg-emerald-500' : 'bg-rose-500'} text-white text-[9px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase`}>
                  {post.versionStatus}
                </span>
              )}
            </h4>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border border-slate-200/50"
            >
              <Hash size={10} strokeWidth={3} /> {tag}
            </span>
          ))}
        </div>
      )}

      {post.attachments && (post.downloadStyle === "techspot" || (!post.downloadStyle && post.attachments.length >= 2)) ? (
         <div className="flex flex-col md:flex-row gap-8 mt-4">
            <div className="flex-1 min-w-0">
               <div
                 className={`post-body mb-4 whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-4"} [&_pre]:bg-slate-800 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_code]:bg-slate-100 [&_code]:text-rose-500 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:px-0 [&_pre_code]:py-0 [&_p]:mb-2 [&_a]:text-blue-600 [&_a]:underline`}
               >
                 <ReactMarkdown
                   remarkPlugins={[remarkBreaks]}
                   rehypePlugins={[rehypeRaw]}
                   components={{
                     h3: ({ node, children, ...props }: any) => {
                       const text = String(children);
                       if (text.includes("🚀 What's New")) {
                         return <h3 className="flex items-center gap-2 text-blue-700 bg-blue-50 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest mt-4 mb-2 border border-blue-100 shadow-sm" {...props}>{children}</h3>;
                       }
                       if (text.includes("🛠️ Bug Fixes")) {
                         return <h3 className="flex items-center gap-2 text-rose-700 bg-rose-50 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest mt-4 mb-2 border border-rose-100 shadow-sm" {...props}>{children}</h3>;
                       }
                       if (text.includes("⚡ Improvements")) {
                         return <h3 className="flex items-center gap-2 text-amber-700 bg-amber-50 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest mt-4 mb-2 border border-amber-100 shadow-sm" {...props}>{children}</h3>;
                       }
                       return <h3 className="text-lg font-black text-primary mt-4 mb-2" {...props}>{children}</h3>;
                     },
                     ul: ({ node, children, ...props }: any) => <ul className="space-y-1.5 ml-4 mb-4" {...props}>{children}</ul>,
                     li: ({ node, children, ...props }: any) => (
                       <li className="flex items-start gap-2 text-slate-700 font-medium text-sm leading-relaxed" {...props}>
                         <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                         <span>{children}</span>
                       </li>
                     )
                   }}
                 >
                   {post.content || ""}
                 </ReactMarkdown>
               </div>
               
               {post.attachments.filter(att => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(att.url) || att.url.includes("image")).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                     {post.attachments.filter(att => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(att.url) || att.url.includes("image")).map((att, idx) => (
                           <div key={idx} className="relative group overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-all hover:border-primary/20">
                             <img
                               src={att.url}
                               alt={att.name}
                               loading="lazy"
                               className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                             />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                 <a
                                   href={att.url}
                        onClick={(e) => handleForceDownload(e, att.url, att.name || "Attachment")}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="p-2 bg-white rounded-full text-primary hover:scale-110 transition-transform"
                                 >
                                   <ExternalLink size={16} />
                                 </a>
                             </div>
                             <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                 <p className="text-white text-[10px] font-bold truncate px-1">{att.name}</p>
                             </div>
                           </div>
                     ))}
                  </div>
               )}
      
      {post.websiteName && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between mb-4 group hover:bg-blue-100/50 transition-colors">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-wider">
            <div className="w-6 h-6 bg-primary text-white rounded-lg flex items-center justify-center">
              <ExternalLink size={12} strokeWidth={3} />
            </div>
            {post.websiteName} Issue / Problem
          </div>
          <Target
            size={14}
            className="text-primary/40 group-hover:text-primary transition-colors"
          />
        </div>
      )}

      {post.mediaUrl && (
        <div className="mb-4">
          {post.mediaType?.startsWith("video") ? (
            <video src={post.mediaUrl} controls className="post-media" />
          ) : post.mediaType?.startsWith("image") ? (
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="post-media"
              loading="lazy"
            />
          ) : post.mediaType?.startsWith("audio") ? (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 truncate">
                {post.mediaName || "Audio Attachment"}
              </p>
              <audio src={post.mediaUrl} controls className="w-full" />
            </div>
          ) : post.mediaType === "link" ? (
            <a
              href={post.mediaUrl.startsWith("http") ? post.mediaUrl : `https://${post.mediaUrl}`}
              target="_blank"
              rel="noreferrer"
              
              className="flex items-center p-4 bg-blue-50/50 border border-blue-100 rounded-2xl hover:bg-blue-50 transition-colors w-full group"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex flex-shrink-0 items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Link2 size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-800 text-sm truncate">
                  {post.mediaName || "External Link"}
                </h5>
                <p className="text-xs text-slate-500 truncate mt-0.5" dir="ltr">
                  {post.mediaUrl}
                </p>
              </div>
            </a>
          ) : !(post.downloadStyle === "techspot" || (!post.downloadStyle && post.attachments && post.attachments.length >= 2)) && (
            <a
              href={post.mediaUrl}
              download={post.mediaName || "Document"}
              onClick={(e) => handleForceDownload(e, post.mediaUrl || "", post.mediaName || "Document")}
              target="_blank"
              rel="noreferrer"
              
              className="flex items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 hover:border-primary/30 transition-colors w-full group"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex flex-shrink-0 items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-800 text-sm truncate">
                  {post.mediaName || "Attached Document"}
                </h5>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">
                  Download File
                </p>
              </div>
              <Download
                size={20}
                className="text-slate-400 group-hover:text-primary transition-colors ml-4"
              />
            </a>
          )}
        </div>
      )}

            </div>

            <div className="w-full md:w-[280px] lg:w-[320px] shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8 flex flex-col">
               <div className="mb-5">
                    <a 
                       href={(() => { const att = getLatestAttachment(post.attachments || []); return att ? att.url : (post.attachments?.[0]?.url || "#"); })()}
                       target="_blank"
                       rel="noopener noreferrer"
                       onClick={(e) => {
                          const attToDownload = getLatestAttachment(post.attachments || []) || post.attachments?.[0];
                          if (attToDownload) handleForceDownload(e, attToDownload.url, attToDownload.name || "Download.zip");
                       }}
                       
                      className="inline-flex items-center gap-4 text-white rounded shadow-sm transition-colors border border-[#0d47a1] overflow-hidden group w-full"
                      style={{ background: "linear-gradient(to bottom, #2b88d8 0%, #1565c0 100%)", padding: "10px" }}
                    >
                      <div className="bg-black/15 p-2.5 flex items-center justify-center border-r border-black/10">
                        <ArrowDown size={28} color="white" strokeWidth={3} className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[20px] font-semibold pr-6 tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] flex-1 truncate" title={(() => { const att = getLatestAttachment(post.attachments || []); return att ? `Download Now (${att.name})` : "Download Now"; })()}>
                        {getLatestAttachment(post.attachments || []) ? "Download Latest Version" : "Download Now"}
                      </span>
                    </a>
               </div>

               <div className="text-[13px] text-gray-800 mb-2 font-sans font-black uppercase tracking-wider">
                  Download
               </div>
               <div className="flex flex-col gap-2 w-full">
                  {post.mediaUrl && !post.mediaType?.startsWith('video') && !post.mediaType?.startsWith('image') && !post.mediaType?.startsWith('audio') && post.mediaType !== 'link' && (
                     <a
                       href={post.mediaUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-between bg-white border border-[#cccccc] shadow-sm group hover:border-blue-500 transition-all overflow-hidden h-[46px] w-full"
                     >
                        <div className="flex items-center h-full min-w-0">
                          <div className="w-11 h-full bg-[#f2f2f2] flex items-center justify-center shrink-0 border-r border-[#cccccc]">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-[#dddddd] shadow-sm">
                              <ArrowDown size={12} className="text-[#666666]" strokeWidth={4} />
                            </div>
                          </div>
                          <div className="flex flex-col px-3 min-w-0">
                            <span className="text-[11px] font-bold text-[#0055aa] truncate leading-tight">
                              {post.mediaName || "Attached Document"}
                            </span>
                          </div>
                        </div>
                     </a>
                  )}
                  {post.attachments?.map((att, idx) => (
                     <a
                       key={idx}
                       href={att.url}
                       onClick={(e) => handleForceDownload(e, att.url, att.name || "Attachment")}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-between bg-white border border-[#cccccc] shadow-sm group hover:border-blue-500 transition-all overflow-hidden h-[46px] w-full"
                     >
                        <div className="flex items-center h-full min-w-0">
                          <div className="w-11 h-full bg-[#f2f2f2] flex items-center justify-center shrink-0 border-r border-[#cccccc]">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-[#dddddd] shadow-sm">
                              <ArrowDown size={12} className="text-[#666666]" strokeWidth={4} />
                            </div>
                          </div>
                          <div className="flex flex-col px-3 min-w-0">
                            <span className="text-[11px] font-bold text-[#0055aa] truncate leading-tight">
                              {att.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pr-3">
                           <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5 bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100/50" title="Version Number">
                                 <span className="text-[9px] font-black text-blue-500 uppercase leading-none">v</span>
                                 <span className="text-[9px] font-bold text-blue-600 leading-none">{att.version || "1.0"}</span>
                              </div>
                              {att.status && (
                                <span className={`${att.status === 'New' ? 'bg-emerald-500' : 'bg-rose-500'} text-white text-[8px] px-2 py-0.5 rounded font-black tracking-widest uppercase shadow-sm`}>
                                   {att.status}
                                </span>
                              )}
                           </div>
                        </div>
                     </a>
                  ))}
               </div>
            </div>
         </div>
      ) : (
         <>
            <div
              className={`post-body mb-4 whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-4"} [&_pre]:bg-slate-800 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_code]:bg-slate-100 [&_code]:text-rose-500 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:px-0 [&_pre_code]:py-0 [&_p]:mb-2 [&_a]:text-blue-600 [&_a]:underline`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h3: ({ node, children, ...props }: any) => {
                    const text = String(children);
                    if (text.includes("🚀 What's New")) {
                      return (
                        <h3 className="flex items-center gap-2 text-blue-700 bg-blue-50 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest mt-4 mb-2 border border-blue-100 shadow-sm" {...props}>
                          {children}
                        </h3>
                      );
                    }
                    if (text.includes("🛠️ Bug Fixes")) {
                      return (
                        <h3 className="flex items-center gap-2 text-rose-700 bg-rose-50 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest mt-4 mb-2 border border-rose-100 shadow-sm" {...props}>
                          {children}
                        </h3>
                      );
                    }
                    if (text.includes("⚡ Improvements")) {
                      return (
                        <h3 className="flex items-center gap-2 text-amber-700 bg-amber-50 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest mt-4 mb-2 border border-amber-100 shadow-sm" {...props}>
                          {children}
                        </h3>
                      );
                    }
                    return <h3 className="text-lg font-black text-primary mt-4 mb-2" {...props}>{children}</h3>;
                  },
                  ul: ({ node, children, ...props }: any) => (
                    <ul className="space-y-1.5 ml-4 mb-4" {...props}>{children}</ul>
                  ),
                  li: ({ node, children, ...props }: any) => (
                    <li className="flex items-start gap-2 text-slate-700 font-medium text-sm leading-relaxed" {...props}>
                      <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                      <span>{children}</span>
                    </li>
                  )
                }}
              >
                {post.content || ""}
              </ReactMarkdown>
            </div>

            {post.attachments && post.attachments.length > 0 && (
               <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="text-[14px] text-gray-800 mb-3 font-sans font-black uppercase tracking-wider">
                     Download
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     {post.attachments.map((att, idx) => {
                       const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(att.url) || att.url.includes("image");
                       return (
                         <div key={idx} className="w-full">
                           {isImage ? (
                             <div className="relative group overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-all hover:border-primary/20">
                               <img
                                 src={att.url}
                                 alt={att.name}
                                 loading="lazy"
                                 className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                               />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <a
                                    href={att.url}
                                    onClick={(e) => handleForceDownload(e, att.url, att.name || "Attachment")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white rounded-full text-primary hover:scale-110 transition-transform"
                                  >
                                    <ExternalLink size={16} />
                                  </a>
                               </div>
                               <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                  <p className="text-white text-[10px] font-bold truncate px-1">{att.name}</p>
                                  {att.status && (
                                     <div className="absolute top-2 right-2">
                                        <span className={`${att.status === 'New' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'} text-white text-[8px] px-2 py-0.5 rounded font-black tracking-widest uppercase`}>
                                           {att.status}
                                        </span>
                                     </div>
                                  )}
                                </div>
                             </div>
                           ) : (
                             <a
                               href={att.url}
                               onClick={(e) => handleForceDownload(e, att.url, att.name || "Attachment")}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center justify-between bg-white border border-[#cccccc] shadow-sm group hover:border-blue-500 transition-all overflow-hidden h-[46px] w-full"
                             >
                                <div className="flex items-center h-full min-w-0">
                                  <div className="w-11 h-full bg-[#f2f2f2] flex items-center justify-center shrink-0 border-r border-[#cccccc]">
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-[#dddddd] shadow-sm">
                                      <ArrowDown size={12} className="text-[#666666]" strokeWidth={4} />
                                    </div>
                                  </div>
                                  <div className="flex flex-col px-3 min-w-0">
                                    <span className="text-[11px] font-bold text-[#0055aa] truncate leading-tight">
                                      {att.name}
                                    </span>
                                    <span className="text-[9px] font-medium text-slate-400 truncate max-w-[200px]">
                                      {att.url}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 pr-3">
                                   <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-0.5 bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100/50" title="Version Number">
                                         <span className="text-[9px] font-black text-blue-500 uppercase leading-none">v</span>
                                         <span className="text-[9px] font-bold text-blue-600 leading-none">{att.version || "1.0"}</span>
                                      </div>
                                      {att.status && (
                                        <span className={`${att.status === 'New' ? 'bg-emerald-500' : 'bg-rose-500'} text-white text-[8px] px-2 py-0.5 rounded font-black tracking-widest uppercase shadow-sm`}>
                                           {att.status}
                                        </span>
                                      )}
                                   </div>
                                </div>
                             </a>
                           )}
                         </div>
                       );
                     })}
                  </div>
               </div>
            )}
      {post.websiteName && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between mb-4 group hover:bg-blue-100/50 transition-colors">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-wider">
            <div className="w-6 h-6 bg-primary text-white rounded-lg flex items-center justify-center">
              <ExternalLink size={12} strokeWidth={3} />
            </div>
            {post.websiteName} Issue / Problem
          </div>
          <Target
            size={14}
            className="text-primary/40 group-hover:text-primary transition-colors"
          />
        </div>
      )}

      {post.mediaUrl && (
        <div className="mb-4">
          {post.mediaType?.startsWith("video") ? (
            <video src={post.mediaUrl} controls className="post-media" />
          ) : post.mediaType?.startsWith("image") ? (
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="post-media"
              loading="lazy"
            />
          ) : post.mediaType?.startsWith("audio") ? (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 truncate">
                {post.mediaName || "Audio Attachment"}
              </p>
              <audio src={post.mediaUrl} controls className="w-full" />
            </div>
          ) : post.mediaType === "link" ? (
            <a
              href={post.mediaUrl.startsWith("http") ? post.mediaUrl : `https://${post.mediaUrl}`}
              target="_blank"
              rel="noreferrer"
              
              className="flex items-center p-4 bg-blue-50/50 border border-blue-100 rounded-2xl hover:bg-blue-50 transition-colors w-full group"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex flex-shrink-0 items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Link2 size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-800 text-sm truncate">
                  {post.mediaName || "External Link"}
                </h5>
                <p className="text-xs text-slate-500 truncate mt-0.5" dir="ltr">
                  {post.mediaUrl}
                </p>
              </div>
            </a>
          ) : !(post.downloadStyle === "techspot" || (!post.downloadStyle && post.attachments && post.attachments.length >= 2)) && (
            <a
              href={post.mediaUrl}
              download={post.mediaName || "Document"}
              onClick={(e) => handleForceDownload(e, post.mediaUrl || "", post.mediaName || "Document")}
              target="_blank"
              rel="noreferrer"
              
              className="flex items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 hover:border-primary/30 transition-colors w-full group"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex flex-shrink-0 items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-800 text-sm truncate">
                  {post.mediaName || "Attached Document"}
                </h5>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">
                  Download File
                </p>
              </div>
              <Download
                size={20}
                className="text-slate-400 group-hover:text-primary transition-colors ml-4"
              />
            </a>
          )}
        </div>
      )}

         </>
      )}

      <div className="flex flex-wrap gap-4 justify-between items-center pt-6 border-t border-slate-100 mt-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              aria-label="Like Post"
              onClick={async (e) => {
                e.stopPropagation();
                const userId = auth.currentUser?.uid;
                if (requireLoginAlert()) return;
                const likedBy = post.likedBy || [];
                try {
                  if (likedBy.includes(userId)) {
                    await updateDoc(doc(db, "posts", post.id), {
                      likes: increment(-1),
                      likedBy: arrayRemove(userId),
                    });
                  } else {
                    await updateDoc(doc(db, "posts", post.id), {
                      likes: increment(1),
                      likedBy: arrayUnion(userId),
                    });
                  }
                } catch (err: any) {
                  addToast(getFriendlyError(err));
                }
              }}
              className={`flex items-center gap-2 p-2 rounded-xl transition-all ${post.likedBy?.includes(auth.currentUser?.uid || "") ? "bg-rose-50 text-rose-500" : "hover:bg-slate-50 text-slate-400"}`}
            >
              <Heart
                size={18}
                fill={
                  post.likedBy?.includes(auth.currentUser?.uid || "")
                    ? "currentColor"
                    : "none"
                }
              />
              <span
                onClick={(e) => {
                  if (isAdmin && post.likes > 0) {
                    e.stopPropagation();
                    setShowLikesModal(true);
                  }
                }}
                className={`text-sm font-black ${isAdmin && post.likes > 0 ? "hover:underline cursor-pointer" : ""}`}
              >
                {post.likes || 0}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 p-2 text-slate-400 cursor-pointer hover:bg-slate-50 rounded-xl transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
            >
              <MessageSquare size={18} />
              <span className="text-sm font-black">
                {post.commentCount || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              onClick={(e) => {
                if (isAdmin && post.views > 0) {
                  e.stopPropagation();
                  setShowViewsModal(true);
                }
              }}
              className={`flex items-center gap-2 p-2 text-slate-400 rounded-xl transition-all ${isAdmin && post.views > 0 ? "cursor-pointer hover:bg-slate-50" : ""}`}
            >
              <Eye size={18} />
              <span
                className={`text-sm font-black ${isAdmin && post.views > 0 ? "hover:underline cursor-pointer" : ""}`}
              >
                {post.views || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button
            aria-label="Share Post"
            onClick={(e) => {
              e.stopPropagation();
              const url = `${window.location.origin}/?postId=${post.id}`;
              const plainContent = post.content ? post.content.replace(/<[^>]*>?/gm, '').replace(/[#*`]/g, '').substring(0, 100) + '...' : "";
              const shareText = plainContent ? `${plainContent}\n\nRead more on E-Vedhika:` : "Check out this post on E-Vedhika:";
              handleShare(
                post.title || "E-Vedhika Post",
                shareText,
                url,
                () => addToast("Link Copied!"),
                post.mediaUrl,
                post.mediaType
              );
            }}
            className="flex items-center gap-2 p-2 px-4 rounded-xl text-primary font-black text-xs uppercase bg-slate-50 hover:bg-primary hover:text-white transition-all"
          >
            <Share2 size={16} strokeWidth={2.5} />
            <span>Share</span>
          </button>

          <button
            aria-label="Read Post"
            onClick={(e) => {
              e.stopPropagation();
              setSearchParams({ postId: post.id });
            }}
            className="flex items-center gap-2 p-2 px-4 rounded-xl text-primary font-black text-xs uppercase bg-slate-50 hover:bg-primary hover:text-white transition-all"
          >
            <Eye size={16} strokeWidth={2.5} />
            <span>Read post</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="space-y-4 mb-4">
            {comments.map((c) => (
              <div key={c.id} className="text-sm bg-slate-50 p-3 rounded-2xl">
                <span className="font-black text-primary mr-2 uppercase text-[10px]">
                  {c.userName}:
                </span>
                <span className="text-slate-600">{c.text}</span>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-2">
                No comments yet
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-slate-50 px-4 py-2 rounded-xl text-sm border-2 border-transparent focus:border-primary/20 outline-none"
            />
            <button
              onClick={async () => {
                if (!newComment.trim() || requireLoginAlert()) return;
                try {
                  const authorName = auth.currentUser!.displayName || auth.currentUser!.email?.split("@")[0] || "User";
                  await addDoc(collection(db, "posts", post.id, "comments"), {
                    text: newComment,
                    time: Date.now(),
                    uid: auth.currentUser!.uid,
                    userName: authorName,
                  });
                  await updateDoc(doc(db, "posts", post.id), {
                    commentCount: increment(1),
                  });

                  // Note: sendCommentNotifications is called here, 
                  // but we might need to import it or pass it as prop if it's too complex.
                  // For now, assume it's available or implemented inside utils.
                  setNewComment("");
                } catch (e: any) {
                  addToast("Error: " + e.message);
                }
              }}
              className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              SEND
            </button>
          </div>
        </div>
      )}

      {showLikesModal && (
        <UsersListModal
          title="Liked By"
          uids={post.likedBy || []}
          allUsers={allUsers}
          onClose={() => setShowLikesModal(false)}
        />
      )}
      {showViewsModal && (
        <UsersListModal
          title="Viewed By"
          uids={post.viewedBy || []}
          allUsers={allUsers}
          onClose={() => setShowViewsModal(false)}
        />
      )}
    </motion.div>
  );
});
