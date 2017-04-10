const fs = require('fs-promise')
const gulp = require('gulp')
const del = require('del')
const Promise = require('bluebird')
const _ = require('lodash')

gulp.task('clean', function (cb) {
  return del(['./knowledge_modules/programming-languages-and-compilers/build'])
})

gulp.task('build', ['clean'], async function () {
  const basePath = './knowledge_modules/programming-languages-and-compilers'

  await fs.mkdir(`${basePath}/build`)
  const topics = await fs.readdir(`${basePath}/src`)

  const result = await Promise.reduce(topics, async (resultObject, currentDirName) => {
    const examplePath = `${basePath}/src/${currentDirName}/example.md`
    const example = await fs.readFile(examplePath, 'utf8').catch(() => '')

    const principlePath = `${basePath}/src/${currentDirName}/principle.md`
    const principle = await fs.readFile(principlePath, 'utf8').catch(() => '')

    const tagPath = `${basePath}/src/${currentDirName}/tags.csv`
    const tags = await fs.readFile(tagPath, 'utf8').catch(() => '')

    resultObject[currentDirName] = {
      title: currentDirName,
      tags: _.uniq(tags.length > 0 ? tags.split(',') : []),
      example,
      principle
    }

    return resultObject
  }, {})

  await fs.writeFile(`${basePath}/build/main.json`, JSON.stringify(result))
})
