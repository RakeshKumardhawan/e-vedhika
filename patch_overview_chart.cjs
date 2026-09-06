const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const regex = /<ResponsiveContainer width="100%" height="100%">[\s\S]*?<\/ResponsiveContainer>/m;
const newChart = `<ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData.length ? chartData : [{time:'00:00',users:0,requests:0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0B3D91" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#0B3D91" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} />
                            <RechartsTooltip 
                              contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '12px 16px' }}
                            />
                            <Area type="monotone" dataKey="users" name="Active Actions" stroke="#0B3D91" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                          </AreaChart>
                        </ResponsiveContainer>`;

content = content.replace(regex, newChart);
fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
console.log("Patched chart");
