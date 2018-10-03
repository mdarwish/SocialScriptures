# Social Scripture

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

## Installation

### 1- Install ELK stack
### 2- Run Elasticsearch
### 3- Run Kibana (optional)

## Configuration

### 1- Import chapters
logstash --debug -f chapters.conf
logstash --debug -f chapters-acronyms.conf


### 2- Import quran arabic verse
logstash --debug -f quran.conf
logstash --debug -f arabic-v.conf
logstash --debug -f arabic-v-simple.conf

### 3- Import bible
logstash --debug -f bible.conf

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running
Run `ng build` to start the development server

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
