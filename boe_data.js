/**
 * Datos y normativa oficial del Baremo de Méritos
 * Orden EFD/1041/2026, de 30 de septiembre (BOE núm. 248, de 6 de octubre de 2026)
 * Concurso de Traslados de ámbito estatal curso 2026/2027
 */

const BOE_INFO = {
  norma: "Orden EFD/1041/2026, de 30 de septiembre",
  publicacion: "BOE núm. 248, de 6 de octubre de 2026",
  urlBoe: "https://www.boe.es/boe/dias/2026/10/06/pdfs/BOE-A-2026-20763.pdf",
  plazoSolicitudes: "Del 5 al 26 de noviembre de 2026, ambos inclusive",
  fechaEfectos: "1 de septiembre de 2027",
  cuerpos: "Cuerpos docentes contemplados en la Ley Orgánica 2/2006 (LOE/LOMLOE)",
};

const BAREMO_DOCENTES = {
  bloque1: {
    id: "1",
    titulo: "1. Antigüedad",
    maximo: null, // Sin tope
    descripcion: "Antigüedad en el centro y en el cuerpo docente",
    subapartados: {
      "1.1.1": {
        titulo: "1.1.1. Permanencia ininterrumpida con destino definitivo en el centro desde el que concursa",
        doc: "Hoja de servicios expedida por la Administración educativa competente o título administrativo/credencial con diligencias de tomas de posesión y cese.",
        detalles: "1º y 2º año: 4,0000 pts/año (0,3333/mes). 3º año: 6,0000 pts (0,5000/mes). 4º y siguientes: 8,0000 pts/año (0,6666/mes)."
      },
      "1.1.2": {
        titulo: "1.1.2. Años como personal funcionario de carrera en situación de provisionalidad",
        doc: "Hoja de servicios expedida por la Administración educativa competente o credencial con diligencias.",
        detalles: "4,0000 puntos por año (0,3333 por mes completo). Si se participa con carácter voluntario desde el 1er destino definitivo obtenido por concurso, se acumula a 1.1.1."
      },
      "1.1.3": {
        titulo: "1.1.3. Años en puesto o centro de Especial Dificultad",
        doc: "Hoja de servicios y certificación de la Administración acreditativa de que el centro tiene la calificación de especial dificultad con fechas de inicio y fin.",
        detalles: "4,0000 puntos por año (0,3333 por mes completo). Se añade a 1.1.1 o 1.1.2. Destino definitivo, provisional o comisión de servicio."
      },
      "1.2.1": {
        titulo: "1.2.1. Servicios efectivos en alguno de los cuerpos a que corresponda la vacante",
        doc: "Hoja de servicios expedida por la Administración educativa competente.",
        detalles: "2,0000 puntos por año (0,1666 por mes completo). Incluye servicios como funcionario de carrera y funcionario interino/en prácticas en el mismo cuerpo."
      },
      "1.2.2": {
        titulo: "1.2.2. Servicios efectivos en otros cuerpos docentes del mismo o superior subgrupo",
        doc: "Hoja de servicios expedida por la Administración educativa competente.",
        detalles: "1,5000 puntos por año (0,1250 por mes completo)."
      },
      "1.2.3": {
        titulo: "1.2.3. Servicios efectivos en otros cuerpos docentes de subgrupo inferior",
        doc: "Hoja de servicios expedida por la Administración educativa competente.",
        detalles: "0,7500 puntos por año (0,0625 por mes completo)."
      }
    }
  },
  bloque2: {
    id: "2",
    titulo: "2. Pertenencia a los cuerpos de Catedráticos",
    maximo: 5.0000,
    puntosFijos: 5.0000,
    descripcion: "Por ser funcionario de carrera de Catedráticos de Enseñanza Secundaria, Música y Artes Escénicas, EOI o Artes Plásticas y Diseño",
    doc: "Hoja de servicios donde conste la pertenencia al cuerpo de Catedráticos o credencial / nombramiento en Diario Oficial."
  },
  bloque3: {
    id: "3",
    titulo: "3. Méritos académicos",
    maximo: 10.0000,
    descripcion: "Doctorado, postgrados, otras titulaciones universitarias, FP superior, enseñanzas de idiomas y artísticas",
    docGeneral: "Copia del título o resguardo de abono de derechos de expedición oficial. Para homologaciones de títulos extranjeros se precisa la declaración oficial de equivalencia.",
    subapartados: {
      "3.1.1": { titulo: "3.1.1. Título de Doctor o Doctora", valor: 6.0000, unidad: "título" },
      "3.1.2": { titulo: "3.1.2. Título oficial de Máster universitario", valor: 3.0000, unidad: "máster", nota: "No baremable el Máster que constituya requisito de ingreso (como el MAES) ni el cursado como requisito de acceso al doctorado alegado." },
      "3.1.3": { titulo: "3.1.3. Suficiencia investigadora / Diploma de Estudios Avanzados (DEA)", valor: 2.0000, unidad: "título" },
      "3.1.4": { titulo: "3.1.4. Premio extraordinario en doctorado, licenciatura o grado", valor: 1.0000, unidad: "premio" },
      "3.2.1a": { titulo: "3.2.1. Grado Universitario completo (distinto al de ingreso)", valor: 5.0000, unidad: "grado" },
      "3.2.1b": { titulo: "3.2.1. Grado obtenido por pasarela / convalidación parcial de enseñanzas", valor: 2.5000, unidad: "grado" },
      "3.2.2": { titulo: "3.2.2. Diplomatura, Ing. Técnica o 1er ciclo de Licenciatura adicional", valor: 3.0000, unidad: "titulación", nota: "En subgrupo A2, no puntúa la primera titulación de esta naturaleza que se posea." },
      "3.2.3": { titulo: "3.2.3. Segundo ciclo de Licenciatura, Ingeniería o Arquitectura adicional", valor: 3.0000, unidad: "segundo ciclo", nota: "En subgrupo A1, no puntúan los estudios necesarios para obtener la primera titulación alegada para ingreso." },
      "3.3_e": { titulo: "3.3.e. Técnico Superior (FP de Grado Superior, Artes Plásticas y Diseño, Técnico Deportivo Superior)", valor: 2.0000, unidad: "título" },
      "3.3_f": { titulo: "3.3.f. Título Profesional de Música o Danza", valor: 2.0000, unidad: "título" }
    }
  },
  bloque4: {
    id: "4",
    titulo: "4. Desempeño de cargos directivos y otras funciones",
    maximo: 30.0000,
    descripcion: "Dirección, vicedirección, jefatura de estudios, secretaría, jefatura de departamento, coordinación y tutorías LOE",
    doc: "Hoja de servicios expedida por la Administración educativa o nombramiento con diligencia de posesión y cese (o certificación de continuidad).",
    subapartados: {
      "4.1": { titulo: "4.1. Director/a de centros públicos, CPR/CEP o ALCE", porAno: 4.5000, porMes: 0.3750 },
      "4.2": { titulo: "4.2. Vicedirector/a, Subdirector/a, Jefe/a de Estudios, Secretario/a y asimilados", porAno: 3.0000, porMes: 0.2500 },
      "4.3": { titulo: "4.3. Jefatura de departamento/seminario, coordinación de ciclo, asesoría formación, dirección EOEP y Tutorías LOE", porAno: 1.5000, porMes: 0.1250, maximo: 10.0000 }
    }
  },
  bloque5: {
    id: "5",
    titulo: "5. Formación y perfeccionamiento",
    maximo: 15.0000,
    descripcion: "Cursos superados e impartidos, nuevas especialidades, competencia digital docente e idiomas extranjeros",
    subapartados: {
      "5.1": {
        titulo: "5.1. Actividades de formación superadas (cursos recibidos)",
        formula: "0,1000 puntos por cada 10 horas completas (1 crédito = 10 h)",
        maximo: 9.0000, // 900 horas
        doc: "Certificado de la entidad convocante u homologación en el registro de formación de la Administración."
      },
      "5.2": {
        titulo: "5.2. Impartición de actividades de formación (cursos impartidos)",
        formula: "0,1000 puntos por cada 3 horas completas",
        maximo: 3.0000, // 90 horas
        doc: "Certificado de impartición con duración de la actividad."
      },
      "5.3": {
        titulo: "5.3. Nuevas especialidades adquiridas por procedimiento oficial (RD 850/1993, 334/2004, 276/2007)",
        valor: 1.0000,
        unidad: "especialidad",
        doc: "Copia de la credencial de adquisición de la nueva especialidad."
      },
      "5.4": {
        titulo: "5.4. Acreditación de la Competencia Digital Docente (CDD)",
        maximo: 3.0000,
        niveles: {
          "ninguno": 0,
          "A1": 0.5000,
          "A2": 1.0000,
          "B1": 1.5000,
          "B2": 2.0000,
          "C1": 2.5000,
          "C2": 3.0000
        },
        doc: "Copia del documento acreditativo de nivel emitido por la Administración educativa competente."
      },
      "5.5": {
        titulo: "5.5. Certificados de conocimiento de idiomas extranjeros (MCER / ACLES no EOI)",
        niveles: { "B1": 1.0000, "B2": 2.0000, "C1": 3.0000, "C2": 4.0000 },
        doc: "Certificado admitido según tabla ACLES/MCER oficial. Solo se valora el nivel superior por idioma."
      }
    }
  },
  bloque6: {
    id: "6",
    titulo: "6. Otros méritos",
    maximo: 15.0000,
    descripcion: "Publicaciones, premios, méritos artísticos/deportivos, puestos en admón., tribunales de oposiciones y tutorización de prácticas",
    subapartados: {
      "6.1": {
        titulo: "6.1. Publicaciones (didácticas y científicas con ISBN/ISSN)",
        maximo: 8.0000,
        doc: "Certificado editorial con tirada, distribución comercial, ISBN/ISSN y depósito legal.",
        libros: {
          autor: 1.0000,
          coautor: 0.5000,
          tresAutores: 0.4000,
          cuatroAutores: 0.3000,
          cincoAutores: 0.2000,
          masCincoAutores: 0.1000
        },
        revistas: {
          autor: 0.2000,
          coautor: 0.1000,
          tresOMas: 0.0500
        }
      },
      "6.2": {
        titulo: "6.2. Premios educativos y proyectos de investigación o innovación",
        maximo: 2.5000,
        doc: "Certificación acreditativa oficial de la entidad convocante o Administración educativa."
      },
      "6.3": {
        titulo: "6.3. Méritos artísticos y condición de deportista de alto nivel o rendimiento",
        maximo: 2.5000,
        deportistaAltoNivel: 1.0000,
        deportistaAltoRendimiento: 0.5000,
        doc: "Certificado del Consejo Superior de Deportes o certificados de entidades culturales."
      },
      "6.4": {
        titulo: "6.4. Servicios en puestos de la Administración educativa (nivel de complemento destino >= cuerpo)",
        porAno: 1.5000,
        porMes: 0.1250,
        doc: "Copia de nombramiento con diligencias de posesión y cese."
      },
      "6.5": {
        titulo: "6.5. Miembro de tribunales de oposiciones docentes LOE (desde RD 276/2007)",
        valor: 0.5000,
        unidad: "convocatoria",
        doc: "Certificado expedido por el órgano competente que custodia las actas."
      },
      "6.6": {
        titulo: "6.6. Tutorización de prácticas",
        masterGrado: 0.1000, // Por curso
        funcionariosPracticas: 0.2000, // Por curso desde 2023/2024
        doc: "Certificado expedido por la Administración educativa o dirección del centro escolar."
      },
      "6.7": {
        titulo: "6.7. Plazas en CC.AA. con particularidades lingüísticas (Navarra, Euskadi, C. Valenciana, Baleares, Cataluña)",
        maximo: 5.0000,
        doc: "Acreditaciones específicas requeridas por las convocatorias de dichas CC.AA."
      }
    }
  }
};

const BAREMO_INSPECTORES = {
  bloque1: {
    id: "1",
    titulo: "1. Antigüedad",
    maximo: null,
    subapartados: {
      "1.1": { titulo: "1.1. Permanencia ininterrumpida como inspector definitivo en la plantilla provincial", porAno12: 4.0, porMes12: 0.3333, porAno3: 6.0, porMes3: 0.5, porAno4Mas: 8.0, porMes4Mas: 0.6666 },
      "1.2": { titulo: "1.2. Provisionalidad como funcionario de carrera inspector", porAno: 4.0, porMes: 0.3333 },
      "1.3.1": { titulo: "1.3.1. Servicios efectivos en el cuerpo de inspectores", porAno: 2.0, porMes: 0.1666 },
      "1.3.2": { titulo: "1.3.2. Servicios efectivos en otros cuerpos docentes LOE", porAno: 1.0, porMes: 0.0833 }
    }
  },
  bloque2: { id: "2", titulo: "2. Méritos académicos", maximo: 10.0000 },
  bloque3: { id: "3", titulo: "3. Formación y perfeccionamiento", maximo: 15.0000 },
  bloque4: { id: "4", titulo: "4. Ejercicio de la función inspectora y cargos directivos", maximo: 20.0000 },
  bloque5: { id: "5", titulo: "5. Otros méritos", maximo: 15.0000 }
};
