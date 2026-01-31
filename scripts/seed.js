<div className="space-y-4 mb-8">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Calendar size={14}/> Select Date</label>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                      {next5Days.map((d, i) => {
                        const isSelected = date === format(d, "yyyy-MM-dd");
                        return (
                          <button key={i} onClick={() => setDate(format(d, "yyyy-MM-dd"))}
                            className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300
                              ${isSelected ? "bg-gray-900 border-gray-900 text-white shadow-xl scale-105" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"}`}>
                            <span className="text-[10px] font-black uppercase mb-1">{format(d, "EEE")}</span>
                            <span className="text-2xl font-black">{format(d, "dd")}</span>
                            <span className="text-[9px] font-medium mt-1 opacity-70">{format(d, "MMM")}</span>
                          </button>
                        )
                      })}
                    </div>
                 </div>