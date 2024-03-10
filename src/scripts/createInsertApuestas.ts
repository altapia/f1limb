import { glob, type Path } from "glob";
import type { Apuesta, User } from "../lib/model.js";
import { usuarios } from "../lib/usuarios.js";

import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

console.log("Creando INSERTS SQL de apuestas ...\n");
await execute();

async function execute() {
  const jsonfiles = await getApuestasFiles();

  let i = 0;
  for (const f of jsonfiles) {
    console.log(`\n************ Tratando fichero: ${f} ***********`);
    i++;
    const contenido = resolve(f);
    await calcular(contenido, i);
    console.log(`========= FIN fichero: ${f} \n`);
  }

  console.log("\nFin de ficheros.");
}

/**
 * Obtiene los ficheros de apuestas y los ordena
 * @returns array con la ruta de cada fichero json de apuestas de cada GP
 */
async function getApuestasFiles() {
  let jsonfilesPaths: Path[] = await glob("src/content/*/apuestas.json", {
    stat: true,
    withFileTypes: true,
  });

  //Se ordenan los ficheros
  const jsonfiles = jsonfilesPaths
    .sort((a, b) => {
      if (a.parent !== undefined && b.parent !== undefined) {
        if (a.parent.name < b.parent.name) {
          return -1;
        }
        if (a.parent.name > b.parent.name) {
          return 1;
        }
      }
      return 0;
    })
    .map((path) => path.fullpath());
  return jsonfiles;
}

/**
 * Calcula las ganancias y puntos de un GP
 * @param json Apuestas del GP
 * @returns
 */
async function calcular(json: string, gpId: number) {
  const clasificacionGP: User[] = [];
  usuarios.forEach((u) => {
    let userCopy = { ...u };
    userCopy.ganancia = 0;
    userCopy.puntos = 0;
    clasificacionGP.push(userCopy);
  });

  try {
    const contents = await readFile(json, { encoding: "utf8" });
    let apuestas: Apuesta[] = JSON.parse(contents);

    //Calcula Ganancia
    apuestas.forEach((a) => {
      let user = clasificacionGP.find((u) => u.id === a.user.id);
      console.log(
        `INSERT INTO apuesta (userId, gpId, descripcion, importe, cuota, estado) values ( ${user?.id}, ${gpId}, '${a.descripcion}', ${a.importe}, ${a.cuota}, ${a.estado} );`,
      );
    });
  } catch (err) {
    console.error(err);
  }
}
