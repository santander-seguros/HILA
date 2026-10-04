/* Copia de data/salidas.json para cuando abres la página con doble clic
   (file://), donde el navegador no deja leer archivos .json.
   Si editas salidas.json, copia aquí el mismo contenido. DATOS DEMO.
   En la Fase 2 ambos archivos se reemplazan por la API del servidor. */
window.HILA_SALIDAS_DEMO = {
  "_nota": "DATOS DEMO. Imitan la futura base de datos. El control real de cupos y la prevención de sobreventa se harán en el servidor (Fase 2).",
  "experiencias": [
    {
      "id": "kayak",
      "slug": "kayak-en-xochimilco",
      "nombre": "Kayak en Xochimilco",
      "precio_desde": 850,
      "duracion": "5 horas",
      "dificultad": "Baja"
    },
    {
      "id": "ferrata",
      "slug": "via-ferrata-y-rappel",
      "nombre": "Vía ferrata + rappel",
      "precio_desde": 1450,
      "duracion": "8 horas",
      "dificultad": "Media"
    },
    {
      "id": "camping",
      "slug": "camping-en-las-estacas",
      "nombre": "Camping en Las Estacas",
      "precio_desde": 1890,
      "duracion": "2 días, 1 noche",
      "dificultad": "Baja"
    }
  ],
  "salidas": [
    {
      "id": "DEMO-1001",
      "experiencia_id": "kayak",
      "fecha": "2026-10-17",
      "hora": "05:30",
      "punto_de_encuentro": "Punto de encuentro DEMO en CDMX (por confirmar)",
      "cupo_total": 12,
      "cupo_reservado": 8,
      "estado": "publicada",
      "precio": 850
    },
    {
      "id": "DEMO-1002",
      "experiencia_id": "kayak",
      "fecha": "2026-10-31",
      "hora": "05:30",
      "punto_de_encuentro": "Punto de encuentro DEMO en CDMX (por confirmar)",
      "cupo_total": 12,
      "cupo_reservado": 12,
      "estado": "agotada",
      "precio": 850
    },
    {
      "id": "DEMO-1003",
      "experiencia_id": "kayak",
      "fecha": "2026-11-14",
      "hora": "05:30",
      "punto_de_encuentro": "Punto de encuentro DEMO en CDMX (por confirmar)",
      "cupo_total": 12,
      "cupo_reservado": 3,
      "estado": "publicada",
      "precio": 850
    },
    {
      "id": "DEMO-1004",
      "experiencia_id": "kayak",
      "fecha": "2026-11-28",
      "hora": "05:30",
      "punto_de_encuentro": "Punto de encuentro DEMO en CDMX (por confirmar)",
      "cupo_total": 12,
      "cupo_reservado": 0,
      "estado": "desactivada",
      "precio": 850
    },
    {
      "id": "DEMO-2001",
      "experiencia_id": "ferrata",
      "fecha": "2026-10-25",
      "hora": "06:00",
      "punto_de_encuentro": "Punto de encuentro DEMO en CDMX (por confirmar)",
      "cupo_total": 10,
      "cupo_reservado": 7,
      "estado": "publicada",
      "precio": 1450
    },
    {
      "id": "DEMO-2002",
      "experiencia_id": "ferrata",
      "fecha": "2026-11-22",
      "hora": "06:00",
      "punto_de_encuentro": "Punto de encuentro DEMO en CDMX (por confirmar)",
      "cupo_total": 10,
      "cupo_reservado": 10,
      "estado": "agotada",
      "precio": 1450
    },
    {
      "id": "DEMO-2003",
      "experiencia_id": "ferrata",
      "fecha": "2026-12-13",
      "hora": "06:00",
      "punto_de_encuentro": "Punto de encuentro DEMO en CDMX (por confirmar)",
      "cupo_total": 10,
      "cupo_reservado": 2,
      "estado": "publicada",
      "precio": 1450
    },
    {
      "id": "DEMO-3001",
      "experiencia_id": "camping",
      "fecha": "2026-11-07",
      "hora": "08:00",
      "punto_de_encuentro": "Punto de encuentro DEMO en CDMX (por confirmar)",
      "cupo_total": 12,
      "cupo_reservado": 11,
      "estado": "publicada",
      "precio": 1890
    },
    {
      "id": "DEMO-3002",
      "experiencia_id": "camping",
      "fecha": "2026-12-05",
      "hora": "08:00",
      "punto_de_encuentro": "Punto de encuentro DEMO en CDMX (por confirmar)",
      "cupo_total": 12,
      "cupo_reservado": 4,
      "estado": "publicada",
      "precio": 1890
    }
  ]
};
