# Slack Community Hack

A simple kit for building Slack community with TypeForm and auto-invitation.

## Contents

* `index.html` - A minimalistic HTML landing page you can customize and serve through your favorite web server.
* `inviter/` - A tiny automaton (~100 LOC) using node.js that queries TypeForm and send Slack invitation to new emails.
* Gulp to compile scss into css.

## Use

1. Clone the repo, and run `npm install`.
2. Customize `index.html` and serve it through your web server (nginx, Apache, etc.)
3. Configure the inviter by filling in `inviter/config.js`.
4. Run the inviter by running `node inviter/index.js`. Use tools such as [pm2](https://github.com/Unitech/pm2) to keep the process alive.

## Built with Slack Community Hack

* [RemoteMesh](https://www.remotemesh.com/) - Chat with other people working remotely
* [wingFind](https://wingfind.com/) - Chat with hundreds of daygamers in your city and beyond

## License

MIT
