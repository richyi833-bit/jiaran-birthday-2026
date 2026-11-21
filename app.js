const PEOPLE=[["Cyrus","首席产品经理","黄金罗盘","初心","每一次看似绕远的选择，都是你亲手绘制的人生地图。愿你永远知道自己为何出发。"],["Arden","首席市场研究专家","星辰地图","远见","你见过的山海，都将成为未来判断世界的坐标。世界很大，你值得更远的远方。"],["Rowan","首席研发工程师","永恒钻石","坚韧","真正的光芒，来自一次又一次的打磨。愿你每一次重构，都比昨天更接近理想。"],["Silas","首席测试工程师","勇者之盾","勇气","世界没有零缺陷版本，但总有人愿意一次次尝试。愿你敢爱、敢闯、敢重新开始。"],["Hugo","首席渠道拓展专家","黄金钥匙","机遇","当一扇门暂时关闭时，请记住你已经拥有打开另一扇门的能力。"],["Lucian","首席营销运营专家","珍藏美酒","醇香岁月","人生如美酒，需要时间酝酿，也值得慢慢品尝。愿你事业有成，有朋友相伴，更拥有随时举杯、尽情享受生活的自由。"],["Aidan","首席数据分析师","时光沙漏","沉淀","成长不是一条直线。那些微小、真实且持续的努力，会在未来某一天闪闪发光。"],["Evren","首席商业与财务专家","翡翠皇冠","价值","愿你收获配得上才华的回报，也拥有对工作、旅行与生活说“我选择”的底气。"],["Aurelio","首席设计师","水晶向日葵","热爱","愿你永远为日出停留，为森林心动，为一片特别的云抬头。"],["Elio","业务总监","生命之树","新生","愿你根系深厚、枝叶繁盛。无论季节如何流转，总能找到自己的光。"]],MEMORIES=[["2018 · 初见","第一次深大合照","campus-mobile.webp","那年九月，深圳大学文科楼。一次 remarkable 的回眸，让我一眼便觉得：你不一般。","50% 27%"],["2018 · 朋友","第一次火锅","hotpot.webp","从教室到一张饭桌，老朋友的故事，在一餐一饭里慢慢变长。","50% 50%"],["2021 · 启程","新手村，正式启程","birthday21.webp","从论文、答辩，到毕业。2021年，你走进产品经理的世界。没有标准答案的人生，从这里正式开始。","50% 45%"],["毕业旅行 · 云贵川","世界再难，也要出发","yungui.webp","毕业那年，恰逢疫情。一场云贵川之旅，几经周折才得以成行。后来才发现，最难忘的不只是沿途的山河，而是在那个处处受限的年代，我们依然一起奔向了远方。","50% 44%"],["2023 · 广州","那些没有掌声的战役","guangzhou.webp","需求、评审、交付、深夜改稿。在压力里苦练本领，在难题面前重新整理思路。那些没有掌声的战役，塑造了后来更强大的你。","50% 43%"],["2024 · 麦理浩径","幸好，路上总有同行的人","hike.webp","穿过山径，遇见蓝色的海。成年人的生活不总是轻松，但远方提醒我们：工作之外，世界依旧辽阔。","50% 47%"],["日本 · 自由的瞬间","那些毫无负担的大笑","tokyo.webp","谁规定旅行一定要端庄？在东京街头，笑到索性躺下。很久以后，我们依然会记得那些毫无负担的大笑。","50% 42%"],["川西 · 更远的地方","世界很大，未来还很长","seda.webp","川西的风，把许多烦恼吹得很远。从初入职场，到今天优秀的 AI 产品经理，那些年的历练从未白费。","50% 48%"],["此刻 · 佳冉3.0","仍在生长，仍然闪耀","self.webp","你一直在磨练，也一直在蜕变。有些风雨，无法提前写进人生的计划。突如其来的意外曾让生活按下暂停，但你走过来了，仍在生长。","50% 42%"]];
const $=id=>document.getElementById(id);function asset(n){return 'assets/'+n;}

