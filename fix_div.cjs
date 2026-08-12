const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const search = `          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-transparent text-xs font-black text-primary border-none outline-none cursor-pointer"
          >
            <option value="newest">కొత్తవి మొదట (Newest First)</option>
            <option value="oldest">పాతవి మొదట (Oldest First)</option>
            <option value="popular">అత్యంత ప్రజాదరణ పొందినవి (Most Popular)</option>
          </select>
        </div>
      </div>`;

const replace = `          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-transparent text-xs font-black text-primary border-none outline-none cursor-pointer"
          >
            <option value="newest">కొత్తవి మొదట (Newest First)</option>
            <option value="oldest">పాతవి మొదట (Oldest First)</option>
            <option value="popular">అత్యంత ప్రజాదరణ పొందినవి (Most Popular)</option>
          </select>
        </div>
        </div>
      </div>`;

content = content.replace(search, replace);
fs.writeFileSync('src/App.tsx', content);
