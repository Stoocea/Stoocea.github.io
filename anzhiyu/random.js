var posts=["/post/C3P0链分析.html","/post/FastJsonRe0.html","/post/JNDIRe0.html","/post/Log4j漏洞分析.html","/post/Jackson反序列化.html","/post/JavaAgent内存马.html","/post/ROME反序列化.html","/post/Spring型内存马分析.html","/post/Re_Live.html","/post/RMIRe0.html","/post/最近的感想.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };