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
  try {
    const trackingNumber = post.trackingNumber || generateTicketTrackingNumber();
    const postId = post.id;
    const authorUid = post.uid || post.authorId || post.userId || "";
    const authorName = post.userName || post.authorName || post.author || post.user || "Citizen";
    const postTitle = post.title || post.subject || post.problem || "Support Inquiry / సహాయ విజ్ఞప్తి";
    const postContent = post.content || post.description || post.problem || postTitle;

    // 1. Update the Post in Firestore (try posts, fallback to problems)
    if (postId) {
      try {
        await updateDoc(doc(db, "posts", postId), {
          status: "private_support",
          trackingNumber: trackingNumber,
          ticketNumber: trackingNumber,
          pushedToSupportAt: Date.now(),
          pushedBy: adminUser?.fullName || adminUser?.username || "Admin",
          verified: false
        });
      } catch (ePosts) {
        console.warn("Could not update posts record directly, trying problems:", ePosts);
        try {
          await updateDoc(doc(db, "problems", postId), {
            status: "private_support",
            trackingNumber: trackingNumber,
            ticketNumber: trackingNumber,
            pushedToSupportAt: Date.now(),
            pushedBy: adminUser?.fullName || adminUser?.username || "Admin"
          });
        } catch (eProb) {
          console.warn("Could not update problem record directly, trying suggestions:", eProb);
          try {
            await updateDoc(doc(db, "suggestions", postId), {
              status: "private_support",
              trackingNumber: trackingNumber,
              ticketNumber: trackingNumber,
              pushedToSupportAt: Date.now(),
              pushedBy: adminUser?.fullName || adminUser?.username || "Admin"
            });
          } catch (eSug) {
            console.warn("Could not update suggestion record directly:", eSug);
          }
        }
      }
    }

    // 2. Create the Support Ticket in Firestore
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
    } catch (createErr) {
      console.warn("addDoc failed, trying setDoc fallback:", createErr);
      const fallbackDoc = doc(collection(db, "support_tickets"));
      await setDoc(fallbackDoc, ticketPayload);
      ticketRef = fallbackDoc;
    }

    // 3. Add initial citizen message to messages subcollection
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

    // 4. If admin provided a note or initial response
    if (customNote && customNote.trim()) {
      await addDoc(collection(db, "support_tickets", ticketRef.id, "messages"), {
        senderId: adminUser?.uid || "admin",
        senderName: "e-Vedika Team",
        text: customNote.trim(),
        time: Date.now() + 50,
        isAdminComment: true
      }).catch(console.error);
    } else {
      // Automatic Acknowledgment Reply
      await addDoc(collection(db, "support_tickets", ticketRef.id, "messages"), {
        senderId: "system",
        senderName: "e-Vedika Team",
        text: "నమస్కారం! మీ విన్నపం మా సపోర్ట్ సిస్టమ్‌కు విజయవంతంగా చేరింది. మా బృందం త్వరలోనే దీనిని పరిశీలించి మీకు సమాధానం ఇస్తుంది. (Your request has been received. Our team will review and respond shortly.)",
        time: Date.now() + 50,
        isAdminComment: true
      }).catch(console.error);
    }

    // 5. Send Notification to User
    if (authorUid) {
      await addDoc(collection(db, "notifications"), {
        uid: authorUid,
        title: "🎫 సపోర్ట్ సిస్టమ్‌కు పంపబడింది (Pushed to Support System)",
        message: `మీ పెండింగ్ పోస్ట్ '${postTitle.substring(0, 35)}' సపోర్ట్ సిస్టమ్‌కు మార్చబడింది. మీ యూనిక్ ట్రాకింగ్ నెంబర్: ${trackingNumber}. ఈ నెంబర్‌తో మీరు ఎప్పుడైనా స్టేటస్ లైవ్ ట్రాక్ చేయవచ్చు.`,
        type: "support_ticket",
        trackingNumber: trackingNumber,
        ticketId: ticketRef.id,
        postId: postId,
        read: false,
        time: Date.now()
      }).catch(console.error);
    }

    // 6. Security & Audit Log
    await addDoc(collection(db, "security_logs"), {
      category: "SETTINGS_CHANGE",
      title: "Post Pushed to Support System",
      description: `Post '${postTitle}' [ID: ${postId}] pushed to support with Tracking #${trackingNumber}`,
      admin: adminUser?.fullName || adminUser?.username || "Admin",
      time: Date.now()
    }).catch(console.error);

    return {
      success: true,
      trackingNumber,
      ticketId: ticketRef.id
    };
  } catch (error: any) {
    console.error("Error pushing post to support system:", error);
    const errMsg = error?.message || "Unknown error occurred";
    const userFriendlyError = errMsg.includes("permission")
      ? "అనుమతులు సరిపోలేదు (Missing or insufficient permissions)."
      : errMsg;
    return {
      success: false,
      trackingNumber: "",
      ticketId: "",
      error: userFriendlyError
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
