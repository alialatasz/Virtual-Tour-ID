export interface HotspotInfo {
  pitch: number;
  yaw: number;
  title: string;
  text?: string;
  dataId?: string;
}

export interface HotspotScene {
  pitch: number;
  yaw: number;
  targetScene: string;
  text: string;
}

export interface SceneData {
  id: string;
  title: string;
  panorama: string;
  type?: 'image' | 'video';
  mediaUrl?: string;
  historyDesc: string;
  imgBefore: string;
  imgAfter: string;
  infoHotspots: HotspotInfo[];
  sceneHotspots: HotspotScene[];
  shortDesc?: string;
  mapCoords?: { x: number; y: number };
  roomNumber?: number;
}

export interface HeritageSite {
  id: string;
  title: string;
  category: string;
  location: string;
  thumbnail: string;
  isAvailable: boolean;
  rooms: Record<string, SceneData>;
  gallery?: { src: string; thumb?: string; alt?: string; }[];
}

export interface FortLocation {
  id: string;
  number: number;
  name: string;
  alias?: string;
  x: number; // percentage in map
  y: number; // percentage in map
  vx?: number; // vector canvas x (0-1000)
  vy?: number; // vector canvas y (0-650)
  photoX?: number; // percentage in photo map
  photoY?: number; // percentage in photo map
  status: 'active' | 'upcoming';
  sceneId?: string;
  description: string;
  thumbnail: string;
}

export interface TourCheckpoint {
  id: string;
  step: number;
  name: string;
  sub: string;
  fullTitle: string;
  desc: string;
  roomNumber: number;
  branch: 'main' | 'maket' | 'makam';
  vx: number; // vector canvas x (0-1000)
  vy: number; // vector canvas y (0-650)
  x: number; // percentage on vector canvas (0-100%)
  y: number; // percentage on vector canvas (0-100%)
  photoX: number; // percentage on photo board (denah-benteng.jpg)
  photoY: number; // percentage on photo board
  thumbnail: string;
}

