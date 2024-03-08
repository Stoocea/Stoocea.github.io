var posts=["/post/FastJson反序列化.html","/post/RMI攻击总结.html","/post/JNDI注入.html","/post/blog迁移动态以及最近的事.html","/post/内存马-tomcat类全类型测试学习.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };