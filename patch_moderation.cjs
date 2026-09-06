const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

// Replace handleApprovePost logic
const oldHandleApprove = `  const handleApprovePost = async (postId: string) => {
    try {
      await updateDoc(doc(db, 'posts', postId), { status: 'approved', verified: true });
      if (addToast) addToast("Post approved and verified!", "success");
    } catch (e) {
      console.error(e);
      if (addToast) addToast("Failed to approve post", "error");
    }
  };`;

const newHandlers = `  const handleUpdatePostStatus = async (post: any, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'posts', post.id), { status: newStatus, verified: newStatus === 'published' });
      if (newStatus === 'private_support') {
        // Create a support ticket from this post
        const { collection, addDoc } = require('firebase/firestore');
        await addDoc(collection(db, 'support_tickets'), {
          subject: post.title || post.subject || 'Support Request',
          status: 'new',
          uid: post.uid,
          userName: post.userName || post.authorName || 'Citizen',
          createdAt: Date.now(),
          updatedAt: Date.now()
        }).then(async (docRef) => {
          await addDoc(collection(db, 'support_tickets', docRef.id, 'messages'), {
            senderId: post.uid,
            senderName: post.userName || post.authorName || 'Citizen',
            text: post.content || post.description || '',
            time: Date.now()
          });
        });
        if (addToast) addToast("Moved to Private Support!");
      } else {
        if (addToast) addToast("Post status updated to " + newStatus, "success");
      }
    } catch (e) {
      console.error(e);
      if (addToast) addToast("Failed to update post", "error");
    }
  };

  const handleApprovePost = async (postId: string) => {
    try {
      await updateDoc(doc(db, 'posts', postId), { status: 'published', verified: true });
      if (addToast) addToast("Post published!", "success");
    } catch (e) {
      console.error(e);
      if (addToast) addToast("Failed to publish post", "error");
    }
  };`;

content = content.replace(oldHandleApprove, newHandlers);

// Replace the UI part
const oldButtons = `<td className="p-3.5 text-right space-x-2">
                                <button
                                  onClick={() => handleApprovePost(p.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black transition-colors shadow-xs"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleDeletePost(p.id)}
                                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-black transition-colors shadow-xs"
                                >
                                  Delete
                                </button>
                              </td>`;

const newButtons = `<td className="p-3.5 text-right space-x-1 flex justify-end">
                                {p.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdatePostStatus(p, 'published')}
                                      className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black transition-colors shadow-xs"
                                    >
                                      Publish
                                    </button>
                                    <button
                                      onClick={() => handleUpdatePostStatus(p, 'private_support')}
                                      className="px-2 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-black transition-colors shadow-xs"
                                    >
                                      To Support
                                    </button>
                                    <button
                                      onClick={() => handleUpdatePostStatus(p, 'rejected')}
                                      className="px-2 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-black transition-colors shadow-xs"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDeletePost(p.id)}
                                  className="px-2 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-black transition-colors shadow-xs ml-1"
                                >
                                  Delete
                                </button>
                              </td>`;
content = content.replace(oldButtons, newButtons);

// Replace status text display
const oldStatusBadge = `<span className={\`px-2 py-0.5 rounded-md text-[10px] font-black uppercase \${p.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}\`}>
                                  {p.status || 'Pending Review'}
                                </span>`;
const newStatusBadge = `<span className={\`px-2 py-0.5 rounded-md text-[10px] font-black uppercase \${p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : p.status === 'private_support' ? 'bg-purple-50 text-purple-700' : p.status === 'rejected' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}\`}>
                                  {p.status || 'pending'}
                                </span>`;
content = content.replace(oldStatusBadge, newStatusBadge);
content = content.replace(oldStatusBadge, newStatusBadge); // In case of duplicate

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
