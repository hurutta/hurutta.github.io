---
title: "Convert your old desktop/laptop to a Web Server"
date: 2024-07-03
category: "Tech"
reading_time: "6 min read"
medium: "https://medium.com/@abid-jawad/convert-your-old-desktop-laptop-to-a-web-server-5dcfa9350382"
tags:
  - Web Server
  - Ngrok
  - HTTP Tunnel
  - Recycle
---

Free web hosting is getting harder to come by. Heroku's free tier is gone, and services like DigitalOcean or MS Azure — even through GitHub's Student Pack — want your credit card and can quietly bill you the moment you cross the free limits.

Meanwhile, there is probably an old desktop or laptop gathering dust in your home. Let's put it back to work — as a real web server that serves your projects to the whole internet.

> Recycle that old machine into something useful #WebServer #Ngrok #Recycle

## The traditional way (and why it's a hassle)

The textbook approach to self-hosting looks like this:

| Step | What it involves |
| --- | --- |
| Install a server OS | Ubuntu Server, CentOS, or Windows Server — or skip the OS migration and use Docker/Kubernetes on what you already run |
| Get a public IP | A static public IP from your ISP, or dynamic DNS to work around not having one |
| Buy a domain | Optional — if you don't mind sharing a bare IP address |
| Port forwarding | Map your device's private IP and application port to the public IP from your router's admin panel |

And after all that, you still have to think about security, firewall rules, and whatever hoops your ISP makes you jump through. Doable — but a lot of ceremony for hosting a side project.

## Tunneling: the shortcut

HTTP tunneling is used to create a network link between two computers in conditions of restricted network connectivity — through firewalls, NATs, and ACLs. An intermediary proxy server relays traffic, which means the internet can reach an application deployed on your local machine without any router surgery.

**Ngrok** is exactly that: a tunneling tool that opens a secure tunnel from a public endpoint to a service running locally. It's the fastest way I know to put a local app on the internet.

## Step 1 — Create a local application

Anything that listens on a port works. Here's a minimal Python Flask REST app:

```python
from flask import Flask
app = Flask(__name__)

@app.route('/helloworld', methods=['GET'])
def hello_world():
    return 'Hello, Mekur'

if __name__ == '__main__':
    app.run(debug=True)
```

Save it as `app.py` and run it:

```bash
python app.py
```

Flask serves on port 5000 by default — verify with cURL or a browser at `http://localhost:5000/helloworld`.

## Step 2 — Install Ngrok

Register and log in on [Ngrok's site](https://ngrok.com), then download the local agent for your operating system from the get-started page. Follow the installation guidelines to configure the agent and add your auth token.

## Step 3 — Create the tunnel

One command:

```bash
ngrok http http://localhost:5000
```

Ngrok opens an HTTP tunnel and hands you a unique random domain — something like `https://1eb2-181-80-12-3.ngrok-free.app` — reachable from anywhere in the world. Your endpoint becomes:

```
https://1eb2-181-80-12-3.ngrok-free.app/helloworld
```

There's also a local web interface at `http://127.0.0.1:4040/status` showing tunnel details and a live log of every request hitting your machine.

## About that browser warning

On the first visit, Ngrok's free tier shows visitors a warning page with a confirmation button. Clients can skip it by sending one request header:

```
"ngrok-skip-browser-warning": "true"
```

Add it in cURL, JavaScript `fetch`, or whatever client you're using, and the interstitial disappears.

## Keeping one address: static domains

By default, Ngrok assigns a fresh random domain every time the tunnel restarts — annoying if you've shared the link. Two fixes: dynamic DNS, or simpler, Ngrok's free static domain. Claim yours following the official instructions, then start the tunnel with it:

```bash
ngrok http --domain=[static-domain] http://localhost:5000
```

Now your application lives at a fixed address that survives restarts.

## Wrapping up

Ngrok makes it almost embarrassingly easy to share a locally running web server with the world — perfect for demoing projects, collaborating remotely, or testing APIs against real clients. When you outgrow the free setup, buy a proper domain and link it to your Ngrok domain for a more professional face.

That dusty old machine in the corner? It's a web server now.
