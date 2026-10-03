const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

const headerStart = indexHtml.indexOf('<header class="site-header">');
const headerEnd = indexHtml.indexOf('</header>') + '</header>'.length;
const header = indexHtml.slice(headerStart, headerEnd);

const drawerStart = indexHtml.indexOf('<div id="mobile-drawer-overlay"');
const drawerEndIndex = indexHtml.indexOf('</div>\r\n  </div>\r\n\r\n  <!--') !== -1 
  ? indexHtml.indexOf('</div>\r\n  </div>\r\n\r\n  <!--') + '</div>\r\n  </div>'.length
  : indexHtml.indexOf('</div>\n  </div>\n\n  <!--') + '</div>\n  </div>'.length;

const drawer = indexHtml.slice(drawerStart, drawerEndIndex);

const regex = /href="([^"]*)"/g;
let match;
const headerHrefs = [];
while ((match = regex.exec(header)) !== null) {
  headerHrefs.push(match[1]);
}

const drawerHrefs = [];
while ((match = regex.exec(drawer)) !== null) {
  drawerHrefs.push(match[1]);
}

console.log('Unique header hrefs:', Array.from(new Set(headerHrefs)));
console.log('Unique drawer hrefs:', Array.from(new Set(drawerHrefs)));
