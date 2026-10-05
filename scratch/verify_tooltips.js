const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  console.log(`\n=== Kiểm tra file: ${filePath} ===`);
  const html = fs.readFileSync(filePath, 'utf8');

  // Helper đơn giản trích xuất block theo id
  function getSection(id) {
    const startIdx = html.indexOf(`id="${id}"`);
    if (startIdx === -1) return null;
    const endIdx = html.indexOf('</section>', startIdx);
    return html.substring(startIdx, endIdx + 10);
  }

  // 1. Kiểm tra #viec-lam-noi-bat
  const sec1 = getSection('viec-lam-noi-bat');
  if (sec1) {
    const jobLogos = [...sec1.matchAll(/class="job-logo-wrapper"[^>]*title="([^"]+)"/g)].map(m => m[1]);
    const imgLogos = [...sec1.matchAll(/class="job-logo"[^>]*title="([^"]+)"/g)].map(m => m[1]);
    console.log(`[#viec-lam-noi-bat] Job logo wrappers: ${jobLogos.length}, Img logos: ${imgLogos.length}`);
    jobLogos.forEach((t, i) => {
      const ok = t.startsWith('Công ty') && t.endsWith('tuyển dụng tại EasyCV');
      console.log(`  Job ${i+1}: "${t}" => ${ok ? 'PASS' : 'FAIL'}`);
    });
  } else {
    console.log('FAIL: Không tìm thấy #viec-lam-noi-bat');
  }

  // 2. Kiểm tra #viec-lam-hap-dan
  const sec2 = getSection('viec-lam-hap-dan');
  if (sec2) {
    const jobLogos = [...sec2.matchAll(/class="job-logo-wrapper"[^>]*title="([^"]+)"/g)].map(m => m[1]);
    console.log(`[#viec-lam-hap-dan] Job logo wrappers: ${jobLogos.length}`);
    jobLogos.forEach((t, i) => {
      const ok = t.startsWith('Công ty') && t.endsWith('tuyển dụng tại EasyCV');
      console.log(`  Job ${i+1}: "${t}" => ${ok ? 'PASS' : 'FAIL'}`);
    });
  } else {
    console.log('FAIL: Không tìm thấy #viec-lam-hap-dan');
  }

  // 3. Kiểm tra #cong-ty-tieu-bieu (Công ty nổi bật)
  const sec3 = getSection('cong-ty-tieu-bieu');
  if (sec3) {
    const compLogos = [...sec3.matchAll(/class="company-card-logo-wrap"[^>]*title="([^"]+)"/g)].map(m => m[1]);
    const markLogos = [...sec3.matchAll(/class="company-card-logo-mark[^"]*"[^>]*title="([^"]+)"/g)].map(m => m[1]);
    console.log(`[#cong-ty-tieu-bieu] Company logo wrappers: ${compLogos.length}, Marks: ${markLogos.length}`);
    compLogos.forEach((t, i) => {
      const ok = t.startsWith('Công ty') && !t.includes('tuyển dụng tại EasyCV');
      console.log(`  Company ${i+1}: "${t}" => ${ok ? 'PASS' : 'FAIL'}`);
    });
  } else {
    console.log('FAIL: Không tìm thấy #cong-ty-tieu-bieu');
  }

  // 4. Kiểm tra #viec-lam-phu-hop
  const sec4 = getSection('viec-lam-phu-hop');
  if (sec4) {
    const jobLogos = [...sec4.matchAll(/class="job-logo-wrapper"[^>]*title="([^"]+)"/g)].map(m => m[1]);
    console.log(`[#viec-lam-phu-hop] Job logo wrappers: ${jobLogos.length}`);
    jobLogos.forEach((t, i) => {
      const ok = t.startsWith('Công ty') && t.endsWith('tuyển dụng tại EasyCV');
      console.log(`  Match Job ${i+1}: "${t}" => ${ok ? 'PASS' : 'FAIL'}`);
    });
  } else {
    console.log('FAIL: Không tìm thấy #viec-lam-phu-hop');
  }
}

checkFile(path.join(__dirname, '..', 'index.html'));
checkFile(path.join(__dirname, '..', 'public', 'index.html'));
