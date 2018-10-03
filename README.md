# Social Scripture

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

## Requirements
### 1- ELK 6.2.2
### 2- Angular 5 or 6
### 3- NodeJS
### 4- SemanticUI library

## Installation

### 1- Clone this repository
### 2- Install ELK stack
### 3- Run Elasticsearch
### 4- Run Kibana (optional)

## Configuration

### 1- Import chapters
logstash --debug -f chapters.conf
logstash --debug -f chapters-acronyms.conf


### 2- Import quran arabic verse
logstash --debug -f quran.conf

### 3- Import bible
logstash --debug -f bible.conf

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running
Run `ng build` to start the development server

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
