import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, CheckCircle, Clock, AlertCircle, 
  Search, RefreshCw, Filter, User, Check, X, ShieldAlert,
  ArrowRight, ChevronRight, MessageCircle, AlertTriangle, Sparkles, Inbox,
  ExternalLink, Mail, Calendar, Hash, Flag, ShieldCheck, Phone, Paperclip, Image as ImageIcon,
  FileText, Zap, Radio, Mic, Trash2
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, updateDoc, setDoc,
  doc, addDoc, getDocs, limit, where, getDoc, deleteDoc
} from 'firebase/firestore';
import { db } from '../../../firebase';
import Swal from 'sweetalert2';
import { notifySupportTicketToTelegram } from '../../services/supportTicketService';

interface SupportCenterProps {
  currentUser?: any;
  addToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

export const SPOT_REPLIES_DATA = [
  {
    id: "review",
    label: "పరిశీలనలో ఉంది ⏳",
    badge: "Under Review",
    text: "నమస్కారం! మీ విన్నపం/సమస్య పరిశీలనలో ఉంది. మా సాంకేతిక బృందం దీనిపై పరిశీలిస్తోంది, త్వరలోనే తగిన పరిష్కారం అందజేస్తాము. - e-Vedika Support Team",
    status: "in_progress",
    btnColor: "bg-amber-600 hover:bg-amber-700 text-white"
  },
  {
    id: "resolved",
    label: "సమస్య పరిష్కరించబడింది ✅",
    badge: "Resolved",
    text: "నమస్కారం! మీరు తెలియజేసిన సమస్య విజయవంతంగా పరిష్కరించబడింది. ఏవైనా సమస్యలుంటే మళ్లీ తెలియజేయగలరు. ధన్యవాదాలు! - e-Vedika Support Team",
    status: "resolved",
    btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white"
  },
  {
    id: "info",
    label: "వివరాలు పంపండి 📝",
    badge: "Need Info",
    text: "నమస్కారం! మీ సమస్యను వేగంగా పరిష్కరించడానికి దయచేసి మీ జిల్లా, మండలం, గ్రామ పంచాయతీ వివరాలు లేదా స్క్రీన్‌షాట్/ఎర్రర్ వివరాలు ఇక్కడ పంపగలరు. - e-Vedika Support Team",
    status: "in_progress",
    btnColor: "bg-blue-600 hover:bg-blue-700 text-white"
  },
  {
    id: "escalate",
    label: "అధికారులకు ఫార్వర్డ్ 🏛️",
    badge: "Escalated",
    text: "నమస్కారం! మీ సమస్య తగిన పరిష్కారం నిమిత్తం సంబంధిత జిల్లా / టెక్నికల్ అధికార బృందానికి ఫార్వర్డ్ చేయబడింది. త్వరలోనే అప్‌డేట్ చేస్తాము. - e-Vedika Support Team",
    status: "in_progress",
    btnColor: "bg-purple-600 hover:bg-purple-700 text-white"
  }
];

const QUICK_RESPONSES = [
  "నమస్కారం! మీ సమస్య పరిశీలనలో ఉంది. త్వరలోనే తగిన పరిష్కారం అందజేస్తాము. (We are reviewing your issue and will resolve it soon.)",
  "మీరు తెలియజేసిన సమస్య విజయవంతంగా పరిష్కరించబడింది. ధన్యవాదాలు! (Your reported issue has been successfully resolved.)",
  "దయచేసి మీ జిల్లా, మండలం లేదా సంబంధిత డాక్యుమెంట్ వివరాలు ఇక్కడ పంపగలరు. (Please provide your district, mandal, or additional details.)",
  "మీ దరఖాస్తు సంబంధిత అధికార యంత్రాంగానికి పంపబడింది. (Your inquiry has been escalated to the relevant departmental authority.)"
];

const PRIORITY_LEVELS = [
  { id: 'low', label: 'Low', color: 'bg-slate-100 text-slate-600', icon: <Flag size={10} className="text-slate-400" /> },
  { id: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-600', icon: <Flag size={10} className="text-blue-500" /> },
  { id: 'high', label: 'High', color: 'bg-rose-100 text-rose-600', icon: <Flag size={10} className="text-rose-500" /> },
];

export function SupportCenter({ currentUser, addToast }: SupportCenterProps) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any | null>(null);
  const [userTicketHistory, setUserTicketHistory] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice recording states and helpers
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const voiceTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (voiceTimerRef.current) {
        clearInterval(voiceTimerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let recorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      } catch (e) {
        try {
          recorder = new MediaRecorder(stream, { mimeType: "audio/mp4" });
        } catch (e2) {
          recorder = new MediaRecorder(stream);
        }
      }
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await sendAdminVoiceNote(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      
      voiceTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      if (addToast) addToast("మైక్రోఫోన్ అనుమతి లభించలేదు లేదా లోపం సంభవించింది", "error");
    }
  };

  const stopRecording = (shouldSend: boolean) => {
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
    setIsRecording(false);
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      if (!shouldSend) {
        mediaRecorder.onstop = () => {
          mediaRecorder.stream.getTracks().forEach(track => track.stop());
        };
      }
      mediaRecorder.stop();
    }
    setMediaRecorder(null);
  };

