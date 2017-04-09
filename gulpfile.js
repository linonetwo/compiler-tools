const fs = require('fs-promise')
const gulp = require('gulp')
const del = require('del')

gulp.task('clean', function(cb) {
  return del(['./knowledge_modules/programming-languages-and-compilers/build'])
})

gulp.task('build', ['clean'], async function() {
  const basePath = './knowledge_modules/programming-languages-and-compilers'

  await fs.mkdir(`${basePath}/build`)
  const topics = await fs.readdir(`${basePath}/src`)
  
  const result = topics.reduce((resultObject, currentDirName) => {
    const example = fs.readFileSync(`${basePath}/src/${currentDirName}/example.md`, 'utf8')
    const principle = fs.readFileSync(`${basePath}/src/${currentDirName}/principle.md`, 'utf8')
    const tags = fs.readFileSync(`${basePath}/src/${currentDirName}/tags.csv`, 'utf8')

    resultObject[currentDirName] = {
      title: currentDirName,
      tags: tags.split(','),
      example,
      principle
    }

    return resultObject
  }, {})
  
  await fs.writeFile(`${basePath}/build/main.json`, JSON.stringify(result))
})
