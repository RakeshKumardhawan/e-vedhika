cat << 'INNER_EOF'
                        {item.hasDropdown && (
                          <div className={`fixed inset-0 sm:absolute sm:inset-auto sm:top-[calc(100%-4px)] sm:left-0 sm:w-64 bg-slate-50 sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border border-slate-100 transition-all duration-200 z-[2000] sm:z-[1050] flex flex-col sm:block ${openDropdown === item.id ? 'opacity-100 visible' : 'opacity-0 invisible sm:mt-0 group-hover/navitem:opacity-100 group-hover/navitem:visible group-hover/navitem:mt-2'} ${openDropdown === item.id ? 'mt-0 sm:mt-2' : ''}`}>
                            {openDropdown === item.id && (
                              <div className="sm:hidden flex-none p-4 bg-white border-b border-slate-200 shadow-sm flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${themeClasses.iconBg}`}>
                                      <Icon size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800">{item.label}</h2>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }} className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors font-medium text-sm">
                                    <ArrowLeft size={18} />
                                    Back
                                  </button>
                                </div>
                              </div>
                            )}
                            <div className="p-4 sm:p-2 flex flex-col gap-2 sm:gap-1 overflow-y-auto flex-1 h-full">
INNER_EOF
