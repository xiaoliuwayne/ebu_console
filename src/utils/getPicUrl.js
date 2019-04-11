export function getPicUrl(url, v, t) {		// t: 0-款式图 2- 5-SPU图 6-SKU图 7-质检图 9-工艺图 v: 0大图  1中图  2小图
  if (!url || typeof url !== 'string') { return ''; }
  t = t || 0;
  let psize = '';
  if (t == 0) {
    psize = (v == null || v == 0) ? '' : (v == 1) ? '?imageView2/1/w/100/h/100/q!/85' : (v == 2) ? '?imageView2/1/w/200/h/200/q!/85' : '?imageView2/1/w/800/h/800/q!/85';
  } else if (t == 2) {
    psize = (v == null || v == 0) ? '' : (v == 1) ? '?imageView2/1/w/100/h/100/q!/85' : (v == 2) ? '?imageView2/1/w/300/h/300/q!/85' : '?imageView2/1/w/800/h/800/q!/85';
  } else if (t == 5) {
    psize = (v == null || v == 0) ? '' : (v == 1) ? '?imageView2/1/w/100/h/100/q!/85' : (v == 2) ? '?imageView2/1/w/300/h/300/q!/85' : '?imageView2/1/w/800/h/800/q!/85';
  } else if (t == 6) {
    psize = (v == null || v == 0) ? '' : (v == 1) ? '?imageView2/1/w/100/h/100/q!/85' : (v == 2) ? '?imageView2/1/w/300/h/300/q!/85' : '?imageView2/1/w/800/h/800/q!/85';
  } else if (t == 7) {
    psize = (v == null || v == 0) ? '' : (v == 1) ? '?imageView2/1/w/100/h/100/q!/85' : (v == 2) ? '?imageView2/1/w/300/h/300/q!/85' : '?imageView2/1/w/800/h/800/q!/85';
  }
  return url + psize;
}