// 13 Titik Jelajah Berurutan Tersinkronisasi Penuh
export const tourCheckpoints: TourCheckpoint[] = [
  {
    id: "r01-gerbang",
    step: 1,
    name: "Gerbang Luar",
    sub: "Titik Awal • Ruang #1",
    fullTitle: "Gerbang Masuk Benteng (Titik 1)",
    desc: "Pintu gerbang luar akses masuk dari jalan raya utama menuju kompleks benteng.",
    roomNumber: 1,
    branch: 'main',
    vx: 70,
    vy: 570,
    x: 7.0,
    y: 87.7,
    photoX: 13.1,
    photoY: 19.9,
    thumbnail: "/gambar/gerbang-masuk-benteng-titik1.png"
  },
  {
    id: "r01-gerbang-2",
    step: 2,
    name: "Jalan Masuk",
    sub: "Pintu Masuk • Ruang #1",
    fullTitle: "Gerbang Masuk Benteng (Titik 2)",
    desc: "Akses jalan pedestrian setelah melintasi gerbang luar pertama.",
    roomNumber: 1,
    branch: 'main',
    vx: 130,
    vy: 515,
    x: 13.0,
    y: 79.2,
    photoX: 11.2,
    photoY: 22.8,
    thumbnail: "/gambar/gerbang-masuk-benteng-titik2.png"
  },
  {
    id: "r01-gerbang-3",
    step: 3,
    name: "Akses Kawasan",
    sub: "Jalur Utama • Ruang #1",
    fullTitle: "Akses Menuju Benteng (Titik 3)",
    desc: "Jalur terbuka dengan pemandangan pegunungan menuju pos pemeriksaan tiket.",
    roomNumber: 1,
    branch: 'main',
    vx: 190,
    vy: 460,
    x: 19.0,
    y: 70.8,
    photoX: 8.8,
    photoY: 25.5,
    thumbnail: "/gambar/akses-menuju-benteng-titik3.png"
  },
  {
    id: "r01-gerbang-4",
    step: 4,
    name: "Depan Pos",
    sub: "Menuju Pos • Ruang #1",
    fullTitle: "Mendekati Checker Gate (Titik 4)",
    desc: "Titik transisi tepat di depan pintu pemeriksaan tiket benteng.",
    roomNumber: 1,
    branch: 'main',
    vx: 250,
    vy: 405,
    x: 25.0,
    y: 62.3,
    photoX: 6.2,
    photoY: 28.0,
    thumbnail: "/gambar/mendekati-checker-gate-titik4.png"
  },
  {
    id: "r02-checker-gate",
    step: 5,
    name: "Checker Gate",
    sub: "Pos Tiket • Ruang #2",
    fullTitle: "Checker Gate (Pos Tiket)",
    desc: "Pos seleksi dan pemeriksaan tiket resmi pengunjung wisata sejarah.",
    roomNumber: 2,
    branch: 'main',
    vx: 310,
    vy: 350,
    x: 31.0,
    y: 53.8,
    photoX: 3.5,
    photoY: 30.2,
    thumbnail: "/gambar/checker-gate-titik1.png"
  },
  {
    id: "r02-checker-gate-2",
    step: 6,
    name: "Halaman Pos",
    sub: "Area Dalam • Ruang #2",
    fullTitle: "Checker Gate (Area Setelah Pos)",
    desc: "Halaman dalam setelah pos tiket menuju perempatan pertama benteng.",
    roomNumber: 2,
    branch: 'main',
    vx: 370,
    vy: 330,
    x: 37.0,
    y: 50.8,
    photoX: 5.8,
    photoY: 33.2,
    thumbnail: "/gambar/checker-gate-titik2.png"
  },
  {
    id: "r03-perempatan-pertama",
    step: 7,
    name: "Perempatan 1",
    sub: "Persimpangan • Ruang #3",
    fullTitle: "Perempatan Pertama (Ruang #3)",
    desc: "Persimpangan utama pembagi rute ke makam dan kawasan dalam benteng.",
    roomNumber: 3,
    branch: 'main',
    vx: 440,
    vy: 330,
    x: 44.0,
    y: 50.8,
    photoX: 10.7,
    photoY: 33.2,
    thumbnail: "/gambar/thumb-r03-perempatan.jpg"
  },
  {
    id: "r03-lanjut-maju",
    step: 8,
    name: "Akses Maket",
    sub: "Lanjut Maju • Ruang #3",
    fullTitle: "Menuju Ruang Maket & Benteng",
    desc: "Jalan utama di depan paviliun maket denah dan dinding benteng barat.",
    roomNumber: 3,
    branch: 'maket',
    vx: 510,
    vy: 310,
    x: 51.0,
    y: 47.7,
    photoX: 14.5,
    photoY: 34.8,
    thumbnail: "/gambar/thumb-r03-lanjut-maju.jpg"
  },
  {
    id: "r04-miniatur-denah",
    step: 9,
    name: "Ruang Maket",
    sub: "Diorama 3D • Ruang #15",
    fullTitle: "Ruang Literasi & Maket (Ruang #15)",
    desc: "Paviliun edukasi dengan miniatur maket 3D Benteng Fort Willem I.",
    roomNumber: 15,
    branch: 'maket',
    vx: 550,
    vy: 250,
    x: 55.0,
    y: 38.5,
    photoX: 19.6,
    photoY: 36.2,
    thumbnail: "/gambar/thumb-r04-miniatur.jpg"
  },
  {
    id: "r05-lanjut-dari-miniatur",
    step: 10,
    name: "Kaponieri",
    sub: "Sayap Benteng • Ruang #16",
    fullTitle: "Halaman Sayap Kaponieri (Ruang #16)",
    desc: "Pelataran depan bangunan sayap barat berarsitektur kolonial megah.",
    roomNumber: 16,
    branch: 'maket',
    vx: 580,
    vy: 400,
    x: 58.0,
    y: 61.5,
    photoX: 23.5,
    photoY: 36.8,
    thumbnail: "/gambar/thumb-r05-lanjut-miniatur.jpg"
  },
  {
    id: "r06-belok-kiri",
    step: 11,
    name: "Jalur Barat",
    sub: "Belok Kiri • Ruang #4",
    fullTitle: "Jalan Menuju Area Pemakaman",
    desc: "Jalur pejalan kaki setelah berbelok kiri dari perempatan pertama.",
    roomNumber: 4,
    branch: 'makam',
    vx: 410,
    vy: 240,
    x: 41.0,
    y: 36.9,
    photoX: 14.8,
    photoY: 31.8,
    thumbnail: "/gambar/thumb-r06-belok-kiri.jpg"
  },
  {
    id: "r07-menuju-pemakaman",
    step: 12,
    name: "Akses Makam",
    sub: "Pelataran Makam • Ruang #4",
    fullTitle: "Pelataran Masuk Makam & Monumen",
    desc: "Pelataran taman depan pendopo makam bersejarah.",
    roomNumber: 4,
    branch: 'makam',
    vx: 380,
    vy: 160,
    x: 38.0,
    y: 24.6,
    photoX: 17.5,
    photoY: 31.0,
    thumbnail: "/gambar/thumb-r07-menuju-makam.jpg"
  },
  {
    id: "r08-pemakaman",
    step: 13,
    name: "Makam Monumen",
    sub: "Joglo Pahlawan • Ruang #4",
    fullTitle: "Makam & Monumen Jogonianfu (Ruang #4)",
    desc: "Area makam ini menjadi tempat peristirahatan terakhir sejumlah ulama yang pernah ditahan di Benteng Willem I serta monumen peringatan Jugun Ianfu.",
    roomNumber: 4,
    branch: 'makam',
    vx: 360,
    vy: 80,
    x: 36.0,
    y: 12.3,
    photoX: 19.9,
    photoY: 30.5,
    thumbnail: "/gambar/thumb-r08-pemakaman.jpg"
  }
];

