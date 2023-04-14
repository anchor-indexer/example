o?=o

test:
	@anchor $@

idl:
	@anchor --provider.cluster devnet idl init GqbUWMWQpgGMprXUEPkxuifKGZidL1CxxFkbqBgVqcDV --filepath target/idl/counter.json
#	@anchor --provider.cluster devnet idl upgrade GqbUWMWQpgGMprXUEPkxuifKGZidL1CxxFkbqBgVqcDV --filepath target/idl/counter.json

deploy:
# recover counter-keypair.json from 1pass
	@anchor build
	@anchor deploy --provider.cluster devnet

integration:
	@env-cmd ./node_modules/.bin/ts-node $o

airdrop:
# @solana-keygen recover --force
# use osy main seed phrase
	@solana airdrop 1 --url=devnet
	@solana balance --url=devnet

.PHONY: test idl deploy integration airdrop
