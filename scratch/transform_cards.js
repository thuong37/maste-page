const fs = require('fs');

function transformHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Match each card:
  // Regex to find cards in #jobListingGrid
  const cardRegex = /(<article class="job-card[^>]*data-id="(\d+)"[^>]*>[\s\S]*?<\/article>)/g;

  let transformedCount = 0;

  const newContent = content.replace(cardRegex, (fullCard, p1, id) => {
    // Check if card has .btn-card-bookmark in job-card-actions
    if (!fullCard.includes('class="btn-card-bookmark"') || !fullCard.includes('class="job-badges-group"')) {
      return fullCard;
    }

    // 1. Remove .btn-card-bookmark from job-card-actions
    let updatedCard = fullCard.replace(
      /<button type="button" class="btn-card-bookmark" data-id="\d+" aria-label="Lưu công việc" title="Lưu công việc">[\s\S]*?<\/button>\s*/,
      ''
    );

    // 2. Add new heart button inside job-badges-group right after the salary badge
    const heartSvg = '<button type="button" class="btn-card-bookmark" data-id="' + id + '" aria-label="Lưu công việc" title="Lưu công việc">\n                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>\n                  </button>';

    updatedCard = updatedCard.replace(
      /(<div class="job-badges-group">[\s\S]*?<span class="job-salary-badge [^"]*">[^<]+<\/span>)\s*(<\/div>)/,
      `$1\n                  ${heartSvg}\n                $2`
    );

    transformedCount++;
    return updatedCard;
  });

  console.log(`Transformed ${transformedCount} cards in ${filePath}`);
  return newContent;
}

// Test on viec-lam.html
const updated = transformHtml('viec-lam.html');
fs.writeFileSync('scratch/viec-lam-transformed.html', updated, 'utf8');

// Verify counts
const heartMatches = (updated.match(/M19 14c1.49-1.46/g) || []).length;
const bookmarkMatches = (updated.match(/btn-card-bookmark/g) || []).length;
console.log('Heart matches in transformed:', heartMatches);
console.log('Total btn-card-bookmark in transformed:', bookmarkMatches);
