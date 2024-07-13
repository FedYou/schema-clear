const youfile = require("youfile");
const ENTRY = "schemas/";
const OUTPUT = "dist/";

const REMOVE = [
  "$id",
  "title",
  "description",
  "examples",
  "default",
  "defaultSnippets",
  "$comment",
];
const FILES = youfile.read.dir.getAllExtnameFiles(ENTRY, ".json");

FILES.map((filePath) => analyze(filePath));

// Lee los archivos y remueve los objetos innecesarios.
function analyze(filePath) {
  const content = youfile.read.json(filePath);
  const outputPath = filePath.replace(ENTRY, OUTPUT);

  const contentClean = clean(content);
  youfile.write.json(outputPath, contentClean);
}
// Si encuentra coincidencia, elimina el objeto.
function remove(obj, key) {
  REMOVE.forEach((name) => {
    if (key === name) {
      delete obj[key];
    }
  });
}

function clean(obj) {
  if (typeof obj === "object" && !Array.isArray(obj)) {
    for (const key in obj) {
      // Si es "properties" no remueva los elementos,por si ahi coincidencia.
      if (key !== "properties") {
        remove(obj, key);
      }
      if (typeof obj[key] === "object") {
        clean(obj[key]);
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((element) => {
      clean(element);
    });
  }
  return obj;
}
