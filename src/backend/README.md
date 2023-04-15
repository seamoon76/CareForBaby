## CareForBaby  后端
软工飞车队 孙骜、徐霈然

### 后端部署

Linux服务器：Ubuntu 20.04

1. 安装Docker

   安装教程可参考：[Docker-从入门到实践](https://yeasy.gitbook.io/docker_practice/install）

2. 将后端代码压缩包下载到服务器，解压缩

   可以通过git clone等方式下载

3. 为服务器申请域名和SSL证书，保存证书到服务器中（注意，由于微信要求前端必须通过HTTPS和域名访问后端云服务器，因此您必须有一个域名和SSL证书，除非使用微信小程序云服务）

4. 修改`docker-compose.yml`文件中的`nginx`-`volumes`

   将`/home/ubuntu/[your ssl certificate file].crt`和`/home/ubuntu/[your ssl certificate file].key`改为您的服务器中为域名申请的SSL证书存放路径

   ```
   nginx:
       restart: always
       image: nginx:latest
       ports:
         - "8001:8000"
       volumes:
         - static-volume:/code/static
         - ./config/nginx:/etc/nginx/conf.d
         #修改下面这两行
         - [your ssl certificate file]se.maqi.site_bundle.crt:[path to your crt file]
         - /home/ubuntu/[your ssl certificate file].key:[path to your key file]
   ```

5. 在解压缩后的目录下执行

   ```bash
   sudo docker-compose up
   ```
