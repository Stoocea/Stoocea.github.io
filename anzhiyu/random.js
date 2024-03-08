var posts=["/post/Spring型内存马分析.html","/post/JavaAgent内存马.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };