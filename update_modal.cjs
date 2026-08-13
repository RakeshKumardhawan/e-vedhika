const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStart = `{showDirectMessages && (`
const targetEndString = `          </motion.div>
        </div>
      )}`;

const startIndex = content.indexOf(targetStart);
if (startIndex === -1) {
  console.log("Could not find start");
  process.exit(1);
}

// Just to be safe, search for the end from the start
const endIndex = content.indexOf(targetEndString, startIndex) + targetEndString.length;

if (endIndex === -1 || endIndex <= startIndex) {
  console.log("Could not find end");
  process.exit(1);
}

const replacement = `{showDirectMessages && (
        <div className="fixed inset-0 z-[4000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-6xl bg-white sm:rounded-[24px] rounded-2xl shadow-2xl overflow-hidden flex flex-row h-[85vh] max-h-[900px]"
          >
            {/* Left Pane - User List */}
            <div className={\`w-full sm:w-[350px] md:w-[400px] shrink-0 border-r border-slate-200 bg-white flex-col h-full \${activeDmUser ? 'hidden sm:flex' : 'flex'}\`}>
              <div className="p-3 sm:p-4 bg-slate-50 flex items-center justify-between border-b border-slate-200">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <MessageCircle size={18} className="text-primary" />
                  Messages
                </h3>
                <button
                  onClick={() => {
                    setShowDirectMessages(false);
                    setActiveDmUser(null);
                  }}
                  className="p-2 rounded-full bg-slate-200/60 hover:bg-slate-300 transition-colors cursor-pointer text-slate-600 sm:hidden"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-3 border-b border-slate-200 bg-white">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={dmSearchQuery}
                    onChange={(e) => setDmSearchQuery(e.target.value)}
                    placeholder="Search or start new chat"
                    className="w-full bg-slate-100 border-none pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 scrollbar-thin">
                {dmUsersList.length > 0 ? (
                  dmUsersList.map(u => {
                    const isOnline = (u as any).lastActive && (Date.now() - (u as any).lastActive < 120000);
                    const isSelected = activeDmUser?.id === u.id;
                    const unreadCount = (u as any).unreadCount || 0;
                    
                    return (
                      <div
                        key={u.id}
                        onClick={() => setActiveDmUser(u)}
                        className={\`p-3 hover:bg-slate-100/80 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors relative \${isSelected ? 'bg-slate-100' : ''}\`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-black text-lg">
                              {(u.name || u.username || "U")[0]}
                            </div>
                          )}
                          {isOnline && (
                             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="text-[13px] font-black text-slate-900 truncate">
                              {u.surname} {u.name}
                            </h4>
                            {(u as any).lastMessageAt > 0 && (
                              <span className={\`text-[10px] font-bold shrink-0 ml-2 \${unreadCount > 0 ? 'text-green-600' : 'text-slate-400'}\`}>
                                {new Date((u as any).lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-[11px] font-medium text-slate-500 truncate flex-1 flex items-center gap-1">
                              {(u as any).lastMessageText ? (
                                <>
                                  {(u as any).lastMessageSender === user.uid && <span className="text-blue-500">✓</span>}
                                  <span className="truncate">{(u as any).lastMessageText}</span>
                                </>
                              ) : (
                                <span className="italic text-slate-400">Click to start chatting</span>
                              )}
                            </p>
                            {unreadCount > 0 && (
                              <span className="text-[10px] bg-green-500 text-white font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm ml-2 shrink-0">
                                {unreadCount > 99 ? '99+' : unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-10 text-center text-slate-400 text-xs font-bold flex flex-col items-center gap-3">
                    <MessageCircle size={36} className="text-slate-300 mx-auto" />
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane - Active Chat */}
            <div className={\`flex-1 bg-[#efeae2] flex-col h-full relative \${!activeDmUser ? 'hidden sm:flex' : 'flex'}\`}>
              {!activeDmUser ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-[#f0f2f5] relative">
                  <button
                    onClick={() => setShowDirectMessages(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-500 hidden sm:block"
                  >
                    <X size={20} />
                  </button>
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm text-slate-300">
                    <MessageCircle size={64} />
                  </div>
                  <h2 className="text-2xl font-light text-slate-700 mb-2">E-VEDHIKA Web</h2>
                  <p className="text-sm text-slate-500 max-w-md font-medium">Select a conversation from the left to start messaging. All messages are securely synced.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  {/* Chat Header */}
                  <div className="px-4 py-3 bg-slate-50 flex items-center gap-3 border-b border-slate-200 sticky top-0 z-10 shrink-0">
                    <button 
                      className="sm:hidden p-2 -ml-2 rounded-full hover:bg-slate-200 transition-colors" 
                      onClick={() => setActiveDmUser(null)}
                    >
                      <ArrowLeft size={18} className="text-slate-600" />
                    </button>
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative">
                      {activeDmUser.photoURL ? (
                        <img src={activeDmUser.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-black">
                          {(activeDmUser.name || activeDmUser.username || "U")[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-black text-slate-900 truncate">
                        {activeDmUser.surname} {activeDmUser.name}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 truncate">
                        {typingUsers[activeDmUser.id] ? (
                          <span className="text-green-600 italic">typing...</span>
                        ) : (
                          (activeDmUser as any).lastActive && (Date.now() - (activeDmUser as any).lastActive < 120000) 
                            ? "Online" 
                            : \`Last seen \${(activeDmUser as any).lastActive ? new Date((activeDmUser as any).lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'recently'}\`
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowDirectMessages(false);
                        setActiveDmUser(null);
                      }}
                      className="p-2 rounded-full hover:bg-slate-200 transition-colors cursor-pointer text-slate-500 hidden sm:block"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')] bg-repeat opacity-95">
                    {dmMessages.length > 0 ? (
                      dmMessages.map((m: any, idx: number) => {
                        const isMe = m.senderId === user?.uid;
                        const prevMsg = idx > 0 ? dmMessages[idx - 1] : null;
                        const timeDiff = prevMsg ? (m.createdAt || 0) - (prevMsg.createdAt || 0) : 999999;
                        const showTimeHeader = timeDiff > 300000;
                        const sameSenderAsPrev = prevMsg && prevMsg.senderId === m.senderId && !showTimeHeader;

                        return (
                          <div key={m.id}>
                            {showTimeHeader && (
                              <div className="text-center my-3">
                                <span className="text-[10px] font-bold bg-white/80 backdrop-blur-sm text-slate-600 px-3 py-1.5 rounded-lg shadow-sm">
                                  {new Date(m.createdAt || Date.now()).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            )}
                            <div className={\`flex \${isMe ? "justify-end" : "justify-start"} \${sameSenderAsPrev ? "mt-0.5" : "mt-2"}\`}>
                              <div
                                className={\`max-w-[80%] px-3 py-2 rounded-lg text-[13px] shadow-sm relative group \${
                                  isMe
                                    ? "bg-[#d9fdd3] text-slate-800 rounded-tr-none"
                                    : "bg-white text-slate-800 rounded-tl-none"
                                }\`}
                              >
                                <p className="leading-relaxed break-words whitespace-pre-wrap">{m.text}</p>
                                <div className={\`flex items-center justify-end gap-1 mt-0.5 text-[9px] font-bold \${isMe ? "text-slate-500" : "text-slate-400"}\`}>
                                  <span>
                                    {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                  {isMe && (
                                    <span className={m.read ? "text-blue-500 font-black text-[10px]" : "text-slate-400"}>
                                      {m.read ? "✓✓" : "✓"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 text-xs font-bold bg-white/50 rounded-2xl mx-10 p-4 text-center backdrop-blur-sm shadow-sm">
                        No messages yet. Send a message to start the conversation!
                      </div>
                    )}
                  </div>

                  {/* Quick-Reply Buttons */}
                  <div className="px-4 py-2 bg-[#f0f2f5] flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 border-t border-slate-200">
                    {[
                      "Okay (సరే)",
                      "Understood (అర్థమైంది)",
                      "Please wait (దయచేసి వేచి ఉండండి)",
                      "Thank you (ధన్యవాదాలు)",
                      "Call me (కాల్ చేయండి)"
                    ].map((qr) => (
                      <button
                        key={qr}
                        type="button"
                        onClick={() => handleSendDMText(qr)}
                        className="px-3 py-1.5 bg-white hover:bg-green-50 text-slate-700 hover:text-green-700 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors border border-slate-200 shadow-sm shrink-0 cursor-pointer"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendDM} className="p-3 bg-[#f0f2f5] flex gap-2 items-end shrink-0">
                    <textarea
                      value={dmInput}
                      onChange={(e) => {
                         handleTypingChange(e);
                         e.target.style.height = 'auto';
                         e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendDM(e);
                        }
                      }}
                      placeholder="Type a message"
                      rows={1}
                      className="flex-1 bg-white border-none px-4 py-3 rounded-2xl text-[13px] font-medium outline-none focus:ring-1 focus:ring-green-500 resize-none overflow-y-auto max-h-[120px]"
                      style={{ minHeight: '44px' }}
                    />
                    <button
                      type="submit"
                      disabled={!dmInput.trim()}
                      className={\`p-3 rounded-full flex items-center justify-center shrink-0 transition-colors \${dmInput.trim() ? 'bg-[#00a884] text-white cursor-pointer hover:bg-[#008f6f]' : 'bg-slate-200 text-slate-400'}\`}
                    >
                      <Send size={18} className={\`\${dmInput.trim() ? 'ml-0.5' : ''}\`} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);

fs.writeFileSync('src/App.tsx', newContent);
