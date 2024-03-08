var posts=["/post/JavaAgent内存马.html","/post/Spring型内存马分析.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };