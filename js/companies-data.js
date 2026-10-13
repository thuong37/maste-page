/* Prototype company directory. Job IDs remain the shared EASYCV_JOBS IDs.
 * Company enrichment, activity and CV scores are demo data, not verified facts.
 */
(() => {
  const jobs = window.EASYCV_JOBS || [];
  const names = {1:'FPT Software',2:'Techcombank',3:'VNG Corporation',4:'Viettel',5:'Shopee Việt Nam',6:'MoMo',7:'VNPAY',8:'Vingroup',9:'CMC Telecom',10:'Base.vn',11:'One Mount Group',12:'KMS Technology',14:'Tiki',15:'Masan Group',16:'NashTech',17:'VinAI Research',18:'MB Bank',19:'Vinamilk',20:'Bosch Việt Nam',21:'Unilever Việt Nam',22:'VPBank',23:'Gemadept',24:'VNPT',26:'FPT Digital',27:'Dentsu Creative',28:'Tân Á Đại Thành'};
  const bankIds = [2,18,22], retailIds = [5,14], manufacturingIds = [15,19,21,28], startupIds = [6,10,17];
  const websites = {1:'https://fptsoftware.com',2:'https://techcombank.com',3:'https://vng.com.vn',4:'https://viettel.com.vn',6:'https://momo.vn',10:'https://base.vn'};
  // Online company banners; attribution is kept in assets/banners/companies/sources.json.
  const cardBanners = {1:'fpt',2:'techcombank',3:'vng',4:'viettel',5:'shopee',6:'momo',7:'vnpay',9:'cmc',10:'base',11:'onemount',12:'kms',14:'tiki',15:'masan',17:'vinai',21:'unilever'};
  window.EASYCV_COMPANIES = jobs.filter(j => ![13,25].includes(j.id)).map((job, i) => {
    const related = jobs.filter(j => j.id === job.id || (job.id === 1 && j.id === 13) || (job.id === 14 && j.id === 25));
    const industry = bankIds.includes(job.id) ? 'Ngân hàng' : retailIds.includes(job.id) ? 'Thương mại điện tử' : manufacturingIds.includes(job.id) ? 'Sản xuất & Tiêu dùng' : job.id === 23 ? 'Logistics' : job.id === 27 ? 'Truyền thông' : job.id === 8 ? 'Bất động sản' : 'Công nghệ';
    const cover = industry === 'Ngân hàng' ? 'employer-spotlight-finance.jpg' : industry === 'Sản xuất & Tiêu dùng' ? 'employer-spotlight-manufacturing.jpg' : industry === 'Thương mại điện tử' ? 'employer-spotlight-retail.jpg' : ['employer-spotlight-team.png','employer-spotlight-innovation.png'][i % 2];
    return {id: String(job.id), name: names[job.id] || job.company, logo:job.logo, jobs:related, industry,
      cities:[...new Set(related.map(j => j.city))], verified:job.verified, urgent:related.some(j=>j.isUrgent),
      flexible:related.some(j=>['hybrid','remote'].includes(j.type)), startup:startupIds.includes(job.id),
      size:startupIds.includes(job.id)?'100 - 499':'1.000+', cover:'assets/banners/'+cover,
      cardCover:cardBanners[job.id] ? 'assets/banners/companies/'+cardBanners[job.id]+'.jpg' : 'assets/banners/'+cover,
      benefits:['Thưởng tháng 13','Bảo hiểm sức khỏe','Đào tạo chuyên môn'], website:websites[job.id] || '',
      matches:related.filter(j=>j.aiMatch >= 85).length,
      score:Math.max(...related.map(j=>j.aiMatch)), applied:i < 5, viewed:i < 12};
  });
})();