export const fortLocations: FortLocation[] = [
  {
    id: "loc-1",
    number: 1,
    name: "Gerbang",
    alias: "Pintu Masuk Utama Kawasan Benteng",
    x: 7.0,
    y: 87.7,
    vx: 70,
    vy: 570,
    photoX: 13.1,
    photoY: 19.9,
    status: "active",
    sceneId: "r01-gerbang",
    description: "Gerbang masuk luar menuju kompleks bersejarah Benteng Fort Willem I dari akses jalan utama.",
    thumbnail: "/gambar/gerbang-masuk-benteng-titik1.png"
  },
  {
    id: "loc-2",
    number: 2,
    name: "Checker Gate",
    alias: "Pos Pemeriksaan Tiket",
    x: 31.0,
    y: 53.8,
    vx: 310,
    vy: 350,
    photoX: 3.3,
    photoY: 30.0,
    status: "active",
    sceneId: "r02-checker-gate",
    description: "Pintu gerbang pemeriksaan tiket dan titik awal masuk area inti kompleks benteng.",
    thumbnail: "/gambar/checker-gate-titik1.png"
  },
  {
    id: "loc-3",
    number: 3,
    name: "Perempatan Pertama",
    alias: "Persimpangan Utama Kawasan Luar",
    x: 44.0,
    y: 50.8,
    vx: 440,
    vy: 330,
    photoX: 10.7,
    photoY: 33.2,
    status: "active",
    sceneId: "r03-perempatan-pertama",
    description: "Titik percabangan utama setelah checker gate yang menghubungkan akses ke makam, pusat oleh-oleh, dan pintu benteng.",
    thumbnail: "/gambar/thumb-r03-perempatan.jpg"
  },
  {
    id: "loc-4",
    number: 4,
    name: "Makam & Monumen Jogonianfu",
    alias: "Monumen Bersejarah",
    x: 36.0,
    y: 12.3,
    vx: 360,
    vy: 80,
    photoX: 19.9,
    photoY: 30.5,
    status: "active",
    sceneId: "r08-pemakaman",
    description: "Area makam ini menjadi tempat peristirahatan terakhir sejumlah ulama yang pernah ditahan di Benteng Willem I yang meninggal pada masa penjajahan Jepang, sepanjang tahun 1942-1945. Salah satu tokoh yang dimakamkan di sini adalah Kiai Mahfudh Salam, ulama asal Kajen, Pati, sekaligus ayahanda Kiai Sahal Mahfudh. Beliau pernah ditahan di Ambarawa dan wafat pada masa pendudukan Jepang. Di dekat kawasan makam terdapat monumen untuk mengenang korban Jugun Ianfu. Jugun Ianfu merupakan sebutan bagi perempuan korban perbudakan seksual oleh militer Jepang pada masa Perang Dunia II. Pada masa pendudukan Jepang, kamp-kamp di Ambarawa menampung orang-orang yang diinternir, termasuk perempuan dan anak-anak. Sejumlah perempuan dari kamp tersebut kemudian dipindahkan secara paksa ke lokasi lain dan menjadi korban kekerasan seksual.",
    thumbnail: "/gambar/thumb-r08-pemakaman.jpg"
  },
  {
    id: "loc-5",
    number: 5,
    name: "Paardenstal",
    alias: "Kandang & Garasi Kereta Kuda",
    x: 68.0,
    y: 13.8,
    vx: 680,
    vy: 90,
    photoX: 28.2,
    photoY: 22.1,
    status: "upcoming",
    sceneId: "paardenstal",
    description: "Kandang kuda dan garasi kereta militer Hindia Belanda dengan arsitektur sentrifugal lengkungan kubah.",
    thumbnail: "/gambar/paardenstal-dulu.jpg"
  },
  {
    id: "loc-6",
    number: 6,
    name: "Bastion Timur Laut",
    alias: "Struktur Sudut Pertahanan Meriam",
    x: 92.0,
    y: 23.1,
    vx: 920,
    vy: 150,
    photoX: 43.5,
    photoY: 20.3,
    status: "upcoming",
    sceneId: "bastion",
    description: "Struktur menonjol di sudut timur laut benteng yang berfungsi sebagai benteng pertahanan dan dudukan meriam.",
    thumbnail: "/gambar/bastion-kini.jpg"
  },
  {
    id: "loc-7",
    number: 7,
    name: "Blok Timur Penjara",
    alias: "Area Wahana & Fasilitas Publik",
    x: 89.0,
    y: 36.9,
    vx: 890,
    vy: 240,
    photoX: 58.5,
    photoY: 27.6,
    status: "upcoming",
    description: "Area wahana rekreasi publik: ATV, berkuda, kolam resapan, mini booth wahana, dan kursi pijat.",
    thumbnail: "/gambar/tahanan-kini.jpg"
  },
  {
    id: "loc-8",
    number: 8,
    name: "Main Gate — Sinema",
    alias: "Pintu Gerbang Utama & Ruang Sinema",
    x: 93.5,
    y: 50.8,
    vx: 935,
    vy: 330,
    photoX: 72.6,
    photoY: 27.2,
    status: "upcoming",
    description: "Pintu gerbang monumental benteng di sisi timur yang kini difungsikan sebagai ruang sinema pemutaran film sejarah.",
    thumbnail: "/gambar/barak-sekarang.jpg"
  },
  {
    id: "loc-9",
    number: 9,
    name: "Penjara / Aviary",
    alias: "Bekas Penjara — Sekarang Aviary",
    x: 91.5,
    y: 75.4,
    vx: 915,
    vy: 490,
    photoX: 85.1,
    photoY: 38.7,
    status: "upcoming",
    sceneId: "room-tahanan",
    description: "Bekas blok sel tahanan militer yang belum direvitalisasi penuh, kini difungsikan sebagai kandang aviary burung.",
    thumbnail: "/gambar/tahanan-kini.jpg"
  },
  {
    id: "loc-10",
    number: 10,
    name: "Rumah Perwira",
    alias: "Archaeological Park & Mobil Antik",
    x: 81.0,
    y: 56.9,
    vx: 810,
    vy: 370,
    photoX: 61.0,
    photoY: 35.6,
    status: "upcoming",
    sceneId: "rumah-dinas",
    description: "Kawasan rumah dinas perwira militer Belanda berpilar monumental, kini menjadi taman arkeologi dan wahana mobil antik.",
    thumbnail: "/gambar/rumah-dinas-kini.jpg"
  },
  {
    id: "loc-11",
    number: 11,
    name: "Lorong Barak Tamtama",
    alias: "Koridor Barak Pasukan KNIL",
    x: 74.0,
    y: 28.5,
    vx: 740,
    vy: 185,
    photoX: 44.2,
    photoY: 29.3,
    status: "upcoming",
    sceneId: "room-barak",
    description: "Koridor megah dengan lengkungan bata khas Eropa yang menghubungkan barak tidur prajurit Hindia Belanda.",
    thumbnail: "/gambar/barak-sekarang.jpg"
  },
  {
    id: "loc-12",
    number: 12,
    name: "Hall (dengan Jembatan)",
    alias: "Aula Utama Penghubung",
    x: 74.5,
    y: 47.7,
    vx: 745,
    vy: 310,
    photoX: 31.2,
    photoY: 37.1,
    status: "upcoming",
    description: "Aula terbuka megah di tengah benteng dengan jembatan layang penghubung lantai atas antar barak.",
    thumbnail: "/gambar/barak-dulu.jpg"
  },
  {
    id: "loc-13",
    number: 13,
    name: "Dapur (Mushola)",
    alias: "Bekas Dapur Garnisun",
    x: 64.0,
    y: 69.2,
    vx: 640,
    vy: 450,
    photoX: 13.9,
    photoY: 42.3,
    status: "upcoming",
    description: "Dapur umum garnisun militer masa lampau yang telah dialihfungsikan menjadi mushola bagi pengunjung.",
    thumbnail: "/gambar/barak-dulu.jpg"
  },
  {
    id: "loc-14",
    number: 14,
    name: "Bastion Barat Laut",
    alias: "Bastion Pertahanan Sisi Barat Daya",
    x: 55.0,
    y: 75.4,
    vx: 550,
    vy: 490,
    photoX: 5.2,
    photoY: 50.0,
    status: "upcoming",
    description: "Bastion sudut pertahanan pengawas gerbang dan akses barat dari Benteng Fort Willem I.",
    thumbnail: "/gambar/bastion-kini.jpg"
  },
  {
    id: "loc-15",
    number: 15,
    name: "Ruang Literasi",
    alias: "Pusat Edukasi & Diorama Maket",
    x: 55.0,
    y: 38.5,
    vx: 550,
    vy: 250,
    photoX: 19.6,
    photoY: 36.2,
    status: "active",
    sceneId: "r04-miniatur-denah",
    description: "Pusat informasi sejarah dengan arsip foto masa lalu, peta tempo dulu, dan miniatur maket arsitektur benteng.",
    thumbnail: "/gambar/thumb-r04-miniatur.jpg"
  },
  {
    id: "loc-16",
    number: 16,
    name: "Kaponieri — Makutoromo",
    alias: "Pusat Oleh-oleh & Suvenir",
    x: 58.0,
    y: 61.5,
    vx: 580,
    vy: 400,
    photoX: 23.5,
    photoY: 36.8,
    status: "active",
    sceneId: "r05-lanjut-dari-miniatur",
    description: "Bangunan sayap kaponieri yang kini menjadi pusat cinderamata dan oleh-oleh khas kawasan wisata benteng.",
    thumbnail: "/gambar/thumb-r05-lanjut-miniatur.jpg"
  }
];