  const sendAdminVoiceNote = async (base64Audio: string) => {
    if (!selectedTicket?.id || isSending) return;
    setIsSending(true);

    // Optimistic message update
    const tempId = `opt_audio_${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      senderId: currentUser?.uid || "admin",
      senderName: "e-Vedika Team",
      text: base64Audio,
      time: Date.now(),
      isAdminComment: true
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    const nextStatus = selectedTicket.status === "resolved" || selectedTicket.status === "closed" ? "open" : "in_progress";
    setSelectedTicket((prev: any) => prev ? { ...prev, status: nextStatus, lastReplyTime: Date.now(), lastReplyBy: "e-Vedika Team" } : null);

    try {
      // Send via primary API
      const res = await fetch("/api/support/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          text: base64Audio,
          status: nextStatus
        })
      });
      const data = await res.json().catch(() => ({ success: true }));
      if (data.success) {
        if (addToast) addToast("వాయిస్ ప్రత్యుత్తరం విజయవంతంగా పంపబడింది! (Voice Reply Sent)", "success");
        return;
      }

      // Client fallback
      if (selectedTicket.isPostSource) {
        await addDoc(collection(db, "posts", selectedTicket.id, "comments"), {
          uid: currentUser?.uid || "admin",
          userName: "e-Vedika Team",
          text: base64Audio,
          time: Date.now(),
          isAdminComment: true
        });
        await updateDoc(doc(db, "posts", selectedTicket.id), { updatedAt: Date.now() });
      } else {
        await addDoc(collection(db, "support_tickets", selectedTicket.id, "messages"), {
          senderId: currentUser?.uid || "admin",
          senderName: "e-Vedika Team",
          text: base64Audio,
          time: Date.now(),
          isAdminComment: true
        });
        await updateDoc(doc(db, "support_tickets", selectedTicket.id), {
          status: nextStatus,
          updatedAt: Date.now(),
          lastReplyBy: "e-Vedika Team",
          lastReplyTime: Date.now()
        });
      }
      if (addToast) addToast("వాయిస్ ప్రత్యుత్తరం విజయవంతంగా పంపబడింది! (Voice Reply Sent)", "success");
    } catch (e: any) {
      console.error("Error sending admin voice note:", e);
      if (addToast) addToast(`Voice Reply error: ${e.message}`, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateTestTicket = async () => {
    try {
      const res = await fetch("/api/support/create-test-ticket", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        if (addToast) addToast("టెస్ట్ టికెట్ విజయవంతంగా సృష్టించబడింది! (Test Ticket Created)", "success");
        const newTicket = {
          id: data.ticketId,
          trackingNumber: data.trackingNumber,
          ticketNumber: data.trackingNumber,
          subject: "టెస్ట్ సమస్య / సాఫ్ట్‌వేర్ సహాయ విజ్ఞప్తి (Test Inquiry)",
          problem: "ఇది సిస్టమ్ పరీక్షించడానికి సృష్టించిన టెస్ట్ సపోర్ట్ టికెట్.",
          category: "Technical Support",
          status: "open",
          priority: "medium",
          userName: currentUser?.fullName || currentUser?.username || "Admin Test User",
          userEmail: currentUser?.email || "test@e-vedhika.in",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          _source: 'server_memory'
        };
        updateCombinedTickets([newTicket], 'support_tickets');
      } else {
        throw new Error(data.error || "Failed");
      }
    } catch (e: any) {
      if (addToast) addToast("Error creating test ticket: " + e.message, "error");
    }
  };

  const handleDeleteTicket = async (e: React.MouseEvent, ticketId: string, isPostSource?: boolean) => {
    e.stopPropagation();
    const res = await Swal.fire({
      title: "టికెట్‌ను తొలగించాలా? (Delete Ticket?)",
      text: "ఈ సపోర్ట్ టికెట్ లేదా డమ్మీ డేటా శాశ్వతంగా తొలగించబడుతుంది.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "అవును, తొలగించు (Delete)"
    });
    if (res.isConfirmed) {
      try {
        const response = await fetch("/api/support/delete-ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId, isPostSource })
        });
        const data = await response.json();
        if (data.success) {
          setTickets(prev => prev.filter(t => t.id !== ticketId));
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(null);
          }
          if (addToast) addToast("టికెట్ విజయవంతంగా తొలగించబడింది! (Ticket deleted)", "success");
        } else {
          throw new Error(data.error || "Failed");
        }
      } catch (err: any) {
        if (addToast) addToast("Error deleting ticket: " + err.message, "error");
      }
    }
  };

  // 1. Listen to Real Firestore support_tickets Collection & private_support posts
  useEffect(() => {
    fetch("/api/support/offline-tickets")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.tickets) && data.tickets.length > 0) {
          updateCombinedTickets(data.tickets.map((t: any) => ({ ...t, _source: 'server_memory' })), 'support_tickets');
        }
      })
      .catch(() => {});

    // Listener for support_tickets
    const unsubTickets = onSnapshot(collection(db, "support_tickets"), (snapshot) => {
      const tList = snapshot.docs.map(d => ({ id: d.id, ...d.data(), _source: 'support_tickets' }));
      updateCombinedTickets(tList, 'support_tickets');
      setLoading(false);
    }, (err) => {
      console.warn("Tickets collection error:", err);
      setLoading(false);
    });

    // Listener for private_support posts
    const unsubPosts = onSnapshot(collection(db, "posts"), (snapshot) => {
      const privatePosts = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((p: any) => {
          const s = (p.status || "").toLowerCase();
          return ["sent to support", "sent-to-support", "private_support", "support"].includes(s);
        })
        .map((p: any) => ({
          ...p,
          id: p.id,
          subject: p.title || p.subject || "Private Post Support Inquiry",
          message: p.content || p.desc || "",
          userName: p.userName || p.authorName || p.author || "User",
          userId: p.uid || p.authorId,
          createdAt: p.time || p.createdAt || Date.now(),
          updatedAt: p.updatedAt || p.time || p.createdAt || Date.now(),
          _source: 'posts',
          isPostSource: true
        }));
      updateCombinedTickets(privatePosts, 'posts');
    }, (err) => {
      console.warn("Posts query error in support:", err);
    });

    return () => {
      unsubTickets();
      unsubPosts();
    };
  }, []);

  const combinedRef = useRef<{support_tickets: any[], posts: any[]}>({ support_tickets: [], posts: [] });
  const updateCombinedTickets = (list: any[], source: 'support_tickets' | 'posts') => {
    combinedRef.current[source] = list;
    const combined = [...combinedRef.current.support_tickets, ...combinedRef.current.posts];
    combined.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
    setTickets(combined);
    
    // Auto-select first if none selected
    if (combined.length > 0 && !selectedTicket) {
      setSelectedTicket(combined[0]);
    } else if (selectedTicket) {
      // Refresh selected ticket data if it's in the new lists
      const updated = combined.find(t => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  };

  // Fetch User Info when selectedTicket changes
  useEffect(() => {
    if (selectedTicket?.userId || selectedTicket?.uid) {
      const targetId = selectedTicket.userId || selectedTicket.uid;
      
      // Fetch profile
      getDoc(doc(db, "users", targetId)).then((snap) => {
        if (snap.exists()) {
          setSelectedUserProfile(snap.data());
        } else {
          setSelectedUserProfile(null);
        }
      });

      // Fetch history (limit 5)
      const q = query(
        collection(db, "support_tickets"), 
        where("uid", "==", targetId),
        limit(5)
      );
      getDocs(q).then((snap) => {
        setUserTicketHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    } else {
      setSelectedUserProfile(null);
      setUserTicketHistory([]);
    }
  }, [selectedTicket?.id]);

  // 2. Listen to Messages for the Selected Ticket (handles both sources & realtime offline store sync)
  useEffect(() => {
    if (!selectedTicket?.id) {
      setMessages([]);
      return;
    }

    const currentTicketId = selectedTicket.id;
    const trackingCode = selectedTicket.trackingNumber || selectedTicket.ticketNumber || currentTicketId;

    // Helper to merge new messages without duplicates
    const mergeNewMessages = (incomingList: any[]) => {
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const combined = [...prev];
        let hasNew = false;

        for (const item of incomingList) {
          const isDup = prev.some(
            (p) =>
              p.id === item.id ||
              (p.text === item.text && Math.abs((p.time || 0) - (item.time || 0)) < 3000)
          );
          if (!isDup) {
            combined.push(item);
            hasNew = true;
          }
        }

        if (hasNew) {
          combined.sort((a, b) => (a.time || 0) - (b.time || 0));
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
          return combined;
        }
        return prev;
      });
    };

    // Live Server/Telegram Polling Fallback (every 2 seconds)
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/support/offline-messages/${encodeURIComponent(currentTicketId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
            mergeNewMessages(data.messages);
            if (data.status) {
              setSelectedTicket((prev: any) => (prev && prev.id === currentTicketId ? { ...prev, status: data.status } : prev));
            }
          }
        }
      } catch {
        // silent
      }
    }, 2000);

    if (selectedTicket.isPostSource) {
      // Use comments subcollection for posts
      const commentsQuery = query(
        collection(db, "posts", currentTicketId, "comments"),
        orderBy("time", "asc")
      );
      const unsubComments = onSnapshot(commentsQuery, (snapshot) => {
        const msgList = snapshot.docs.map(d => ({ 
          id: d.id, 
          ...d.data(),
          senderName: d.data().userName || (d.data().isAdminComment ? "e-Vedika Team" : "Citizen"),
          text: d.data().text || d.data().comment
        }));
        setMessages(msgList);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }, () => {
        onSnapshot(collection(db, "posts", currentTicketId, "comments"), (snap) => {
          const msgList = snap.docs.map(d => ({ 
            id: d.id, 
            ...d.data(),
            senderName: d.data().userName || (d.data().isAdminComment ? "e-Vedika Team" : "Citizen"),
            text: d.data().text || d.data().comment
          }));
          msgList.sort((a: any, b: any) => (a.time || 0) - (b.time || 0));
          setMessages(msgList);
        });
      });
      return () => {
        unsubComments();
        clearInterval(pollInterval);
      };
    } else {
      // Use messages subcollection for support_tickets
      const messagesQuery = query(
        collection(db, "support_tickets", currentTicketId, "messages"),
        orderBy("time", "asc")
      );

      const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
        const msgList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setMessages(msgList);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }, () => {
        onSnapshot(collection(db, "support_tickets", currentTicketId, "messages"), (snap) => {
          const msgList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          msgList.sort((a: any, b: any) => (a.time || 0) - (b.time || 0));
          setMessages(msgList);
        });
      });

      // Auto mark as read/open if new (only for support_tickets)
      if (selectedTicket.status === "new") {
        updateDoc(doc(db, "support_tickets", currentTicketId), { status: "open" }).catch(console.error);
      }

      return () => {
        unsubMessages();
        clearInterval(pollInterval);
      };
    }
  }, [selectedTicket?.id]);

  // Handle Sending a Reply as "e-Vedika Team" (Instant Optimistic UI + Server/Telegram Sync)
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket?.id || isSending) return;

    setIsSending(true);
    const text = replyText.trim();
    setReplyText("");

    // ⚡ 1. INSTANT OPTIMISTIC DISPLAY IN CHAT THREAD
    const tempId = `opt_${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      senderId: currentUser?.uid || "admin",
      senderName: "e-Vedika Team",
      text: text,
      time: Date.now(),
      isAdminComment: true
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    const nextStatus = selectedTicket.status === "resolved" || selectedTicket.status === "closed" ? "open" : "in_progress";
    setSelectedTicket((prev: any) => prev ? { ...prev, status: nextStatus, lastReplyTime: Date.now(), lastReplyBy: "e-Vedika Team" } : null);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    try {
      // 2. Primary: Use Server API with Admin SDK (zero permission issues & instant Telegram alert)
      const res = await fetch("/api/support/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          text: text,
          status: nextStatus
        })
      });
      const data = await res.json().catch(() => ({ success: true }));
      if (data.success) {
        if (addToast) addToast("ప్రత్యుత్తరం పంపబడింది! (Reply sent & synced to Telegram)", "success");
        return;
      }

