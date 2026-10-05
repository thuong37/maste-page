const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function updateCssFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add .site-header rule if not already present
  if (!content.includes('.site-header {')) {
    const headerRule = `/* Thanh menu không neo cố định khi cuộn màn hình trên trang tìm kiếm việc làm */\r\n.site-header {\r\n  position: relative !important;\r\n  top: auto !important;\r\n}\r\n\r\n`;
    content = headerRule + content;
    console.log(`[CSS] Added .site-header rule to ${filePath}`);
  }

  // 2. Update .hero-search-sticky-bar.is-sticky top to 0px
  if (content.includes('top: var(--sticky-search-top, 72px);')) {
    content = content.replace('top: var(--sticky-search-top, 72px);', 'top: var(--sticky-search-top, 0px);');
    console.log(`[CSS] Updated sticky-search-top default to 0px in ${filePath}`);
  }

  // 3. Update .ads-sidebar-container top to 145px
  if (content.includes('.ads-sidebar-container {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 20px;\r\n  position: sticky;\r\n  top: 90px;')) {
    content = content.replace(
      '.ads-sidebar-container {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 20px;\r\n  position: sticky;\r\n  top: 90px;',
      '.ads-sidebar-container {\r\n  display: flex;\r\n  flex-direction: column;\r\n  gap: 20px;\r\n  position: sticky;\r\n  top: 145px;'
    );
    console.log(`[CSS] Updated ads-sidebar-container top to 145px in ${filePath}`);
  } else if (content.includes('.ads-sidebar-container {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  position: sticky;\n  top: 90px;')) {
    content = content.replace(
      '.ads-sidebar-container {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  position: sticky;\n  top: 90px;',
      '.ads-sidebar-container {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  position: sticky;\n  top: 145px;'
    );
    console.log(`[CSS] Updated ads-sidebar-container top to 145px in ${filePath} (LF)`);
  }

  // 4. Update split-detail-pane
  content = content.replace(
    /\.split-detail-pane\s*\{([\s\S]*?)top:\s*86px;([\s\S]*?)max-height:\s*calc\(100vh - 106px\);/g,
    '.split-detail-pane {$1top: 145px;$2max-height: calc(100vh - 165px);'
  );

  // 5. Update split-list-pane
  content = content.replace(
    /\.split-list-pane\s*\{([\s\S]*?)top:\s*86px;([\s\S]*?)max-height:\s*calc\(100vh - 106px\);/g,
    '.split-list-pane {$1top: 145px;$2max-height: calc(100vh - 165px);'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

function updateJsFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace updateStickyState inside initStickySearch
  const targetOld = `    function updateStickyState() {
      const headerHeight = header ? header.offsetHeight : 72;
      stickyBar.style.setProperty('--sticky-search-top', headerHeight + 'px');

      const wrapperRect = wrapper.getBoundingClientRect();
      if (wrapperRect.top < headerHeight) {
        if (!stickyBar.classList.contains('is-sticky')) {
          // Dùng chiều cao thực của stickyBar (gồm cả filter bar bên trong)
          wrapper.style.minHeight = stickyBar.offsetHeight + 'px';
          stickyBar.classList.add('is-sticky');
        }
      } else {
        if (stickyBar.classList.contains('is-sticky')) {
          stickyBar.classList.remove('is-sticky');
          wrapper.style.minHeight = '';
        }
      }
      ticking = false;
    }`;

  const targetNew = `    function updateStickyState() {
      // Thanh menu (.site-header) không còn neo cố định trên màn list job (position: relative),
      // nên khi cuộn màn hình xuống, thanh tìm kiếm neo trực tiếp sát mép trên cùng (top: 0).
      stickyBar.style.setProperty('--sticky-search-top', '0px');

      const wrapperRect = wrapper.getBoundingClientRect();
      if (wrapperRect.top <= 0) {
        if (!stickyBar.classList.contains('is-sticky')) {
          // Dùng chiều cao thực của stickyBar (gồm cả filter bar bên trong)
          wrapper.style.minHeight = stickyBar.offsetHeight + 'px';
          stickyBar.classList.add('is-sticky');
        }
      } else {
        if (stickyBar.classList.contains('is-sticky')) {
          stickyBar.classList.remove('is-sticky');
          wrapper.style.minHeight = '';
        }
      }
      ticking = false;
    }`;

  // Normalize CRLF to LF for matching, then restore CRLF if file had CRLF
  const hasCRLF = content.includes('\r\n');
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedOld = targetOld.replace(/\r\n/g, '\n');
  const normalizedNew = targetNew.replace(/\r\n/g, '\n');

  if (normalizedContent.includes(normalizedOld)) {
    let updated = normalizedContent.replace(normalizedOld, normalizedNew);
    if (hasCRLF) {
      updated = updated.replace(/\n/g, '\r\n');
    }
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`[JS] Successfully updated updateStickyState in ${filePath}`);
  } else {
    console.error(`[JS] WARNING: targetOld not found in ${filePath}`);
  }
}

function updateHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add .site-header rule inside #easycv-job-card-hover-style if not present
  if (!content.includes('position: relative !important;\n    top: auto !important;') &&
      !content.includes('position: relative !important;\r\n    top: auto !important;')) {
    const searchTarget = '.badge-ai-match {\n      display: none !important;\n    }';
    const searchTargetCRLF = '.badge-ai-match {\r\n      display: none !important;\r\n    }';
    const addition = `\n    /* Thanh menu không neo cố định khi cuộn màn hình trên trang tìm kiếm việc làm */\n    .site-header {\n      position: relative !important;\n      top: auto !important;\n    }`;
    const additionCRLF = `\r\n    /* Thanh menu không neo cố định khi cuộn màn hình trên trang tìm kiếm việc làm */\r\n    .site-header {\r\n      position: relative !important;\r\n      top: auto !important;\r\n    }`;

    if (content.includes(searchTargetCRLF)) {
      content = content.replace(searchTargetCRLF, searchTargetCRLF + additionCRLF);
      console.log(`[HTML] Added inline .site-header rule to ${filePath} (CRLF)`);
    } else if (content.includes(searchTarget)) {
      content = content.replace(searchTarget, searchTarget + addition);
      console.log(`[HTML] Added inline .site-header rule to ${filePath} (LF)`);
    }
  }

  // 2. Update version query string to 13.0_unpin_menu
  content = content.replace(/viec-lam\.css\?v=[a-zA-Z0-9_.]+/g, 'viec-lam.css?v=13.0_unpin_menu');
  content = content.replace(/viec-lam\.js\?v=[a-zA-Z0-9_.]+/g, 'viec-lam.js?v=13.0_unpin_menu');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[HTML] Updated version cache buster in ${filePath}`);
}

// Execute updates
console.log('--- Updating CSS Files ---');
updateCssFile(path.join(rootDir, 'css', 'viec-lam.css'));
updateCssFile(path.join(rootDir, 'public', 'css', 'viec-lam.css'));

console.log('--- Updating JS Files ---');
updateJsFile(path.join(rootDir, 'js', 'viec-lam.js'));
updateJsFile(path.join(rootDir, 'public', 'js', 'viec-lam.js'));

console.log('--- Updating HTML Files ---');
updateHtmlFile(path.join(rootDir, 'viec-lam.html'));
updateHtmlFile(path.join(rootDir, 'public', 'viec-lam.html'));

console.log('Done.');
