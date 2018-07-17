#!/usr/bin/env node
'use strict';
const meow = require('meow');
const execa = require('execa');

const cli = meow(`
  Usage
    $ ga <alias> <command>

    Examples

    $ ga  unstage 'reset HEAD'

    $ ga

    Options
      -l,list ,list all git aliases
    Examples
    $ ga -l

`, {
	flags: {
		list: {
			type: 'string',
			alias: 'l'
		}
	}
});
const execute = (command, callback) => {
	(async () => {
		try {
			const {stdout} = await execa.shell(command);
			if (callback) {
				callback(true, stdout);
			}
		} catch (error) {
			if (callback) {
				callback(false, error);
			}
		}
	})();
};
const checkForGit = callback => {
	execute('git --version', callback);
};
const init = () => {
	const {input, flags} = cli;
	if (Object.keys(flags).length === 0 && flags.constructor === Object) {
		const [arg1, arg2] = input;
		const command = `git config --global alias.${arg1} '${arg2}'`;
		execute(command, null);
	} else if ('list' in flags) {
		(async () => {
			const {stdout} = await execa('git', [`config`, `--get-regexp`, `alias.*`]);
			console.log(stdout);
		})();
	}
};

checkForGit(flag => {
	if (flag) {
		init();
	} else {
		console.log('No Git Found');
	}
});

