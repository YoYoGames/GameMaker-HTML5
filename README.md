# GameMaker HTML5 Runtime

## Overview

This is the source for GameMaker's HTML5 runtime. The runtime will continue to receive updates and fixes from the GameMaker team. 

If you wish, you can clone it, experiment with it, use your modified version in your GameMaker installation, and even contribute your changes back to the repository if they're suitable for others also. You’re encouraged to contribute by creating an Issue using the link below to document your changes and then linking the issue to a Pull Request once you have made the change, which will then all be reviewed by our team when you submit your request for review.

<br>

## Reporting Issues

Report bugs with the current, unmodified HTML5 runtime source on this repository's [Issues page](https://github.com/YoYoGames/GameMaker-HTML5/issues). Whenever possible, please include an exported GameMaker project demonstrating the issue - do this using `Help > Upload a Bug/Ticket Sample` inside GameMaker, then paste the link GameMaker gives you into your bug report.

<br>
<hr>

## Modifying The Runtime Yourself

In order to use this runtime for extending yourself, you should clone the repository as normal. Once you have the code checked out, you can tell GameMaker to use your cloned repository rather than its built-in copy of the runtime.

You do this by changing *Path to HTML5 runner* under *Platform Settings > HTML5* on the *Preferences* screen, for example if you have the repository checked out to `C:\source\GameMaker-HTML5`:

![Screenshot of Preferences screen](doc/set-html5-runner-path.png)

To revert back to the built-in runner, simply change the path back to `${html5_runner_path}`:

![Screenshot of Preferences screen](doc/std-html5-runner-path.png)

After you’ve made your changes, run your game in GameMaker using the HTML5 target, which should use your modified runtime. Make use of the Debugger and browser tools to fix any issues that might crop up.

<br>

## Contributing Changes Back To This Repo

Once you’re confident with your changes, push your changes to your forked repository, create an Issue on this HTML5 repo to document the change properly for everyone else (if you didn't do this already), and then create a Pull Request in the original repository (click on "compare across forks") and link this to your Issue.

**Always** attach a clearly-documented GameMaker project export onto your Issue/Pull Request for **all** changes you make, demonstrating that you have tested your changes before you submitted them and showing how the change is expected to be used, otherwise your PR may not be accepted - do this using `Help > Upload a Bug/Ticket Sample` inside GameMaker, then paste the link GameMaker gives you into your bug report.

_You may be asked to make fixes to your Issue documentation and/or changes to your source if our team finds any problems during the review, so be aware your pull request may not be accepted in its initial form._

We look forward to seeing your contributions!
