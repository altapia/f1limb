import { glob, type Path } from "glob";
import type { Apuesta, User } from "../lib/model.ts";
import { usuarios } from "../lib/usuarios.ts";

import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

console.log("Calculando clasificación general ...\n");
const clasificacion = new Map<number, User>();
await execute();

async function execute() {
  initClasificacion();

  const jsonfiles = await getApuestasFiles();

  for (const f of jsonfiles) {
    console.log(`\n************ Tratando fichero: ${f} ***********`);
    const contenido = resolve(f);
    await calcular(contenido);
    console.log(`========= FIN fichero: ${f} \n`);
  }

  console.log("\nFin de ficheros.\n****Clasificación GENERAL:****");
  let listClasificacion = Array.from(clasificacion.values());
  pintaClasificacion(listClasificacion, false);
  escribeFicheroClasificacion().then(() => console.log("FIN"));
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
 * Inicializa el mapa que contendrá la clasificación final
 */
function initClasificacion() {
  usuarios.forEach((u) => {
    let userCopy = { ...u };
    userCopy.ganancia = 0;
    userCopy.puntos = 0;
    clasificacion.set(userCopy.id, userCopy);
  });
}

/**
 * Escribe en el log la clasificación ordenada por ganancia
 * @param ordenGanancia true si debe ordenarse por ganancia, false si se debe ordenar por puntos
 */
function pintaClasificacion(listClasificacion: User[], ordenGanancia: boolean) {
  //let listClasificacion = Array.from(clasificacion.values())
  if (ordenGanancia) {
    ordenarPorGanancia(listClasificacion);
  } else {
    ordenarPorPuntos(listClasificacion);
  }
  listClasificacion.forEach((u, i) =>
    console.log(`${i + 1} - ${u.nombre}: \t${u.ganancia}€ \t${u.puntos}pts.`),
  );
}

/**
 * Escribe el fichero con la clasificación final
 * @returns
 */
async function escribeFicheroClasificacion() {
  let listClasificacion = Array.from(clasificacion.values());
  ordenarPorPuntos(listClasificacion);
  console.log(
    "\nEscribiendo fichero de clasificación: src/content/clasificacion.json",
  );
  const promise = writeFile(
    "src/content/clasificacion.json",
    JSON.stringify(listClasificacion),
  );
  return promise;
}

/**
 * Calcula las ganancias y puntos de un GP
 * @param json Apuestas del GP
 * @returns
 */
async function calcular(json: string) {
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

    //Si no hay apuestas no hago nada.
    if (apuestas.length == 0) return;

    let apuestasPendientes = false;
    //Calcula Ganancia
    apuestas.forEach((a) => {
      let user = clasificacionGP.find((u) => u.id === a.user.id);

      let ganancia = 0;
      if (a.estado === 2) {
        ganancia = ganancia + a.importe * a.cuota - a.importe;
      } else if (a.estado === 3) {
        ganancia = ganancia - a.importe;
      } else {
        apuestasPendientes = true;
        return;
      }
      if (user && user.ganancia !== undefined) {
        user.ganancia = user.ganancia + Math.round(ganancia * 100) / 100;
      }
    });

    if (apuestasPendientes) {
      console.warn("Hay apuestas pendientes");
      return;
    }

    await calcularPuntos(clasificacionGP);

    pintaClasificacion(clasificacionGP, true);

    //Incremento el total
    clasificacionGP.forEach((u) => {
      let user = clasificacion.get(u.id);
      if (
        user &&
        user.puntos !== undefined &&
        user.ganancia !== undefined &&
        u.ganancia !== undefined &&
        u.puntos !== undefined
      ) {
        user.ganancia += u.ganancia;
        user.ganancia = Math.round(user.ganancia * 100) / 100;
        user.puntos += u.puntos;
      }
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * Orden la lista de usuarios por ganancia
 * @param lista
 */
async function ordenarPorGanancia(lista: User[]) {
  await lista.sort((a, b) => {
    if ((a.ganancia ?? 0) < (b.ganancia ?? 0)) {
      return 1;
    }
    if ((a.ganancia ?? 0) > (b.ganancia ?? 0)) {
      return -1;
    }
    return 0;
  });
}

/**
 * Orden la lista de usuarios por puntos
 * @param lista
 */
async function ordenarPorPuntos(lista: User[]) {
  await lista.sort((a, b) => {
    if ((a.puntos ?? 0) < (b.puntos ?? 0)) {
      return 1;
    }
    if ((a.puntos ?? 0) > (b.puntos ?? 0)) {
      return -1;
    }
    return 0;
  });
}

/**
 * Calcula los puntos obtenidos en el GP según las ganancias.
 * @param lista Lista de usuarios con las ganancias del GP
 */
async function calcularPuntos(lista: User[]) {
  const puntuacion: number[] = [14, 11, 8, 6, 4, 3, 2, 1];

  // Se ordena por gananacia
  await ordenarPorGanancia(lista);

  //Según el orden se reparten los puntos, siempre y cuando no haya DNF (-3€)
  lista.forEach((u: User, i: number) => {
    let puntos = 0;
    if (u.ganancia !== -3) {
      puntos += puntuacion[i] ?? 0;
    }
    let user = lista.find((user: User) => user.id == u.id);
    if (user && user.puntos !== undefined) {
      user.puntos = user.puntos + puntos;
    }
  });
}
