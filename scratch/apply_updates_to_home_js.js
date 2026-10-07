const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Normalize line endings to \n for consistent matching, then restore if needed
  const hasCRLF = content.includes('\r\n');
  content = content.replace(/\r\n/g, '\n');
  content = content.replace(
    "const featuredPaginator = createJobPaginator('.featured-jobs-section', '.job-card');\n",
    ""
  );

  // 2. Remove legacy Section 3 filter pills listener
  const legacySection3Regex = /\/\/ --- 3\. Filter Pills for "Việc làm nổi bật"[\s\S]*?\}\);\n  \}\);\n\n/;
  content = content.replace(legacySection3Regex, "");

  // 3. Replace FEATURED_JOBS_DATA block
  // Start from: // Kho dữ liệu chuẩn ...
  // to: let currentCategory = 'sales';
  const featuredJobsCode = fs.readFileSync('scratch/featured_jobs_code.js', 'utf8').replace(/\r\n/g, '\n');

  const startMarker = "    // Kho dữ liệu chuẩn";
  const endMarker = "    // Trạng thái vận hành\n    let currentCategory = 'sales';";

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Could not find markers in ${filePath}: startIndex=${startIndex}, endIndex=${endIndex}`);
  }

  const replacementMiddle = `${featuredJobsCode}\n\n    // Trạng thái vận hành (mặc định tab Tất cả)\n    let currentCategory = 'all';`;
  
  content = content.slice(0, startIndex) + replacementMiddle + content.slice(endIndex + endMarker.length);

  // 4. Update calculateJobRank and getRankedJobsForCategory
  const oldScoringAndRanking = `    // Thuật toán ưu tiên hiển thị (Sort & Scoring Engine)
    function calculateJobRank(job, isLogged) {
      if (!isLogged) {
        // CHƯA ĐĂNG NHẬP:
        // Ưu tiên theo ngành nghề có lượng job lớn hơn thị trường:
        // sales (500) > it (400) > marketing (300) > finance (200) > hr (100)
        const categoryWeights = {
          sales: 500,
          it: 400,
          marketing: 300,
          finance: 200,
          hr: 100
        };
        let score = categoryWeights[job.category] || 50;
        if (job.isLightningBadge) score += 60; // Job HR tương tác nhiều
        if (job.verified) score += 20;
        if (job.salaryIsOrange) score += 15;
        return score;
      }

      // ĐÃ ĐĂNG NHẬP:
      // Ưu tiên theo dữ liệu người dùng:
      // - Hành vi gần đây (Cao): dữ liệu search job, dữ liệu xem job, dữ liệu lưu job
      // - Dữ liệu hồ sơ và CV ứng viên (Cao)
      // - Dữ liệu tính năng gợi ý việc làm (Cao)
      // - Dữ liệu tín hiệu job: mới đăng, uy tín NTD, độ tương tác (Trung bình)
      let score = 0;

      // 1. Dữ liệu tìm kiếm gần đây
      let searchHistory = [];
      try {
        searchHistory = JSON.parse(localStorage.getItem('easycv_search_history') || '[]');
      } catch (e) {
        searchHistory = ['Sales', 'B2B', 'React', 'Marketing'];
      }
      if (!Array.isArray(searchHistory) || searchHistory.length === 0) {
        searchHistory = ['Sales', 'B2B', 'React', 'Marketing'];
      }
      searchHistory.forEach(kw => {
        const kwLower = kw.toLowerCase();
        if (job.title.toLowerCase().includes(kwLower)) score += 45;
        if (job.skills.some(s => s.toLowerCase().includes(kwLower))) score += 30;
      });

      // 2. Dữ liệu xem job & lưu job gần đây
      let savedJobs = [];
      try {
        savedJobs = JSON.parse(localStorage.getItem('easycv_saved_jobs') || '[]');
      } catch (e) {
        savedJobs = [];
      }
      if (savedJobs.includes(job.id)) score += 50;

      // 3. Dữ liệu hồ sơ & CV ứng viên (Profile: IT & Sales B2B, Kỹ năng cao)
      const userProfileSkills = ['B2B Sales', 'Key Account', 'ReactJS', 'Node.js', 'Digital Marketing', 'Data Analyst', 'HRBP'];
      job.skills.forEach(skill => {
        if (userProfileSkills.includes(skill)) score += 25;
      });
      if (job.category === 'sales' || job.category === 'it') score += 40;

      // 4. Tính năng gợi ý việc làm (AI Match)
      if (job.aiMatch) {
        score += Math.round(job.aiMatch * 0.5); // +40-50 điểm
      }

      // 5. Tín hiệu job: Mới đăng, Uy tín NTD, Huy hiệu Tia Sét
      if (job.isLightningBadge) score += 30; // HR phản hồi nhanh
      if (job.verified) score += 20; // NTD uy tín
      if (job.updated.includes('phút')) score += 25; // Mới đăng < 1h
      else if (job.updated.includes('1 giờ') || job.updated.includes('2 giờ')) score += 15;

      return score;
    }

    // Lấy danh sách việc làm đã sắp xếp theo tab hiện tại và thuật toán ưu tiên
    function getRankedJobsForCategory(categoryKey) {
      const isLogged = checkUserLoginState();
      
      // Lọc theo nhóm ngành đã chọn
      const filtered = FEATURED_JOBS_DATA.filter(job => job.category === categoryKey);

      // Tính điểm và sắp xếp giảm dần theo điểm ưu tiên
      const scoredList = filtered.map(job => ({
        ...job,
        priorityScore: calculateJobRank(job, isLogged)
      }));

      scoredList.sort((a, b) => b.priorityScore - a.priorityScore);
      return scoredList;
    }`;

  const newScoringAndRanking = `    // Thuật toán ưu tiên hiển thị (Sort & Scoring Engine)
    function calculateJobRank(job, isLogged) {
      if (!isLogged) {
        // CHƯA ĐĂNG NHẬP:
        // Đánh giá chất lượng việc làm: Huy hiệu Tia Sét, NTD uy tín, Mức lương hấp dẫn, Điểm AI Match và Độ mới
        let score = (job.aiMatch ? Math.round(job.aiMatch * 0.5) : 30);
        if (job.isLightningBadge) score += 40; // HR phản hồi nhanh
        if (job.verified) score += 25; // NTD xác thực uy tín
        if (job.salaryIsOrange) score += 20; // Lương cạnh tranh
        if (job.updated.includes('phút')) score += 30; // Mới đăng < 1h
        else if (job.updated.includes('1 giờ') || job.updated.includes('2 giờ')) score += 15;
        return score;
      }

      // ĐÃ ĐĂNG NHẬP:
      // Ưu tiên theo dữ liệu người dùng:
      // - Hành vi gần đây (Cao): dữ liệu search job, dữ liệu xem job, dữ liệu lưu job
      // - Dữ liệu hồ sơ và CV ứng viên (Cao)
      // - Dữ liệu tính năng gợi ý việc làm (Cao)
      // - Dữ liệu tín hiệu job: mới đăng, uy tín NTD, độ tương tác (Trung bình)
      let score = 0;

      // 1. Dữ liệu tìm kiếm gần đây
      let searchHistory = [];
      try {
        searchHistory = JSON.parse(localStorage.getItem('easycv_search_history') || '[]');
      } catch (e) {
        searchHistory = ['Sales', 'B2B', 'React', 'Marketing'];
      }
      if (!Array.isArray(searchHistory) || searchHistory.length === 0) {
        searchHistory = ['Sales', 'B2B', 'React', 'Marketing'];
      }
      searchHistory.forEach(kw => {
        const kwLower = kw.toLowerCase();
        if (job.title.toLowerCase().includes(kwLower)) score += 45;
        if (job.skills.some(s => s.toLowerCase().includes(kwLower))) score += 30;
      });

      // 2. Dữ liệu xem job & lưu job gần đây
      let savedJobs = [];
      try {
        savedJobs = JSON.parse(localStorage.getItem('easycv_saved_jobs') || '[]');
      } catch (e) {
        savedJobs = [];
      }
      if (savedJobs.includes(job.id)) score += 50;

      // 3. Dữ liệu hồ sơ & CV ứng viên (Profile: IT & Sales B2B, Kỹ năng cao)
      const userProfileSkills = ['B2B Sales', 'Key Account', 'ReactJS', 'Node.js', 'Digital Marketing', 'Data Analyst', 'HRBP'];
      job.skills.forEach(skill => {
        if (userProfileSkills.includes(skill)) score += 25;
      });
      if (job.category === 'sales' || job.category === 'it') score += 40;

      // 4. Tính năng gợi ý việc làm (AI Match)
      if (job.aiMatch) {
        score += Math.round(job.aiMatch * 0.5); // +40-50 điểm
      }

      // 5. Tín hiệu job: Mới đăng, Uy tín NTD, Huy hiệu Tia Sét
      if (job.isLightningBadge) score += 30; // HR phản hồi nhanh
      if (job.verified) score += 20; // NTD uy tín
      if (job.updated.includes('phút')) score += 25; // Mới đăng < 1h
      else if (job.updated.includes('1 giờ') || job.updated.includes('2 giờ')) score += 15;

      return score;
    }

    // Lấy danh sách việc làm đã sắp xếp theo tab hiện tại và thuật toán ưu tiên (chuẩn 2 trang x 12 việc làm = 24 việc làm)
    function getRankedJobsForCategory(categoryKey) {
      const isLogged = checkUserLoginState();
      
      if (categoryKey === 'all') {
        // Tab "Tất cả": Tuyển chọn cân bằng 24 việc làm hàng đầu từ 5 nhóm ngành (6 IT, 6 Sales, 4 Marketing, 4 Finance, 4 HR)
        const categories = ['it', 'sales', 'marketing', 'finance', 'hr'];
        const quota = { it: 6, sales: 6, marketing: 4, finance: 4, hr: 4 };
        
        let selected = [];
        categories.forEach(cat => {
          const catJobs = FEATURED_JOBS_DATA.filter(j => j.category === cat)
            .map(j => ({ ...j, priorityScore: calculateJobRank(j, isLogged) }))
            .sort((a, b) => b.priorityScore - a.priorityScore);
          selected.push(...catJobs.slice(0, quota[cat]));
        });

        // Sắp xếp tổng thể theo điểm ưu tiên để hiển thị các công việc hot nhất
        selected.sort((a, b) => b.priorityScore - a.priorityScore);
        return selected.slice(0, 24);
      }

      // Lọc theo nhóm ngành đã chọn (mỗi ngành đúng 24 việc làm = 2 trang x 12 thẻ)
      const filtered = FEATURED_JOBS_DATA.filter(job => job.category === categoryKey);

      // Tính điểm và sắp xếp giảm dần theo điểm ưu tiên
      const scoredList = filtered.map(job => ({
        ...job,
        priorityScore: calculateJobRank(job, isLogged)
      }));

      scoredList.sort((a, b) => b.priorityScore - a.priorityScore);
      return scoredList.slice(0, 24);
    }`;

  if (!content.includes(oldScoringAndRanking)) {
    throw new Error(`Could not find oldScoringAndRanking in ${filePath}`);
  }

  content = content.replace(oldScoringAndRanking, newScoringAndRanking);

  if (hasCRLF) {
    content = content.replace(/\n/g, '\r\n');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${filePath}`);
}

updateFile('js/home.js');
updateFile('public/js/home.js');
