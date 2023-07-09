# Nginx Load Balancing Tutorial

This tutorial will guide you through the process of setting up Nginx as a load balancer to distribute incoming traffic among three Docker containers running your application. The Nginx container and the application containers will be connected to the same Docker network and referenced using their respective names.

## Prerequisites

Before starting this tutorial, ensure that you have the following:

- Docker installed on your system
- Basic understanding of Docker and Docker networks
- Familiarity with Nginx and its configuration

## Step 1: Create a Docker Network

To establish communication between the Nginx container and the application containers, create a Docker network. Run the following command:

```bash
docker network create my-network
```

This will create a Docker network named `my-network`.

## Step 2: Build and Run the Application Containers

1. In the root directory of your application, build the Docker image by running the following command:

    ```bash
    docker build -t my-app .
    ```

    This command builds the Docker image using the Dockerfile and tags it as `my-app`.

2. Start three containers for your application using the following commands:

    ```bash
    docker run --name app1 --network my-network -p 8080:8080 -d my-app
    docker run --name app2 --network my-network -p 8080:8080 -d my-app
    docker run --name app3 --network my-network -p 8080:8080 -d my-app
    ```

    These commands start three containers named `app1`, `app2`, and `app3` respectively, exposing ports `8080`, `8080`, and `8080` on the host and connecting them to the `my-network` Docker network. Each container runs your application.

By following these steps, you build and run three instances of your application in separate Docker containers. Nginx, acting as the load balancer, will distribute incoming traffic among these containers.

## Step 3: Configure Nginx

Use the file default.conf with the following configuration:

```nginx
http {
    upstream loadbalance {
        server app1:8080;
        server app2:8080;
        server app3:8080;
    }

    server {
        listen 80;
        location / {
            proxy_pass http://loadbalance;
        }
    }
}
```

In this configuration, the `upstream` block defines the three application containers using their names and the port they are running on. The `server` block listens on port `80` and forwards incoming requests to the `loadbalance` upstream.

## Step 4: Build and Run the Nginx Container

```Dockerfile
FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf
```

Build the Docker image by running the following command in the same directory as the `Dockerfile`:

```bash
docker build -t my-nginx .
```

Once the image is built, run the Nginx container with the following command:

```bash
docker run --name my-nginx --network my-network -p 80:80 -d my-nginx
```

This command starts a container named `my-nginx`, connects it to the `my-network` Docker network, maps port `80` of the host to port `80` of the container, and runs it in detached mode.

## Step 5: Verify the Load Balancing

With the Nginx container and application containers running, you can test the load balancing. Open a web browser to send requests to `http://localhost`. Each request should be forwarded to one of the application containers in a round-robin fashion.

Congratulations! You have successfully set up Nginx as a load balancer between three Docker containers running your application.

## Conclusion

This tutorial provided a step-by-step guide to configuring Nginx as a load balancer in a Docker environment. By following these instructions, you can distribute incoming traffic among multiple application containers.