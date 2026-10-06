const fs = require('fs');
const path = require('path');

const filePath = path.resolve('chi-tiet-viec-lam.html');
const content = fs.readFileSync(filePath, 'utf8');

const filterStartMarker = '<!-- BỘ LỌC TIÊU CHÍ VIỆC LÀM (Đồng bộ từ trang Danh sách Việc làm) -->';
const filterEndMarker = '<!-- 2 MAIN BLOCKS: KHỐI TRÁI LÀ DANH SÁCH JOB, KHỐI PHẢI LÀ MÔ TẢ JOB ĐÓ -->';

const startIndex = content.indexOf(filterStartMarker);
const endIndex = content.indexOf(filterEndMarker);

console.log('startIndex:', startIndex);
console.log('endIndex:', endIndex);

const targetBtnMarker = 'id="btnCloseSuggest">Đóng [Esc]</button>';
const targetBtnIndex = content.indexOf(targetBtnMarker);
console.log('targetBtnIndex:', targetBtnIndex);

if (targetBtnIndex !== -1) {
  // Let's print the next 200 chars after targetBtnIndex
  console.log('Next 200 chars after targetBtnIndex:');
  console.log(JSON.stringify(content.substring(targetBtnIndex, targetBtnIndex + 200)));
}
