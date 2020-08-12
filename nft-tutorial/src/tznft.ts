#!/usr/bin/env node
import { program } from 'commander';
import * as networkConf from './config-network';
import * as aliasConf from './config-aliases';
import * as bootstrap from './bootstrap';
import * as contracts from './contracts';

// configuration

//prettier-ignore
program
  .command('config-init')
  .alias('ci')
  .description('creates tznft.config file')
  .action(networkConf.initUserConfig);

// selecting network

//prettier-ignore
program
  .command('show-network')
  .alias('shown')
  .description(
    'shows currently selected active network', 
    {'a': 'also shows all available networks'}
  )
  .option('-a --all', 'shows all available configured networks', false)
  .action((options) => networkConf.showActiveNetwork(options.all)).passCommandToAction(false);

//prettier-ignore
program
  .command('set-network')
  .alias('setn')
  .arguments('<network>')
  .description('selected network to originate contracts')
  .action(networkConf.setNetwork);

//prettier-ignore
program
  .command('start')
  .alias('s')
  .option(
    '-b, --bootstrap <alias>',
    'alias to use for the helper contract origination',
    'bob')
  .description('starts and initializes network provider')
  .action(options => bootstrap.start(options.bootstrap)).passCommandToAction(false);

//prettier-ignore
program
  .command('kill')
  .alias('k')
  .description('kills running network provider')
  .action(bootstrap.kill);

//aliases

//prettier-ignore
program
    .command('show-alias')
    .alias('showa')
    .arguments('[alias]')
    .action(aliasConf.showAlias).passCommandToAction(false);

//prettier-ignore
program
  .command('add-alias')
  .alias('adda')
  .description('adds new alias to the configuration')
  .arguments('<alias> <key_or_address>')
  .action(aliasConf.addAlias).passCommandToAction(false);

//prettier-ignore
program
  .command('add-alias-faucet')
  .alias('addaf')
  .description('adds new alias to the configuration from the faucet json file')
  .arguments('<alias> <faucet_file>')
  .action(aliasConf.addAliasFromFaucet).passCommandToAction(false);

//prettier-ignore
program
  .command('remove-alias')
  .alias('rma')
  .description('removes alias from the configuration')
  .arguments('<alias>')
  .action(aliasConf.removeAlias).passCommandToAction(false);

// nft

//prettier-ignore
program
  .command('mint')
  .alias('m')
  .description('creates a new NFT contract and mint new tokens')
  .arguments('<owner>')
  .requiredOption(
    '-t, --tokens <tokens...>',
    'definitions of new tokens, a list of "id, symbol, name"',
    contracts.parseTokens, [])
  .action((owner, options) => contracts.mintNfts(owner, options.tokens)).passCommandToAction(false);

//prettier-ignore
program
  .command('show-balance')
  .alias('showb')
  .description('shows NFT balances for the specified owner')
  .requiredOption('-op, --operator <operator>', 'address that originates a query')
  .requiredOption('--nft <nft_address>', 'address of the NFT contract')
  .requiredOption('-o, --owner <owner>', 'token owner to check balances')
  .requiredOption('-t, --tokens <tokens...>', 'list of token IDs to check')
  .action((options)=>contracts.showBalances(
    options.operator, options.nft, options.owner, options.tokens)).passCommandToAction(false);

//prettier-ignore
program
  .command('transfer')
  .alias('tx')
  .description('transfers NFT tokens')
  .requiredOption('-op, --operator <operator>', 'address that originates a transfer')
  .requiredOption('--nft <nft_address>', 'address of the NFT contract')
  .requiredOption(
    '-t, --tokens <tokens...>', 
    'definitions of each transfer, a list of "from, to, token_id"',
    contracts.parseTransfers, [])
    .action((options)=>contracts.transfer(
      options.operator, options.nft, options.tokens)).passCommandToAction(false);

//debugging command

//prettier-ignore
program
  .command('config-show-all')
  .description('shows whole raw config')
  .action(networkConf.showConfig);

program.parse();
