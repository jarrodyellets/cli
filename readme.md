# Random quite cli

<figure><img src="http://www.jarrodyellets.com/img/cli.png" alt="Cli preview" style="width: 100%; display: block; margin-left: auto; margin-right: auto;"/></figure>

Random quote cli written React Ink

## Starting

* First, clone or download the repo, open your terminal to the repo, and run ```npm install```.

* Before you run the cli, you must initialize a build. To build, run ```npm run build```

* To run project, enter  ```cli``` , and press enter.

## Getting random quotes

* All commands must start with the ```lq``` command. For example, ```--help``` won't work, you must enter ```lq --help```

* ```lq``` - ```lq``` with no arguments will get a single random quote.

* ```lq --number=x``` - To get certain number of random quotes. For example, ```lq --number=7``` will get you **7** random quotes

* ```lq --character=x``` - To get a quote from a certain character. For example, ```lq --character=hubert``` will get a random quote from the character **hubert**

* ```lq --keyword=x``` - To get all quotes that match a keyword. For example, ```lq --keyword=bon``` will return all quotes that contain the word **bon**

* Flags can be cumulative, such as ```lq --character=hubert --number=4 --keyword=le```, which will return **4** quotes from **hubert** that contain the keyword **le**.

* ```lq --help``` - To get help, which will display all of the argument options, as well as show you all available characters.


