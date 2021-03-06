const fs = require('fs')
const path = require('path')
const JSZip = require('jszip')
const slash = require('slash')

main()

async function main() {
  try {
    let zippedData = await getZippedFolderSync()
    let res = fs.writeFileSync(`./leveleditor-dist/sh-leveleditor-${process.platform}.zip`, zippedData)
  } catch (e) {
    console.log("Error:", e)
  }
}

async function getZippedFolderSync() {
  let zip = new JSZip()
  addLevelsDir(zip)
  addSHUtils(zip)
  addDoc(zip)

  let data = null
  let zipped = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    platform: "UNIX",
    compressionOptions: {
      level: 9
    }
  })

  return zipped
}

function addLevelsDir(zip) {
  let dir = './leveleditor/levels'
  let allPaths = getFilePathsRecursiveSync(dir)

  for (let filePath of allPaths) {
    let addPath = path.relative('./leveleditor', filePath)

    let data = fs.readFileSync(filePath)
    zip.file(slash(addPath), data, {
      binary: true
    })
  }
}

function addSHUtils(zip) {
  let dir = './leveleditor-dist/shutils'
  let allPaths = getFilePathsRecursiveSync(dir)

  for (let filePath of allPaths) {
    let addPath = path.relative(dir, filePath)

    let data = fs.readFileSync(filePath)
    zip.file(slash(addPath), data, {
      unixPermissions: "755"
    })
  }
}

function addDoc(zip) {
  let dir = './leveleditor/doc'
  let allPaths = getFilePathsRecursiveSync(dir)

  for (let filePath of allPaths) {
    let addPath = path.relative('./leveleditor', filePath)

    let data = fs.readFileSync(filePath)
    zip.file(slash(addPath), data)
  }
}

// returns a flat array of absolute paths of all files recursively contained in the dir
function getFilePathsRecursiveSync(dir) {
  var results = []
  list = fs.readdirSync(dir)
  var pending = list.length
  if (!pending) return results

  for (let file of list) {
    file = path.resolve(dir, file)
    let stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      let res = getFilePathsRecursiveSync(file)
      results = results.concat(res)
    } else {
      results.push(file)
    }
    if (!--pending) return results
  }

  return results
}

module.exports = getZippedFolderSync