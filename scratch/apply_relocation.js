const fs = require('fs');
const path = require('path');

const filePath = path.resolve('chi-tiet-viec-lam.html');
const content = fs.readFileSync(filePath, 'utf8');

const filterStartMarker = '<!-- BỘ LỌC TIÊU CHÍ VIỆC LÀM (Đồng bộ từ trang Danh sách Việc làm) -->';
const filterEndMarker = '<!-- 2 MAIN BLOCKS: KHỐI TRÁI LÀ DANH SÁCH JOB, KHỐI PHẢI LÀ MÔ TẢ JOB ĐÓ -->';

const startIndex = content.indexOf(filterStartMarker);
const endIndex = content.indexOf(filterEndMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find filter markers!');
  process.exit(1);
}

// Extract block including comments up to right before filterEndMarker
const blockToMove = content.substring(startIndex, endIndex).trim();

// Target insertion: after searchSuggestDropdown closes
const suggestCloseMarker = 'id="btnCloseSuggest">Đóng [Esc]</button>\r\n              </div>\r\n            </div>';
const suggestCloseIdx = content.indexOf(suggestCloseMarker);

if (suggestCloseIdx === -1) {
  console.error('Could not find suggestCloseMarker!');
  process.exit(1);
}

const insertPoint = suggestCloseIdx + suggestCloseMarker.length;

// Let's create the new content:
// 1. Everything before insertPoint
// 2. '\r\n\r\n' + blockToMove
// 3. Everything between insertPoint and startIndex
// 4. Everything after endIndex

const part1 = content.substring(0, insertPoint);
const part2 = '\r\n\r\n' + blockToMove + '\r\n';
const part3 = content.substring(insertPoint, startIndex);
const part4 = content.substring(endIndex);

let newContent = part1 + part2 + part3 + part4;

// Also adjust .single-job-hero padding from "padding: 20px 0 16px 0;" to "padding: 28px 0 8px 0;"
newContent = newContent.replace('padding: 20px 0 16px 0;', 'padding: 28px 0 8px 0;');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully relocated filter bar and saved filters overlay in chi-tiet-viec-lam.html');
