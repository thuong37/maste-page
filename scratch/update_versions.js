const fs = require('fs');

function updateVersions(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Update stylesheet
  content = content.replace(
    /href="css\/viec-lam\.css[^"]*"/,
    'href="css/viec-lam.css?v=10.0_heart_icon_synced"'
  );

  // Update script
  content = content.replace(
    /src="js\/viec-lam\.js[^"]*"/,
    'src="js/viec-lam.js?v=10.0_heart_icon_synced"'
  );

  // Add critical CSS if not already there
  if (!content.includes('border-radius: 50% !important;')) {
    const criticalCss = `
    .btn-card-bookmark {
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      border: 1.5px solid #CBD5E1 !important;
      background: #FFFFFF !important;
      color: #64748B !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
      padding: 0 !important;
      flex-shrink: 0 !important;
    }
    .btn-card-bookmark svg {
      width: 17px !important;
      height: 17px !important;
      stroke: currentColor !important;
      fill: none;
      stroke-width: 2 !important;
      transition: all 0.18s ease !important;
    }
    .btn-card-bookmark:hover {
      border-color: #EF4444 !important;
      color: #EF4444 !important;
      background: #FEF2F2 !important;
      transform: scale(1.08) !important;
    }
    .btn-card-bookmark.saved {
      background: #FEF2F2 !important;
      border-color: #EF4444 !important;
      color: #EF4444 !important;
    }
    .btn-card-bookmark.saved svg {
      fill: #EF4444 !important;
      stroke: #EF4444 !important;
    }
`;
    content = content.replace(
      /(<style id="easycv-job-card-hover-style">[\s\S]*?)(\s*<\/style>)/,
      `$1${criticalCss}$2`
    );
  }

  // Add cache-control meta in <head>
  if (!content.includes('http-equiv="Cache-Control"')) {
    content = content.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated cache busting and critical CSS in ${filePath}`);
}

updateVersions('viec-lam.html');
updateVersions('public/viec-lam.html');
