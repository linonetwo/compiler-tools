const fs = require('fs-promise')
const gulp = require('gulp')
const del = require('del')
const Promise = require('bluebird')

gulp.task('clean', function(cb) {
  return del(['./knowledge_modules/programming-languages-and-compilers/build'])
})

gulp.task('build', ['clean'], async function() {
  const basePath = './knowledge_modules/programming-languages-and-compilers'

  await fs.mkdir(`${basePath}/build`)
  const topics = await fs.readdir(`${basePath}/src`)
  
  const result = await Promise.reduce(topics, async (resultObject, currentDirName) => {
    const examplePath = `${basePath}/src/${currentDirName}/example.md`
    const example = await fs.access(examplePath)
      .then(() => fs.readFile(examplePath, 'utf8'))
      .catch(error => '')

    const principlePath = `${basePath}/src/${currentDirName}/principle.md`
    const principle = await fs.access(principlePath)
    .then(() => fs.readFile(principlePath, 'utf8'))
    .catch(error => '')

    const tagPath = `${basePath}/src/${currentDirName}/tags.csv`
    const tags = await fs.access(tagPath)
    .then(() => fs.readFile(tagPath, 'utf8'))
    .catch(error => '')

    resultObject[currentDirName] = {
      title: currentDirName,
      tags: tags.length > 0 ? tags.split(',') : [],
      example,
      principle
    }

    return resultObject
  }, {})
  
  await fs.writeFile(`${basePath}/build/main.json`, JSON.stringify(result))
})