      // 3. Client fallback if API route failed
      if (selectedTicket.isPostSource) {
        await addDoc(collection(db, "posts", selectedTicket.id, "comments"), {
          uid: currentUser?.uid || "admin",
          userName: "e-Vedika Team",
          text: text,
          time: Date.now(),
          isAdminComment: true
        });
        await updateDoc(doc(db, "posts", selectedTicket.id), { updatedAt: Date.now() });
      } else {
        await addDoc(collection(db, "support_tickets", selectedTicket.id, "messages"), {
          senderId: currentUser?.uid || "admin",
          senderName: "e-Vedika Team",
          text: text,
          time: Date.now(),
          isAdminComment: true
        });
        await updateDoc(doc(db, "support_tickets", selectedTicket.id), {
          status: nextStatus,
          updatedAt: Date.now(),
          lastReplyBy: "e-Vedika Team",
          lastReplyTime: Date.now()
        });
      }

      if (addToast) addToast("ప్రత్యుత్తరం పంపబడింది! (Reply sent to citizen)", "success");
    } catch (e: any) {
      console.error("Error sending reply:", e);
      if (addToast) addToast(`Reply error: ${e.message}`, "error");
    } finally {
      setIsSending(false);
    }
  };

  // Handle 1-Click Spot Reply (Instant Optimistic UI + Server/Telegram Sync)
  const handleSendSpotReply = async (spot: typeof SPOT_REPLIES_DATA[0]) => {
    if (!selectedTicket?.id || isSending) return;
    setIsSending(true);

    // ⚡ 1. INSTANT OPTIMISTIC DISPLAY IN CHAT THREAD
    const tempId = `spot_${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      senderId: currentUser?.uid || "admin",
      senderName: "e-Vedika Team",
      text: spot.text,
      time: Date.now(),
      isAdminComment: true,
      spotLabel: spot.label
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setSelectedTicket((prev: any) => prev ? { ...prev, status: spot.status, lastReplyTime: Date.now(), lastReplyBy: "e-Vedika Team" } : null);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    try {
      // 2. Primary: Use Server API with Admin SDK (guarantees 100% permission pass & instant Telegram sync)
      const res = await fetch("/api/support/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          text: spot.text,
          status: spot.status
        })
      });
      const data = await res.json().catch(() => ({ success: true }));
      if (data.success) {
        if (addToast) addToast(`⚡ Spot Reply [${spot.label}] విజయవంతంగా పంపబడింది!`, "success");
        return;
      }

      // 3. Client fallback
      if (selectedTicket.isPostSource) {
        await addDoc(collection(db, "posts", selectedTicket.id, "comments"), {
          uid: currentUser?.uid || "admin",
          userName: "e-Vedika Team",
          text: spot.text,
          time: Date.now(),
          isAdminComment: true
        });
        await updateDoc(doc(db, "posts", selectedTicket.id), { updatedAt: Date.now() });
      } else {
        await addDoc(collection(db, "support_tickets", selectedTicket.id, "messages"), {
          senderId: currentUser?.uid || "admin",
          senderName: "e-Vedika Team",
          text: spot.text,
          time: Date.now(),
          isAdminComment: true
        });
        await updateDoc(doc(db, "support_tickets", selectedTicket.id), {
          status: spot.status,
          updatedAt: Date.now(),
          lastReplyBy: "e-Vedika Team",
          lastReplyTime: Date.now()
        });
      }
      if (addToast) addToast(`⚡ Spot Reply [${spot.label}] విజయవంతంగా పంపబడింది!`, "success");
    } catch (e: any) {
      console.error("Error sending spot reply:", e);
      if (addToast) addToast(`Spot reply error: ${e.message}`, "error");
    } finally {
      setIsSending(false);
    }
  };

  // Manual Trigger to Broadcast Ticket to Telegram
  const handleTriggerTelegramAlert = async () => {
    if (!selectedTicket?.id) return;
    const trackingNumber = selectedTicket.trackingNumber || selectedTicket.ticketNumber || selectedTicket.id.substring(0, 8).toUpperCase();
    const ok = await notifySupportTicketToTelegram({
      ticketId: selectedTicket.id,
      trackingNumber: trackingNumber,
      userName: selectedTicket.userName || selectedTicket.name || "Citizen",
      userPhone: selectedTicket.phone || selectedTicket.userPhone,
      userEmail: selectedTicket.userEmail || selectedTicket.email,
      subject: selectedTicket.subject || selectedTicket.title || "Support Request",
      category: selectedTicket.category || selectedTicket.moduleName || "General Support",
      message: selectedTicket.message || selectedTicket.problem || selectedTicket.description || ""
    });
    if (ok) {
      if (addToast) addToast("✅ టెలిగ్రామ్ అలర్ట్ & 1-Click Spot Reply బటన్లు పంపబడ్డాయి!", "success");
    } else {
      if (addToast) addToast("⚠️ టెలిగ్రామ్ నోటిఫికేషన్ పంపడంలో లోపం", "error");
    }
  };

  // Handle Status Change
  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedTicket?.id) return;
    try {
      const col = selectedTicket.isPostSource ? "posts" : "support_tickets";
      await setDoc(doc(db, col, selectedTicket.id), {
        status: newStatus,
        updatedAt: Date.now()
      }, { merge: true });
      setSelectedTicket({ ...selectedTicket, status: newStatus });
      if (addToast) addToast(`Status updated to ${newStatus.toUpperCase()}`, "success");
    } catch (e: any) {
      console.error(e);
      try {
        await setDoc(doc(db, "support_tickets", selectedTicket.id), {
          status: newStatus,
          updatedAt: Date.now()
        }, { merge: true });
        setSelectedTicket({ ...selectedTicket, status: newStatus });
        if (addToast) addToast(`Status updated to ${newStatus.toUpperCase()}`, "success");
      } catch (err: any) {
        if (addToast) addToast(`Error updating status: ${err.message}`, "error");
      }
    }
  };

  // Handle Priority Change
  const handleUpdatePriority = async (newPriority: string) => {
    if (!selectedTicket?.id) return;
    try {
      const col = selectedTicket.isPostSource ? "posts" : "support_tickets";
      await setDoc(doc(db, col, selectedTicket.id), {
        priority: newPriority,
        updatedAt: Date.now()
      }, { merge: true });
      setSelectedTicket({ ...selectedTicket, priority: newPriority });
      if (addToast) addToast(`Priority set to ${newPriority.toUpperCase()}`, "success");
    } catch (e: any) {
      console.error(e);
    }
  };

  // Filtered Tickets
  const filteredTickets = tickets.filter((t) => {
    const userName = (t.userName || t.name || t.userEmail || "").toLowerCase();
    const subject = (t.subject || t.title || t.problem || "").toLowerCase();
    const message = (t.message || t.description || "").toLowerCase();
    const trackingNo = (t.trackingNumber || t.ticketNumber || "").toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = userName.includes(query) || subject.includes(query) || message.includes(query) || trackingNo.includes(query) || t.id.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;
    if (statusFilter === "open") {
      const s = (t.status || "open").toLowerCase();
      return s === "open" || s === "new" || s === "private_support" || s === "sent to support" || s === "sent-to-support" || !t.status;
    }
    if (statusFilter === "in_progress") return t.status === "in_progress" || t.status === "pending";
    if (statusFilter === "resolved") return t.status === "resolved";
    if (statusFilter === "closed") return t.status === "closed";
    return true;
  });

  const openCount = tickets.filter(t => {
    const s = (t.status || "open").toLowerCase();
    return s === "open" || s === "new" || s === "private_support" || s === "sent to support" || s === "sent-to-support" || !t.status;
  }).length;
  const inProgressCount = tickets.filter(t => {
    const s = (t.status || "").toLowerCase();
    return s === "in_progress" || s === "pending";
  }).length;
  const resolvedCount = tickets.filter(t => t.status === "resolved").length;
  const closedCount = tickets.filter(t => t.status === "closed").length;

  return (
    <div className="space-y-6 pb-16 text-left max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0B3D91] to-slate-900 p-8 rounded-[36px] text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-200 flex items-center gap-1.5">
                <MessageCircle size={12} className="text-emerald-400" />
                Communication Hub
              </span>
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded-full text-[10px] font-bold">
                {openCount + inProgressCount} Active Support Inquiries
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Support Center & Citizen Inquiries
            </h2>
            <p className="text-blue-100/80 text-xs sm:text-sm max-w-2xl font-medium mt-1">
              Live Firestore support conversations, user problem reports, and official "e-Vedika Team" resolution desk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 bg-sky-500/10 border border-sky-400/30 rounded-2xl flex items-center gap-2 text-sky-200">
              <Radio size={14} className="text-sky-400 animate-pulse" />
              <div className="text-left">
                <span className="text-[9px] font-black uppercase tracking-wider block text-sky-300">Telegram 2-Way Bot</span>
                <span className="text-[11px] font-bold text-white">Live Direct Replies & Spot Sync</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-300 block">Open Tickets</span>
              <span className="text-lg font-black text-white">{openCount}</span>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-300 block">In Progress</span>
              <span className="text-lg font-black text-amber-300">{inProgressCount}</span>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-300 block">Resolved</span>
              <span className="text-lg font-black text-emerald-300">{resolvedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Support Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
        {/* LEFT COLUMN: TICKET LIST (3 COLS) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          {/* Filter and Search */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: "all", label: "All", count: tickets.length },
                { id: "open", label: "Open", count: openCount },
                { id: "in_progress", label: "Pending", count: inProgressCount },
                { id: "resolved", label: "Resolved", count: resolvedCount },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                    statusFilter === st.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {st.label} ({st.count})
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1 max-h-[600px]">
            {loading && tickets.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-[10px] font-bold">
                <RefreshCw className="animate-spin inline mb-2 text-blue-600 block mx-auto" size={20} /> 
                Loading requests...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-[11px] font-bold space-y-3">
                <MessageSquare className="mx-auto text-slate-300" size={32} />
                <p>ఎటువంటి సపోర్ట్ టికెట్లు లేవు (No tickets found)</p>
                <button
                  onClick={handleCreateTestTicket}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-sm hover:bg-blue-700 transition-all inline-block cursor-pointer"
                >
                  + Create Test Ticket (టెస్ట్ టికెట్ సృష్టించు)
                </button>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const status = (t.status || "open").toLowerCase();
                const priority = t.priority || "medium";
                const userName = t.userName || t.name || t.userEmail?.split('@')[0] || "Citizen User";
                const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "Recent";
                const priorityConfig = PRIORITY_LEVELS.find(p => p.id === priority) || PRIORITY_LEVELS[1];

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-200 shadow-xs"
                        : "hover:bg-slate-50 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 truncate flex-1">
                        <span className="font-mono text-[8px] px-1 py-0.5 bg-indigo-50 text-indigo-700 rounded font-black border border-indigo-100 shrink-0">
                          #{t.trackingNumber || t.ticketNumber || t.id.substring(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold text-slate-400 shrink-0">{dateStr}</span>
                        <button
                          onClick={(e) => handleDeleteTicket(e, t.id, t.isPostSource)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="తొలగించు (Delete Ticket)"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <h5 className="font-black text-[11px] text-slate-900 truncate leading-tight mb-1">
                      {t.subject || t.title || t.problem || "Support Inquiry"}
                    </h5>

                    <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mb-2">
                      {t.message || t.description || t.problem || "No description provided."}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black text-slate-600 flex items-center gap-1 truncate">
                        <User size={10} className="text-slate-400" />
                        {userName}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                        status === "resolved" ? "bg-emerald-100 text-emerald-800" :
                        status === "in_progress" || status === "pending" || status === "private_support" || status === "sent to support" || status === "sent-to-support" ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {status === "resolved" ? "Resolved" : "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CONVERSATION & REPLY PANEL (6-9 COLS) */}
        <div className={`lg:col-span-${showUserInfo ? '6' : '9'} bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden transition-all duration-300`}>
          {selectedTicket ? (
            <>
              {/* Ticket Top Header & Status Controls */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                        selectedTicket.status === "resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {selectedTicket.status === "resolved" ? "Resolved" : "Active Request"}
                      </span>
                      
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[9px] font-black">
                        <Hash size={10} /> {selectedTicket.trackingNumber || selectedTicket.ticketNumber || selectedTicket.id.substring(0, 8).toUpperCase()}
                      </div>
                      
                      <div className="relative group">
                        <div className={`px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 cursor-pointer text-[9px] font-black uppercase transition-all hover:brightness-95 ${
                          PRIORITY_LEVELS.find(p => p.id === (selectedTicket.priority || 'medium'))?.color || PRIORITY_LEVELS[1].color
                        }`}>
                          {PRIORITY_LEVELS.find(p => p.id === (selectedTicket.priority || 'medium'))?.icon}
                          Priority: {selectedTicket.priority || 'medium'}
                        </div>
                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 hidden group-hover:block overflow-hidden min-w-[120px] animate-in fade-in zoom-in-95 duration-200">
                          {PRIORITY_LEVELS.map(p => (
                            <button
                              key={p.id}
                              onClick={() => handleUpdatePriority(p.id)}
                              className="w-full px-4 py-2.5 text-left text-[10px] font-black uppercase hover:bg-slate-50 flex items-center gap-2 border-b border-slate-50 last:border-0"
                            >
                              {p.icon} {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedTicket.isPostSource ? (
                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                          <MessageCircle size={10} /> Community Post
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                          <Inbox size={10} /> Support Portal
                        </span>
                      )}

                      <button
                        onClick={(e) => handleDeleteTicket(e, selectedTicket.id, selectedTicket.isPostSource)}
                        className="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 transition-colors ml-auto cursor-pointer"
                        title="టికెట్ తొలగించు (Delete Ticket)"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {selectedTicket.subject || selectedTicket.title || selectedTicket.problem || "Citizen Support Inquiry"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleTriggerTelegramAlert}
                      title="Telegram కి అలర్ట్ & 1-Click Spot Reply బటన్లు పంపు"
                      className="px-3 py-2 bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Send size={13} /> 📱 Telegram అలర్ట్ పంపు
                    </button>
                    <button 
                      onClick={() => setShowUserInfo(!showUserInfo)}
                      className={`p-2.5 rounded-xl border transition-all shadow-sm ${showUserInfo ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                      title="User Sidebar"
                    >
                      <User size={18} />
                    </button>
                    <select
                      value={selectedTicket.status || "open"}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-[11px] font-black text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Chat Thread Messages Display */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/20 max-h-[420px] min-h-[300px]">
                {/* Original Support Inquiry */}
                <div className="flex justify-start">
                  <div className="max-w-[95%] w-full bg-indigo-50/30 rounded-[32px] rounded-tl-none p-6 border border-indigo-100/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex items-center justify-between gap-4 mb-4 border-b border-indigo-100/30 pb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-600">
                           <User size={20} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 leading-none">
                            {selectedTicket.userName || "Citizen"}
                          </p>
                          <p className="text-[9px] text-indigo-600 font-black uppercase tracking-widest mt-1">Original Submission</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block">
                          {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleDateString() : ''}
                        </span>
                        <span className="text-[10px] font-black text-slate-500">
                          {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap font-medium relative z-10 italic bg-white/50 p-4 rounded-2xl border border-white/80">
                      "{selectedTicket.message || selectedTicket.description || selectedTicket.problem || selectedTicket.subject || "No content provided."}"
                    </p>
                  </div>
                </div>

                {/* Subcollection Thread Messages */}
                {messages.map((m) => {
                  const isAdminMsg = m.senderName === "e-Vedika Team" || m.senderId === "admin" || m.senderId === currentUser?.uid || m.isAdminComment || m.fromTelegram;

                  return (
                    <div
                      key={m.id}
                      className={`flex ${isAdminMsg ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-3xl p-4 shadow-xs ${
                          isAdminMsg
                            ? 'bg-[#0B3D91] text-white rounded-tr-none border border-blue-900'
                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className={`text-[11px] font-black flex items-center gap-1.5 ${isAdminMsg ? 'text-blue-100' : 'text-slate-900'}`}>
                            {isAdminMsg && <Sparkles size={12} className="text-amber-300" />}
                            {m.senderName || (isAdminMsg ? "e-Vedika Team" : "Citizen")}
                            {isAdminMsg && (
                              <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded text-white font-bold">
                                Official Admin
                              </span>
                            )}
                            {m.fromTelegram && (
                              <span className="text-[9px] bg-sky-500/30 text-sky-100 border border-sky-400/40 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                                📱 Telegram Reply
                              </span>
                            )}
                          </span>
                          <span className={`text-[9px] ${isAdminMsg ? 'text-blue-200' : 'text-slate-400'}`}>
                            {m.time ? new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        {m.text && m.text.startsWith("data:audio/") ? (
                          <div className="flex flex-col gap-1 py-1 min-w-[200px]">
                            <span className={`text-[10px] font-bold flex items-center gap-1 ${isAdminMsg ? 'text-blue-200' : 'text-slate-500'}`}>
                              <Mic size={12} className="text-rose-400 animate-pulse" /> వాయిస్ సందేశం (Voice Message)
                            </span>
                            <audio src={m.text} controls className="w-full max-w-full rounded-md h-8 text-black" />
                          </div>
                        ) : (
                          <p className={`text-xs leading-relaxed whitespace-pre-wrap ${isAdminMsg ? 'text-blue-50' : 'text-slate-700'}`}>
                            {m.text}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* ⚡ 1-Click Spot Replies Toolbar */}
              <div className="px-5 py-3 bg-indigo-50/50 border-t border-indigo-100/60 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-500 fill-amber-500" />
                    ⚡ 1-Click Spot Replies (తక్షణ ప్రత్యుత్తరాలు):
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold">
                    (Telegram బాట్ లో మరియు వెబ్‌సైట్ లో ఒకేసారి సింక్ అవుతాయి)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SPOT_REPLIES_DATA.map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => handleSendSpotReply(spot)}
                      disabled={isSending}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 ${spot.btnColor}`}
                      title={spot.text}
                    >
                      <span>{spot.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Template Replies (paste to textarea) */}
              <div className="px-5 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Sparkles size={11} className="text-blue-600" /> టెంప్లేట్ కాపీ:
                </span>
                {QUICK_RESPONSES.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReplyText(qr)}
                    className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-slate-600 hover:text-blue-700 rounded-lg text-[10px] font-semibold transition-all shrink-0 truncate max-w-[220px]"
                    title={qr}
                  >
                    {qr.slice(0, 30)}...
                  </button>
                ))}
              </div>

              {/* Reply Input Area */}
              <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-2">
                {isRecording ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between text-xs animate-pulse">
                    <div className="flex items-center gap-2 text-rose-700 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
                      <span>వాయిస్ ప్రత్యుత్తరం రికార్డ్ అవుతోంది... {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, "0")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => stopRecording(false)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-black transition-all cursor-pointer"
                        title="Cancel"
                      >
                        రద్దు (Cancel)
                      </button>
                      <button
                        type="button"
                        onClick={() => stopRecording(true)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                        title="Stop & Send"
                      >
                        పంపండి (Stop & Send)
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type an official response as 'e-Vedika Team' to this citizen..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={startRecording}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Record voice note"
                        >
                          <Mic size={14} /> Record Voice Note (వాయిస్ నోట్)
                        </button>
                        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                          Press <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Ctrl+Enter</kbd> to send
                        </span>
                      </div>

                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || isSending}
                        className="px-6 py-2.5 bg-[#0B3D91] hover:bg-blue-900 disabled:opacity-50 text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-900/20 flex items-center gap-2 cursor-pointer"
                      >
                        <Send size={14} /> {isSending ? "Sending..." : "Reply as e-Vedika Team"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-3 p-12">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare size={32} />
              </div>
              <h4 className="text-sm font-black text-slate-700">Select a Support Conversation</h4>
              <p className="text-xs text-slate-400 max-w-sm text-center">
                Click on any citizen inquiry from the left column to view the full dialogue and respond as the e-Vedika Team.
              </p>
            </div>
          )}
        </div>

        {/* USER QUICK INFO SIDEBAR (3 COLS) */}
        {showUserInfo && selectedTicket && (
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-100 bg-slate-50/30">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={14} className="text-blue-600" /> User Quick Info
              </h4>

              <div className="flex flex-col items-center text-center gap-3 py-2">
                <div className="w-20 h-20 rounded-full bg-indigo-50 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                  {selectedUserProfile?.photoURL ? (
                    <img src={selectedUserProfile.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-indigo-300" />
                  )}
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-sm">
                    {selectedUserProfile?.username || selectedTicket.userName || "Citizen"}
                  </h5>
                  <div className="flex items-center gap-1 justify-center mt-1">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Verified Citizen</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Email Address</p>
                    <p className="text-[11px] font-bold text-slate-700 truncate">{selectedUserProfile?.email || selectedTicket.userEmail || 'Not Provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Phone Number</p>
                    <p className="text-[11px] font-bold text-slate-700 truncate">
                      {selectedTicket.userPhone || selectedUserProfile?.phoneNumber || 'Not Provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Joined Portal</p>
                    <p className="text-[11px] font-bold text-slate-700">
                      {selectedUserProfile?.createdAt ? new Date(selectedUserProfile.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachments Section if any */}
              {(selectedTicket.mediaUrl || (selectedTicket.attachments && selectedTicket.attachments.length > 0)) && (
                <div className="space-y-3 pt-2">
                  <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Attachments & Media</h6>
                  <div className="space-y-2">
                    {selectedTicket.mediaUrl && (
                      <div className="relative group rounded-xl overflow-hidden border border-slate-200">
                        {selectedTicket.mediaType?.startsWith('image/') ? (
                          <img src={selectedTicket.mediaUrl} alt="Media" className="w-full h-32 object-cover cursor-pointer" onClick={() => window.open(selectedTicket.mediaUrl, '_blank')} />
                        ) : (
                          <div className="w-full h-20 bg-slate-100 flex items-center justify-center text-slate-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                        <a href={selectedTicket.mediaUrl} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow-sm text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                    {selectedTicket.attachments?.map((at: any, i: number) => (
                      <a 
                        key={i}
                        href={at.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Paperclip size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-slate-700 truncate">{at.name || 'Attachment'}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Click to View</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* History */}
              <div className="space-y-3 pt-2">
                <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Recent Ticket History</h6>
                {userTicketHistory.length > 0 ? (
                  <div className="space-y-2">
                    {userTicketHistory.map(h => (
                      <div key={h.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 transition-all">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="text-[9px] font-mono font-black text-indigo-600 bg-indigo-50 px-1 rounded">
                            #{h.trackingNumber || h.ticketNumber || h.id.substring(0, 5).toUpperCase()}
                          </span>
                          <span className={`text-[8px] font-black uppercase ${h.status === 'resolved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {h.status}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-700 line-clamp-1">{h.subject || 'Support Inquiry'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic">No previous ticket history found.</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => window.open(`/profile/${selectedTicket.userId || selectedTicket.uid}`, '_blank')}
                className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink size={12} /> View Full Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