export const heritageSites: HeritageSite[] = [
  {
    id: "fort-willem-i",
    title: "Benteng Fort Willem I",
    category: "Benteng",
    location: "Ambarawa, Jawa Tengah",
    thumbnail: "/gambar/katalog-willem.png",
    isAvailable: true,
    gallery: [
      { src: "/gambar/galeri1 (1).png", thumb: "/gambar/galeri1 (1).png", alt: "Galeri Benteng Fort Willem I (1)" },
      { src: "/gambar/galeri1 (2).png", thumb: "/gambar/galeri1 (2).png", alt: "Galeri Benteng Fort Willem I (2)" },
      { src: "/gambar/galeri1 (3).png", thumb: "/gambar/galeri1 (3).png", alt: "Galeri Benteng Fort Willem I (3)" },
      { src: "/gambar/galeri1 (4).png", thumb: "/gambar/galeri1 (4).png", alt: "Galeri Benteng Fort Willem I (4)" },
      { src: "/gambar/galeri1 (5).png", thumb: "/gambar/galeri1 (5).png", alt: "Galeri Benteng Fort Willem I (5)" },
      { src: "/gambar/galeri1 (6).png", thumb: "/gambar/galeri1 (6).png", alt: "Galeri Benteng Fort Willem I (6)" }
    ],
    rooms: {
      "sejarah-umum": {
        id: "sejarah-umum",
        title: "Sejarah Benteng Pendem",
        panorama: "",
        historyDesc: "Benteng Pendem Ambarawa (Fort Willem I) dibangun oleh pemerintah kolonial Hindia Belanda pada tahun 1834 hingga 1845. Benteng megah ini awalnya difungsikan sebagai barak militer dan pusat logistik, sebelum akhirnya diubah menjadi penjara militer yang menyimpan banyak kisah kelam di balik jeruji besinya.",
        imgBefore: "/gambar/benteng-lama.png",
        imgAfter: "/gambar/benteng-baru.png",
        infoHotspots: [],
        sceneHotspots: []
      },

      // ==========================================
      // URUTAN 6 VIDEO TEST 360 BERJALAN
      // ==========================================

      // 1. R01-gerbang
      "r01-gerbang": {
        id: "r01-gerbang",
        title: "Gerbang Masuk Benteng (Titik 1)",
        type: "video",
        mediaUrl: "/R01-gerbang.mp4",
        panorama: "/R01-gerbang.mp4",
        historyDesc: "Pintu masuk utama menuju kawasan Benteng Fort Willem I. Dari titik ini pengunjung memulai perjalanan visual melintasi pintu gerbang luar kawasan pertahanan kolonial Ambarawa.",
        shortDesc: "Pintu masuk utama luar kawasan Benteng Fort Willem I.",
        imgBefore: "/gambar/barak-dulu.jpg",
        imgAfter: "/gambar/gerbang-masuk-benteng-titik1.png",
        mapCoords: { x: 13.1, y: 19.9 },
        roomNumber: 1,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 0, targetScene: "r01-gerbang-2", text: "MASUK!" }
        ]
      },

      // 2. R01-gerbang(02)
      "r01-gerbang-2": {
        id: "r01-gerbang-2",
        title: "Gerbang Masuk Benteng (Titik 2)",
        type: "video",
        mediaUrl: "/R01-gerbang(02).mp4",
        panorama: "/R01-gerbang(02).mp4",
        historyDesc: "Titik transisi tepat setelah melewati gerbang luar benteng. Jalan akses menghubungkan area jalan raya ke jalur lingkar kompleks.",
        shortDesc: "Akses jalan setelah melewati gerbang masuk pertama.",
        imgBefore: "/gambar/barak-dulu.jpg",
        imgAfter: "/gambar/gerbang-masuk-benteng-titik2.png",
        mapCoords: { x: 10.5, y: 23.0 },
        roomNumber: 1,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 0, targetScene: "r01-gerbang-3", text: "LANJUT" },
          { pitch: -3, yaw: 180, targetScene: "r01-gerbang", text: "KEMBALI" }
        ]
      },

      // 3. R01-gerbang(03) -> file R01-gerbang(3).mp4
      "r01-gerbang-3": {
        id: "r01-gerbang-3",
        title: "Akses Menuju Benteng (Titik 3)",
        type: "video",
        mediaUrl: "/R01-gerbang(3).mp4",
        panorama: "/R01-gerbang(3).mp4",
        historyDesc: "Jalur pedestrian luas yang menghubungkan gerbang luar menuju area pos pemeriksaan benteng dengan panorama alam terbuka di sekitarnya.",
        shortDesc: "Jalur pejalan kaki menuju gerbang pemeriksaan.",
        imgBefore: "/gambar/barak-dulu.jpg",
        imgAfter: "/gambar/akses-menuju-benteng-titik3.png",
        mapCoords: { x: 7.0, y: 26.0 },
        roomNumber: 1,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 0, targetScene: "r01-gerbang-4", text: "MAJU" },
          { pitch: -3, yaw: 180, targetScene: "r01-gerbang-2", text: "KEMBALI" }
        ]
      },

      // 4. R01-gerbang(04) -> file R01-gerbang(4).mp4
      "r01-gerbang-4": {
        id: "r01-gerbang-4",
        title: "Mendekati Checker Gate (Titik 4)",
        type: "video",
        mediaUrl: "/R01-gerbang(4).mp4",
        panorama: "/R01-gerbang(4).mp4",
        historyDesc: "Area transisi di depan gerbang tiket dan pos penjagaan (Checker Gate). Dari sini pengunjung bersiap masuk ke area verifikasi tiket benteng.",
        shortDesc: "Tepat di depan pos pemeriksaan tiket masuk.",
        imgBefore: "/gambar/barak-dulu.jpg",
        imgAfter: "/gambar/mendekati-checker-gate-titik4.png",
        mapCoords: { x: 4.8, y: 28.5 },
        roomNumber: 1,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 0, targetScene: "r02-checker-gate", text: "KE CHECKER GATE" },
          { pitch: -3, yaw: 180, targetScene: "r01-gerbang-3", text: "KEMBALI" }
        ]
      },

      // 5. R02-checker-gate
      "r02-checker-gate": {
        id: "r02-checker-gate",
        title: "Checker Gate (Titik 1)",
        type: "video",
        mediaUrl: "/R02-checker-gate.mp4",
        panorama: "/R02-checker-gate.mp4",
        historyDesc: "Pos pemeriksaan tiket resmi (Checker Gate) Benteng Fort Willem I. Area ini menjadi pintu sirkulasi masuk bagi seluruh pengunjung wisata sejarah.",
        shortDesc: "Pos tiket dan pemeriksaan pintu masuk resmi.",
        imgBefore: "/gambar/barak-dulu.jpg",
        imgAfter: "/gambar/checker-gate-titik1.png",
        mapCoords: { x: 3.3, y: 30.0 },
        roomNumber: 2,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 0, targetScene: "r02-checker-gate-2", text: "LEWATI POS TIKET" },
          { pitch: -3, yaw: 180, targetScene: "r01-gerbang-4", text: "KEMBALI" }
        ]
      },

      // 6. R02-checker-gate(02)
      "r02-checker-gate-2": {
        id: "r02-checker-gate-2",
        title: "Checker Gate (Titik 2)",
        type: "video",
        mediaUrl: "/R02-checker-gate(02).mp4",
        panorama: "/R02-checker-gate(02).mp4",
        historyDesc: "Halaman dalam setelah melewati pos tiket, membuka akses langsung ke Perempatan Pertama dan lorong-lorong megah dinding benteng barat.",
        shortDesc: "Halaman dalam setelah pos tiket menuju perempatan pertama.",
        imgBefore: "/gambar/barak-dulu.jpg",
        imgAfter: "/gambar/checker-gate-titik2.png",
        mapCoords: { x: 6.5, y: 31.5 },
        roomNumber: 2,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 0, targetScene: "r03-perempatan-pertama", text: "KE PEREMPATAN PERTAMA" },
          { pitch: -3, yaw: 180, targetScene: "r02-checker-gate", text: "KEMBALI KE POS" }
        ]
      },

      // 7. R03-perempatan-pertama
      "r03-perempatan-pertama": {
        id: "r03-perempatan-pertama",
        title: "Perempatan Pertama (Titik 1)",
        type: "video",
        mediaUrl: "/R03-perempatan-pertama.mp4",
        panorama: "/R03-perempatan-pertama.mp4",
        historyDesc: "Persimpangan jalan utama setelah melewati pos checker gate. Dari titik ini, jalur bercabang menuju area Makam & Monumen Jogonianfu di sisi barat/kiri, area galeri maket dan kaponieri di sisi lurus depan, serta akses dinding luar benteng.",
        shortDesc: "Persimpangan jalan utama pembagi rute kawasan luar benteng.",
        imgBefore: "/gambar/benteng-lama.png",
        imgAfter: "/gambar/thumb-r03-perempatan.jpg",
        mapCoords: { x: 10.7, y: 33.2 },
        roomNumber: 3,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 0, targetScene: "r06-belok-kiri", text: "KE ARAH MAKAM" },
          { pitch: -3, yaw: -80, targetScene: "r03-lanjut-maju", text: "LURUS KE BENTENG" },
          { pitch: -3, yaw: 180, targetScene: "r02-checker-gate-2", text: "KEMBALI KE CHECKER GATE" }
        ]
      },

      // 8. R03-lanjut-maju-dari-perempatan
      "r03-lanjut-maju": {
        id: "r03-lanjut-maju",
        title: "Menuju Ruang Maket & Benteng",
        type: "video",
        mediaUrl: "/R03-lanjut-maju-dari-perempatan.mp4",
        panorama: "/R03-lanjut-maju-dari-perempatan.mp4",
        historyDesc: "Jalan utama berpaving yang menghubungkan perempatan pertama ke arah paviliun diorama maket benteng dan bangunan sayap Kaponieri / Makutoromo.",
        shortDesc: "Akses jalan utama di depan paviliun maket denah benteng.",
        imgBefore: "/gambar/benteng-lama.png",
        imgAfter: "/gambar/thumb-r03-lanjut-maju.jpg",
        mapCoords: { x: 14.5, y: 34.8 },
        roomNumber: 3,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -2, yaw: -65, targetScene: "r04-miniatur-denah", text: "MASUK RUANG MAKET" },
          { pitch: -3, yaw: 15, targetScene: "r05-lanjut-dari-miniatur", text: "LANJUT KE SAYAP BENTENG" },
          { pitch: -3, yaw: 180, targetScene: "r03-perempatan-pertama", text: "KEMBALI KE PEREMPATAN" }
        ]
      },

      // 9. R04-miniatur-denah
      "r04-miniatur-denah": {
        id: "r04-miniatur-denah",
        title: "Ruang Literasi & Maket Benteng",
        type: "video",
        mediaUrl: "/R04-miniatur-denah.mp4",
        panorama: "/R04-miniatur-denah.mp4",
        historyDesc: "Paviliun terbuka pusat literasi sejarah Benteng Fort Willem I. Di tengah ruangan terdapat meja kaca besar berisi maket miniatur 3D arsitektur lengkap kompleks benteng, foto-foto arsip masa kolonial, dan panel edukasi sejarah.",
        shortDesc: "Paviliun edukasi dengan miniatur maket 3D Benteng Fort Willem I.",
        imgBefore: "/gambar/benteng-lama.png",
        imgAfter: "/gambar/thumb-r04-miniatur.jpg",
        mapCoords: { x: 19.6, y: 36.2 },
        roomNumber: 15,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -2, yaw: 30, targetScene: "r05-lanjut-dari-miniatur", text: "KELUAR KE SAYAP BENTENG" },
          { pitch: -2, yaw: -140, targetScene: "r03-lanjut-maju", text: "KELUAR KE JALAN UTAMA" }
        ]
      },

      // 10. R05-lanjut-dari-miniatur
      "r05-lanjut-dari-miniatur": {
        id: "r05-lanjut-dari-miniatur",
        title: "Halaman Sayap Kaponieri",
        type: "video",
        mediaUrl: "/R05-lanjut-dari-miniatur.mp4",
        panorama: "/R05-lanjut-dari-miniatur.mp4",
        historyDesc: "Area pelataran luas antara paviliun galeri maket dan bangunan megah dua lantai sayap barat benteng dengan tangga baja hitam yang menawan.",
        shortDesc: "Pelataran jalan di depan tangga bangunan sayap benteng.",
        imgBefore: "/gambar/benteng-lama.png",
        imgAfter: "/gambar/thumb-r05-lanjut-miniatur.jpg",
        mapCoords: { x: 23.5, y: 36.8 },
        roomNumber: 16,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -2, yaw: -150, targetScene: "r04-miniatur-denah", text: "MASUK RUANG MAKET" },
          { pitch: -3, yaw: 180, targetScene: "r03-lanjut-maju", text: "KEMBALI KE JALAN UTAMA" }
        ]
      },

      // 11. R06-belok-kiri-dari-perempatan
      "r06-belok-kiri": {
        id: "r06-belok-kiri",
        title: "Jalan Menuju Area Pemakaman",
        type: "video",
        mediaUrl: "/R06-belok-kiri-dari-perempatan.mp4",
        panorama: "/R06-belok-kiri-dari-perempatan.mp4",
        historyDesc: "Jalan pedestrian luas sisi barat daya dari perempatan pertama dengan jalur ubin pemandu difabel kuning, membuka pemandangan ke arah tiang bendera dan kawasan makam bersejarah.",
        shortDesc: "Jalur pejalan kaki setelah berbelok kiri dari perempatan pertama.",
        imgBefore: "/gambar/benteng-lama.png",
        imgAfter: "/gambar/thumb-r06-belok-kiri.jpg",
        mapCoords: { x: 14.8, y: 31.8 },
        roomNumber: 4,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 0, targetScene: "r07-menuju-pemakaman", text: "KE DEPAN PAVILIUN MAKAM" },
          { pitch: -3, yaw: 180, targetScene: "r03-perempatan-pertama", text: "KEMBALI KE PEREMPATAN" }
        ]
      },

      // 12. R07-menuju-pemakaman
      "r07-menuju-pemakaman": {
        id: "r07-menuju-pemakaman",
        title: "Akses Masuk Makam & Monumen",
        type: "video",
        mediaUrl: "/R07-menuju-pemakaman.mp4",
        panorama: "/R07-menuju-pemakaman.mp4",
        historyDesc: "Pelataran depan paviliun B13 dan taman terbuka sebelum memasuki area cungkup makam pahlawan dan monumen peringatan sejarah benteng.",
        shortDesc: "Pelataran depan taman dan pintu masuk kawasan pemakaman.",
        imgBefore: "/gambar/benteng-lama.png",
        imgAfter: "/gambar/thumb-r07-menuju-makam.jpg",
        mapCoords: { x: 17.5, y: 31.0 },
        roomNumber: 4,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 180, targetScene: "r08-pemakaman", text: "MASUK KE MAKAM & MONUMEN" },
          { pitch: -2, yaw: 40, targetScene: "r06-belok-kiri", text: "KEMBALI KE JALUR BARAT" }
        ]
      },

      // 13. R08-pemakaman
      "r08-pemakaman": {
        id: "r08-pemakaman",
        title: "Makam & Monumen Jogonianfu",
        type: "video",
        mediaUrl: "/R08-pemakaman.mp4",
        panorama: "/R08-pemakaman.mp4",
        historyDesc: "Area makam ini menjadi tempat peristirahatan terakhir sejumlah ulama yang pernah ditahan di Benteng Willem I yang meninggal pada masa penjajahan Jepang, sepanjang tahun 1942-1945. Salah satu tokoh yang dimakamkan di sini adalah Kiai Mahfudh Salam, ulama asal Kajen, Pati, sekaligus ayahanda Kiai Sahal Mahfudh. Beliau pernah ditahan di Ambarawa dan wafat pada masa pendudukan Jepang. Di dekat kawasan makam terdapat monumen untuk mengenang korban Jugun Ianfu. Jugun Ianfu merupakan sebutan bagi perempuan korban perbudakan seksual oleh militer Jepang pada masa Perang Dunia II. Pada masa pendudukan Jepang, kamp-kamp di Ambarawa menampung orang-orang yang diinternir, termasuk perempuan dan anak-anak. Sejumlah perempuan dari kamp tersebut kemudian dipindahkan secara paksa ke lokasi lain dan menjadi korban kekerasan seksual.",
        shortDesc: "Makam ulama pejuang kemerdekaan & Monumen korban Jugun Ianfu di bawah pendopo joglo benteng.",
        imgBefore: "/gambar/benteng-lama.png",
        imgAfter: "/gambar/thumb-r08-pemakaman.jpg",
        mapCoords: { x: 19.9, y: 30.5 },
        roomNumber: 4,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 180, targetScene: "r07-menuju-pemakaman", text: "KELUAR DARI AREA MAKAM" },
          { pitch: -3, yaw: -130, targetScene: "r03-perempatan-pertama", text: "KE PEREMPATAN PERTAMA" }
        ]
      },

      // Alias untuk backwards compatibility
      "lapangan-utama": {
        id: "lapangan-utama",
        title: "Gerbang Masuk Benteng (Titik 1)",
        type: "video",
        mediaUrl: "/R01-gerbang.mp4",
        panorama: "/R01-gerbang.mp4",
        historyDesc: "Gerbang utama menuju kawasan Benteng Pendem Ambarawa (Fort Willem I) yang megah dan bersejarah.",
        shortDesc: "Akses gerbang utama menuju kawasan Benteng Fort Willem I.",
        imgBefore: "/gambar/barak-dulu.jpg",
        imgAfter: "/gambar/gerbang-masuk-benteng-titik1.png",
        mapCoords: { x: 13.1, y: 19.9 },
        roomNumber: 1,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: -3, yaw: 0, targetScene: "r01-gerbang-2", text: "MASUK!" }
        ]
      },

      // Ruangan Lainnya (Static / Historical Data)
      "room-tahanan": {
        id: "room-tahanan",
        title: "Penjara / Aviary (Ruang Tahanan)",
        panorama: "https://pannellum.org/images/bma-1.jpg",
        historyDesc: "Sel pengap tanpa cahaya tempat para tawanan politik masa kolonial. Kondisinya kini perlahan direstorasi namun tetap mempertahankan aura kelam dari masa lalunya.",
        shortDesc: "Ruang bawah tanah tanpa cahaya untuk tahanan politik.",
        imgBefore: "https://images.unsplash.com/photo-1519097871630-65db4051a842?ixlib=rb-4.0.3&grayscale=true",
        imgAfter: "/gambar/tahanan-kini.jpg",
        mapCoords: { x: 85.1, y: 38.7 },
        roomNumber: 9,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: 5, yaw: 180, targetScene: "r01-gerbang", text: "Kembali ke Gerbang" }
        ]
      },
      "room-barak": {
        id: "room-barak",
        title: "Lorong Barak Tamtama KNIL",
        panorama: "https://pannellum.org/images/bma-0.jpg",
        historyDesc: "Barak ini dahulu digunakan sebagai tempat istirahat ratusan prajurit KNIL. Struktur bangunannya panjang dengan sirkulasi udara yang dirancang khusus untuk iklim tropis.",
        shortDesc: "Bekas tempat istirahat prajurit KNIL berkapasitas 100 orang.",
        imgBefore: "/gambar/barak-dulu.jpg",
        imgAfter: "/gambar/barak-sekarang.jpg",
        mapCoords: { x: 44.2, y: 29.3 },
        roomNumber: 11,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: 0, yaw: 90, targetScene: "r01-gerbang", text: "Kembali ke Gerbang" }
        ]
      },
      "bastion": {
        id: "bastion",
        title: "Bastion Timur Laut",
        panorama: "/gambar/bastion-360.jpg",
        historyDesc: "Bastion merupakan struktur sudut menonjol pada benteng yang berfungsi utama sebagai posisi pertahanan dan area penembakan meriam. Benteng yang mengusung sistem ini secara keseluruhan dikenal sebagai benteng tipe bastion (bastion fort), star fort, atau trace italienne—sebuah gaya arsitektur militer khas Eropa yang dikembangkan secara intensif oleh bangsa Belanda pada abad ke-16 hingga ke-18.",
        shortDesc: "Struktur sudut benteng untuk pertahanan dan penembakan meriam.",
        imgBefore: "/gambar/bastion-dulu.jpg",
        imgAfter: "/gambar/bastion-kini.jpg",
        mapCoords: { x: 43.5, y: 20.3 },
        roomNumber: 6,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: 0, yaw: 180, targetScene: "r01-gerbang", text: "Kembali ke Gerbang" }
        ]
      },
      "rumah-dinas": {
        id: "rumah-dinas",
        title: "Rumah Perwira (Archaeological Park)",
        panorama: "/gambar/rumah-dinas-360.jpg",
        historyDesc: "Kompleks Benteng Willem I memiliki lima strata rumah dinas perwira yang dibangun pada rentang tahun 1838 hingga 1843. Struktur arsitektur bangunan tersebut mencerminkan hierarki militer Hindia Belanda, di mana jumlah pilar membedakan tingkatan jabatan.",
        shortDesc: "Area kediaman hierarkis untuk perwira militer Hindia Belanda.",
        imgBefore: "/gambar/rumah-dinas-dulu.jpg",
        imgAfter: "/gambar/rumah-dinas-kini.jpg",
        mapCoords: { x: 61.0, y: 35.6 },
        roomNumber: 10,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: 0, yaw: 180, targetScene: "r01-gerbang", text: "Kembali ke Gerbang" }
        ]
      },
      "ruang-literasi": {
        id: "ruang-literasi",
        title: "Ruang Literasi & Diorama",
        panorama: "/gambar/ruang-literasi-360.jpg",
        historyDesc: "Ruang Literasi menyajikan informasi kesejarahan melalui poster dan berbagai gambar dari masa lalu. Disediakan juga miniatur dari bangunan benteng.",
        shortDesc: "Pusat informasi sejarah dengan miniatur dan poster masa lalu.",
        imgBefore: "/gambar/literasi-dulu.jpg",
        imgAfter: "/gambar/literasi-kini.jpg",
        mapCoords: { x: 19.6, y: 36.2 },
        roomNumber: 15,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: 0, yaw: 180, targetScene: "r01-gerbang", text: "Kembali ke Gerbang" }
        ]
      },
      "paardenstal": {
        id: "paardenstal",
        title: "Paardenstal (Kandang Kuda)",
        panorama: "/gambar/paardenstal-360.jpg",
        historyDesc: "Bangunan paardenstal berarti kandang kuda dan dalam penggunaannya juga dikenal sebagai tempat atau garasi kereta kuda. Terdapat dua paardenstal dengan lengkungan besar dan enam lengkungan kecil di sisi timur. Dibangun pada pembangunan tahap kedua, sepanjang tahun 1844-1848.",
        shortDesc: "Kandang dan garasi kereta kuda bergaya arsitektur sentrifugal.",
        imgBefore: "/gambar/paardenstal-dulu.jpg",
        imgAfter: "/gambar/paardenstal-kini.jpg",
        mapCoords: { x: 28.2, y: 22.1 },
        roomNumber: 5,
        infoHotspots: [],
        sceneHotspots: [
          { pitch: 0, yaw: 180, targetScene: "r01-gerbang", text: "Kembali ke Gerbang" }
        ]
      }
    }
  },
  {
    id: "candi-borobudur",
    title: "Candi Borobudur",
    category: "Candi",
    location: "Magelang, Jawa Tengah",
    thumbnail: "/gambar/candi-borobudur.jpg",
    isAvailable: false,
    gallery: [
      { src: "https://images.unsplash.com/photo-1596401057658-3e54589d972c?q=80&w=1200", thumb: "https://images.unsplash.com/photo-1596401057658-3e54589d972c?q=80&w=300", alt: "Candi Borobudur Pagi Hari" },
      { src: "https://images.unsplash.com/photo-1572111504021-40d998064a32?q=80&w=1200", thumb: "https://images.unsplash.com/photo-1572111504021-40d998064a32?q=80&w=300", alt: "Stupa Borobudur" }
    ],
    rooms: {}
  },
  {
    id: "keraton-kasunanan",
    title: "Keraton Kasunanan",
    category: "Keraton",
    location: "Surakarta, Jawa Tengah",
    thumbnail: "/gambar/keraton-kasunanan.jpg",
    isAvailable: false,
    rooms: {}
  },
  {
    id: "lawang-sewu",
    title: "Lawang Sewu",
    category: "Gedung",
    location: "Semarang, Jawa Tengah",
    thumbnail: "/gambar/lawang-sewu.jpg",
    isAvailable: false,
    rooms: {}
  },
  {
    id: "sam-poo-kong",
    title: "Kelenteng Sam Poo Kong",
    category: "Kelenteng",
    location: "Semarang, Jawa Tengah",
    thumbnail: "/gambar/sam-poo-kong.jpg",
    isAvailable: false,
    rooms: {}
  },
  {
    id: "vihara-watugong",
    title: "Vihara Buddhagaya Watugong",
    category: "Vihara",
    location: "Semarang, Jawa Tengah",
    thumbnail: "/gambar/vihara-watugong.jpg",
    isAvailable: false,
    rooms: {}
  },
  {
    id: "gedung-marba",
    title: "Gedung Marba",
    category: "Gedung",
    location: "Kota Lama Semarang",
    thumbnail: "/gambar/gedung-marba.jpg",
    isAvailable: false,
    rooms: {}
  }
];

export async function getHeritageSites(): Promise<HeritageSite[]> {
  return heritageSites;
}

export async function getSiteById(id: string): Promise<HeritageSite | null> {
  const site = heritageSites.find(s => s.id === id);
  return site || null;
}

export const tourData = heritageSites[0].rooms;
