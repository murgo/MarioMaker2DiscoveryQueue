# Super Mario Maker 2 Discovery Queue
Unofficial Mario Maker 2 Discovery Queue / Level Exchange.

Goal of the project is to make it easier for people to get some plays to new courses and prevent the levels from dying in the no-first-clear graveyard.

Current version running at: https://mariomaker2discoveryqueue.com

## Running instructions:

### Run on local machine:
```
cd /app/dir/
meteor --settings settings.json
```

### Deploy to server

1) Install [MUP](http://meteor-up.com/). Do this on machine you're deploying from, not on server. Runtime environment will be automatically installed on server via SSH.

```
cd /app/dir/
npm install -g mup
mkdir .deploy
cd .deploy
mup init
edit mup.js & settings.js to allow mup to configure your server via SSH.
mup setup --verbose
```

2) Deploy to server
```
cd .deploy
mup deploy --verbose --settings settings.json
```

## Disclaimer

This project is not affiliated with Nintendo in any way. All Super Mario Maker 2 rights belong to Nintendo.
