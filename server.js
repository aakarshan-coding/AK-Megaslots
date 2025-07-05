const fs = require('fs');
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const cors = require('cors'); // Import cors package

// ALICE = PLAYER BANK ACCOUNT
// BOB = CASINO BANK ACCOUNT

app.use(cors());

app.use(bodyParser.json());

//post request to send money from the player to casino if they run out of money to play with
app.post('/send-money-to-casino', (req, res) => {
  const amount = req.body.amount;
  console.log(amount);
  // Handle the amount as needed (e.g., process payment logic)

  // Respond with success message
  //res.json({ message: `Payment of ${amount} received` });

  
  console.log(`payment recieved of amount ${amount}`);

  // ALICE TO BOB PAYMENT - represents bank to casino payback system  
  const REST_HOST = '127.0.0.1:8081';
  const MACAROON_PATH = 'C:/Users/srira/.polar/networks/1/volumes/lnd/alice/data/chain/bitcoin/regtest/admin.macaroon'; // alice macaroon path

  var bankBalanceEnough = true;

  let requestBody = {
    addr: 'bcrt1pe0ypen8em7zgdp62ap8yxr37fczxagujftchkcxmg43rwf7zsrussqnn29', // bob address
    amount: `${amount}`, 
    send_all: false, 
    min_confs: 1, 
    spend_unconfirmed: false, 
  };

  let options = {
    url: `https://${REST_HOST}/v1/transactions`,
    // Work-around for self-signed certificates.
    rejectUnauthorized: false,
    json: true,
    headers: {
      'Grpc-Metadata-macaroon': fs.readFileSync(MACAROON_PATH).toString('hex'),
    },
    form: JSON.stringify(requestBody),
    
  }
  request.post(options, function(error, response, body) {
    
    console.log(body);

    console.log(body.code);
    if ((body.message == 'insufficient funds available to construct transaction'))
    {
      bankBalanceEnough = false;
    }

    if (bankBalanceEnough)
    {
      res.status(200).send("Bank balance is enough");
    }
    else
    {
      res.status(300).send("Insufficient user bank balance.");
      console.log('error found');
    }


  });


});


app.post('/send-money-to-player', (req, res) => {
  const amount = req.body.amount;
  console.log(amount);
  // Handle the amount as needed (e.g., process payment logic)

  // Respond with success message
  //res.json({ message: `Payment of ${amount} received` });

  
  console.log(`request recieved to send back ${amount}`);

  // ALICE TO BOB PAYMENT - represents bank to casino payback system  
  const REST_HOST = '127.0.0.1:8081';
  const MACAROON_PATH = 'C:/Users/srira/.polar/networks/1/volumes/lnd/alice/data/chain/bitcoin/regtest/admin.macaroon'; // alice macaroon path

  let requestBody = {
    addr: 'bcrt1pe0ypen8em7zgdp62ap8yxr37fczxagujftchkcxmg43rwf7zsrussqnn29', // bob address
    amount: `${amount}`, 
    send_all: false, 
    min_confs: 1, 
    spend_unconfirmed: false, 
  };

  let options = {
    url: `https://${REST_HOST}/v1/transactions`,
    // Work-around for self-signed certificates.
    rejectUnauthorized: false,
    json: true,
    headers: {
      'Grpc-Metadata-macaroon': fs.readFileSync(MACAROON_PATH).toString('hex'),
    },
    form: JSON.stringify(requestBody),
  }
  request.post(options, function(error, response, body) {
    console.log(body);

    if (body.message == 'transaction output is dust')
    {
      res.status(300).send("Insufficient user bank balance.");
      console.log('error found');
    }
    else if (!body.message)
    {
      res.status(200).send("sufficient balance foo sent money");
    }

  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//Bob to Alice


// post request to "cash out" money from the in game bank balance (casino) to the players money
let x = 1;


/*
if (x==0)
{
  // BOB TO ALICE PAYMENT - represents casino to player payback system
    const REST_HOST = '127.0.0.1:8082';
    const MACAROON_PATH = 'C:/Users/srira/.polar/networks/1/volumes/lnd/bob/data/chain/bitcoin/regtest/admin.macaroon'; // bob macaroon path
    let requestBody = {
      addr: 'bcrt1pu6v385z5dfcuswptu9565w5lg8z9tu5dmhh5mjytuddcde99j9fqhcg0c0', // alice address
      amount: '500000', 
      send_all: false, 
      min_confs: 1, 
      spend_unconfirmed: false, 
    };

    let options = {
      url: `https://${REST_HOST}/v1/transactions`,
      // Work-around for self-signed certificates.
      rejectUnauthorized: false,
      json: true,
      headers: {
        'Grpc-Metadata-macaroon': fs.readFileSync(MACAROON_PATH).toString('hex'),
      },
      form: JSON.stringify(requestBody),
    }
    request.post(options, function(error, response, body) {
      console.log(body);
    });
}

else
{

  // ALICE TO BOB PAYMENT - represents bank to casino payback system  
    const REST_HOST = '127.0.0.1:8081';
    const MACAROON_PATH = 'C:/Users/srira/.polar/networks/1/volumes/lnd/alice/data/chain/bitcoin/regtest/admin.macaroon'; // alice macaroon path

    let requestBody = {
      addr: 'bcrt1pe0ypen8em7zgdp62ap8yxr37fczxagujftchkcxmg43rwf7zsrussqnn29', // bob address
      amount: '500000', 
      send_all: false, 
      min_confs: 1, 
      spend_unconfirmed: false, 
    };

    let options = {
      url: `https://${REST_HOST}/v1/transactions`,
      // Work-around for self-signed certificates.
      rejectUnauthorized: false,
      json: true,
      headers: {
        'Grpc-Metadata-macaroon': fs.readFileSync(MACAROON_PATH).toString('hex'),
      },
      form: JSON.stringify(requestBody),
    }
    request.post(options, function(error, response, body) {
      console.log(body);
    });
}

*/