// Dữ liệu CV dùng để tự động điền vào TopCV.
// Lấy từ template mẫu (SAMPLE) trong js/cv-templates.js — một nguồn dữ liệu chung.
module.exports = {
  basics: {
    name: 'Nguyễn Minh Anh',
    label: 'Frontend Developer',
    email: 'minhanh@example.com',
    phone: '0901 234 567',
    url: 'minhanh.dev',
    city: 'Hà Nội',
    summary:
      '3 năm kinh nghiệm xây dựng giao diện web, tập trung vào hiệu năng và trải nghiệm người dùng. Mong muốn phát triển sản phẩm có tác động tới hàng triệu người dùng.',
  },
  work: [
    {
      name: 'Công ty ABC',
      position: 'Frontend Developer',
      startDate: '03/2022',
      endDate: 'Hiện tại',
      highlights: [
        'Xây dựng dashboard bán hàng bằng React, giảm 40% thời gian tải trang.',
        'Dẫn dắt nhóm 3 người, thiết lập quy trình code review.',
      ],
    },
    {
      name: 'Công ty XYZ',
      position: 'Thực tập Frontend',
      startDate: '06/2021',
      endDate: '02/2022',
      highlights: ['Phát triển landing page responsive cho 5 chiến dịch marketing.'],
    },
  ],
  education: [
    {
      institution: 'ĐH Bách Khoa Hà Nội',
      studyType: 'Cử nhân',
      area: 'Khoa học Máy tính',
      startDate: '2018',
      endDate: '2022',
    },
  ],
  skills: [
    { name: 'Frontend', keywords: ['HTML', 'CSS', 'JavaScript', 'React'] },
    { name: 'Công cụ', keywords: ['Git', 'Figma', 'Vite'] },
  ],
  languages: [{ language: 'Tiếng Anh', fluency: 'IELTS 7.0' }],
};
