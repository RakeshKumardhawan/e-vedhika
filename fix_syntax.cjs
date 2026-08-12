const fs = require('fs');
let code = fs.readFileSync('src/components/CodeManager.tsx', 'utf8');

// The problematic area is around line 860
code = code.replace(
  `              )}
              </>
              )}            </div>          </div>        </div>      </div>    </div>  );}`,
  `              )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`
);

fs.writeFileSync('src/components/CodeManager.tsx', code);
