# Vether Mining Client

![vether-miner-ui](https://github.com/vetherasset/vether-miner/blob/master/git/vether-miner-ui.png)

* Run this mining client to continuously mine the contract and earn Vether by burning Ether. 
* You can enter your own config variables and deploy via your own heroku app. 
* You can deploy this app without touching any code. See guide below. 

### Config Variables
This is your local `dotenv` file, or add these variables to Heroku via **config vars** that you manually enter. 

```bash
PAYER_KEY = <!!!MAINNET-ETH-PRIVATEKEY!!!>
PAYOUT_ADDR = <your-cold-wallet-address>
DAY_CAPITAL = 1
DYNO_URL = <your-dyno-url>
PORT = 3000
```

* `PAYER_KEY`: The address which holds funds to send Ether (hot wallet)
* `PAYOUT_ADDR`: The address which will be the beneficiary of funds (cold wallet)
* `DAY_CAPITAL`: Maximum capital to spend every day
* `DYNO_URL`: Needed for `wokeDyno.js` to keep your dyno alive every 25 mins
* `PORT`: Heroku Port


## 1. Deploy to Heroku via forking this Github (no code needed):

1. Fork this repo
2. Go to Heroku and **Create New App** -> **Connect to Github** option
3. Select this repo after searching
4. Go to **Settings** -> **Reveal config vars**
5. Add all the `dotenv` config variables individually
6. **Deploy** -> **Manual Deploy** -> **Deploy Branch**
7. **Open App** -> View dashboard

https://www.freecodecamp.org/news/how-to-deploy-a-nodejs-app-to-heroku-from-github-without-installing-heroku-on-your-machine-433bec770efe/

## 2. Deploy to Heroku

Follow this guide to deploy to a Heroku app to run continuously:

https://devcenter.heroku.com/articles/getting-started-with-nodejs

Make sure you add the `dotenv` config variables (**Settings** -> **Reveal config vars**)

The dashboard is available at the app domain: `<app-domain>.herokuapp.com`

## 3. Deploy to local:

```
yarn
```

**Configuration (DotEnv)**
Add your private key and config details to the `dotenv` file:

Rename it to `.env`

**Start**
You can run on local:
```
yarn start
```
View the dashboard by going to this:
http://localhost:3000

```
sudo lsof -i:3000
```