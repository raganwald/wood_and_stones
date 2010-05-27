// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, undefined) {
	
	var referee = (function () {
		
		var get_adjacents = (function () {
			
			var memoized_adjacents;
			
			return function () 	{
			
				if (undefined == memoized_adjacents) {
		
					// this can be seriously simplified:
					// 1,2,3,4,5,6,7,8,10,12,14,16, 18, and 19
					// will always be the same. 9, 11, 13,
					// 15, and 17 will differ when they are
					// equal to the size of the board
		
				    if (11 == go.sgf.game_info.SZ) memoized_adjacents = {
				        'dj': '#cj,#ej,#di,#dk',
				        'jg': '#ig,#kg,#jf,#jh',
				        'gh': '#fh,#hh,#gg,#gi',
				        'jh': '#ih,#kh,#jg,#ji',
				        'ba': '#aa,#ca,#bb',
				        'gi': '#fi,#hi,#gh,#gj',
				        'dk': '#ck,#ek,#dj',
				        'ji': '#ii,#ki,#jh,#jj',
				        'gj': '#fj,#hj,#gi,#gk',
				        'ea': '#da,#fa,#eb',
				        'bb': '#ab,#cb,#ba,#bc',
				        'gk': '#fk,#hk,#gj',
				        'eb': '#db,#fb,#ea,#ec',
				        'jj': '#ij,#kj,#ji,#jk',
				        'bc': '#ac,#cc,#bb,#bd',
				        'jk': '#ik,#kk,#jj',
				        'bd': '#ad,#cd,#bc,#be',
				        'ha': '#ga,#ia,#hb',
				        'ec': '#dc,#fc,#eb,#ed',
				        'be': '#ae,#ce,#bd,#bf',
				        'hb': '#gb,#ib,#ha,#hc',
				        'ed': '#dd,#fd,#ec,#ee',
				        'bf': '#af,#cf,#be,#bg',
				        'ka': '#ja,#kb',
				        'hc': '#gc,#ic,#hb,#hd',
				        'bg': '#ag,#cg,#bf,#bh',
				        'kb': '#jb,#ka,#kc',
				        'hd': '#gd,#id,#hc,#he',
				        'ee': '#de,#fe,#ed,#ef',
				        'bh': '#ah,#ch,#bg,#bi',
				        'kc': '#jc,#kb,#kd',
				        'he': '#ge,#ie,#hd,#hf',
				        'ef': '#df,#ff,#ee,#eg',
				        'bi': '#ai,#ci,#bh,#bj',
				        'kd': '#jd,#kc,#ke',
				        'hf': '#gf,#if,#he,#hg',
				        'eg': '#dg,#fg,#ef,#eh',
				        'ke': '#je,#kd,#kf',
				        'hg': '#gg,#ig,#hf,#hh',
				        'eh': '#dh,#fh,#eg,#ei',
				        'bj': '#aj,#cj,#bi,#bk',
				        'kf': '#jf,#ke,#kg',
				        'ei': '#di,#fi,#eh,#ej',
				        'bk': '#ak,#ck,#bj',
				        'kg': '#jg,#kf,#kh',
				        'hh': '#gh,#ih,#hg,#hi',
				        'ej': '#dj,#fj,#ei,#ek',
				        'kh': '#jh,#kg,#ki',
				        'ca': '#ba,#da,#cb',
				        'hi': '#gi,#ii,#hh,#hj',
				        'ek': '#dk,#fk,#ej',
				        'ki': '#ji,#kh,#kj',
				        'hj': '#gj,#ij,#hi,#hk',
				        'cb': '#bb,#db,#ca,#cc',
				        'kj': '#jj,#ki,#kk',
				        'hk': '#gk,#ik,#hj',
				        'fa': '#ea,#ga,#fb',
				        'fb': '#eb,#gb,#fa,#fc',
				        'cc': '#bc,#dc,#cb,#cd',
				        'kk': '#jk,#kj',
				        'ia': '#ha,#ja,#ib',
				        'fc': '#ec,#gc,#fb,#fd',
				        'cd': '#bd,#dd,#cc,#ce',
				        'ib': '#hb,#jb,#ia,#ic',
				        'fd': '#ed,#gd,#fc,#fe',
				        'ce': '#be,#de,#cd,#cf',
				        'ic': '#hc,#jc,#ib,#id',
				        'fe': '#ee,#ge,#fd,#ff',
				        'cf': '#bf,#df,#ce,#cg',
				        'id': '#hd,#jd,#ic,#ie',
				        'cg': '#bg,#dg,#cf,#ch',
				        'ff': '#ef,#gf,#fe,#fg',
				        'ch': '#bh,#dh,#cg,#ci',
				        'ie': '#he,#je,#id,#if',
				        'fg': '#eg,#gg,#ff,#fh',
				        'ci': '#bi,#di,#ch,#cj',
				        'if': '#hf,#jf,#ie,#ig',
				        'fh': '#eh,#gh,#fg,#fi',
				        'cj': '#bj,#dj,#ci,#ck',
				        'ig': '#hg,#jg,#if,#ih',
				        'fi': '#ei,#gi,#fh,#fj',
				        'ck': '#bk,#dk,#cj',
				        'ih': '#hh,#jh,#ig,#ii',
				        'fj': '#ej,#gj,#fi,#fk',
				        'aa': '#ba,#ab',
				        'fk': '#ek,#gk,#fj',
				        'da': '#ca,#ea,#db',
				        'ii': '#hi,#ji,#ih,#ij',
				        'ab': '#bb,#aa,#ac',
				        'db': '#cb,#eb,#da,#dc',
				        'ij': '#hj,#jj,#ii,#ik',
				        'ac': '#bc,#ab,#ad',
				        'ga': '#fa,#ha,#gb',
				        'dc': '#cc,#ec,#db,#dd',
				        'ik': '#hk,#jk,#ij',
				        'ad': '#bd,#ac,#ae',
				        'gb': '#fb,#hb,#ga,#gc',
				        'ae': '#be,#ad,#af',
				        'gc': '#fc,#hc,#gb,#gd',
				        'dd': '#cd,#ed,#dc,#de',
				        'af': '#bf,#ae,#ag',
				        'ja': '#ia,#ka,#jb',
				        'de': '#ce,#ee,#dd,#df',
				        'ag': '#bg,#af,#ah',
				        'jb': '#ib,#kb,#ja,#jc',
				        'gd': '#fd,#hd,#gc,#ge',
				        'df': '#cf,#ef,#de,#dg',
				        'ah': '#bh,#ag,#ai',
				        'jc': '#ic,#kc,#jb,#jd',
				        'ge': '#fe,#he,#gd,#gf',
				        'dg': '#cg,#eg,#df,#dh',
				        'ai': '#bi,#ah,#aj',
				        'jd': '#id,#kd,#jc,#je',
				        'gf': '#ff,#hf,#ge,#gg',
				        'dh': '#ch,#eh,#dg,#di',
				        'aj': '#bj,#ai,#ak',
				        'je': '#ie,#ke,#jd,#jf',
				        'di': '#ci,#ei,#dh,#dj',
				        'ak': '#bk,#aj',
				        'jf': '#if,#kf,#je,#jg',
				        'gg': '#fg,#hg,#gf,#gh'
				    };
				    if (17 == go.sgf.game_info.SZ) memoized_adjacents = {
				        'nd': '#md,#od,#nc,#ne',
				        'eo': '#do,#fo,#en,#ep',
				        'hk': '#gk,#ik,#hj,#hl',
				        'kh': '#jh,#lh,#kg,#ki',
				        'qa': '#pa,#qb',
				        'ne': '#me,#oe,#nd,#nf',
				        'ep': '#dp,#fp,#eo,#eq',
				        'hl': '#gl,#il,#hk,#hm',
				        'ki': '#ji,#li,#kh,#kj',
				        'qb': '#pb,#qa,#qc',
				        'nf': '#mf,#of,#ne,#ng',
				        'eq': '#dq,#fq,#ep',
				        'hm': '#gm,#im,#hl,#hn',
				        'kj': '#jj,#lj,#ki,#kk',
				        'qc': '#pc,#qb,#qd',
				        'ng': '#mg,#og,#nf,#nh',
				        'aa': '#ba,#ab',
				        'hn': '#gn,#in,#hm,#ho',
				        'qd': '#pd,#qc,#qe',
				        'nh': '#mh,#oh,#ng,#ni',
				        'ab': '#bb,#aa,#ac',
				        'ho': '#go,#io,#hn,#hp',
				        'kk': '#jk,#lk,#kj,#kl',
				        'qe': '#pe,#qd,#qf',
				        'ni': '#mi,#oi,#nh,#nj',
				        'ac': '#bc,#ab,#ad',
				        'hp': '#gp,#ip,#ho,#hq',
				        'kl': '#jl,#ll,#kk,#km',
				        'qf': '#pf,#qe,#qg',
				        'nj': '#mj,#oj,#ni,#nk',
				        'ad': '#bd,#ac,#ae',
				        'da': '#ca,#ea,#db',
				        'hq': '#gq,#iq,#hp',
				        'km': '#jm,#lm,#kl,#kn',
				        'qg': '#pg,#qf,#qh',
				        'nk': '#mk,#ok,#nj,#nl',
				        'ae': '#be,#ad,#af',
				        'db': '#cb,#eb,#da,#dc',
				        'kn': '#jn,#ln,#km,#ko',
				        'qh': '#ph,#qg,#qi',
				        'nl': '#ml,#ol,#nk,#nm',
				        'af': '#bf,#ae,#ag',
				        'dc': '#cc,#ec,#db,#dd',
				        'ko': '#jo,#lo,#kn,#kp',
				        'qi': '#pi,#qh,#qj',
				        'nm': '#mm,#om,#nl,#nn',
				        'ag': '#bg,#af,#ah',
				        'kp': '#jp,#lp,#ko,#kq',
				        'qj': '#pj,#qi,#qk',
				        'ah': '#bh,#ag,#ai',
				        'dd': '#cd,#ed,#dc,#de',
				        'ga': '#fa,#ha,#gb',
				        'kq': '#jq,#lq,#kp',
				        'qk': '#pk,#qj,#ql',
				        'nn': '#mn,#on,#nm,#no',
				        'ai': '#bi,#ah,#aj',
				        'de': '#ce,#ee,#dd,#df',
				        'gb': '#fb,#hb,#ga,#gc',
				        'ql': '#pl,#qk,#qm',
				        'no': '#mo,#oo,#nn,#np',
				        'aj': '#bj,#ai,#ak',
				        'df': '#cf,#ef,#de,#dg',
				        'gc': '#fc,#hc,#gb,#gd',
				        'qm': '#pm,#ql,#qn',
				        'np': '#mp,#op,#no,#nq',
				        'ak': '#bk,#aj,#al',
				        'dg': '#cg,#eg,#df,#dh',
				        'gd': '#fd,#hd,#gc,#ge',
				        'qn': '#pn,#qm,#qo',
				        'nq': '#mq,#oq,#np',
				        'dh': '#ch,#eh,#dg,#di',
				        'ge': '#fe,#he,#gd,#gf',
				        'ja': '#ia,#ka,#jb',
				        'al': '#bl,#ak,#am',
				        'qo': '#po,#qn,#qp',
				        'di': '#ci,#ei,#dh,#dj',
				        'gf': '#ff,#hf,#ge,#gg',
				        'jb': '#ib,#kb,#ja,#jc',
				        'am': '#bm,#al,#an',
				        'qp': '#pp,#qo,#qq',
				        'jc': '#ic,#kc,#jb,#jd',
				        'an': '#bn,#am,#ao',
				        'dj': '#cj,#ej,#di,#dk',
				        'gg': '#fg,#hg,#gf,#gh',
				        'jd': '#id,#kd,#jc,#je',
				        'ao': '#bo,#an,#ap',
				        'dk': '#ck,#ek,#dj,#dl',
				        'qq': '#pq,#qp',
				        'je': '#ie,#ke,#jd,#jf',
				        'ma': '#la,#na,#mb',
				        'ap': '#bp,#ao,#aq',
				        'dl': '#cl,#el,#dk,#dm',
				        'gh': '#fh,#hh,#gg,#gi',
				        'jf': '#if,#kf,#je,#jg',
				        'mb': '#lb,#nb,#ma,#mc',
				        'aq': '#bq,#ap',
				        'dm': '#cm,#em,#dl,#dn',
				        'gi': '#fi,#hi,#gh,#gj',
				        'mc': '#lc,#nc,#mb,#md',
				        'dn': '#cn,#en,#dm,#do',
				        'gj': '#fj,#hj,#gi,#gk',
				        'jg': '#ig,#kg,#jf,#jh',
				        'md': '#ld,#nd,#mc,#me',
				        'do': '#co,#eo,#dn,#dp',
				        'gk': '#fk,#hk,#gj,#gl',
				        'jh': '#ih,#kh,#jg,#ji',
				        'pa': '#oa,#qa,#pb',
				        'dp': '#cp,#ep,#do,#dq',
				        'gl': '#fl,#hl,#gk,#gm',
				        'ji': '#ii,#ki,#jh,#jj',
				        'me': '#le,#ne,#md,#mf',
				        'pb': '#ob,#qb,#pa,#pc',
				        'dq': '#cq,#eq,#dp',
				        'gm': '#fm,#hm,#gl,#gn',
				        'mf': '#lf,#nf,#me,#mg',
				        'pc': '#oc,#qc,#pb,#pd',
				        'gn': '#fn,#hn,#gm,#go',
				        'jj': '#ij,#kj,#ji,#jk',
				        'mg': '#lg,#ng,#mf,#mh',
				        'pd': '#od,#qd,#pc,#pe',
				        'go': '#fo,#ho,#gn,#gp',
				        'jk': '#ik,#kk,#jj,#jl',
				        'mh': '#lh,#nh,#mg,#mi',
				        'pe': '#oe,#qe,#pd,#pf',
				        'gp': '#fp,#hp,#go,#gq',
				        'jl': '#il,#kl,#jk,#jm',
				        'mi': '#li,#ni,#mh,#mj',
				        'pf': '#of,#qf,#pe,#pg',
				        'ca': '#ba,#da,#cb',
				        'gq': '#fq,#hq,#gp',
				        'jm': '#im,#km,#jl,#jn',
				        'mj': '#lj,#nj,#mi,#mk',
				        'pg': '#og,#qg,#pf,#ph',
				        'cb': '#bb,#db,#ca,#cc',
				        'jn': '#in,#kn,#jm,#jo',
				        'mk': '#lk,#nk,#mj,#ml',
				        'ph': '#oh,#qh,#pg,#pi',
				        'jo': '#io,#ko,#jn,#jp',
				        'ml': '#ll,#nl,#mk,#mm',
				        'pi': '#oi,#qi,#ph,#pj',
				        'cc': '#bc,#dc,#cb,#cd',
				        'jp': '#ip,#kp,#jo,#jq',
				        'pj': '#oj,#qj,#pi,#pk',
				        'cd': '#bd,#dd,#cc,#ce',
				        'fa': '#ea,#ga,#fb',
				        'jq': '#iq,#kq,#jp',
				        'mm': '#lm,#nm,#ml,#mn',
				        'pk': '#ok,#qk,#pj,#pl',
				        'ce': '#be,#de,#cd,#cf',
				        'fb': '#eb,#gb,#fa,#fc',
				        'mn': '#ln,#nn,#mm,#mo',
				        'pl': '#ol,#ql,#pk,#pm',
				        'cf': '#bf,#df,#ce,#cg',
				        'fc': '#ec,#gc,#fb,#fd',
				        'mo': '#lo,#no,#mn,#mp',
				        'pm': '#om,#qm,#pl,#pn',
				        'cg': '#bg,#dg,#cf,#ch',
				        'fd': '#ed,#gd,#fc,#fe',
				        'mp': '#lp,#np,#mo,#mq',
				        'pn': '#on,#qn,#pm,#po',
				        'ch': '#bh,#dh,#cg,#ci',
				        'fe': '#ee,#ge,#fd,#ff',
				        'ia': '#ha,#ja,#ib',
				        'mq': '#lq,#nq,#mp',
				        'po': '#oo,#qo,#pn,#pp',
				        'ci': '#bi,#di,#ch,#cj',
				        'ib': '#hb,#jb,#ia,#ic',
				        'cj': '#bj,#dj,#ci,#ck',
				        'ff': '#ef,#gf,#fe,#fg',
				        'ic': '#hc,#jc,#ib,#id',
				        'pp': '#op,#qp,#po,#pq',
				        'ck': '#bk,#dk,#cj,#cl',
				        'fg': '#eg,#gg,#ff,#fh',
				        'id': '#hd,#jd,#ic,#ie',
				        'pq': '#oq,#qq,#pp',
				        'cl': '#bl,#dl,#ck,#cm',
				        'fh': '#eh,#gh,#fg,#fi',
				        'ie': '#he,#je,#id,#if',
				        'la': '#ka,#ma,#lb',
				        'cm': '#bm,#dm,#cl,#cn',
				        'fi': '#ei,#gi,#fh,#fj',
				        'if': '#hf,#jf,#ie,#ig',
				        'lb': '#kb,#mb,#la,#lc',
				        'cn': '#bn,#dn,#cm,#co',
				        'fj': '#ej,#gj,#fi,#fk',
				        'ig': '#hg,#jg,#if,#ih',
				        'lc': '#kc,#mc,#lb,#ld',
				        'co': '#bo,#do,#cn,#cp',
				        'fk': '#ek,#gk,#fj,#fl',
				        'ih': '#hh,#jh,#ig,#ii',
				        'ld': '#kd,#md,#lc,#le',
				        'oa': '#na,#pa,#ob',
				        'cp': '#bp,#dp,#co,#cq',
				        'fl': '#el,#gl,#fk,#fm',
				        'le': '#ke,#me,#ld,#lf',
				        'ob': '#nb,#pb,#oa,#oc',
				        'cq': '#bq,#dq,#cp',
				        'fm': '#em,#gm,#fl,#fn',
				        'ii': '#hi,#ji,#ih,#ij',
				        'lf': '#kf,#mf,#le,#lg',
				        'oc': '#nc,#pc,#ob,#od',
				        'fn': '#en,#gn,#fm,#fo',
				        'ij': '#hj,#jj,#ii,#ik',
				        'lg': '#kg,#mg,#lf,#lh',
				        'od': '#nd,#pd,#oc,#oe',
				        'fo': '#eo,#go,#fn,#fp',
				        'ik': '#hk,#jk,#ij,#il',
				        'lh': '#kh,#mh,#lg,#li',
				        'oe': '#ne,#pe,#od,#of',
				        'fp': '#ep,#gp,#fo,#fq',
				        'il': '#hl,#jl,#ik,#im',
				        'li': '#ki,#mi,#lh,#lj',
				        'of': '#nf,#pf,#oe,#og',
				        'fq': '#eq,#gq,#fp',
				        'im': '#hm,#jm,#il,#in',
				        'lj': '#kj,#mj,#li,#lk',
				        'ba': '#aa,#ca,#bb',
				        'og': '#ng,#pg,#of,#oh',
				        'in':'#hn,#jn,#im,#io',
				        'lk': '#kk,#mk,#lj,#ll',
				        'oh': '#nh,#ph,#og,#oi',
				        'io': '#ho,#jo,#in,#ip',
				        'bb': '#ab,#cb,#ba,#bc',
				        'oi': '#ni,#pi,#oh,#oj',
				        'ip': '#hp,#jp,#io,#iq',
				        'll': '#kl,#ml,#lk,#lm',
				        'bc': '#ac,#cc,#bb,#bd',
				        'oj': '#nj,#pj,#oi,#ok',
				        'iq': '#hq,#jq,#ip',
				        'lm': '#km,#mm,#ll,#ln',
				        'bd': '#ad,#cd,#bc,#be',
				        'ea': '#da,#fa,#eb',
				        'ok': '#nk,#pk,#oj,#ol',
				        'ln': '#kn,#mn,#lm,#lo',
				        'be': '#ae,#ce,#bd,#bf',
				        'eb': '#db,#fb,#ea,#ec',
				        'ol': '#nl,#pl,#ok,#om',
				        'lo': '#ko,#mo,#ln,#lp',
				        'bf': '#af,#cf,#be,#bg',
				        'ec': '#dc,#fc,#eb,#ed',
				        'om': '#nm,#pm,#ol,#on',
				        'lp': '#kp,#mp,#lo,#lq',
				        'bg': '#ag,#cg,#bf,#bh',
				        'ed': '#dd,#fd,#ec,#ee',
				        'on': '#nn,#pn,#om,#oo',
				        'bh': '#ah,#ch,#bg,#bi',
				        'ha': '#ga,#ia,#hb',
				        'lq': '#kq,#mq,#lp',
				        'bi': '#ai,#ci,#bh,#bj',
				        'ee': '#de,#fe,#ed,#ef',
				        'hb': '#gb,#ib,#ha,#hc',
				        'oo': '#no,#po,#on,#op',
				        'bj': '#aj,#cj,#bi,#bk',
				        'ef': '#df,#ff,#ee,#eg',
				        'hc': '#gc,#ic,#hb,#hd',
				        'op': '#np,#pp,#oo,#oq',
				        'bk': '#ak,#ck,#bj,#bl',
				        'eg': '#dg,#fg,#ef,#eh',
				        'hd': '#gd,#id,#hc,#he',
				        'oq': '#nq,#pq,#op',
				        'bl': '#al,#cl,#bk,#bm',
				        'eh': '#dh,#fh,#eg,#ei',
				        'he': '#ge,#ie,#hd,#hf',
				        'ka': '#ja,#la,#kb',
				        'bm': '#am,#cm,#bl,#bn',
				        'ei': '#di,#fi,#eh,#ej',
				        'hf': '#gf,#if,#he,#hg',
				        'kb': '#jb,#lb,#ka,#kc',
				        'bn': '#an,#cn,#bm,#bo',
				        'ej': '#dj,#fj,#ei,#ek',
				        'hg': '#gg,#ig,#hf,#hh',
				        'kc': '#jc,#lc,#kb,#kd',
				        'bo': '#ao,#co,#bn,#bp',
				        'ek': '#dk,#fk,#ej,#el',
				        'kd': '#jd,#ld,#kc,#ke',
				        'bp': '#ap,#cp,#bo,#bq',
				        'el': '#dl,#fl,#ek,#em',
				        'hh': '#gh,#ih,#hg,#hi',
				        'ke': '#je,#le,#kd,#kf',
				        'na': '#ma,#oa,#nb',
				        'nb': '#mb,#ob,#na,#nc',
				        'bq': '#aq,#cq,#bp',
				        'em': '#dm,#fm,#el,#en',
				        'hi': '#gi,#ii,#hh,#hj',
				        'kf': '#jf,#lf,#ke,#kg',
				        'nc': '#mc,#oc,#nb,#nd',
				        'en': '#dn,#fn,#em,#eo',
				        'hj': '#gj,#ij,#hi,#hk',
				        'kg': '#jg,#lg,#kf,#kh'
				    };
				    if (13 == go.sgf.game_info.SZ) memoized_adjacents = {
				        'me': '#le,#md,#mf',
				        'jg': '#ig,#kg,#jf,#jh',
				        'dj': '#cj,#ej,#di,#dk',
				        'al': '#bl,#ak,#am',
				        'gh': '#fh,#hh,#gg,#gi',
				        'mf': '#lf,#me,#mg',
				        'jh': '#ih,#kh,#jg,#ji',
				        'am': '#bm,#al',
				        'ba': '#aa,#ca,#bb',
				        'gi': '#fi,#hi,#gh,#gj',
				        'dk': '#ck,#ek,#dj,#dl',
				        'mg': '#lg,#mf,#mh',
				        'ji': '#ii,#ki,#jh,#jj',
				        'gj': '#fj,#hj,#gi,#gk',
				        'dl': '#cl,#el,#dk,#dm',
				        'mh': '#lh,#mg,#mi',
				        'ea': '#da,#fa,#eb',
				        'bb': '#ab,#cb,#ba,#bc',
				        'gk': '#fk,#hk,#gj,#gl',
				        'dm': '#cm,#em,#dl',
				        'mi': '#li,#mh,#mj',
				        'jj': '#ij,#kj,#ji,#jk',
				        'eb': '#db,#fb,#ea,#ec',
				        'bc': '#ac,#cc,#bb,#bd',
				        'gl': '#fl,#hl,#gk,#gm',
				        'mj': '#lj,#mi,#mk',
				        'jk': '#ik,#kk,#jj,#jl',
				        'bd': '#ad,#cd,#bc,#be',
				        'gm': '#fm,#hm,#gl',
				        'ha': '#ga,#ia,#hb',
				        'ec': '#dc,#fc,#eb,#ed',
				        'mk': '#lk,#mj,#ml',
				        'jl': '#il,#kl,#jk,#jm',
				        'be': '#ae,#ce,#bd,#bf',
				        'hb': '#gb,#ib,#ha,#hc',
				        'ed': '#dd,#fd,#ec,#ee',
				        'ml': '#ll,#mk,#mm',
				        'ka': '#ja,#la,#kb',
				        'jm': '#im,#km,#jl',
				        'bf': '#af,#cf,#be,#bg',
				        'hc': '#gc,#ic,#hb,#hd',
				        'kb': '#jb,#lb,#ka,#kc',
				        'bg': '#ag,#cg,#bf,#bh',
				        'hd': '#gd,#id,#hc,#he',
				        'ee': '#de,#fe,#ed,#ef',
				        'mm': '#lm,#ml',
				        'kc': '#jc,#lc,#kb,#kd',
				        'bh': '#ah,#ch,#bg,#bi',
				        'he': '#ge,#ie,#hd,#hf',
				        'ef': '#df,#ff,#ee,#eg',
				        'kd': '#jd,#ld,#kc,#ke',
				        'bi': '#ai,#ci,#bh,#bj',
				        'hf': '#gf,#if,#he,#hg',
				        'eg': '#dg,#fg,#ef,#eh',
				        'ke': '#je,#le,#kd,#kf',
				        'hg': '#gg,#ig,#hf,#hh',
				        'eh': '#dh,#fh,#eg,#ei',
				        'bj': '#aj,#cj,#bi,#bk',
				        'kf': '#jf,#lf,#ke,#kg',
				        'ei': '#di,#fi,#eh,#ej',
				        'bk': '#ak,#ck,#bj,#bl',
				        'kg': '#jg,#lg,#kf,#kh',
				        'hh': '#gh,#ih,#hg,#hi',
				        'ej': '#dj,#fj,#ei,#ek',
				        'bl': '#al,#cl,#bk,#bm',
				        'kh': '#jh,#lh,#kg,#ki',
				        'ca': '#ba,#da,#cb',
				        'hi': '#gi,#ii,#hh,#hj',
				        'ek': '#dk,#fk,#ej,#el',
				        'bm': '#am,#cm,#bl',
				        'ki': '#ji,#li,#kh,#kj',
				        'hj': '#gj,#ij,#hi,#hk',
				        'el': '#dl,#fl,#ek,#em',
				        'cb': '#bb,#db,#ca,#cc',
				        'kj': '#jj,#lj,#ki,#kk',
				        'hk': '#gk,#ik,#hj,#hl',
				        'em': '#dm,#fm,#el',
				        'fa': '#ea,#ga,#fb',
				        'hl': '#gl,#il,#hk,#hm',
				        'fb': '#eb,#gb,#fa,#fc',
				        'cc': '#bc,#dc,#cb,#cd',
				        'kk': '#jk,#lk,#kj,#kl',
				        'ia': '#ha,#ja,#ib',
				        'fc': '#ec,#gc,#fb,#fd',
				        'cd': '#bd,#dd,#cc,#ce',
				        'hm': '#gm,#im,#hl',
				        'kl': '#jl,#ll,#kk,#km',
				        'ib': '#hb,#jb,#ia,#ic',
				        'fd': '#ed,#gd,#fc,#fe',
				        'ce': '#be,#de,#cd,#cf',
				        'la': '#ka,#ma,#lb',
				        'km': '#jm,#lm,#kl',
				        'ic': '#hc,#jc,#ib,#id',
				        'fe': '#ee,#ge,#fd,#ff',
				        'cf': '#bf,#df,#ce,#cg',
				        'lb': '#kb,#mb,#la,#lc',
				        'id': '#hd,#jd,#ic,#ie',
				        'cg': '#bg,#dg,#cf,#ch',
				        'lc': '#kc,#mc,#lb,#ld',
				        'ff': '#ef,#gf,#fe,#fg',
				        'ch': '#bh,#dh,#cg,#ci',
				        'ie': '#he,#je,#id,#if',
				        'ld': '#kd,#md,#lc,#le',
				        'fg': '#eg,#gg,#ff,#fh',
				        'ci': '#bi,#di,#ch,#cj',
				        'if': '#hf,#jf,#ie,#ig',
				        'le': '#ke,#me,#ld,#lf',
				        'fh': '#eh,#gh,#fg,#fi',
				        'cj': '#bj,#dj,#ci,#ck',
				        'ig': '#hg,#jg,#if,#ih',
				        'lf': '#kf,#mf,#le,#lg',
				        'fi': '#ei,#gi,#fh,#fj',
				        'ck': '#bk,#dk,#cj,#cl',
				        'ih': '#hh,#jh,#ig,#ii',
				        'lg': '#kg,#mg,#lf,#lh',
				        'fj': '#ej,#gj,#fi,#fk',
				        'cl': '#bl,#dl,#ck,#cm',
				        'aa': '#ba,#ab',
				        'lh': '#kh,#mh,#lg,#li',
				        'fk': '#ek,#gk,#fj,#fl',
				        'cm': '#bm,#dm,#cl',
				        'da': '#ca,#ea,#db',
				        'ii': '#hi,#ji,#ih,#ij',
				        'ab': '#bb,#aa,#ac',
				        'li': '#ki,#mi,#lh,#lj',
				        'db': '#cb,#eb,#da,#dc',
				        'ij': '#hj,#jj,#ii,#ik',
				        'ac': '#bc,#ab,#ad',
				        'fl': '#el,#gl,#fk,#fm',
				        'lj': '#kj,#mj,#li,#lk',
				        'ik': '#hk,#jk,#ij,#il',
				        'ga': '#fa,#ha,#gb',
				        'dc': '#cc,#ec,#db,#dd',
				        'ad': '#bd,#ac,#ae',
				        'fm': '#em,#gm,#fl',
				        'lk': '#kk,#mk,#lj,#ll',
				        'il': '#hl,#jl,#ik,#im',
				        'gb': '#fb,#hb,#ga,#gc',
				        'ae': '#be,#ad,#af',
				        'ja': '#ia,#ka,#jb',
				        'im': '#hm,#jm,#il',
				        'gc': '#fc,#hc,#gb,#gd',
				        'dd': '#cd,#ed,#dc,#de',
				        'af': '#bf,#ae,#ag',
				        'll': '#kl,#ml,#lk,#lm',
				        'jb': '#ib,#kb,#ja,#jc',
				        'de': '#ce,#ee,#dd,#df',
				        'ag': '#bg,#af,#ah',
				        'gd': '#fd,#hd,#gc,#ge',
				        'ma': '#la,#mb',
				        'lm': '#km,#mm,#ll',
				        'jc': '#ic,#kc,#jb,#jd',
				        'df': '#cf,#ef,#de,#dg',
				        'ah': '#bh,#ag,#ai',
				        'ge': '#fe,#he,#gd,#gf',
				        'mb': '#lb,#ma,#mc',
				        'jd': '#id,#kd,#jc,#je',
				        'dg': '#cg,#eg,#df,#dh',
				        'ai': '#bi,#ah,#aj',
				        'gf': '#ff,#hf,#ge,#gg',
				        'mc': '#lc,#mb,#md',
				        'je': '#ie,#ke,#jd,#jf',
				        'dh': '#ch,#eh,#dg,#di',
				        'aj': '#bj,#ai,#ak',
				        'md': '#ld,#mc,#me',
				        'jf': '#if,#kf,#je,#jg',
				        'di': '#ci,#ei,#dh,#dj',
				        'ak': '#bk,#aj,#al',
				        'gg': '#fg,#hg,#gf,#gh'
				    };
				    if (19 == go.sgf.game_info.SZ) memoized_adjacents = {
				        'nd': '#md,#od,#nc,#ne',
				        'bs': '#as,#cs,#br',
				        'eo': '#do,#fo,#en,#ep',
				        'hk': '#gk,#ik,#hj,#hl',
				        'kh': '#jh,#lh,#kg,#ki',
				        'qa': '#pa,#ra,#qb',
				        'ne': '#me,#oe,#nd,#nf',
				        'ep': '#dp,#fp,#eo,#eq',
				        'hl': '#gl,#il,#hk,#hm',
				        'ki': '#ji,#li,#kh,#kj',
				        'qb': '#pb,#rb,#qa,#qc',
				        'nf': '#mf,#of,#ne,#ng',
				        'eq': '#dq,#fq,#ep,#er',
				        'hm': '#gm,#im,#hl,#hn',
				        'kj': '#jj,#lj,#ki,#kk',
				        'qc': '#pc,#rc,#qb,#qd',
				        'ng': '#mg,#og,#nf,#nh',
				        'aa': '#ba,#ab',
				        'er': '#dr,#fr,#eq,#es',
				        'hn': '#gn,#in,#hm,#ho',
				        'qd': '#pd,#rd,#qc,#qe',
				        'nh': '#mh,#oh,#ng,#ni',
				        'ab': '#bb,#aa,#ac',
				        'es': '#ds,#fs,#er',
				        'ho': '#go,#io,#hn,#hp',
				        'kk': '#jk,#lk,#kj,#kl',
				        'qe': '#pe,#re,#qd,#qf',
				        'ni': '#mi,#oi,#nh,#nj',
				        'ac': '#bc,#ab,#ad',
				        'hp': '#gp,#ip,#ho,#hq',
				        'kl': '#jl,#ll,#kk,#km',
				        'qf': '#pf,#rf,#qe,#qg',
				        'nj': '#mj,#oj,#ni,#nk',
				        'ad': '#bd,#ac,#ae',
				        'da': '#ca,#ea,#db',
				        'hq': '#gq,#iq,#hp,#hr',
				        'km': '#jm,#lm,#kl,#kn',
				        'qg': '#pg,#rg,#qf,#qh',
				        'nk': '#mk,#ok,#nj,#nl',
				        'ae': '#be,#ad,#af',
				        'db': '#cb,#eb,#da,#dc',
				        'hr': '#gr,#ir,#hq,#hs',
				        'kn': '#jn,#ln,#km,#ko',
				        'qh': '#ph,#rh,#qg,#qi',
				        'nl': '#ml,#ol,#nk,#nm',
				        'af': '#bf,#ae,#ag',
				        'dc': '#cc,#ec,#db,#dd',
				        'hs': '#gs,#is,#hr',
				        'ko': '#jo,#lo,#kn,#kp',
				        'qi': '#pi,#ri,#qh,#qj',
				        'nm': '#mm,#om,#nl,#nn',
				        'ag': '#bg,#af,#ah',
				        'kp': '#jp,#lp,#ko,#kq',
				        'qj': '#pj,#rj,#qi,#qk',
				        'ah': '#bh,#ag,#ai',
				        'dd': '#cd,#ed,#dc,#de',
				        'ga': '#fa,#ha,#gb',
				        'kq': '#jq,#lq,#kp,#kr',
				        'qk': '#pk,#rk,#qj,#ql',
				        'nn': '#mn,#on,#nm,#no',
				        'ai': '#bi,#ah,#aj',
				        'de': '#ce,#ee,#dd,#df',
				        'gb': '#fb,#hb,#ga,#gc',
				        'kr': '#jr,#lr,#kq,#ks',
				        'ql': '#pl,#rl,#qk,#qm',
				        'no': '#mo,#oo,#nn,#np',
				        'aj': '#bj,#ai,#ak',
				        'df': '#cf,#ef,#de,#dg',
				        'gc': '#fc,#hc,#gb,#gd',
				        'ks': '#js,#ls,#kr',
				        'qm': '#pm,#rm,#ql,#qn',
				        'np': '#mp,#op,#no,#nq',
				        'ak': '#bk,#aj,#al',
				        'dg': '#cg,#eg,#df,#dh',
				        'gd': '#fd,#hd,#gc,#ge',
				        'qn': '#pn,#rn,#qm,#qo',
				        'nq': '#mq,#oq,#np,#nr',
				        'dh': '#ch,#eh,#dg,#di',
				        'ge': '#fe,#he,#gd,#gf',
				        'ja': '#ia,#ka,#jb',
				        'al': '#bl,#ak,#am',
				        'qo': '#po,#ro,#qn,#qp',
				        'nr': '#mr,#or,#nq,#ns',
				        'di': '#ci,#ei,#dh,#dj',
				        'gf': '#ff,#hf,#ge,#gg',
				        'jb': '#ib,#kb,#ja,#jc',
				        'am': '#bm,#al,#an',
				        'qp': '#pp,#rp,#qo,#qq',
				        'ns': '#ms,#os,#nr',
				        'jc': '#ic,#kc,#jb,#jd',
				        'an': '#bn,#am,#ao',
				        'dj': '#cj,#ej,#di,#dk',
				        'gg': '#fg,#hg,#gf,#gh',
				        'jd': '#id,#kd,#jc,#je',
				        'ao': '#bo,#an,#ap',
				        'dk': '#ck,#ek,#dj,#dl',
				        'qq': '#pq,#rq,#qp,#qr',
				        'ma': '#la,#na,#mb',
				        'je': '#ie,#ke,#jd,#jf',
				        'ap': '#bp,#ao,#aq',
				        'dl': '#cl,#el,#dk,#dm',
				        'gh': '#fh,#hh,#gg,#gi',
				        'qr': '#pr,#rr,#qq,#qs',
				        'mb': '#lb,#nb,#ma,#mc',
				        'jf': '#if,#kf,#je,#jg',
				        'aq': '#bq,#ap,#ar',
				        'dm': '#cm,#em,#dl,#dn',
				        'gi': '#fi,#hi,#gh,#gj',
				        'qs': '#ps,#rs,#qr',
				        'mc': '#lc,#nc,#mb,#md',
				        'ar': '#br,#aq,#as',
				        'dn': '#cn,#en,#dm,#do',
				        'gj': '#fj,#hj,#gi,#gk',
				        'jg': '#ig,#kg,#jf,#jh',
				        'md': '#ld,#nd,#mc,#me',
				        'as': '#bs,#ar',
				        'do': '#co,#eo,#dn,#dp',
				        'gk': '#fk,#hk,#gj,#gl',
				        'jh': '#ih,#kh,#jg,#ji',
				        'pa': '#oa,#qa,#pb',
				        'me': '#le,#ne,#md,#mf',
				        'dp': '#cp,#ep,#do,#dq',
				        'gl': '#fl,#hl,#gk,#gm',
				        'ji': '#ii,#ki,#jh,#jj',
				        'pb': '#ob,#qb,#pa,#pc',
				        'mf': '#lf,#nf,#me,#mg',
				        'dq': '#cq,#eq,#dp,#dr',
				        'gm': '#fm,#hm,#gl,#gn',
				        'pc': '#oc,#qc,#pb,#pd',
				        'mg': '#lg,#ng,#mf,#mh',
				        'dr': '#cr,#er,#dq,#ds',
				        'gn': '#fn,#hn,#gm,#go',
				        'jj': '#ij,#kj,#ji,#jk',
				        'pd': '#od,#qd,#pc,#pe',
				        'mh': '#lh,#nh,#mg,#mi',
				        'ds': '#cs,#es,#dr',
				        'go': '#fo,#ho,#gn,#gp',
				        'jk': '#ik,#kk,#jj,#jl',
				        'sa': '#ra,#sb',
				        'pe': '#oe,#qe,#pd,#pf',
				        'mi': '#li,#ni,#mh,#mj',
				        'gp': '#fp,#hp,#go,#gq',
				        'jl': '#il,#kl,#jk,#jm',
				        'sb': '#rb,#sa,#sc',
				        'pf': '#of,#qf,#pe,#pg',
				        'mj': '#lj,#nj,#mi,#mk',
				        'ca': '#ba,#da,#cb',
				        'gq': '#fq,#hq,#gp,#gr',
				        'jm': '#im,#km,#jl,#jn',
				        'sc': '#rc,#sb,#sd',
				        'pg': '#og,#qg,#pf,#ph',
				        'mk': '#lk,#nk,#mj,#ml',
				        'cb': '#bb,#db,#ca,#cc',
				        'gr': '#fr,#hr,#gq,#gs',
				        'jn': '#in,#kn,#jm,#jo',
				        'sd': '#rd,#sc,#se',
				        'ph': '#oh,#qh,#pg,#pi',
				        'ml': '#ll,#nl,#mk,#mm',
				        'gs': '#fs,#hs,#gr',
				        'jo': '#io,#ko,#jn,#jp',
				        'se': '#re,#sd,#sf',
				        'pi': '#oi,#qi,#ph,#pj',
				        'cc': '#bc,#dc,#cb,#cd',
				        'jp': '#ip,#kp,#jo,#jq',
				        'sf': '#rf,#se,#sg',
				        'pj': '#oj,#qj,#pi,#pk',
				        'mm': '#lm,#nm,#ml,#mn',
				        'cd': '#bd,#dd,#cc,#ce',
				        'fa': '#ea,#ga,#fb',
				        'jq': '#iq,#kq,#jp,#jr',
				        'sg': '#rg,#sf,#sh',
				        'pk': '#ok,#qk,#pj,#pl',
				        'mn': '#ln,#nn,#mm,#mo',
				        'ce': '#be,#de,#cd,#cf',
				        'fb': '#eb,#gb,#fa,#fc',
				        'jr': '#ir,#kr,#jq,#js',
				        'sh': '#rh,#sg,#si',
				        'pl': '#ol,#ql,#pk,#pm',
				        'mo': '#lo,#no,#mn,#mp',
				        'cf': '#bf,#df,#ce,#cg',
				        'fc': '#ec,#gc,#fb,#fd',
				        'js': '#is,#ks,#jr',
				        'si': '#ri,#sh,#sj',
				        'pm': '#om,#qm,#pl,#pn',
				        'mp': '#lp,#np,#mo,#mq',
				        'cg': '#bg,#dg,#cf,#ch',
				        'fd': '#ed,#gd,#fc,#fe',
				        'sj': '#rj,#si,#sk',
				        'pn': '#on,#qn,#pm,#po',
				        'mq': '#lq,#nq,#mp,#mr',
				        'ch': '#bh,#dh,#cg,#ci',
				        'fe': '#ee,#ge,#fd,#ff',
				        'ia': '#ha,#ja,#ib',
				        'sk': '#rk,#sj,#sl',
				        'po': '#oo,#qo,#pn,#pp',
				        'mr': '#lr,#nr,#mq,#ms',
				        'ci': '#bi,#di,#ch,#cj',
				        'ib': '#hb,#jb,#ia,#ic',
				        'sl': '#rl,#sk,#sm',
				        'ms': '#ls,#ns,#mr',
				        'cj': '#bj,#dj,#ci,#ck',
				        'ff': '#ef,#gf,#fe,#fg',
				        'ic': '#hc,#jc,#ib,#id',
				        'sm': '#rm,#sl,#sn',
				        'pp': '#op,#qp,#po,#pq',
				        'ck': '#bk,#dk,#cj,#cl',
				        'fg': '#eg,#gg,#ff,#fh',
				        'id': '#hd,#jd,#ic,#ie',
				        'sn': '#rn,#sm,#so',
				        'pq': '#oq,#qq,#pp,#pr',
				        'cl': '#bl,#dl,#ck,#cm',
				        'fh': '#eh,#gh,#fg,#fi',
				        'ie': '#he,#je,#id,#if',
				        'la': '#ka,#ma,#lb',
				        'so': '#ro,#sn,#sp',
				        'pr': '#or,#qr,#pq,#ps',
				        'cm': '#bm,#dm,#cl,#cn',
				        'fi': '#ei,#gi,#fh,#fj',
				        'if': '#hf,#jf,#ie,#ig',
				        'lb': '#kb,#mb,#la,#lc',
				        'sp': '#rp,#so,#sq',
				        'ps': '#os,#qs,#pr',
				        'cn': '#bn,#dn,#cm,#co',
				        'fj': '#ej,#gj,#fi,#fk',
				        'ig': '#hg,#jg,#if,#ih',
				        'lc': '#kc,#mc,#lb,#ld',
				        'sq': '#rq,#sp,#sr',
				        'co': '#bo,#do,#cn,#cp',
				        'fk': '#ek,#gk,#fj,#fl',
				        'ih': '#hh,#jh,#ig,#ii',
				        'ld': '#kd,#md,#lc,#le',
				        'sr': '#rr,#sq,#ss',
				        'oa': '#na,#pa,#ob',
				        'cp': '#bp,#dp,#co,#cq',
				        'fl': '#el,#gl,#fk,#fm',
				        'le': '#ke,#me,#ld,#lf',
				        'ob': '#nb,#pb,#oa,#oc',
				        'cq': '#bq,#dq,#cp,#cr',
				        'fm': '#em,#gm,#fl,#fn',
				        'ii': '#hi,#ji,#ih,#ij',
				        'lf': '#kf,#mf,#le,#lg',
				        'ss': '#rs,#sr',
				        'oc': '#nc,#pc,#ob,#od',
				        'cr': '#br,#dr,#cq,#cs',
				        'fn': '#en,#gn,#fm,#fo',
				        'ij': '#hj,#jj,#ii,#ik',
				        'lg': '#kg,#mg,#lf,#lh',
				        'od': '#nd,#pd,#oc,#oe',
				        'cs': '#bs,#ds,#cr',
				        'fo': '#eo,#go,#fn,#fp',
				        'ik': '#hk,#jk,#ij,#il',
				        'lh': '#kh,#mh,#lg,#li',
				        'ra': '#qa,#sa,#rb',
				        'oe': '#ne,#pe,#od,#of',
				        'fp': '#ep,#gp,#fo,#fq',
				        'il': '#hl,#jl,#ik,#im',
				        'li': '#ki,#mi,#lh,#lj',
				        'rb': '#qb,#sb,#ra,#rc',
				        'of': '#nf,#pf,#oe,#og',
				        'fq': '#eq,#gq,#fp,#fr',
				        'im': '#hm,#jm,#il,#in',
				        'lj': '#kj,#mj,#li,#lk',
				        'ba': '#aa,#ca,#bb',
				        'rc': '#qc,#sc,#rb,#rd',
				        'og': '#ng,#pg,#of,#oh',
				        'fr': '#er,#gr,#fq,#fs',
				        'in':'#hn,#jn,#im,#io',
				        'lk': '#kk,#mk,#lj,#ll',
				        'rd': '#qd,#sd,#rc,#re',
				        'oh': '#nh,#ph,#og,#oi',
				        'fs': '#es,#gs,#fr',
				        'io': '#ho,#jo,#in,#ip',
				        'bb': '#ab,#cb,#ba,#bc',
				        're': '#qe,#se,#rd,#rf',
				        'oi': '#ni,#pi,#oh,#oj',
				        'ip': '#hp,#jp,#io,#iq',
				        'll': '#kl,#ml,#lk,#lm',
				        'bc': '#ac,#cc,#bb,#bd',
				        'rf': '#qf,#sf,#re,#rg',
				        'oj': '#nj,#pj,#oi,#ok',
				        'iq': '#hq,#jq,#ip,#ir',
				        'lm': '#km,#mm,#ll,#ln',
				        'bd': '#ad,#cd,#bc,#be',
				        'ea': '#da,#fa,#eb',
				        'rg': '#qg,#sg,#rf,#rh',
				        'ok': '#nk,#pk,#oj,#ol',
				        'ln': '#kn,#mn,#lm,#lo',
				        'ir': '#hr,#jr,#iq,#is',
				        'be': '#ae,#ce,#bd,#bf',
				        'eb': '#db,#fb,#ea,#ec',
				        'rh': '#qh,#sh,#rg,#ri',
				        'ol': '#nl,#pl,#ok,#om',
				        'lo': '#ko,#mo,#ln,#lp',
				        'bf': '#af,#cf,#be,#bg',
				        'ec': '#dc,#fc,#eb,#ed',
				        'is': '#hs,#js,#ir',
				        'ri': '#qi,#si,#rh,#rj',
				        'om': '#nm,#pm,#ol,#on',
				        'lp': '#kp,#mp,#lo,#lq',
				        'bg': '#ag,#cg,#bf,#bh',
				        'ed': '#dd,#fd,#ec,#ee',
				        'rj': '#qj,#sj,#ri,#rk',
				        'on': '#nn,#pn,#om,#oo',
				        'lq': '#kq,#mq,#lp,#lr',
				        'bh': '#ah,#ch,#bg,#bi',
				        'ha': '#ga,#ia,#hb',
				        'rk': '#qk,#sk,#rj,#rl',
				        'lr': '#kr,#mr,#lq,#ls',
				        'bi': '#ai,#ci,#bh,#bj',
				        'ee': '#de,#fe,#ed,#ef',
				        'hb': '#gb,#ib,#ha,#hc',
				        'rl': '#ql,#sl,#rk,#rm',
				        'oo': '#no,#po,#on,#op',
				        'ls': '#ks,#ms,#lr',
				        'bj': '#aj,#cj,#bi,#bk',
				        'ef': '#df,#ff,#ee,#eg',
				        'hc': '#gc,#ic,#hb,#hd',
				        'rm': '#qm,#sm,#rl,#rn',
				        'op': '#np,#pp,#oo,#oq',
				        'bk': '#ak,#ck,#bj,#bl',
				        'eg': '#dg,#fg,#ef,#eh',
				        'hd': '#gd,#id,#hc,#he',
				        'rn': '#qn,#sn,#rm,#ro',
				        'oq': '#nq,#pq,#op,#or',
				        'bl': '#al,#cl,#bk,#bm',
				        'eh': '#dh,#fh,#eg,#ei',
				        'he': '#ge,#ie,#hd,#hf',
				        'ka': '#ja,#la,#kb',
				        'ro': '#qo,#so,#rn,#rp',
				        'or': '#nr,#pr,#oq,#os',
				        'bm': '#am,#cm,#bl,#bn',
				        'ei': '#di,#fi,#eh,#ej',
				        'hf': '#gf,#if,#he,#hg',
				        'kb': '#jb,#lb,#ka,#kc',
				        'rp': '#qp,#sp,#ro,#rq',
				        'os': '#ns,#ps,#or',
				        'bn': '#an,#cn,#bm,#bo',
				        'ej': '#dj,#fj,#ei,#ek',
				        'hg': '#gg,#ig,#hf,#hh',
				        'kc': '#jc,#lc,#kb,#kd',
				        'rq': '#qq,#sq,#rp,#rr',
				        'bo': '#ao,#co,#bn,#bp',
				        'ek': '#dk,#fk,#ej,#el',
				        'kd': '#jd,#ld,#kc,#ke',
				        'na': '#ma,#oa,#nb',
				        'bp': '#ap,#cp,#bo,#bq',
				        'el': '#dl,#fl,#ek,#em',
				        'hh': '#gh,#ih,#hg,#hi',
				        'ke': '#je,#le,#kd,#kf',
				        'rr': '#qr,#sr,#rq,#rs',
				        'nb': '#mb,#ob,#na,#nc',
				        'bq': '#aq,#cq,#bp,#br',
				        'em': '#dm,#fm,#el,#en',
				        'hi': '#gi,#ii,#hh,#hj',
				        'kf': '#jf,#lf,#ke,#kg',
				        'rs': '#qs,#ss,#rr',
				        'nc': '#mc,#oc,#nb,#nd',
				        'br': '#ar,#cr,#bq,#bs',
				        'en': '#dn,#fn,#em,#eo',
				        'hj': '#gj,#ij,#hi,#hk',
				        'kg': '#jg,#lg,#kf,#kh'
				    },
				   if ( 9 == go.sgf.game_info.SZ) memoized_adjacents = {
				        'ie': '#he,#id,#if',
				        'cb': '#bb,#db,#ca,#cc',
				        'ec': '#dc,#fc,#eb,#ed',
				        'gd': '#fd,#hd,#gc,#ge',
				        'if': '#hf,#ie,#ig',
				        'ed': '#dd,#fd,#ec,#ee',
				        'ge': '#fe,#he,#gd,#gf',
				        'aa': '#ba,#ab',
				        'ig': '#hg,#if,#ih',
				        'gf': '#ff,#hf,#ge,#gg',
				        'ab': '#bb,#aa,#ac',
				        'cc': '#bc,#dc,#cb,#cd',
				        'ih': '#hh,#ig,#ii',
				        'ac': '#bc,#ab,#ad',
				        'cd': '#bd,#dd,#cc,#ce',
				        'ee': '#de,#fe,#ed,#ef',
				        'ad': '#bd,#ac,#ae',
				        'ce': '#be,#de,#cd,#cf',
				        'ef': '#df,#ff,#ee,#eg',
				        'gg': '#fg,#hg,#gf,#gh',
				        'ii': '#hi,#ih',
				        'ae': '#be,#ad,#af',
				        'cf': '#bf,#df,#ce,#cg',
				        'eg': '#dg,#fg,#ef,#eh',
				        'gh': '#fh,#hh,#gg,#gi',
				        'af': '#bf,#ae,#ag',
				        'cg': '#bg,#dg,#cf,#ch',
				        'eh': '#dh,#fh,#eg,#ei',
				        'ha': '#ga,#ia,#hb',
				        'gi': '#fi,#hi,#gh',
				        'ag': '#bg,#af,#ah',
				        'ch': '#bh,#dh,#cg,#ci',
				        'fa': '#ea,#ga,#fb',
				        'ei': '#di,#fi,#eh',
				        'hb': '#gb,#ib,#ha,#hc',
				        'ah': '#bh,#ag,#ai',
				        'da': '#ca,#ea,#db',
				        'ci': '#bi,#di,#ch',
				        'fb': '#eb,#gb,#fa,#fc',
				        'hc': '#gc,#ic,#hb,#hd',
				        'hd': '#gd,#id,#hc,#he',
				        'ba': '#aa,#ca,#bb',
				        'ai': '#bi,#ah',
				        'db': '#cb,#eb,#da,#dc',
				        'fc': '#ec,#gc,#fb,#fd',
				        'he': '#ge,#ie,#hd,#hf',
				        'dc': '#cc,#ec,#db,#dd',
				        'fd': '#ed,#gd,#fc,#fe',
				        'hf': '#gf,#if,#he,#hg',
				        'fe': '#ee,#ge,#fd,#ff',
				        'bb': '#ab,#cb,#ba,#bc',
				        'hg': '#gg,#ig,#hf,#hh',
				        'bc': '#ac,#cc,#bb,#bd',
				        'dd': '#cd,#ed,#dc,#de',
				        'bd': '#ad,#cd,#bc,#be',
				        'de': '#ce,#ee,#dd,#df',
				        'ff': '#ef,#gf,#fe,#fg',
				        'hh': '#gh,#ih,#hg,#hi',
				        'be': '#ae,#ce,#bd,#bf',
				        'df': '#cf,#ef,#de,#dg',
				        'fg': '#eg,#gg,#ff,#fh',
				        'ia': '#ha,#ib',
				        'hi': '#gi,#ii,#hh',
				        'bf': '#af,#cf,#be,#bg',
				        'dg': '#cg,#eg,#df,#dh',
				        'fh': '#eh,#gh,#fg,#fi',
				        'ib': '#hb,#ia,#ic',
				        'bg': '#ag,#cg,#bf,#bh',
				        'dh': '#ch,#eh,#dg,#di',
				        'ga': '#fa,#ha,#gb',
				        'fi': '#ei,#gi,#fh',
				        'ic': '#hc,#ib,#id',
				        'bh': '#ah,#ch,#bg,#bi',
				        'ea': '#da,#fa,#eb',
				        'di': '#ci,#ei,#dh',
				        'gb': '#fb,#hb,#ga,#gc',
				        'id': '#hd,#ic,#ie',
				        'ca': '#ba,#da,#cb',
				        'bi': '#ai,#ci,#bh',
				        'eb': '#db,#fb,#ea,#ec',
				        'gc': '#fc,#hc,#gb,#gd'
				    };
				    if (15 == go.sgf.game_info.SZ) memoized_adjacents = {
				        'eo': '#do,#fo,#en',
				        'hk': '#gk,#ik,#hj,#hl',
				        'kh': '#jh,#lh,#kg,#ki',
				        'nd': '#md,#od,#nc,#ne',
				        'hl': '#gl,#il,#hk,#hm',
				        'ki': '#ji,#li,#kh,#kj',
				        'ne': '#me,#oe,#nd,#nf',
				        'hm': '#gm,#im,#hl,#hn',
				        'kj': '#jj,#lj,#ki,#kk',
				        'nf': '#mf,#of,#ne,#ng',
				        'aa': '#ba,#ab',
				        'hn': '#gn,#in,#hm,#ho',
				        'ng': '#mg,#og,#nf,#nh',
				        'ab': '#bb,#aa,#ac',
				        'ho': '#go,#io,#hn',
				        'kk': '#jk,#lk,#kj,#kl',
				        'nh': '#mh,#oh,#ng,#ni',
				        'ac': '#bc,#ab,#ad',
				        'kl': '#jl,#ll,#kk,#km',
				        'ni': '#mi,#oi,#nh,#nj',
				        'ad': '#bd,#ac,#ae',
				        'da': '#ca,#ea,#db',
				        'km': '#jm,#lm,#kl,#kn',
				        'nj': '#mj,#oj,#ni,#nk',
				        'ae': '#be,#ad,#af',
				        'db': '#cb,#eb,#da,#dc',
				        'kn': '#jn,#ln,#km,#ko',
				        'nk': '#mk,#ok,#nj,#nl',
				        'af': '#bf,#ae,#ag',
				        'dc': '#cc,#ec,#db,#dd',
				        'ko': '#jo,#lo,#kn',
				        'nl': '#ml,#ol,#nk,#nm',
				        'ag': '#bg,#af,#ah',
				        'nm': '#mm,#om,#nl,#nn',
				        'ah': '#bh,#ag,#ai',
				        'dd': '#cd,#ed,#dc,#de',
				        'ga': '#fa,#ha,#gb',
				        'ai': '#bi,#ah,#aj',
				        'de': '#ce,#ee,#dd,#df',
				        'gb': '#fb,#hb,#ga,#gc',
				        'nn': '#mn,#on,#nm,#no',
				        'aj': '#bj,#ai,#ak',
				        'df': '#cf,#ef,#de,#dg',
				        'gc': '#fc,#hc,#gb,#gd',
				        'no': '#mo,#oo,#nn',
				        'ak': '#bk,#aj,#al',
				        'dg': '#cg,#eg,#df,#dh',
				        'gd': '#fd,#hd,#gc,#ge',
				        'dh': '#ch,#eh,#dg,#di',
				        'ge': '#fe,#he,#gd,#gf',
				        'ja': '#ia,#ka,#jb',
				        'al': '#bl,#ak,#am',
				        'di': '#ci,#ei,#dh,#dj',
				        'gf': '#ff,#hf,#ge,#gg',
				        'jb': '#ib,#kb,#ja,#jc',
				        'am': '#bm,#al,#an',
				        'jc': '#ic,#kc,#jb,#jd',
				        'an': '#bn,#am,#ao',
				        'dj': '#cj,#ej,#di,#dk',
				        'gg': '#fg,#hg,#gf,#gh',
				        'jd': '#id,#kd,#jc,#je',
				        'ao': '#bo,#an',
				        'dk': '#ck,#ek,#dj,#dl',
				        'je': '#ie,#ke,#jd,#jf',
				        'ma': '#la,#na,#mb',
				        'dl': '#cl,#el,#dk,#dm',
				        'gh': '#fh,#hh,#gg,#gi',
				        'jf': '#if,#kf,#je,#jg',
				        'mb': '#lb,#nb,#ma,#mc',
				        'dm': '#cm,#em,#dl,#dn',
				        'gi': '#fi,#hi,#gh,#gj',
				        'mc': '#lc,#nc,#mb,#md',
				        'dn': '#cn,#en,#dm,#do',
				        'gj': '#fj,#hj,#gi,#gk',
				        'jg': '#ig,#kg,#jf,#jh',
				        'md': '#ld,#nd,#mc,#me',
				        'do': '#co,#eo,#dn',
				        'gk': '#fk,#hk,#gj,#gl',
				        'jh': '#ih,#kh,#jg,#ji',
				        'gl': '#fl,#hl,#gk,#gm',
				        'ji': '#ii,#ki,#jh,#jj',
				        'me': '#le,#ne,#md,#mf',
				        'gm': '#fm,#hm,#gl,#gn',
				        'mf': '#lf,#nf,#me,#mg',
				        'gn': '#fn,#hn,#gm,#go',
				        'jj': '#ij,#kj,#ji,#jk',
				        'mg': '#lg,#ng,#mf,#mh',
				        'go': '#fo,#ho,#gn',
				        'jk': '#ik,#kk,#jj,#jl',
				        'mh': '#lh,#nh,#mg,#mi',
				        'jl': '#il,#kl,#jk,#jm',
				        'mi': '#li,#ni,#mh,#mj',
				        'ca': '#ba,#da,#cb',
				        'jm': '#im,#km,#jl,#jn',
				        'mj': '#lj,#nj,#mi,#mk',
				        'cb': '#bb,#db,#ca,#cc',
				        'jn': '#in,#kn,#jm,#jo',
				        'mk': '#lk,#nk,#mj,#ml',
				        'jo': '#io,#ko,#jn',
				        'ml': '#ll,#nl,#mk,#mm',
				        'cc': '#bc,#dc,#cb,#cd',
				        'cd': '#bd,#dd,#cc,#ce',
				        'fa': '#ea,#ga,#fb',
				        'mm': '#lm,#nm,#ml,#mn',
				        'ce': '#be,#de,#cd,#cf',
				        'fb': '#eb,#gb,#fa,#fc',
				        'mn': '#ln,#nn,#mm,#mo',
				        'cf': '#bf,#df,#ce,#cg',
				        'fc': '#ec,#gc,#fb,#fd',
				        'mo': '#lo,#no,#mn',
				        'cg': '#bg,#dg,#cf,#ch',
				        'fd': '#ed,#gd,#fc,#fe',
				        'ch': '#bh,#dh,#cg,#ci',
				        'fe': '#ee,#ge,#fd,#ff',
				        'ia': '#ha,#ja,#ib',
				        'ci': '#bi,#di,#ch,#cj',
				        'ib': '#hb,#jb,#ia,#ic',
				        'cj': '#bj,#dj,#ci,#ck',
				        'ff': '#ef,#gf,#fe,#fg',
				        'ic': '#hc,#jc,#ib,#id',
				        'ck': '#bk,#dk,#cj,#cl',
				        'fg': '#eg,#gg,#ff,#fh',
				        'id': '#hd,#jd,#ic,#ie',
				        'cl': '#bl,#dl,#ck,#cm',
				        'fh': '#eh,#gh,#fg,#fi',
				        'ie': '#he,#je,#id,#if',
				        'la': '#ka,#ma,#lb',
				        'cm': '#bm,#dm,#cl,#cn',
				        'fi': '#ei,#gi,#fh,#fj',
				        'if': '#hf,#jf,#ie,#ig',
				        'lb': '#kb,#mb,#la,#lc',
				        'cn': '#bn,#dn,#cm,#co',
				        'fj': '#ej,#gj,#fi,#fk',
				        'ig': '#hg,#jg,#if,#ih',
				        'lc': '#kc,#mc,#lb,#ld',
				        'co': '#bo,#do,#cn',
				        'fk': '#ek,#gk,#fj,#fl',
				        'ih': '#hh,#jh,#ig,#ii',
				        'ld': '#kd,#md,#lc,#le',
				        'fl': '#el,#gl,#fk,#fm',
				        'le': '#ke,#me,#ld,#lf',
				        'oa': '#na,#ob',
				        'fm': '#em,#gm,#fl,#fn',
				        'ii': '#hi,#ji,#ih,#ij',
				        'lf': '#kf,#mf,#le,#lg',
				        'ob': '#nb,#oa,#oc',
				        'fn': '#en,#gn,#fm,#fo',
				        'ij': '#hj,#jj,#ii,#ik',
				        'lg': '#kg,#mg,#lf,#lh',
				        'oc': '#nc,#ob,#od',
				        'fo': '#eo,#go,#fn',
				        'ik': '#hk,#jk,#ij,#il',
				        'lh': '#kh,#mh,#lg,#li',
				        'od': '#nd,#oc,#oe',
				        'il': '#hl,#jl,#ik,#im',
				        'li': '#ki,#mi,#lh,#lj',
				        'oe': '#ne,#od,#of',
				        'im': '#hm,#jm,#il,#in',
				        'lj': '#kj,#mj,#li,#lk',
				        'of': '#nf,#oe,#og',
				        'ba': '#aa,#ca,#bb',
				        'in':'#hn,#jn,#im,#io',
				        'lk': '#kk,#mk,#lj,#ll',
				        'og': '#ng,#of,#oh',
				        'io': '#ho,#jo,#in',
				        'oh': '#nh,#og,#oi',
				        'bb': '#ab,#cb,#ba,#bc',
				        'll': '#kl,#ml,#lk,#lm',
				        'oi': '#ni,#oh,#oj',
				        'bc': '#ac,#cc,#bb,#bd',
				        'lm': '#km,#mm,#ll,#ln',
				        'oj': '#nj,#oi,#ok',
				        'bd': '#ad,#cd,#bc,#be',
				        'ea': '#da,#fa,#eb',
				        'ln': '#kn,#mn,#lm,#lo',
				        'ok': '#nk,#oj,#ol',
				        'be': '#ae,#ce,#bd,#bf',
				        'eb': '#db,#fb,#ea,#ec',
				        'lo': '#ko,#mo,#ln',
				        'ol': '#nl,#ok,#om',
				        'bf': '#af,#cf,#be,#bg',
				        'ec': '#dc,#fc,#eb,#ed',
				        'om': '#nm,#ol,#on',
				        'bg': '#ag,#cg,#bf,#bh',
				        'ed': '#dd,#fd,#ec,#ee',
				        'on': '#nn,#om,#oo',
				        'bh': '#ah,#ch,#bg,#bi',
				        'ha': '#ga,#ia,#hb',
				        'bi': '#ai,#ci,#bh,#bj',
				        'ee': '#de,#fe,#ed,#ef',
				        'hb': '#gb,#ib,#ha,#hc',
				        'oo': '#no,#on',
				        'bj': '#aj,#cj,#bi,#bk',
				        'ef': '#df,#ff,#ee,#eg',
				        'hc': '#gc,#ic,#hb,#hd',
				        'bk': '#ak,#ck,#bj,#bl',
				        'eg': '#dg,#fg,#ef,#eh',
				        'hd': '#gd,#id,#hc,#he',
				        'bl': '#al,#cl,#bk,#bm',
				        'eh': '#dh,#fh,#eg,#ei',
				        'he': '#ge,#ie,#hd,#hf',
				        'ka': '#ja,#la,#kb',
				        'bm': '#am,#cm,#bl,#bn',
				        'ei': '#di,#fi,#eh,#ej',
				        'hf': '#gf,#if,#he,#hg',
				        'kb': '#jb,#lb,#ka,#kc',
				        'bn': '#an,#cn,#bm,#bo',
				        'ej': '#dj,#fj,#ei,#ek',
				        'hg': '#gg,#ig,#hf,#hh',
				        'kc': '#jc,#lc,#kb,#kd',
				        'bo': '#ao,#co,#bn',
				        'ek': '#dk,#fk,#ej,#el',
				        'kd': '#jd,#ld,#kc,#ke',
				        'el': '#dl,#fl,#ek,#em',
				        'hh': '#gh,#ih,#hg,#hi',
				        'ke': '#je,#le,#kd,#kf',
				        'na': '#ma,#oa,#nb',
				        'em': '#dm,#fm,#el,#en',
				        'hi': '#gi,#ii,#hh,#hj',
				        'kf': '#jf,#lf,#ke,#kg',
				        'nb': '#mb,#ob,#na,#nc',
				        'en': '#dn,#fn,#em,#eo',
				        'hj': '#gj,#ij,#hi,#hk',
				        'kg': '#jg,#lg,#kf,#kh',
				        'nc': '#mc,#oc,#nb,#nd'
				    };
	
				};
			
				return memoized_adjacents;
			
			};
		
		})();
		
		var colour_of = function(intersection) {
			if (intersection.hasClass('black'))
				return 'black';
			else if (intersection.hasClass('white'))
				return 'white';
		};
		
		var is_blank = function(intersection ) {
			return !intersection.hasClass('black') && !intersection.hasClass('white');
		};
		
		var before = function (a, b) {
			// returns whether a is before b
			var a_id = a.attr('id');
			var b_id = b.attr('id');
			var a_across = a_id[0];
			var a_down = a_id[1];
			var b_across = b_id[0];
			var b_down = b_id[1];
			
			return (a_across < b_across || (a_across == b_across && a_down < b_down));
		};
		
		var analyze = function(board, debug) {
			
			if (board == undefined)
				board = $('.move.play .board');
			
			var adjacents = get_adjacents();
			
			// Class decorations:
			//
			// group: this is the head stone of a group. Holds its data.
			//
			// group_xx: identifies a stone as belonging to the group where
			// intersection xx has the group class. The head stone also has this class.
			//
			// last_liberty_is_xx: identifies a stone as belomnging to a group with a single
			// liberty at xx.
			//
			// at_liberty: identifies an empty intersection with at least one liberty.
			
			debug = (debug == undefined ? false : debug);
			if (typeof(board) == 'string')
				board = $(board);
			board
				.find('.intersection')
					.data('group', null)
					.data('liberties', null)
					.removeClass(function (i, clazz) {
						return [
							'group at_liberty atari valid',
							clazz.match(/group_../),
							clazz.match(/last_liberty_is_../),
							clazz.match(/debug_\w+/)
						].join(' ');
					})
					.end()
					
			// first pass, assemble groups
			$.each(go.letters, function (i, across) {
				$.each(go.letters, function (j, down) {
					var id = across + down;
					var intersection = board.find('#' + id);
					if (intersection.is('.black,.white')) {
						var colour = colour_of(intersection);

						intersection
							.data('group', intersection)
							.addClass('group_' + id)
							.addClass('group')
							.data('liberties', []);
							
						board
							.find(adjacents[id])
								.filter(':not(.black):not(.white)')
									.each(function (i, adj) {
										adj = $(adj)
										var adj_id = adj.attr('id');
										var group = intersection.data('group');
										if (debug) console.info(intersection.attr('id') + ' belongs to ' + group.attr('id'));
										var liberties = group.data('liberties');
										if (liberties == null) {
											console.error('no liberties for group ' + group.attr('id') + ' of ' + intersection.attr('id'));
										}
										if (-1 == $.inArray(adj_id, liberties))
											liberties.push(adj_id);
									})
									.end()
								.filter('.black,.white')
									.each(function (i, adj) {
										adj = $(adj)
										if (colour_of(adj) == colour && before(adj, intersection)) {
											var adj_bt = adj.data('group');
											var this_bt = intersection.data('group');
										
											if (adj_bt.attr('id') != this_bt.attr('id')) {
												if (debug) console.info('merging group for ' + intersection.attr('id') + ' into group for ' + adj.attr('id'));
												var from;
												var to;
												if (before(adj_bt, this_bt)) {
													from = this_bt
													to = adj_bt
												}
												else if (before(this_bt, adj_bt)) {
													from = adj_bt
													to = this_bt
												}
												// merge liberties
		                    					if (debug) console.info('merging ' + from.attr('id') + ' into ' + to.attr('id'));

												var from_liberties = from.data('liberties');
												var to_liberties = to.data('liberties')
												$.each(from_liberties, function (i, liberty) {
													if ($.inArray(liberty, to_liberties) == -1)
														to_liberties.push(liberty);
												});
										
												from
													.removeClass('group')
													.data('liberties', null);
										
												if (debug) console.info('now ' + to_liberties.length + ' liberties for ' + to.attr('id'));
											
												board
													.find('.group_' + from.attr('id'))
														.removeClass('group_' + from.attr('id'))
														.addClass('group_' + to.attr('id'))
														.data('group', to);
											}
										}
									});
					}
				});
			});
			
			// second pass, update killed and atari
			board
				.find('.group')
					.each(function (i, group) {
						group = $(group);
						var group_id = group.attr('id');
						var members = board
							.find('.group_' + group_id);
						if (!members.is('.safe')) {
							var liberties = group.data('liberties');
							if (liberties.length == 0) {
								members
									.addClass('dead');
							}
							else if (liberties.length == 1) {
								members
									.addClass('atari last_liberty_is_' + liberties[0]);
							}
						}
					});
			
			// third pass, liberties for empty intersections
			board
				.find('.intersection:not(.black):not(.white)')
					.each(function (i, intersection) {
						intersection = $(intersection);
						if (0 != board
							.find(adjacents[intersection.attr('id')])
								.filter('.intersection:not(.black):not(.white)')
									.size())
							intersection.addClass('at_liberty');
					})
					.end();
					
			return board;
		};
		
		var rules = (function () {
			
			var at_liberty_valid = function (board) {
				// console.log('at_liberty_valid');
				return board
					.find('.intersection.at_liberty:not(.white):not(.black)')
						.addClass('valid debug_at_liberty_valid')
						.end();
			};
			
			
			// this is the rule that permits suicide in Go, so removing this
			// rule prohibits suicide!
			
			var killers_valid = function (board) {
				// console.log('killers_valid');
				var opponent = board.closest('.move').is('.black') ? 'white' : 'black';
				
				return board
					.find('.group.atari.' + opponent)
						.each(function (i, el) {
							el = $(el);
							m = el.attr('class').match(/last_liberty_is_(..)/);
							if (m)
								board
									.find('#' + m[1])
										.addClass('valid debug_killers_valid');
						})
						.end()
			};
			
			var extend_group_valid = function (board) {
				// console.log('extend_group_valid');
				var player = board.closest('.move').is('.white') ? 'white' : 'black';
				var adjacents = get_adjacents();
				
				return board
					.find('.intersection:not(.valid):not(.white):not(.black)')
						.each(function (i, el) {
							el = $(el);
							var id = el.attr('id');
							if (board.find(adjacents[id]).is('.' + player + ':not(.atari)'))
								el
									.addClass('valid debug_extend_group_valid');
						})
						.end();
			};
			
			var simple_ko_invalid = function (board) {
				var opponent = board.closest('.move').is('.black') ? 'white' : 'black';
				var last_sgf_node = go.sgf.current[go.sgf.current.length - 1];
				var last_id = last_sgf_node[opponent[0].toUpperCase()];
				
				if (last_id && last_id.length == 2 && board.has('#' + last_id)) {
					var killed = last_sgf_node['K'];
					 if (killed) {
						var a = killed.split(',');
						if (a.length == 1) {
							var captured_id = a[0];
							var captured = $('#' + captured_id);
							if (captured.size() == 1 && captured.is('valid')) {
								var recaptured = board
									.find('.last_liberty_is_' + captured_id);
								if (recaptured.size() == 1 && recaptured.attr('id') == last_id)
									captured
										.removeClass('valid')
										.addClass('debug_simple_ko_invalid');
							}
						}
					}
				}
				return board
			};
			
			var two_passes = function (board) {
				if (go.sgf.current.length > 2) {
					var ultimate_index = go.sgf.floor(go.sgf.current.length - 1);
					if (ultimate_index < 2) return board;
					var penultimate_index = go.sgf.floor(ultimate_index - 1);
					if (penultimate_index < 1) return board;
					var ultimate = go.sgf.current[ultimate_index][board.closest('.move').is('.black') ? 'W' : 'B'];
					var penultimate = go.sgf.current[penultimate_index][board.closest('.move').is('.black') ? 'B' : 'W'];
					if (
						(ultimate == '' && penultimate == '') ||
						ultimate != undefined && penultimate != undefined && !board.has('#' + ultimate) && !board.has('#' + penultimate)
					) {
						go.sgf.game_info['RE'] = '0';
						alert('The game is over!');
					}
				}
				return board;
			};
			
			var no_whites = function (board) {
				if (!board.has('.white')) {
					go.sgf.game_info['RE'] = 'B+1';
					alert('Black wins by eliminating all whites!');
				}
				return board;
			}
			
			var any_capture = function (board) {
				if (go.sgf.current.length > 1) {
					var ultimate_index = go.sgf.floor(go.sgf.current.length - 1);
					if (go.sgf.current[ultimate_index]['K']) {
						if (go.sgf.current[ultimate_index]['W']) {
							alert('White wins');
							go.sgf.game_info['RE'] = 'W+1';
						}
						else if (go.sgf.current[ultimate_index]['B']) {
							alert('Black wins');
							go.sgf.game_info['RE'] = 'B+1';
						}
						else console.error('confused about who actually won')
					}
				}
				return board;
			};
			
			var connect_sides = function(board) {
				left_groups = board
					.find('.intersection:first-child')
						.map(function(i, el) {
							var m = $(el).attr('class').match(/group_../);
							if (m)
								return '.' + m[0];
						})
							.get()
								.join(',');
				top_groups = board
					.find('.row:first-child .intersection')
						.map(function(i, el) {
							var m = $(el).attr('class').match(/group_../);
							if (m)
								return '.' + m[0];
						})
							.get()
								.join(',');
				connectors = board
					.find('.intersection:last-child')
						.filter(left_groups)
					.add(
						board
							.find('.row:last-child .intersection')
								.filter(top_groups)
					);
				if (connectors.is('.black') && connectors.is('.white')) {
					alert('Weird, it is a tie!?');
					go.sgf.game_info['RE'] = '0';
				}
				else if (connectors.is('.black')) {
					alert('Black connects and wins');
					go.sgf.game_info['RE'] = 'B+1';
				}
				else if (connectors.is('.white')) {
					alert('White connects and wins');
					go.sgf.game_info['RE'] = 'W+1';
				}
			};
			
			// SETUPS
			
			var star_points = function (handicap) {
				
				if (handicap > 0)
				
					return function () {
					
				        var corner = go.sgf.game_info.SZ <= 11 ? 3 : 4;
				        var half = Math.floor(go.sgf.game_info.SZ / 2);
				        var left = go.letters[ corner - 1 ];
				        var center = go.letters[ half ];
				        var right = go.letters[ go.sgf.game_info.SZ - corner ];
				        var top = left;
				        var middle = center;
				        var bottom = right;
						go.sgf.game_info['AB'] = [
							(bottom + left), (top + right), (bottom + right), (top + left), 
							(middle + left), (middle + right), (top + center), (bottom + center), 
		 					(middle + center)
						].slice(0, handicap).join(',');
						go.sgf.game_info['HA'] = handicap;
					};
					
				else return function () { };
				
			};
			
			var random_points = function (black_stones, white_stones) {
				
				return function () {
					
					if ($.isFunction(black_stones))
						black_stones = black_stones();
						
					if ($.isFunction(white_stones))
						white_stones = white_stones();
					
					var eligible_letters = go.letters.slice(2, go.sgf.game_info.SZ - 2);
					var deck = [];
					$.each(eligible_letters, function (i, across) {
						$.each(eligible_letters, function (j, down) {
							deck.push(across + down);
						});
					});
				
			        do {
						deck.sort('Math.random() - 0.5'.lambda());
						
						// This setup actually modifies a test board because
						// it must check for ataris and dead groups
						var board = $('<div></div>')
							.addClass('board');
						$.each(go.letters, function (down_index, down_letter) {
							$('<div></div>')
								.addClass('row')
								.into(function (row) {
									$.each(go.letters, function (across_index, across_letter) {
										$('<img/>')
											.addClass('intersection')
											.attr('id', across_letter + down_letter)
											.attr('src', 'i/dot_clear.gif')
											.appendTo(row);
									});
								})
								.appendTo(board);
						});
						for (i = 0; i < black_stones; ++i) {
							board
								.find('#' + deck[i] + '.intersection')
									.addClass('black');
						}
						for (j = black_stones; j < (white_stones+black_stones); ++j) {
							board
								.find('#' + deck[j] + '.intersection')
									.addClass('white');
						}
					} while (
						board
							.into(analyze)
							.has('.intersection.atari,.intersection.dead')
								.size() > 0
					)
			
					if (black_stones > 0)
						go.sgf.game_info.AB = deck.slice(0, black_stones).join(',');
					if (white_stones > 0)
						go.sgf.game_info.AW = deck.slice(black_stones, black_stones + white_stones).join(',');
				};
				
			};
			
			var corner = function () {
				var placements = [];
				$.each(go.letters, function (i,across) {
					placements.push(across + 'a');
					if (i > 0)
						placements.push(go.letters[go.letters.length - 1] + across);
				});
				go.sgf.game_info.AB = placements.join(',');
			};
			
			var box = function () {
				var placements = [];
				$.each(go.letters.slice(1, go.letters.length - 1), function (i, letter) {
					placements.push(letter + 'a'); // top
					placements.push(go.letters[go.letters.length - 1] + letter); // right
					placements.push(letter + go.letters[go.letters.length - 1]); // bottom
					placements.push('a' + letter); // left
				});
				go.sgf.game_info.AB = placements.join(',');
			};
			
			var influences = function () {
				var blacks = [];
				var whites = [];
				$.each(go.letters.slice(0, go.letters.length - 1), function (i, letter) {
					whites.push(letter + 'a'); // top
					blacks.push(go.letters[go.letters.length - 1] + letter); // right
				});
				$.each(go.letters.slice(1, go.letters.length), function (i, letter) {
					whites.push(letter + go.letters[go.letters.length - 1]); // bottom
					blacks.push('a' + letter); // left
				});
				go.sgf.game_info.AB = blacks.join(',');
				go.sgf.game_info.AW = whites.join(',');
			};
			
			var dots = function () {
				var blacks = [];
				var whites = [];
				for (i = 0;  i < go.sgf.game_info.SZ; i += 2) {
					var white_down = go.letters[i];
					var black_down = go.letters[i + 1];
					for (j = 0;  j < go.sgf.game_info.SZ; j += 2) {
						var black_across = go.letters[j];
						var white_across = go.letters[j + 1];
						whites.push(white_across + white_down);
						blacks.push(black_across + black_down);
					}
				}
				go.sgf.game_info.AB = blacks.join(',');
				go.sgf.game_info.AW = whites.join(',');
			};
			
			var korean_baduk = function () {
					
		        var corner = go.sgf.game_info.SZ <= 11 ? 3 : 4;
		        var half = Math.floor(go.sgf.game_info.SZ / 2);
		        var left = go.letters[ corner - 1 ];
		        var center = go.letters[ half ];
		        var right = go.letters[ go.sgf.game_info.SZ - corner ];
		        var top = left;
		        var middle = center;
		        var bottom = right;
		
				var leftish = go.letters[ corner - 1 + (half - (corner - 1))  / 2 ];
				var rightish = go.letters[ half +  (half - (corner - 1))  / 2 ];
				var topish = leftish
				var bottomish = rightish;
		
				var blacks = [left + top, left + middle, center + middle, right + middle, right + bottom];
				var whites = [left + bottom, center + top, center + bottom, right + top];
		
				if (go.sgf.game_info.SZ >= 17) {
					blacks = blacks.concat([leftish + top, rightish + top, leftish + bottom, rightish + bottom])
					whites = whites.concat([left + topish, left + bottomish, right + topish, right + bottomish])
				}
				
				go.sgf.game_info.AB = blacks.join(',');
				go.sgf.game_info.AW = whites.join(',');
			};
			
			var ancient_chinese = function () {
					
		        var corner = go.sgf.game_info.SZ <= 11 ? 3 : 4;
		        var left = go.letters[ corner - 1 ];
		        var right = go.letters[ go.sgf.game_info.SZ - corner ];
		        var top = left;
		        var bottom = right;
				
				go.sgf.game_info.AB = [left + top, right + bottom].join(',');
				go.sgf.game_info.AW = [left + bottom, right + top].join(',');
			};
			
			var seventeen_free =function () {
				go.sgf.game_info.HA = 17;
			}
			
			return {
				setups: {
					classic: [
						{
							text: "Black plays first",
							to_play: "black",
							setup: star_points(0)
						},
						{
							text: "Two stone handicap",
							to_play: "white",
							setup: star_points(2),
							HA: 2
						},
						{
							text: "Three stone handicap",
							to_play: "white",
							setup: star_points(3),
							HA: 3
						},
						{
							text: "Four stone handicap",
							to_play: "white",
							setup: star_points(4),
							HA: 4
						},
						{
							text: "Five stone handicap",
							to_play: "white",
							setup: star_points(5),
							HA: 5
						},
						{
							text: "Six stone handicap",
							to_play: "white",
							setup: star_points(6),
							HA: 6
						},
						{
							text: "Seven stone handicap",
							to_play: "black",
							setup: star_points(7),
							HA: 7
						},
						{
							text: "Eight stone handicap",
							to_play: "white",
							setup: star_points(8),
							HA: 8
						},
						{
							text: "Nine stone handicap",
							to_play: "white",
							setup: star_points(9),
							HA: 9
						}
					],
					other: [
						{
							text: "Dots",
							to_play: "black",
							setup: dots
						},
						{
							text: "Influence",
							to_play: "black",
							setup: influences
						},
						{
							text: "Wild Fuseki",
							to_play: "black",
							setup: random_points(3,3)
						},
						{
							text: "Really Wild Fuseki",
							to_play: "black",
							setup: random_points(
								function () { return go.sgf.game_info.SZ - 3; },
								function () { return go.sgf.game_info.SZ - 3; }
							)
						},
						{
							text: "Korean Baduk",
							to_play: "white",
							setup: korean_baduk
						},
						{
							text: "Ancient Chinese",
							to_play: "black",
							setup: ancient_chinese
						}
					],
					none: [
						{
							text: "Black plays first",
							to_play: "black",
							setup: star_points(0)
						}
					],
					to_live: [
						{
							text: "Corner Go",
							to_play: "white",
							setup: corner
						},
						{
							text: "Shape Game",
							to_play: "white",
							setup: box
						},
						{
							text: "Kill-all",
							to_play: "black",
							setup: seventeen_free
						}
					]
				},
				validations: {
					at_liberty_valid: at_liberty_valid,
					killers_valid: killers_valid,
					extend_group_valid: extend_group_valid,
					simple_ko_invalid: simple_ko_invalid
				},
				endings: {
					two_passes: two_passes,
					any_capture: any_capture,
					connect_sides: connect_sides
				},
				games: {
					"Classic": '{"GM": 1, "setups": "classic", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_valid", "killers_valid", "extend_group_valid", "simple_ko_invalid" ]}',
					"Other Go Setups": '{"GM": 1, "setups": "other", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_valid", "killers_valid", "extend_group_valid", "simple_ko_invalid" ]}',
					"Atari Go": '{"GM": 12, "setups": "classic", "sizes": [9,11,13,15,17,19], "endings": ["two_passes", "any_capture"], "validations": [ "at_liberty_valid", "killers_valid", "extend_group_valid", "simple_ko_invalid" ]}',
					"White to Live": '{"GM": 14, "setups": "to_live", "sizes": [9,11,13,17,19], "endings": ["two_passes", "no_whites"], "validations": [ "at_liberty_valid", "killers_valid", "extend_group_valid", "simple_ko_invalid" ]}',
					"Gonnect": '{"GM": 13, "setups": "none", "sizes": [13], "endings": ["two_passes", "connect_sides"], "validations": [ "at_liberty_valid", "killers_valid", "extend_group_valid", "simple_ko_invalid" ]}',
					"One Eye Go": '{"GM": 11, "setups": "classic", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_valid", "extend_group_valid" ]}'
				}
			};
		})();
		
		var history_free_validate = function (board) {
			console.error('should not run this default');
			return board;
		};
			
		var game_over = function(board) {
			if (go.sgf.game_info['RE'] != undefined) {
				board
					.find('.intersection.valid')
						.addClass('debug_game_over')
						.removeClass('valid');
			}
		};
		
		// sets the rules to be used in this game
		var set_rules = function (hash_of_strings) {
			// console.log(hash_of_strings);
			var validations = $.map(
				hash_of_strings.validations,
				function (name, i) {
					return rules.validations[name]
			});
			var endings = $.map(
				hash_of_strings.endings,
				function (name, i) {
					return rules.endings[name]
			});
			var steps = $.merge(endings, validations);
			steps.push(game_over);
			history_free_validate = function (board) {
				$.each(steps, function (i, step) {
					board
						.into(step);
				});
				return board;
			}
		};
		
		// validate all legal moves
		var validate = function (board) {
			return board
				.into(analyze)
				.into(history_free_validate);
		};
		
		return {
			set_rules: set_rules,
			analyze: analyze,
			validate: validate,
			rules: rules
		};
	
	})();
	
	go.on_document_ready(function () { 
		go.referee = referee; 
		$.each(referee.rules.games, function (game, serialized_rules) {
			$('<option></option>')
				.text(game)
				.attr('value', serialized_rules)
				.appendTo($('form.new_game #rules'));
		});
	});
	
})(jQuery);	