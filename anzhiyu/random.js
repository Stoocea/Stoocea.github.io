var posts=["/post/JNDIRe0.html","/post/JavaAgent内存马.html","/post/Spring型内存马分析.html","/post/RMIRe0.html","/post/Log4j漏洞分析.html","/post/最近的感想.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };