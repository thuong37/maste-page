/* Company prototype interactions. No backend writes; follows are browser-local. */
(() => {
  'use strict';
  const companies = window.EASYCV_COMPANIES || [];
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
  const href = c => `cong-ty.html?id=${encodeURIComponent(c.id)}`;
  const key = 'easycv-company-follows-v1';
  let following;
  try { const saved = JSON.parse(localStorage.getItem(key) || 'null'); following = new Set(Array.isArray(saved)?saved.filter(id=>companies.some(c=>c.id===id)):['1','2','3']); } catch { following = new Set(['1','2','3']); }
  let toastTimer;
  function toast(message) { const el = $('#co-toast'); el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3000); }
  const followButton = c => `<button type="button" class="co-button${following.has(c.id)?' is-following':''}" data-follow="${esc(c.id)}" aria-pressed="${following.has(c.id)}" aria-label="${following.has(c.id)?'Bỏ theo dõi':'Theo dõi'} ${esc(c.name)}">${following.has(c.id)?'✓ Đang theo dõi':'+ Theo dõi'}</button>`;
  function card(c) {
    return `<article class="company-card" data-company-id="${esc(c.id)}"><a href="${href(c)}" tabindex="-1" aria-hidden="true"><img class="company-cover" src="${esc(c.cardCover || c.cover)}" alt="" loading="lazy" width="360" height="120"></a><div class="company-card-body"><div class="company-identity"><img class="company-logo" src="${esc(c.logo)}" alt="Logo ${esc(c.name)}" loading="lazy" width="64" height="64"><div><h3><a href="${href(c)}">${esc(c.name)}</a>${c.verified?'<span class="verified-mark" title="Đã xác thực (minh họa)" aria-label="Đã xác thực (minh họa)">✓</span>':''}</h3><p>${esc(c.industry)} · ${esc(c.size)} nhân viên</p></div></div><p class="company-city">${esc(c.cities.join(' · '))}</p></div><div class="company-card-foot"><div class="company-job-count"><strong>${c.jobs.length} việc đang tuyển</strong><span>${c.matches} khớp CV</span></div><div class="company-card-actions">${followButton(c)}<a href="${href(c)}">Xem trang <span aria-hidden="true">→</span></a></div></div></article>`;
  }
  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-follow]');if(!btn)return;
    const c=companies.find(c=>c.id===btn.dataset.follow);if(!c)return;
    following.has(c.id)?following.delete(c.id):following.add(c.id);
    let persisted=true;try {localStorage.setItem(key,JSON.stringify([...following]));} catch {persisted=false;}
    document.querySelectorAll(`[data-follow="${c.id}"]`).forEach(el=>{el.outerHTML=followButton(c);});
    toast(`${following.has(c.id)?'Đã theo dõi':'Đã bỏ theo dõi'} ${c.name}${persisted?'':'. Thay đổi chỉ được lưu trong phiên này.'}`);
    if($('#company-grid')) render();
  });
  window.addEventListener('storage',e=>{if(e.key!==key)return;try {const ids=JSON.parse(e.newValue || 'null');following=new Set(Array.isArray(ids)?ids:['1','2','3']);}catch{return;}if($('#company-grid'))render();else document.querySelectorAll('[data-follow]').forEach(el=>{const c=companies.find(c=>c.id===el.dataset.follow);if(c)el.outerHTML=followButton(c);});});

  const fields=[
    {key:'industry',name:'Lĩnh vực',options:['Công nghệ','Ngân hàng','Thương mại điện tử','Sản xuất & Tiêu dùng','Logistics','Truyền thông','Bất động sản']},
    {key:'size',name:'Quy mô nhân sự',options:['100 - 499','1.000+']},
    {key:'city',name:'Địa điểm',options:['Hà Nội','Hồ Chí Minh','Đà Nẵng','Remote']},
    {key:'type',name:'Hình thức làm việc',options:['Hybrid','Remote','Toàn thời gian']},
    {key:'benefit',name:'Phúc lợi',options:['Thưởng tháng 13','Bảo hiểm sức khỏe','Đào tạo chuyên môn']}
  ];
  let state={view:'discover',page:1,query:'',location:'',quick:new Set(),collection:'',sort:'match',filters:{}};
  function reset() {
    state={...state,page:1,query:'',location:'',quick:new Set(),collection:'',sort:'match',filters:{}};
    $('#company-search').reset();$('#company-sort').value='match';$('#hiring-only').checked=true;
    document.querySelectorAll('[data-filter]').forEach(el=>el.checked=false);
    document.querySelectorAll('[data-quick],[data-collection]').forEach(el=>el.setAttribute('aria-pressed','false'));render();
  }
  function collectionMatches(c,k){return k==='tech'?c.industry==='Công nghệ':k==='bank'?c.industry==='Ngân hàng':k==='startup'?c.startup:k==='flexible'?c.flexible:true;}
  function matches(c) {
    if(state.view==='following'&&!following.has(c.id))return false;
    if(state.view==='applied'&&!c.applied)return false;
    if(state.view==='viewed'&&!c.viewed)return false;
    if(state.query&&!normalize(c.name+' '+c.industry+' '+c.jobs.map(j=>j.company).join(' ')).includes(normalize(state.query)))return false;
    if(state.location&&!c.cities.includes(state.location))return false;
    if($('#hiring-only').checked&&!c.jobs.length)return false;
    if([...state.quick].some(k=>k==='verified'?!c.verified:k==='urgent'?!c.urgent:!collectionMatches(c,k)))return false;
    if(state.collection&&!collectionMatches(c,state.collection))return false;
    return Object.entries(state.filters).every(([k,values])=>!values.length || values.some(v=>k==='city'?c.cities.includes(v):k==='benefit'?c.benefits.includes(v):k==='type'?c.jobs.some(j=>j.type===({'Hybrid':'hybrid','Remote':'remote','Toàn thời gian':'fulltime'}[v])):c[k]===v));
  }
  function render() {
    $('#following-count').textContent=following.size;
    $('#applied-count').textContent=companies.filter(c=>c.applied).length;
    $('#viewed-count').textContent=companies.filter(c=>c.viewed).length;
    const found=companies.filter(matches).sort((a,b)=>state.sort==='name'?a.name.localeCompare(b.name,'vi'):state.sort==='jobs'?b.jobs.length-a.jobs.length:b.score-a.score);
    const pages=Math.max(1,Math.ceil(found.length/9));state.page=Math.min(state.page,pages);
    $('#result-count').textContent=`${found.length} công ty${state.view==='following'?' đang theo dõi':state.view==='applied'?' đã ứng tuyển':state.view==='viewed'?' đã xem CV':''}`;
    $('#company-grid').innerHTML=found.length?found.slice((state.page-1)*9,state.page*9).map(card).join(''):`<div class="empty-state"><h2>Chưa tìm thấy công ty</h2><p>${state.view==='following'?'Hãy theo dõi công ty bạn quan tâm hoặc thử bỏ bớt bộ lọc.':'Thử từ khóa khác hoặc bỏ bớt bộ lọc để khám phá thêm.'}</p><button type="button" class="co-button" data-reset>Đặt lại bộ lọc</button></div>`;
    $('#company-pagination').innerHTML=pages>1?`<button type="button" data-page="${state.page-1}" aria-label="Trang trước" ${state.page===1?'disabled':''}>‹</button>${Array.from({length:pages},(_,i)=>`<button type="button" data-page="${i+1}" ${state.page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')}<button type="button" data-page="${state.page+1}" aria-label="Trang sau" ${state.page===pages?'disabled':''}>›</button>`:'';
    const active=[];
    if(state.query)active.push({kind:'query',value:state.query});if(state.location)active.push({kind:'location',value:state.location});
    Object.entries(state.filters).forEach(([k,vs])=>vs.forEach(v=>active.push({kind:k,value:v})));
    $('#active-filters').innerHTML=active.map(({kind,value})=>`<button type="button" data-remove="${esc(kind)}" data-value="${esc(value)}" aria-label="Bỏ bộ lọc ${esc(value)}">${esc(value)} ×</button>`).join('');
  }
  if($('#company-grid')) {
    $('#filter-fields').innerHTML=fields.map(f=>`<fieldset class="filter-group"><legend>${f.name}</legend>${f.options.map(v=>`<label><input type="checkbox" data-filter="${f.key}" value="${esc(v)}">${esc(v)}</label>`).join('')}</fieldset>`).join('');
    $('#company-search').addEventListener('submit',e=>{e.preventDefault();state.query=$('#company-keyword').value.trim();state.location=$('#company-location').value;state.page=1;render();});
    $('#company-location').addEventListener('change',()=>{state.location=$('#company-location').value;state.page=1;render();});
    $('#company-sort').addEventListener('change',e=>{state.sort=e.target.value;state.page=1;render();});
    $('#hiring-only').addEventListener('change',()=>{state.page=1;render();});
    $('#reset-filters').addEventListener('click',reset);
    $('#mobile-filter-toggle').addEventListener('click',e=>{const open=$('#company-filters').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));if(open)$('#company-filters').scrollIntoView({block:'start'});});
    $('#filter-fields').addEventListener('change',e=>{const k=e.target.dataset.filter;if(!k)return;state.filters[k]=Array.from(document.querySelectorAll(`[data-filter="${k}"]:checked`),el=>el.value);state.page=1;render();});
    document.addEventListener('click',e=>{
      const quick=e.target.closest('[data-quick]');if(quick){const k=quick.dataset.quick;state.quick.has(k)?state.quick.delete(k):state.quick.add(k);quick.setAttribute('aria-pressed',String(state.quick.has(k)));state.page=1;render();}
      const collection=e.target.closest('[data-collection]');if(collection){state.collection=state.collection===collection.dataset.collection?'':collection.dataset.collection;document.querySelectorAll('[data-collection]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.collection===state.collection)));state.page=1;render();}
      const view=e.target.closest('[data-view]');if(view){state.view=view.dataset.view;state.page=1;document.querySelectorAll('[data-view]').forEach(el=>{el.removeAttribute('aria-current');});view.setAttribute('aria-current','page');render();}
      const page=e.target.closest('[data-page]');if(page&&!page.disabled){state.page=Number(page.dataset.page);render();$('.results-toolbar').scrollIntoView({block:'start'});}
      if(e.target.closest('[data-reset]'))reset();
      const remove=e.target.closest('[data-remove]');if(remove){const k=remove.dataset.remove,v=remove.dataset.value;if(k==='query'){state.query='';$('#company-keyword').value='';}else if(k==='location'){state.location='';$('#company-location').value='';}else{state.filters[k]=state.filters[k].filter(x=>x!==v);document.querySelectorAll(`[data-filter="${k}"]`).forEach(el=>{if(el.value===v)el.checked=false;});}state.page=1;render();}
    });
    render();
  }

  function jobCard(j) {
    const url=`chi-tiet-viec-lam.html?id=${j.id}&title=${encodeURIComponent(j.title)}`;
    return `<article class="job-card" data-job-id="${j.id}"><div class="job-card-top"><img src="${esc(j.logo)}" alt="" class="job-company-logo" loading="lazy"><div class="job-info-main"><div class="job-header-row"><div class="job-title-wrap"><h3 class="job-title"><a href="${url}" class="job-title-link">${esc(j.title)}</a></h3><div class="job-company-row"><span class="job-company-name">${esc(j.company)}</span></div><div class="job-quick-pills"><span class="job-quick-pill">${esc(j.city)}</span><span class="job-quick-pill">${esc(j.exp)} năm</span></div></div><div class="job-top-right"><span class="job-salary-text">${esc(j.salaryBadge)}</span></div></div></div></div><div class="job-card-divider"></div><div class="job-card-bottom"><div class="job-bottom-left">${esc(j.skills.slice(0,3).join(' · '))}</div><div class="job-bottom-right"><a class="co-button" href="${url}">Xem việc làm →</a></div></div></article>`;
  }
  if($('#company-profile')) {
    const id=new URLSearchParams(location.search).get('id') || '1';const c=companies.find(c=>c.id===id);
    if(!c){$('#company-profile').innerHTML='<div class="empty-state"><h1>Không tìm thấy công ty</h1><p>Công ty này chưa có trong bản thử nghiệm.</p><a class="co-button primary" href="kham-pha-cong-ty.html">Khám phá công ty</a></div>';return;}
    document.title=`${c.name} | EasyCV`;
    const benefitIcons=['◈','♡','↗','◷','✦','☷'];
    const benefits=[...c.benefits,'Làm việc linh hoạt','Lộ trình phát triển','Hoạt động gắn kết'];
    const roles=[...new Set(c.jobs.map(j=>j.category))];const roleNames={it:'IT & Công nghệ',finance:'Tài chính',marketing:'Marketing',sales:'Kinh doanh',logistics:'Logistics',engineering:'Kỹ thuật',hr:'Nhân sự'};
    $('#company-profile').innerHTML=`<nav class="co-breadcrumb" aria-label="Đường dẫn"><a href="index.html">Trang chủ</a><span aria-hidden="true">›</span><a href="kham-pha-cong-ty.html">Khám phá công ty</a><span aria-hidden="true">›</span><span>${esc(c.name)}</span></nav>
      <div class="profile-brand"><div class="profile-cover"><img src="${esc(c.cover)}" alt="Ảnh minh họa môi trường làm việc" width="1220" height="238"><small>Ảnh bìa minh họa</small></div><div class="profile-identity"><img class="profile-logo" src="${esc(c.logo)}" alt="Logo ${esc(c.name)}" width="100" height="100"><div class="profile-intro"><div class="profile-title"><h1>${esc(c.name)}</h1>${c.verified?'<span class="verified-label">✓ Đã xác thực (minh họa)</span>':''}</div><p class="profile-tagline">Cùng phát triển sự nghiệp. Cùng tạo nên giá trị.</p><div class="profile-facts"><span>${esc(c.industry)}</span><span>${esc(c.size)} nhân viên</span><span>${esc(c.cities.join(' · '))}</span>${c.website?`<a href="${esc(c.website)}" target="_blank" rel="noopener noreferrer">${esc(new URL(c.website).hostname)} ↗</a>`:''}</div><div class="profile-actions">${followButton(c)}<a href="#company-jobs" class="co-button primary">Xem ${c.jobs.length} việc đang tuyển</a><button type="button" class="co-button" id="share-company">Chia sẻ ↗</button></div></div></div><nav class="profile-nav" aria-label="Nội dung trang công ty"><a href="#company-about">Giới thiệu</a><a href="#company-jobs">Việc làm (${c.jobs.length})</a><a href="#company-benefits">Phúc lợi</a><a href="#company-process">Quy trình</a><a href="#company-offices">Văn phòng</a></nav></div>
      <p class="demo-note">Hồ sơ công ty mẫu: quy mô, giới thiệu, phúc lợi, quy trình và điểm khớp CV là dữ liệu minh họa; việc làm lấy từ dữ liệu chung của EasyCV.</p>
      <div class="profile-layout"><div class="profile-content">
      <section class="profile-section" id="company-about"><h2>Về ${esc(c.name)}</h2><p>${esc(c.name)} hoạt động trong lĩnh vực ${esc(c.industry.toLowerCase())}. Tại đây, mỗi thành viên có cơ hội học hỏi, đóng góp và phát triển cùng đội ngũ.</p><p id="about-more" hidden>Chúng tôi hướng đến một môi trường hợp tác, nơi các ý tưởng được lắng nghe và năng lực được phát triển thông qua những dự án thực tế. Khám phá các vị trí đang tuyển để tìm cơ hội phù hợp với định hướng của bạn.</p><button type="button" class="intro-more" id="about-toggle" aria-expanded="false" aria-controls="about-more">Xem thêm ↓</button></section>
      <section class="profile-section" id="company-jobs"><h2>Việc làm đang tuyển <span class="verified-label">${c.jobs.length} vị trí</span></h2><div class="job-filters"><label class="co-sr" for="profile-job-role">Nhóm nghề</label><select id="profile-job-role"><option value="">Tất cả nhóm nghề</option>${roles.map(r=>`<option value="${esc(r)}">${esc(roleNames[r]||r)}</option>`).join('')}</select><label class="co-sr" for="profile-job-location">Địa điểm</label><select id="profile-job-location"><option value="">Tất cả địa điểm</option>${c.cities.map(city=>`<option>${esc(city)}</option>`).join('')}</select><label class="hiring-filter" style="border:0;padding:0"><input type="checkbox" id="profile-job-match"> Chỉ việc khớp CV</label></div><p id="profile-job-count" aria-live="polite"></p><div id="profile-job-list" class="profile-jobs"></div></section>
      <section class="profile-section" id="company-benefits"><h2>Phúc lợi & cuộc sống tại công ty</h2><p>Không chỉ là nơi làm việc, còn là nơi bạn có thể phát triển.</p><div class="benefit-grid">${benefits.map((b,i)=>`<div class="benefit-item"><span class="benefit-icon" aria-hidden="true">${benefitIcons[i]}</span><span>${esc(b)}</span></div>`).join('')}</div><div class="culture-images"><img src="assets/banners/employer-spotlight-team.png" alt="Ảnh minh họa hoạt động đội ngũ" loading="lazy"><img src="assets/banners/employer-spotlight-innovation.png" alt="Ảnh minh họa không gian sáng tạo" loading="lazy"></div><p class="demo-note">Ảnh văn hóa và danh sách phúc lợi minh họa.</p></section>
      <section class="profile-section" id="company-salary"><h2>Mức lương tham khảo</h2><table class="salary-table"><thead><tr><th scope="col">Vị trí đang tuyển</th><th scope="col">Thu nhập / tháng</th></tr></thead><tbody>${c.jobs.map(j=>`<tr><td>${esc(j.title)}</td><td>${esc(j.salaryBadge)}</td></tr>`).join('')}</tbody></table><p class="demo-note">Khoảng lương từ tin tuyển dụng mẫu, tùy kinh nghiệm và thỏa thuận.</p></section>
      <section class="profile-section" id="company-process"><h2>Quy trình tuyển dụng</h2><p>4 bước để bắt đầu hành trình mới cùng chúng tôi.</p><ol class="process-steps"><li><strong>Gửi hồ sơ</strong><p>Chọn vị trí và gửi CV.</p></li><li><strong>Trao đổi ban đầu</strong><p>Kết nối với đội tuyển dụng.</p></li><li><strong>Phỏng vấn</strong><p>Trao đổi chuyên môn với đội ngũ.</p></li><li><strong>Nhận lời mời</strong><p>Thống nhất và bắt đầu công việc.</p></li></ol></section>
      <section class="profile-section" id="company-offices"><h2>Địa điểm làm việc</h2>${c.cities.map(city=>`<div class="office-item"><div><strong>${esc(city==='Remote'?'Làm việc từ xa':city)}</strong><p>${city==='Remote'?'Trao đổi lịch làm việc khi phỏng vấn.':'Địa chỉ cụ thể được trao đổi trong tin tuyển dụng.'}</p></div>${city!=='Remote'?`<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name+' '+city)}" target="_blank" rel="noopener noreferrer">Tìm trên bản đồ ↗</a>`:''}</div>`).join('')}</section>
      <section class="profile-section"><h2>Công ty bạn có thể quan tâm</h2><div class="company-grid similar-grid">${companies.filter(other=>other.id!==c.id&&other.industry===c.industry).slice(0,2).map(card).join('') || '<p>Chưa có công ty tương tự trong dữ liệu mẫu.</p>'}</div></section>
      </div><aside class="profile-aside"><section class="profile-aside-panel"><h2>Thông tin chung</h2><dl><div><dt>Lĩnh vực</dt><dd>${esc(c.industry)}</dd></div><div><dt>Quy mô (minh họa)</dt><dd>${esc(c.size)} nhân viên</dd></div><div><dt>Địa điểm tuyển dụng</dt><dd>${esc(c.cities.join(', '))}</dd></div><div><dt>Website</dt><dd>${c.website?`<a href="${esc(c.website)}" target="_blank" rel="noopener noreferrer">${esc(new URL(c.website).hostname)} ↗</a>`:'Chưa cập nhật'}</dd></div><div><dt>Năm thành lập</dt><dd>Chưa cập nhật</dd></div><div><dt>Mã số thuế</dt><dd>Chưa cập nhật</dd></div></dl></section><section class="profile-aside-panel"><h2>Độ phù hợp với bạn</h2><div class="match-value">${c.matches}<small> / ${c.jobs.length} việc làm</small></div><p>Khớp với hồ sơ mẫu của bạn. Tìm vị trí để phát huy thế mạnh của mình.</p><a href="#company-jobs" class="co-button primary" id="show-matched-jobs">Xem việc phù hợp</a><p class="demo-note">Minh họa theo điểm khớp từ 85% trong dữ liệu mẫu.</p></section></aside></div>`;
    function renderJobs(){const selected=c.jobs.filter(j=>(!$('#profile-job-role').value||j.category===$('#profile-job-role').value)&&(!$('#profile-job-location').value||j.city===$('#profile-job-location').value)&&(!$('#profile-job-match').checked||j.aiMatch>=85));$('#profile-job-count').textContent=`${selected.length} việc làm phù hợp với bộ lọc`;
      $('#profile-job-list').innerHTML=selected.length?selected.map(jobCard).join(''):'<div class="empty-state"><h2>Chưa có việc phù hợp</h2><p>Thử bỏ bớt bộ lọc để xem các cơ hội khác.</p><button type="button" class="co-button" id="reset-job-filters">Xem tất cả việc làm</button></div>';}
    ['#profile-job-role','#profile-job-location','#profile-job-match'].forEach(s=>$(s).addEventListener('change',renderJobs));
    $('#show-matched-jobs').addEventListener('click',()=>{$('#profile-job-role').value='';$('#profile-job-location').value='';$('#profile-job-match').checked=true;renderJobs();});
    $('#profile-job-list').addEventListener('click',e=>{if(e.target.closest('#reset-job-filters')){$('#profile-job-role').value='';$('#profile-job-location').value='';$('#profile-job-match').checked=false;renderJobs();}});
    $('#about-toggle').addEventListener('click',e=>{const more=$('#about-more');more.hidden=!more.hidden;e.currentTarget.textContent=more.hidden?'Xem thêm ↓':'Thu gọn ↑';e.currentTarget.setAttribute('aria-expanded',String(!more.hidden));});
    $('#share-company').addEventListener('click',async()=>{try {if(navigator.share){await navigator.share({title:document.title,url:location.href});}else{await navigator.clipboard.writeText(location.href);toast('Đã sao chép liên kết công ty');}}catch(err){if(err.name==='AbortError')return;const input=document.createElement('input');input.value=location.href;input.setAttribute('aria-label','Liên kết trang công ty');input.className='co-button';$('#share-company').after(input);input.select();toast('Chọn và sao chép liên kết bên cạnh nút Chia sẻ');}});
    const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(!visible)return;document.querySelectorAll('.profile-nav a').forEach(a=>{const active=a.hash==='#'+visible.target.id;a.style.borderBottomColor=active?'var(--eb-primary-500)':'transparent';a.style.color=active?'var(--eb-primary-700)':'';if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});},{rootMargin:'-5% 0px -65% 0px'});
    ['company-about','company-jobs','company-benefits','company-process','company-offices'].forEach(id=>observer.observe(document.getElementById(id)));
    renderJobs();
  }
})();
