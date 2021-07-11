### Getting started

### Program

ensure you have installed anchor as described [here](https://project-serum.github.io/anchor/getting-started/installation.html#install-rust)
cd into program, start the test validator:

```
cd program
test-validator
```

and in a new tab, deploy the program

```
cd program
anchor deploy
```

#### Frontend

cd into frontend, install node packages and start the dev server to run at http://localhost:5200:

```
cd frontend
yarn
cp .env.local.example .env.local
make
```
