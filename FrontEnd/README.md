# Installation:
If Angular Cli is not in your system,plz follow the steps below:
# Install Angular CLI: 13.3.6
npm i -g @angular/cli
# Install Node: 14.16.0
Goto https://nodejs.org/en/download/ and download the respective node version.

# AssetMgt

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
or

Run ---> 'npm run mserve'
"mserve": "set NODE_OPTIONS=--max_old_space_size=8192 & ng serve --host 10.1.1.139 --open"


# START XAMPP SERVER 
1, Apache & Mysql to start

username :"root"
password:""

# Run the nodejs server
 cd .\BackEnd\  & npm start 

# Run the application 
 cd .\FrontEnd\
 1,assetMgt\FrontEnd> npm run mserve - this cmd will run --host 10.1.1.139 --open",

 2,if you want to run locally then remove --host 10.1.1.139
Open the link http://10.1.1.139:4200/login or localhost:4200/login



## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


