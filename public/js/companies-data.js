/* Prototype company directory. Job IDs remain the shared EASYCV_JOBS IDs.
 * Company enrichment, activity and CV scores are demo data, not verified facts.
 */
(() => {
  const jobs = window.EASYCV_JOBS || [];
  const names = {1:'Công ty TNHH Phần mềm FPT',2:'Ngân hàng TMCP Kỹ Thương Việt Nam',3:'Công ty Cổ phần VNG',4:'Tập đoàn Công nghiệp - Viễn thông Quân đội',5:'Công ty TNHH Shopee',6:'Công ty Cổ phần Dịch vụ Di động Trực tuyến',7:'Công ty Cổ phần Giải pháp Thanh toán Việt Nam',8:'Tập đoàn Vingroup - Công ty CP',9:'Công ty Cổ phần Hạ tầng Viễn thông CMC',10:'Công ty Cổ phần Base Enterprise',11:'Công ty Cổ phần Tập đoàn One Mount',12:'Công ty TNHH KMS Technology',14:'Công ty Cổ phần Ti Ki',15:'Công ty Cổ phần Tập đoàn Masan',16:'Công ty TNHH NashTech Việt Nam',17:'Công ty TNHH VinAI',18:'Ngân hàng TMCP Quân đội',19:'Công ty Cổ phần Sữa Việt Nam',20:'Công ty TNHH Bosch Việt Nam',21:'Công ty TNHH Unilever Việt Nam',22:'Ngân hàng TMCP Việt Nam Thịnh Vượng',23:'Công ty Cổ phần Gemadept',24:'Tập đoàn Bưu chính Viễn thông Việt Nam',26:'Công ty TNHH FPT Digital',27:'Công ty TNHH Dentsu Creative Việt Nam',28:'Công ty Cổ phần Tập đoàn Tân Á Đại Thành'};
  const bankIds = [2,18,22], retailIds = [5,14], manufacturingIds = [15,19,21,28], startupIds = [6,10,17];
  const websites = {1:'https://fptsoftware.com',2:'https://techcombank.com',3:'https://vng.com.vn',4:'https://viettel.com.vn',6:'https://momo.vn',10:'https://base.vn'};
  // Online company banners; attribution is kept in assets/banners/companies/sources.json.
  const cardBanners = {1:'fpt',2:'techcombank',3:'vng',4:'viettel',5:'shopee',6:'momo',7:'vnpay',9:'cmc',10:'base',11:'onemount',12:'kms',14:'tiki',15:'masan',17:'vinai',21:'unilever'};
  // Long-form intros (about half a screen) for the featured companies; demo copy, not verified.
  const galleryKeys = {1:'fpt',3:'vng',6:'momo',7:'vnpay',14:'tiki',17:'vinai'};
  const galleries = {};
  Object.keys(galleryKeys).forEach(id => { galleries[id] = [1,2,3,4,5,6].map(n => 'assets/banners/companies/gallery/' + galleryKeys[id] + '-' + n + '.jpg'); });
  const profiles = {
    3:['VNG là một trong những doanh nghiệp công nghệ hàng đầu Việt Nam, khởi đầu từ năm 2004 với các sản phẩm giải trí trực tuyến và nhanh chóng mở rộng sang nền tảng số. Ngày nay, VNG vận hành hệ sinh thái sản phẩm phục vụ hàng chục triệu người dùng mỗi ngày, tiêu biểu là ứng dụng nhắn tin Zalo, nền tảng thanh toán ZaloPay, dịch vụ điện toán đám mây GreenNode cùng mảng trò chơi và nội dung số.',
      'Với định hướng xây dựng sản phẩm công nghệ do người Việt làm chủ, VNG đầu tư mạnh vào dữ liệu, trí tuệ nhân tạo và hạ tầng đám mây. Các đội ngũ kỹ sư làm việc theo mô hình sản phẩm, được trao quyền quyết định và chịu trách nhiệm đến cùng cho kết quả mà mình tạo ra.',
      'Môi trường làm việc tại VNG đề cao sự cởi mở, tinh thần học hỏi và chia sẻ. Nhân sự được tham gia các chương trình đào tạo nội bộ, hội thảo công nghệ, cơ hội luân chuyển giữa các sản phẩm và lộ trình phát triển rõ ràng, cùng khuôn viên làm việc hiện đại tại VNG Campus (TP. Hồ Chí Minh).'],
    6:['MoMo là một trong những nền tảng ví điện tử và siêu ứng dụng tài chính được sử dụng rộng rãi nhất Việt Nam, ra đời với mục tiêu giúp mọi người thanh toán, chuyển tiền và quản lý tài chính cá nhân một cách đơn giản, an toàn ngay trên điện thoại.',
      'Từ chuyển tiền, thanh toán hóa đơn, mua vé, đặt dịch vụ cho đến đầu tư, bảo hiểm và vay tiêu dùng, MoMo liên tục mở rộng hệ sinh thái để đồng hành cùng người dùng trong nhiều khía cạnh của cuộc sống. Phía sau mỗi tính năng là hệ thống xử lý giao dịch quy mô lớn, đòi hỏi độ ổn định, bảo mật và trải nghiệm người dùng ở mức cao nhất.',
      'Văn hóa MoMo khuyến khích sự chủ động, đặt khách hàng làm trung tâm và dám thử nghiệm nhanh. Nhân viên được làm việc trong không gian sáng tạo, tiếp cận dữ liệu và công nghệ hiện đại, đồng thời có nhiều cơ hội phát triển nghề nghiệp trong một công ty công nghệ tài chính đang tăng trưởng mạnh.'],
    14:['Tiki là một trong những nền tảng thương mại điện tử đầu tiên của Việt Nam, khởi đầu từ cửa hàng sách trực tuyến năm 2010 và dần phát triển thành sàn thương mại điện tử đa ngành hàng. Doanh nghiệp theo đuổi triết lý đặt trải nghiệm khách hàng lên hàng đầu, với cam kết hàng chính hãng và giao hàng nhanh.',
      'Để vận hành hàng triệu đơn hàng, Tiki xây dựng hệ thống công nghệ, kho vận và dịch vụ giao nhận riêng, kết hợp phân tích dữ liệu và cá nhân hóa để gợi ý sản phẩm phù hợp với từng khách hàng. Đây là môi trường để các kỹ sư, chuyên viên dữ liệu và vận hành giải những bài toán thực tế ở quy mô lớn.',
      'Đội ngũ Tiki trẻ, năng động và đề cao dữ liệu, sáng tạo. Mỗi thành viên được khuyến khích đề xuất ý tưởng, thử nghiệm nhanh và học hỏi từ kết quả, cùng các chế độ phúc lợi và chương trình phát triển năng lực giúp gắn bó lâu dài.'],
    7:['Công ty Cổ phần Giải pháp Thanh toán Việt Nam (VNPAY) là đơn vị hoạt động trong lĩnh vực công nghệ tài chính, cung cấp hạ tầng và giải pháp thanh toán điện tử cho ngân hàng, doanh nghiệp và hàng triệu người dùng trên cả nước.',
      'Các sản phẩm tiêu biểu gồm cổng thanh toán, thanh toán bằng mã VNPAY-QR tại các điểm bán, ví điện tử, thanh toán hóa đơn và các dịch vụ số liên kết với hệ thống ngân hàng. VNPAY liên tục mở rộng mạng lưới chấp nhận thanh toán, góp phần thúc đẩy thanh toán không dùng tiền mặt tại Việt Nam.',
      'Làm việc tại VNPAY, bạn sẽ tham gia xây dựng những hệ thống đòi hỏi tính an toàn, ổn định và khả năng mở rộng cao. Công ty chú trọng môi trường chuyên nghiệp, đào tạo chuyên môn và cơ hội phát triển cùng thị trường thanh toán số đang tăng trưởng nhanh.'],
    17:['VinAI là đơn vị nghiên cứu và ứng dụng trí tuệ nhân tạo thuộc hệ sinh thái Vingroup, thành lập với sứ mệnh tạo ra những công nghệ AI có tác động thực tế. Các nhóm nghiên cứu của VinAI tập trung vào thị giác máy tính, xử lý ngôn ngữ tự nhiên, học máy và nhiều lĩnh vực nền tảng khác.',
      'Bên cạnh nghiên cứu, VinAI đưa kết quả vào sản phẩm thực tế như hệ thống hỗ trợ lái xe thông minh, trợ lý ảo, nhận diện hình ảnh và các giải pháp thông minh cho nhiều doanh nghiệp. Nhiều công trình của đội ngũ được công bố tại các hội nghị khoa học uy tín trên thế giới.',
      'Môi trường tại VinAI kết hợp tinh thần học thuật với tốc độ của doanh nghiệp công nghệ. Kỹ sư và nhà nghiên cứu được làm việc với dữ liệu và hạ tầng tính toán quy mô lớn, cộng tác cùng chuyên gia trong và ngoài nước, và có nhiều cơ hội phát triển chuyên môn sâu.'],
    1:['FPT Software là công ty thành viên của Tập đoàn FPT, chuyên cung cấp dịch vụ phần mềm và chuyển đổi số cho khách hàng trên toàn cầu, trong đó có nhiều doanh nghiệp lớn tại Nhật Bản, châu Âu, Bắc Mỹ và Đông Nam Á. Đây là một trong những doanh nghiệp xuất khẩu phần mềm lớn nhất Việt Nam với đội ngũ hàng chục nghìn kỹ sư.',
      'Công ty triển khai nhiều lĩnh vực công nghệ như phát triển phần mềm, điện toán đám mây, dữ liệu và AI, ô tô thông minh, an ninh mạng và các giải pháp doanh nghiệp. Nhân sự có cơ hội tham gia dự án quốc tế với quy trình chuẩn hóa, làm việc cùng khách hàng toàn cầu và nâng cao kỹ năng chuyên môn lẫn ngoại ngữ.',
      'FPT Software chú trọng đào tạo và phát triển nghề nghiệp với hệ thống học tập nội bộ, chứng chỉ quốc tế, lộ trình thăng tiến minh bạch và cơ hội làm việc tại nước ngoài. Môi trường trẻ, năng động cùng các hoạt động gắn kết và chế độ phúc lợi đầy đủ giúp nhân viên yên tâm phát triển lâu dài.']
  };
  window.EASYCV_COMPANIES =jobs.filter(j => ![13,25].includes(j.id)).map((job, i) => {
    const related = jobs.filter(j => j.id === job.id || (job.id === 1 && j.id === 13) || (job.id === 14 && j.id === 25));
    const industry = bankIds.includes(job.id) ? 'Ngân hàng' : retailIds.includes(job.id) ? 'Thương mại điện tử' : manufacturingIds.includes(job.id) ? 'Sản xuất & Tiêu dùng' : job.id === 23 ? 'Logistics' : job.id === 27 ? 'Truyền thông' : job.id === 8 ? 'Bất động sản' : 'Công nghệ';
    const cover = industry === 'Ngân hàng' ? 'employer-spotlight-finance.jpg' : industry === 'Sản xuất & Tiêu dùng' ? 'employer-spotlight-manufacturing.jpg' : industry === 'Thương mại điện tử' ? 'employer-spotlight-retail.jpg' : ['employer-spotlight-team.png','employer-spotlight-innovation.png'][i % 2];
    return {id: String(job.id), name: names[job.id] || job.company, logo:job.logo, jobs:related, industry,
      cities:[...new Set(related.map(j => j.city))], verified:job.verified, urgent:related.some(j=>j.isUrgent),
      flexible:related.some(j=>['hybrid','remote'].includes(j.type)), startup:startupIds.includes(job.id),
      size:startupIds.includes(job.id)?'100 - 499':'1.000+', cover:'assets/banners/'+cover,
      cardCover:cardBanners[job.id] ? 'assets/banners/companies/'+cardBanners[job.id]+'.jpg' : 'assets/banners/'+cover,
      about:({'Ngân hàng':'Ngân hàng cung cấp giải pháp tài chính toàn diện cho cá nhân và doanh nghiệp, tập trung vào chuyển đổi số và trải nghiệm khách hàng. Môi trường làm việc chuyên nghiệp, lộ trình thăng tiến rõ ràng cùng nhiều cơ hội đào tạo và phát triển nghề nghiệp dài hạn.',
        'Thương mại điện tử':'Doanh nghiệp thương mại điện tử hàng đầu, kết nối hàng triệu người mua và nhà bán mỗi ngày. Đội ngũ trẻ năng động, đề cao dữ liệu và sáng tạo, luôn sẵn sàng thử thách để mang lại trải nghiệm mua sắm tốt nhất cho khách hàng.',
        'Sản xuất & Tiêu dùng':'Tập đoàn sản xuất và tiêu dùng với nhiều thương hiệu quen thuộc, hoạt động trên khắp cả nước. Chúng tôi coi trọng chất lượng, sự bền vững và xây dựng môi trường để nhân sự được học hỏi, đóng góp và phát triển lâu dài.',
        'Logistics':'Đơn vị logistics vận hành mạng lưới kho bãi và vận chuyển rộng khắp, ứng dụng công nghệ để tối ưu chuỗi cung ứng. Môi trường làm việc năng động, nhiều cơ hội tiếp cận quy trình và công nghệ vận hành hiện đại.',
        'Truyền thông':'Doanh nghiệp truyền thông và nội dung số với đội ngũ sáng tạo giàu năng lượng. Chúng tôi khuyến khích ý tưởng mới, làm việc linh hoạt và tạo điều kiện để mỗi cá nhân phát huy dấu ấn riêng trong từng dự án.',
        'Bất động sản':'Doanh nghiệp bất động sản phát triển nhiều dự án quy mô lớn, hướng tới không gian sống chất lượng. Môi trường làm việc chuyên nghiệp, chế độ đãi ngộ cạnh tranh và cơ hội phát triển cùng các dự án trọng điểm.'}[industry]
        ||'Doanh nghiệp công nghệ xây dựng sản phẩm số phục vụ hàng triệu người dùng. Văn hóa cởi mở, đề cao học hỏi và làm việc nhóm, mang đến nhiều cơ hội tiếp cận công nghệ mới và phát triển chuyên môn cùng đội ngũ kỹ sư giàu kinh nghiệm.'),
      followers:[12400,8600,15200,9800,3200,7100,5400,2300,18600,640,4800,1900,6300,2700,980,420,11300,3600,820,5900,1500,300,7700,2100,4200,1100][i%26],
      profile:profiles[job.id] || null,
      gallery:galleries[job.id] || null,
      benefits:['Thưởng tháng 13','Bảo hiểm sức khỏe','Đào tạo chuyên môn'], website:websites[job.id] || '',
      matches:related.filter(j=>j.aiMatch >= 85).length,
      score:Math.max(...related.map(j=>j.aiMatch)), applied:i < 5, viewed:i < 12};
  });
})();
