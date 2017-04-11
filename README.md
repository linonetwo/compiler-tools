# cheatsheet

An offline cheatsheet , young and simple , using the faceted searching to help you explore.
  
[Shanghaitech's programming-languages-and-compilers class(Song Fu)](http://sist.shanghaitech.edu.cn/faculty/songfu/course/spring2017/cs131/) allows student bring offline device as cheatsheet, and encourage student to calculate by device instead of by hand. What a wonderful teacher! So I wrote this offline cheatsheet.

## Usage

1. Download(TBD...) or manulally update ./knowledge_modules
1. run ```gulp build```
1. copy ```./build/index.html``` to a mobile device for offline use

## knowledge_modules

This is a folder similar to node_module, but intended to contain knowledge download from openkg or so.
  
For now, in this very early stage, we have to manually edit it, and follow some hard-coded format. Format is as follow:

1. make a folder ```programming-languages-and-compilers``` like ```./knowledge_modules/programming-languages-and-compilers/```
1. make a ```/src/``` in that folder
1. make some folders and place ```example.md``` and ```principle.md``` and ```tags.csv``` inside, some of these files can be omited.
1. you can use ```<img src="" alt="parse" />``` to insert base64 image to ```.md``` file

![screenshot](https://github.com/linonetwo/cheatsheet/blob/master/doc/kgmodule.png?raw=true)
