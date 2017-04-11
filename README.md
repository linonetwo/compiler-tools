# cheatsheet

An offline cheatsheet , young and simple , using the faceted searching to help you explore.

## Usage

1. Download(TBD...) or manulally update ./knowledge_modules
1. run ```gulp build```
1. copy ```./build/index.html``` to a mobile device for offline use

## knowledge_modules

This is a folder similar to node_module, but intended to contain knowledge download from openkg or so.
  
For now,  in this early stage, we have to manually edit it, and follow some hard-coded format. Format is as follow:

1. make a folder ```programming-languages-and-compilers``` like ```./knowledge_modules/programming-languages-and-compilers/```
1. make a ```/src/``` in that folder
1. make some folders and place ```example.md``` and ```principle.md``` and ```tags.csv``` inside, some of these files can be omited.
1. you can use ```<img src="" alt="parse" />``` to insert base64 image to ```.md``` file
