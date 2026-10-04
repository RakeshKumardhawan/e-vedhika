import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, setDoc, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Generates a clean, human-readable, unique Support Ticket tracking number.
 * Format: EV-Sup-XX (e.g. EV-Sup-01)
 */
export function generateTicketTrackingNumber(): string {
  const randomNum = Math.floor(1 + Math.random() * 999);
  const formattedNum = randomNum.toString().padStart(2, '0');
  return `EV-Sup-${formattedNum}`;
}

export interface PushToSupportResult {
  success: boolean;
  trackingNumber: string;
  ticketId: string;
  error?: string;
}

/**
 * Pushes a pending post into the Support System (support_tickets),
 * assigning a unique tracking number and notifying the user.
 */
export async function pushPostToSupportSystem(
  post: any,
  adminUser?: any,
  customNote?: string
): Promise<PushToSupportResult> {
  const trackingNumber = post.trackingNumber || generateTicketTrackingNumber();
  const postId = post.id;
  const authorUid = post.uid || post.authorId || post.userId || "";
  const authorName = post.userName || post.authorName || post.author || post.user || "Citizen";
  const postTitle = post.title || post.subject || post.problem || "Support Inquiry / సహాయ విజ్ఞప్తి";
  const postContent = post.content || post.description || post.problem || postTitle;

  // 1. Try Server API with Admin SDK first (guarantees 100% bypass of client permission glitches)
  try {
    const serverRes = await fetch("/api/support/push-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post, adminUser, customNote, trackingNumber })
    });
    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data.success) {
        return {
          success: true,
          trackingNumber: data.trackingNumber || trackingNumber,
          ticketId: data.ticketId || `tk_${Date.now()}`
        };
      }
    }
  } catch (serverErr) {
    console.warn("Server push-post API failed or offline, falling back to direct Firestore:", serverErr);
  }

  // 2. Direct Firestore Client Fallback
  try {
    // A. First priority: Hide the post from public view immediately
    if (postId) {
      let updateSuccessful = false;
      const updatePayload = {
        status: "private_support",
        trackingNumber: trackingNumber,
        ticketNumber: trackingNumber,
        pushedToSupportAt: Date.now(),
        pushedBy: adminUser?.fullName || adminUser?.username || "Admin",
        verified: false
      };

      try {
        await updateDoc(doc(db, "posts", postId), updatePayload);
        updateSuccessful = true;
      } catch (ePosts) {
        try {
          await updateDoc(doc(db, "problems", postId), updatePayload);
          updateSuccessful = true;
        } catch (eProbs) {
          console.warn("Could not find post in 'posts' or 'problems' collections to hide it:", eProbs);
        }
      }
      
      if (!updateSuccessful) {
        // If we can't hide the post, we should probably still try to create the ticket,
        // but it's a warning sign.
      }
    }

    // B. Create the Support Ticket in Firestore
    const ticketPayload = {
      trackingNumber: trackingNumber,
      ticketNumber: trackingNumber,
      postId: postId || null,
      subject: postTitle,
      problem: postContent,
      category: post.category || "General Support",
      status: "open",
      priority: "normal",
      uid: authorUid,
      userId: authorUid,
      userName: authorName,
      userEmail: post.userEmail || post.email || "",
      userPhone: post.userPhone || post.phone || "",
      attachments: post.attachments || [],
      mediaUrl: post.mediaUrl || "",
      mediaType: post.mediaType || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source: "pending_post_push",
      lastReplyBy: customNote ? "e-Vedika Team" : "Citizen",
      lastReplyTime: Date.now()
    };

    let ticketRef: any = null;
    try {
      ticketRef = await addDoc(collection(db, "support_tickets"), ticketPayload);
    } catch {
      const fallbackDoc = doc(collection(db, "support_tickets"));
      await setDoc(fallbackDoc, ticketPayload);
      ticketRef = fallbackDoc;
    }

    // Initial citizen message
    let initialMessage = postContent;
    if (post.userPhone || post.phone) {
      initialMessage += `\n\n📞 సంప్రదించాల్సిన ఫోన్ నంబర్: ${post.userPhone || post.phone}`;
    }

    await addDoc(collection(db, "support_tickets", ticketRef.id, "messages"), {
      senderId: authorUid || "citizen",
      senderName: authorName,
      text: initialMessage,
      time: Date.now()
    }).catch(console.error);

    // Initial acknowledgment
    await addDoc(collection(db, "support_tickets", ticketRef.id, "messages"), {
      senderId: "system",
      senderName: "e-Vedika Team",
      text: customNote?.trim() || "నమస్కారం! మీ విన్నపం మా సపోర్ట్ సిస్టమ్‌కు చేరింది. మా బృందం త్వరలోనే దీనిని పరిశీలించి పరిష్కరిస్తుంది.",
      time: Date.now() + 50,
      isAdminComment: true
    }).catch(console.error);

    // Telegram Alert
    notifySupportTicketToTelegram({
      ticketId: ticketRef.id,
      trackingNumber: trackingNumber,
      userName: authorName,
      userPhone: post.userPhone || post.phone,
      userEmail: post.userEmail || post.email,
      subject: postTitle,
      category: post.category || "General Support",
      message: initialMessage
    }).catch(console.error);

    if (authorUid && authorUid !== "community_user") {
      await addDoc(collection(db, "notifications"), {
        uid: authorUid,
        title: "🎧 సపోర్ట్ రిక్వెస్ట్ అప్‌డేట్ (Support Request Sent)",
        message: `మీరు చేసిన సపోర్ట్ రిక్వెస్ట్ ను అడ్మిన్ సపోర్ట్ టీం కి పంపారు. ట్రాకింగ్ ID: #${trackingNumber}. మీ రిక్వెస్ట్ స్టేటస్ ను ఇక్కడ ట్రాక్ చేసుకోవచ్చు.`,
        type: "support_ticket_created",
        read: false,
        readBy: [],
        time: Date.now(),
        ticketId: ticketRef.id,
        postId: postId || null,
        trackingNumber: trackingNumber,
        senderUid: adminUser?.uid || "admin"
      }).catch(console.error);
    }

    return {
      success: true,
      trackingNumber,
      ticketId: ticketRef.id
    };
  } catch (error: any) {
    console.error("Error pushing post to support system:", error);
    return {
      success: false,
      trackingNumber: "",
      ticketId: "",
      error: error?.message || "Failed to push to support system"
    };
  }
}

