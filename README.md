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
DYNO = <true-or-false>
PORT = 3000
```

* `PAYER_KEY`: The address which holds funds to send Ether (hot wallet) (recommend funding with [Tornado.Cash](https://tornado.cash))
* `PAYER_XPUB` <OPTIONAL> BIP39 XPub to allow random sending of funds to other addresses. 
* `PAYOUT_ADDR`: The address which will be the beneficiary of funds (cold wallet).
* `DAY_CAPITAL`: Maximum capital to spend every day
* `DYNO_URL`: Needed for `wokeDyno.js` to keep your dyno alive every 25 mins.
* `DYNO`: Specifies if should  use `wokeDyno.js`.
* `PORT`: Heroku Port


## 1. Deploy to Heroku via forking this Github (no code needed):

1. Fork this repo
2. Go to Heroku and Create New App** -> **Connect to Github** option
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
In the `dotenv` file add following:

1. Add your **private key** and **payout address**.
2. Set **DYNO** to **false**.
3. Set **DAY_CAPITAL** to your desired amount you want burn every day.

Rename it to `.env`

**Start**

You can run on local:
```
yarn start
```
View the dashboard by going to this:
http://localhost:3000

If you decide to use WokeDyno, it may not play nice locally. Change the wokeDyne port to `3001` in `app.js`:
```javascript
app.listen(3001, () => {
  wakeUpDyno(process.env.DYNO_URL); // will start once server starts
})
```
If you run into trouble, you can kill it:
```
sudo lsof -i:3001
```

Make sure you change back to `3000` before deploying to Heroku.

