# CareForBaby

## Introduction

`CareForBaby` is a WeChat mini-program targeting at newborn/child infusion nursing record  to digitize infusion nursing records and assist nurses in better infusion care.

## Setup

### deploy frontend

1. Register a WeChat Mini Program account

2. Fill in the applied Mini Program ID in the WeChat Developer Tools

3. Set the backend domain name and port number in the `app.ts` file in the root directory

    ```
    // app.ts
    serverUrl:'https://se.maqi.site:8001/'
    ```

4. After the development is complete, click `Upload` in the WeChat developer tool to upload it as a trial version of the applet

5. Released as an official version after the WeChat public platform application is approved

### deploy backend

Linux server: Ubuntu 20.04

1. Install Docker

    For the installation tutorial, please refer to: [Docker-From Getting Started to Practice ](https://yeasy.gitbook.io/docker_practice/install)

2. Download the backend code compression package to the server and decompress it

    It can be downloaded through git clone, etc.

3. Apply for a domain name and SSL certificate for the server, and save the certificate to the server (note that because WeChat requires the front-end to access the back-end cloud server through HTTPS and domain name, you must have a domain name and SSL certificate, unless you use the WeChat applet cloud service )

4. Modify `nginx`-`volumes` in the `docker-compose.yml` file

    Change `/home/ubuntu/[your ssl certificate file].crt` and `/home/ubuntu/[your ssl certificate file].key` to the storage path of the SSL certificate applied for the domain name in your server

    ```
    nginx:
        restart: always
        image: nginx:latest
        ports:
          - "8001:8000"
        volumes:
          - static-volume:/code/static
          - ./config/nginx:/etc/nginx/conf.d
          #Modify the following two lines
          - /home/ubuntu/[your ssl certificate file].crt:[path to your crt file]
          - /home/ubuntu/[your ssl certificate file].key:[path to your key file]
    ```

5. Execute in the decompressed directory

    ```bash
    sudo docker-compose up
    ```

## Usage

See `doc/CareForBaby Product Document.pdf`

## Author

+ Qi Ma (mq19 AT mails DOT tsinghua DOT edu DOT cn)
+ Leyi Pan
+ Ao Sun
+ Peiran Xu

## License

MIT