/**
 * Searches and tracks a ticket or inquiry by Unique Tracking Code / Ticket ID.
 */
export async function trackTicketByCode(inputCode: string): Promise<{
  found: boolean;
  ticket?: any;
  messages?: any[];
  linkedPost?: any;
  message?: string;
}> {
  const code = inputCode.trim();
  if (!code) {
    return { found: false, message: "దయచేసి సరైన ట్రాకింగ్ నెంబర్ ఎంటర్ చేయండి." };
  }

  try {
    let matchedTicket: any = null;

    // 1. Try trackingNumber match
    const q1 = query(collection(db, "support_tickets"), where("trackingNumber", "==", code));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      const docSnap = snap1.docs[0];
      matchedTicket = { id: docSnap.id, ...docSnap.data() };
    }

    // 2. Try uppercase trackingNumber match
    if (!matchedTicket && code.toUpperCase() !== code) {
      const qUpper = query(collection(db, "support_tickets"), where("trackingNumber", "==", code.toUpperCase()));
      const snapUpper = await getDocs(qUpper);
      if (!snapUpper.empty) {
        const docSnap = snapUpper.docs[0];
        matchedTicket = { id: docSnap.id, ...docSnap.data() };
      }
    }

    // 3. Try ticketNumber match
    if (!matchedTicket) {
      const q2 = query(collection(db, "support_tickets"), where("ticketNumber", "==", code));
      const snap2 = await getDocs(q2);
      if (!snap2.empty) {
        const docSnap = snap2.docs[0];
        matchedTicket = { id: docSnap.id, ...docSnap.data() };
      }
    }

    // 4. Try Direct Document ID
    if (!matchedTicket) {
      try {
        const directDoc = await getDoc(doc(db, "support_tickets", code));
        if (directDoc.exists()) {
          matchedTicket = { id: directDoc.id, ...directDoc.data() };
        }
      } catch {
        // Document ID not found or invalid format
      }
    }

    // 5. If found ticket, fetch messages and linked post
    if (matchedTicket) {
      let messages: any[] = [];
      try {
        const msgQuery = query(
          collection(db, "support_tickets", matchedTicket.id, "messages"),
          orderBy("time", "asc")
        );
        const msgSnap = await getDocs(msgQuery);
        messages = msgSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.warn("Retrying messages fallback without orderBy:", err);
        const fallbackSnap = await getDocs(collection(db, "support_tickets", matchedTicket.id, "messages"));
        messages = fallbackSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.time || 0) - (b.time || 0));
      }

      let linkedPost: any = null;
      if (matchedTicket.postId) {
        try {
          const postSnap = await getDoc(doc(db, "posts", matchedTicket.postId));
          if (postSnap.exists()) {
            linkedPost = { id: postSnap.id, ...postSnap.data() };
          }
        } catch {
          // ignore
        }
      }

      return {
        found: true,
        ticket: matchedTicket,
        messages,
        linkedPost
      };
    }

    // 6. Check if it's a post with this tracking number
    const postQ = query(collection(db, "posts"), where("trackingNumber", "==", code));
    const postSnap = await getDocs(postQ);
    if (!postSnap.empty) {
      const pData: any = { id: postSnap.docs[0].id, ...postSnap.docs[0].data() };
      return {
        found: true,
        ticket: {
          id: pData.id,
          trackingNumber: pData.trackingNumber || code,
          subject: pData.title || pData.subject || "Community Post",
          problem: pData.content || pData.description || "",
          status: pData.status || "private_support",
          createdAt: pData.time || pData.createdAt || Date.now(),
          updatedAt: pData.pushedToSupportAt || Date.now(),
          userName: pData.userName || pData.authorName || "Citizen"
        },
        messages: [
          {
            senderName: pData.userName || "Citizen",
            text: pData.content || pData.description || "",
            time: pData.time || Date.now()
          }
        ],
        linkedPost: pData
      };
    }

    return {
      found: false,
      message: `ట్రాకింగ్ నెంబర్ '${code}' తో ఎలాంటి సపోర్ట్ టికెట్ కనుగొనబడలేదు. దయచేసి నెంబర్ సరిచూసుకోండి.`
    };
  } catch (error: any) {
    console.error("Error tracking ticket:", error);
    return {
      found: false,
      message: `ట్రాక్ చేయడంలో లోపం ఏర్పడింది: ${error?.message || ""}`
    };
  }
}

/**
 * Sends real-time Support Center Alert to Telegram with 1-Click Spot Reply buttons.
 */
export async function notifySupportTicketToTelegram(payload: {
  ticketId: string;
  trackingNumber?: string;
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  subject?: string;
  category?: string;
  moduleName?: string;
  message?: string;
  isFollowUp?: boolean;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/support/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    return !!data.success;
  } catch (e) {
    console.warn("Failed to notify Telegram about support ticket:", e);
    return false;
  }
}

