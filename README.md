# dragButton
拖拽选择按钮
这是一个拖拽按钮来进行选择各种项的jquery 插件。效果类似之前的Uber打车下边的选择打车种类。
具体参数如下：

config = {

  container: $('.service-box'), // 页面容器
  
  item: ['python', 'javaScript', 'PHP', 'Java'], // 种类
  
  radius: '.5rem' // 拖拽按钮半径
}
使用方法：

$.fn.drag.init({

        container: $('.service-box'),
        
        item: ['python', 'javaScript', 'PHP', 'Java'],
        
        radius: '.5rem'
        
    });