/* V1.9: warm pictures before navigation, with only two network requests in flight. */
const photoTasks=new Map(),photoQueue=[];let photoBusy=0;
function pumpPhotos(){
 while(photoBusy<2 && photoQueue.length){
  const job=photoQueue.shift(),img=new Image();photoBusy++;img.decoding='async';img.fetchPriority='low';
  let done=false;const finish=ok=>{if(done)return;done=true;photoBusy--;job.resolve(ok);pumpPhotos()};
  img.onload=()=>{if(img.decode)img.decode().catch(()=>{});finish(true)};
  img.onerror=()=>finish(false);img.src=asset(job.name);
  if(img.complete&&img.naturalWidth>0)finish(true);
 }
}
function preloadPhoto(name,urgent=false){
 if(photoTasks.has(name))return photoTasks.get(name);
 let resolve;const p=new Promise(r=>resolve=r);photoTasks.set(name,p);
 const job={name,resolve};if(urgent)photoQueue.unshift(job);else photoQueue.push(job);
 pumpPhotos();return p;
}
function nextMemories(){
 for(let i=memIndex+1;i<Math.min(MEMORIES.length,memIndex+4);i++)preloadPhoto(MEMORIES[i][2]);
 if(memIndex>=MEMORIES.length-2)preloadPhoto('cyrus.webp');
}
const photoFrame=document.querySelector('#memory .memory-cinema'),photoMessage=document.createElement('div');
photoMessage.className='photo-loading';photoMessage.textContent='正在载入这段回忆…';photoMessage.setAttribute('role','status');
photoFrame.appendChild(photoMessage);
$('memImage').addEventListener('load',()=>photoFrame.classList.remove('photo-pending','photo-error'));
$('memImage').addEventListener('error',()=>{photoFrame.classList.remove('photo-pending');photoFrame.classList.add('photo-error');photoMessage.textContent='照片加载失败，轻触重试'});
photoMessage.onclick=()=>{if(!photoFrame.classList.contains('photo-error'))return;photoFrame.classList.replace('photo-error','photo-pending');photoMessage.textContent='正在重试…';$('memImage').src=asset(MEMORIES[memIndex][2])+'?retry='+Date.now()};
let scene='intro',memIndex=0,personIndex=0;let collected=[];/* Fresh visit starts without previous-version demo progress; collection persists only in this tab. */
function show(id){scene=id;document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));window.scrollTo(0,0);if(id==='memory')drawMemory();if(id==='transition'){preloadPhoto('cyrus.webp',true);preloadPhoto('arden.webp');preloadPhoto('rowan.webp')}if(id==='partners')drawPartners();if(id==='tree'||id==='letter'){preloadPhoto('bracelet_authentic.webp',true);preloadPhoto('birthday_card.png')}if(id==='bracelet')preloadPhoto('birthday_card.png',true);if(id==='card')$('finalCardArt').loading='eager';if(id==='tree')updateTree()}
let timer;function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>$('toast').classList.remove('show'),1800)}
const audio=$('audio');
const musicIDs=['musicBtn','memMusic','transitionMusic','partnersMusic','treeMusic','letterMusic','braceletMusic','cardMusic'];
let musicPreferredOn=true;
const MUSIC_IN_POINT=4.25; // Original recording is silent for its first 4.37 seconds.
audio.loop=true;audio.volume=.44;audio.preload='metadata';
function skipSilentIntro(){
  if(audio.readyState>=1&&audio.currentTime<1){
    try{audio.currentTime=MUSIC_IN_POINT}catch(err){}
  }
}
audio.addEventListener('loadedmetadata',skipSilentIntro);
audio.addEventListener('timeupdate',()=>{
  // Safari/Chrome reset a looping MP3 to 0; skip the silent lead-in every loop.
  if(!audio.paused&&audio.duration>150&&audio.currentTime<.7)skipSilentIntro();
});
function syncMusicButtons(){const playing=!audio.paused&&!audio.ended;musicIDs.forEach(id=>{const b=$(id);if(!b)return;b.classList.toggle('is-playing',playing);b.setAttribute('aria-label',playing?'暂停生日钢琴曲':'播放生日钢琴曲');b.setAttribute('aria-pressed',String(playing));b.title=playing?'暂停音乐':'点击播放音乐'});const hint=$('musicHint');if(hint){hint.textContent=playing?'音乐正在播放 · 点击暂停':'轻触音符开启音乐 ↗';hint.classList.toggle('hint-off',playing)}}
function requestMusic(){musicPreferredOn=true;audio.muted=false;audio.volume=.44;audio.loop=true;skipSilentIntro();try{const result=audio.play();if(result&&typeof result.catch==='function')result.catch(()=>{syncMusicButtons();toast('轻触右上角音符，即可开启音乐')})}catch(e){syncMusicButtons();toast('轻触右上角音符，即可开启音乐')}syncMusicButtons()}
function music(){if(!audio.paused){musicPreferredOn=false;audio.pause()}else{requestMusic()}syncMusicButtons()}
musicIDs.forEach(id=>{const b=$(id);if(b)b.addEventListener('click',music)});
audio.addEventListener('play',syncMusicButtons);audio.addEventListener('pause',syncMusicButtons);audio.addEventListener('ended',syncMusicButtons);
syncMusicButtons();
/* Navigation never depends on whether music was started earlier; returning to intro is safe. */
$('start').addEventListener('click',()=>{if(musicPreferredOn&&audio.paused)requestMusic();show('memory')});
function wrapTwo(s,max=18){let t=s.replace(/[“”]/g,'');if(t.length<=max)return t;let pivot=Math.round(t.length/2);let best=pivot;let chars='，。；、！';for(let d=0;d<9;d++){if(chars.includes(t[pivot-d])){best=pivot-d+1;break}if(chars.includes(t[pivot+d])){best=pivot+d+1;break}}return t.slice(0,best)+'\n'+t.slice(best)}
function drawMemory(){let m=MEMORIES[memIndex];$('memNo').textContent=String(memIndex+1).padStart(2,'0')+' / '+String(MEMORIES.length).padStart(2,'0');$('memTitle').textContent=m[0];photoFrame.classList.remove('photo-error');photoFrame.classList.add('photo-pending');photoMessage.textContent='正在载入这段回忆…';const wide=['hotpot.webp','campus-mobile.webp'].includes(m[2]);photoFrame.classList.toggle('is-wide',wide);photoFrame.style.setProperty('--photo-bg','url("'+asset(m[2])+'")');$('memImage').fetchPriority='high';$('memImage').loading='eager';$('memImage').decoding='async';$('memImage').src=asset(m[2]);if($('memImage').complete&&$('memImage').naturalWidth>0)photoFrame.classList.remove('photo-pending');nextMemories();$('memImage').style.objectPosition=m[4];$('memImage').style.animation='none';void $('memImage').offsetWidth;$('memImage').style.animation=wide?'memWideIn .65s ease both':'memFilmIn .9s ease both';$('memImage').alt=m[0]+'真实回忆照片';$('memSubtitle').textContent=m[1];$('memText').textContent=m[3];$('memDots').innerHTML=MEMORIES.map((_,i)=>'<span class="'+(i===memIndex?'on':'')+'"></span>').join('');$('memNext').textContent=memIndex===MEMORIES.length-1?'认识新伙伴　›':'下一段回忆　›'}
$('memBack').onclick=()=>memIndex? (memIndex--,drawMemory()):show('intro');$('memPrev').onclick=$('memBack').onclick;$('memNext').onclick=()=>memIndex===MEMORIES.length-1?show('transition'):(memIndex++,drawMemory());let sx=0;$('memory').addEventListener('touchstart',e=>{sx=e.changedTouches[0].clientX},{passive:true});$('memory').addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>95){if(dx<0)$('memNext').click();else $('memPrev').click()}},{passive:true});
$('meetPartners').onclick=()=>show('partners');$('partnersBack').onclick=()=>show('transition');
const shortQuotes=["愿你定义改变世界的产品，\n也自由定义自己的人生。","愿眼界超越时代、脚步跨越山海，\n前途无量。","那些深夜里的苦练，\n终会成为无人能夺走的光芒。","人生无法预演，\n愿你始终勇敢面对未知。","曾经困住你的地方，\n终会成为新世界的入口。","愿事业有成、朋友常伴，\n每个庆祝时刻都有人举杯。","愿五年沉淀成为底气，\n在未来收获人生复利。","愿事业有成，财富丰盈，\n拥有不必妥协的自由。","愿历经世事仍爱山川草木，\n把生活过成艺术。","愿你根深叶茂，不惧风雨，\n柳暗花明，向阳而生。"];
let portraitGridBuilt=false;
function drawPartners(){
 const p=PEOPLE[personIndex],file=p[0].toLowerCase()+'.webp',featured=$('featuredPortrait');
 if(featured.dataset.file!==file){featured.dataset.file=file;featured.fetchPriority='high';featured.decoding='async';featured.src=asset(file)}
 preloadPhoto(file,true);preloadPhoto(PEOPLE[(personIndex+1)%10][0].toLowerCase()+'.webp');
 $('featuredNumber').textContent=String(personIndex+1).padStart(2,'0')+' / 10';$('featuredName').textContent=p[0];$('featuredRole').textContent=p[1];$('featuredQuote').textContent=shortQuotes[personIndex];$('featuredQuote').style.whiteSpace='pre-line';
 const grid=$('peopleGrid');if(!portraitGridBuilt){
  grid.innerHTML=PEOPLE.map((it,i)=>'<button class="person" data-person="'+i+'" aria-label="选择'+it[0]+'"><img src="'+asset(it[0].toLowerCase()+'.webp')+'" alt="'+it[0]+'" loading="lazy" decoding="async" fetchpriority="low"><span>'+it[0]+'</span></button>').join('');
  grid.querySelectorAll('button').forEach(el=>el.onclick=()=>{personIndex=+el.dataset.person;drawPartners()});portraitGridBuilt=true;
 }
 grid.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===personIndex);b.classList.toggle('done',collected.includes(i))});
 $('openPresent').textContent=collected.includes(personIndex)?'再次看看这份礼物　›':'打开这位伙伴的礼物　›';
 $('goTree').textContent=collected.length===10?'前往生命之树　›':'还有 '+(10-collected.length)+' 份祝福待收集';
 $('goTree').classList.toggle('is-complete',collected.length===10);
 $('collectCount').textContent=collected.length===10?'10份礼物已经集齐，生命之树已点亮。':collected.length+' / 10 份祝福';updateTree()
}
$('nextFriend').onclick=()=>{personIndex=(personIndex+1)%10;drawPartners()};$('goTree').onclick=()=>{if(collected.length!==10){toast('请先收集十位新伙伴的礼物');return}show('tree')};
function openModal(){const p=PEOPLE[personIndex];$('modalNo').textContent='GIFT '+String(personIndex+1).padStart(2,'0')+' / 10';$('modalArt').src=asset('gift_'+p[0].toLowerCase()+'.webp');$('giftModalTitle').textContent=p[2];$('modalWords').textContent=p[4];$('claimPresent').textContent=collected.includes(personIndex)?'继续这段旅程　›':'收下这份祝福　›';$('giftOverlay').classList.add('open');$('giftOverlay').setAttribute('aria-hidden','false')}
function closeModal(){$('giftOverlay').classList.remove('open');$('giftOverlay').setAttribute('aria-hidden','true')}
$('openPresent').onclick=openModal;$('closePresent').onclick=closeModal;$('giftOverlay').onclick=e=>{if(e.target===$('giftOverlay'))closeModal()};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});$('claimPresent').onclick=()=>{let added=!collected.includes(personIndex);if(added){collected.push(personIndex);try{sessionStorage.setItem('jiaran15-collected',JSON.stringify(collected))}catch{}}closeModal();if(added)toast('一份祝福已收下，树长出新叶');personIndex=(personIndex+1)%10;drawPartners();if(collected.length===10)toast('10份礼物已经集齐，生命之树已点亮。')};
const centers=[[130,210],[468,182],[185,113],[418,110],[291,51],[109,298],[510,285],[237,182],[372,205],[305,135]];
function initTree(tag){const root=document.querySelector('[data-tree="'+tag+'"]');if(!root)return;const NS='http://www.w3.org/2000/svg';for(let k=0;k<10;k++){const group=document.createElementNS(NS,'g');group.dataset.n=k;const [x,y]=centers[k];for(let j=0;j<15;j++){const a=j*2.399+(.2*k),r=12+Math.sqrt(j)*11,cx=x+Math.cos(a)*r,cy=y+Math.sin(a)*r,el=document.createElementNS(NS,'ellipse');el.setAttribute('cx',cx.toFixed(1));el.setAttribute('cy',cy.toFixed(1));el.setAttribute('rx',String(9+(j%3)*2));el.setAttribute('ry',String(5+(j%2)*2));el.setAttribute('transform','rotate('+(j*57)+' '+cx+' '+cy+')');el.setAttribute('fill',['#78965c','#9bb46a','#416c48','#d1bc75','#638851'][j%5]);group.appendChild(el)}root.appendChild(group)}}
initTree('miniTree');initTree('fullTree');function updateTree(){document.querySelectorAll('.leaf-clusters g').forEach(g=>g.classList.toggle('grown',Number(g.dataset.n)<collected.length))}
$('goLetter').onclick=()=>show('letter');$('seeBracelet').onclick=()=>show('bracelet');$('getCard').onclick=()=>show('card');$('replay').onclick=()=>{if(!confirm('重温这趟旅程将清空已收集的10份礼物，确定重新开始吗？'))return;collected=[];personIndex=0;memIndex=0;try{sessionStorage.removeItem('jiaran15-collected')}catch{}updateTree();drawPartners();closeModal();audio.pause();audio.currentTime=0;musicPreferredOn=true;syncMusicButtons();show('intro');toast('旅程已重置，祝福可以重新收集')};
$('saveCard').onclick=()=>{
 const img=$('finalCardArt');const filename='佳冉_向阳而生_生日纪念卡.png';
 // iOS browsers cannot silently save into Photos; open the real PNG for long-press save.
 if(/iPhone|iPad|iPod/i.test(navigator.userAgent)){
   const opened=window.open(img.src,'_blank');
   if(opened){toast('请在新打开的图片上长按，选择保存到照片');return}
   toast('请长按卡片图片，选择保存到照片');return;
 }
 fetch(img.src).then(r=>{if(!r.ok)throw new Error('image '+r.status);return r.blob()}).then(blob=>{
   const uri=URL.createObjectURL(blob);const a=document.createElement('a');
   a.href=uri;a.download=filename;document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(uri),8000);toast('生日纪念卡已下载');
 }).catch(()=>{const a=document.createElement('a');a.href=img.src;a.download=filename;document.body.appendChild(a);a.click();a.remove();toast('请检查浏览器下载记录')});
};
show('intro');
preloadPhoto('campus-mobile.webp',true);
setTimeout(()=>{preloadPhoto('hotpot.webp');preloadPhoto('birthday21.webp');},350);