#!/usr/bin/env node
var chalk = require('chalk');
var program = require('commander');
var daemon = require('../lib/daemon');
program
	.option('-t, --test', 'just test')
	.option('-d, --daemon', 'start as daemon')
	.option('-s, --stop', 'stop daemon listener')
	.parse(process.argv);

var listenerId = program.args;

 if (!listenerId.length) {
 	console.error(chalk.red('listenerId required'));
 	process.exit(1);
 } else if (listenerId.toString().match(/[^0-9||all]/)) {
	 console.error(chalk.red('listenerId can only be numbers or all'));
	 process.exit(1);
 }


if(program.test){
	var f1 = './templates/my-exchange';
	var allQueue = require('require-dir')(f1);
	var listener = allQueue['queue-test'];
	listener.start();
} else if(program.daemon){
	daemon.start('queue-id-' + listenerId,
		'./bin/interface.js',
		['listen', 'start', listenerId],
		null,
		function (process) {
			console.log(chalk.green('Start Listener id:' + listenerId + ' as a daemon ,just run ') +
				chalk.yellow('./node_modules/pm2/bin/pm2 ls') +
				chalk.green(' to see them'));
		}
	);
} else if(program.stop){
	daemon.stop('queue-id-' + listenerId, function(){})
} else{
	require('../core/dispatcher')().startListener(listenerId.toString());
}


