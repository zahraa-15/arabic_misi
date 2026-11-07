export type Skill = "listening" | "speaking" | "reading" | "writing";
export type Activity = {
  id: string;
  type:
    | "choice"
    | "boolean"
    | "match"
    | "letters"
    | "order"
    | "fill"
    | "text"
    | "speak"
    | "free";
  prompt: string;
  options?: string[];
  answer?: string;
  accepted?: string[];
  pairs?: [string, string][];
  audio?: string;
  passage?: string;
  explanation: string;
  rubric?: string[];
};
export type Mission = {
  id: string;
  title: string;
  arabic: string;
  skill: Skill;
  minutes: number;
  objective: string;
  lesson: string;
  example: string;
  translation: string;
  activities: Activity[];
};
export const vocabulary = [
  ["اِسْمِي", "Nama saya", "ismī"],
  ["أَنَا", "Saya", "anā"],
  ["طَالِبٌ", "Siswa laki-laki", "ṭālib"],
  ["طَالِبَةٌ", "Siswa perempuan", "ṭālibah"],
  ["مَدْرَسَةٌ", "Sekolah", "madrasah"],
  ["أَدْرُسُ", "Saya belajar", "adrusu"],
  ["مِنْ", "Dari", "min"],
  ["أَيْنَ", "Di mana / dari mana (dengan مِنْ)", "ayna"],
  ["مَا", "Apa", "mā"],
  ["فِي", "Di / di dalam", "fī"],
  ["أَنْتَ", "Kamu (laki-laki)", "anta"],
  ["أَنْتِ", "Kamu (perempuan)", "anti"],
];
export const dialog =
  "مَرْحَبًا. اِسْمِي أَحْمَدُ. أَنَا طَالِبٌ. أَنَا مِنْ إِنْدُونِيسِيَا. مَا اسْمُكَ؟ اِسْمِي عَلِيٌّ. أَنَا طَالِبٌ أَيْضًا.";
export const reading =
  "اِسْمِي فَاطِمَةُ. أَنَا طَالِبَةٌ. أَنَا مِنْ إِنْدُونِيسِيَا. أَدْرُسُ فِي مَدْرَسَةٍ. صَدِيقَتِي مَرْيَمُ طَالِبَةٌ أَيْضًا.";
export const missions: Mission[] = [
  {
    id: "listening",
    title: "Salam, teman baru!",
    arabic: "الاستماع",
    skill: "listening",
    minutes: 10,
    objective: "Mengenali nama, asal, dan status pelajar dari dialog pendek.",
    lesson:
      "Dengarkan dialog dua siswa. مَا اسْمُكَ؟ berarti “Siapa namamu?” untuk laki-laki. Untuk perempuan: مَا اسْمُكِ؟. Putar ulang dan perhatikan kata اِسْمِي serta مِنْ.",
    example: dialog,
    translation:
      "Halo. Nama saya Ahmad. Saya seorang siswa. Saya dari Indonesia. Siapa namamu? Nama saya Ali. Saya juga seorang siswa.",
    activities: [
      {
        id: "l1",
        type: "choice",
        prompt: "Dengarkan. Siapa nama pembicara pertama?",
        audio: dialog,
        options: ["Ahmad", "Ali", "Maryam"],
        answer: "Ahmad",
        explanation:
          "Pembicara pertama mengatakan اِسْمِي أَحْمَدُ (nama saya Ahmad).",
      },
      {
        id: "l2",
        type: "choice",
        prompt: "Dari negara mana pembicara berasal?",
        audio: "أَنَا مِنْ إِنْدُونِيسِيَا.",
        options: ["Mesir", "Indonesia", "Arab Saudi"],
        answer: "Indonesia",
        explanation: "مِنْ إِنْدُونِيسِيَا berarti dari Indonesia.",
      },
      {
        id: "l3",
        type: "boolean",
        prompt: "Kalimat yang kamu dengar berarti “Saya seorang siswi”.",
        audio: "أَنَا طَالِبٌ.",
        options: ["Benar", "Salah"],
        answer: "Salah",
        explanation: "طَالِبٌ adalah siswa laki-laki; طَالِبَةٌ adalah siswi.",
      },
      {
        id: "l4",
        type: "match",
        prompt: "Dengarkan, lalu cocokkan kosakata dengan maknanya.",
        audio: "اِسْمِي. أَنَا. طَالِبٌ.",
        pairs: [
          ["اِسْمِي", "Nama saya"],
          ["أَنَا", "Saya"],
          ["طَالِبٌ", "Siswa laki-laki"],
        ],
        explanation:
          "اِسْمِي = nama saya; أَنَا = saya; طَالِبٌ = siswa laki-laki.",
      },
      {
        id: "l5",
        type: "choice",
        prompt: "Apa makna pertanyaan yang kamu dengar?",
        audio: "مَا اسْمُكَ؟",
        options: ["Dari mana kamu?", "Siapa namamu?", "Di mana sekolahmu?"],
        answer: "Siapa namamu?",
        explanation:
          "مَا اسْمُكَ؟ digunakan untuk menanyakan nama kepada laki-laki.",
      },
    ],
  },
  {
    id: "speaking",
    title: "Ceritakan tentang dirimu",
    arabic: "الكلام",
    skill: "speaking",
    minutes: 12,
    objective:
      "Mengucapkan salam, nama, status pelajar, dan asal dalam perkenalan singkat.",
    lesson:
      "Ucapkan perlahan: marḥaban, ismī…, anā ṭālib / ṭālibah. Vokal ā dan ī dibaca panjang. Huruf ح dibunyikan dari tenggorokan tanpa berlebihan. Rekaman bersifat opsional; latihan ini dinilai mandiri, bukan oleh AI.",
    example:
      "مَرْحَبًا. اِسْمِي عَلِيٌّ. أَنَا طَالِبٌ. أَنَا مِنْ إِنْدُونِيسِيَا.",
    translation:
      "Halo. Nama saya Ali. Saya seorang siswa. Saya dari Indonesia.",
    activities: [
      {
        id: "s1",
        type: "speak",
        prompt: "Ucapkan salam dan nama kamu dua kali.",
        audio: "مَرْحَبًا. اِسْمِي عَلِيٌّ.",
        rubric: [
          "Saya sudah mengucapkan salam dengan suara.",
          "Saya sudah mengganti Ali dengan nama saya dan mengulang dua kali.",
        ],
        explanation:
          "Contoh: مَرْحَبًا. اِسْمِي عَلِيٌّ. Nilai aktivitas ini adalah penilaian mandiri.",
      },
      {
        id: "s2",
        type: "choice",
        prompt: "Kamu menyapa seorang siswi. Pilih pertanyaan yang tepat.",
        options: ["مَا اسْمُكَ؟", "مَا اسْمُكِ؟", "اِسْمِي عَلِيٌّ."],
        answer: "مَا اسْمُكِ؟",
        explanation:
          "Akhiran ـكِ (ki) ditujukan kepada perempuan; ـكَ (ka) kepada laki-laki.",
      },
      {
        id: "s3",
        type: "speak",
        prompt: "Perkenalkan status pelajarmu. Pilih bentuk yang sesuai.",
        audio: "أَنَا طَالِبٌ. أَنَا طَالِبَةٌ.",
        rubric: [
          "Saya sudah mengucapkan أَنَا طَالِبٌ atau أَنَا طَالِبَةٌ.",
          "Saya sudah mengulang dan memperhatikan vokal panjang pada طَالِب.",
        ],
        explanation:
          "Gunakan طَالِبٌ untuk laki-laki dan طَالِبَةٌ untuk perempuan.",
      },
      {
        id: "s4",
        type: "speak",
        prompt:
          "Latih dialog: مِنْ أَيْنَ أَنْتَ؟ Jawab bahwa kamu dari Indonesia.",
        audio: "مِنْ أَيْنَ أَنْتَ؟ أَنَا مِنْ إِنْدُونِيسِيَا.",
        rubric: [
          "Saya sudah mengucapkan pertanyaan dan jawabannya.",
          "Saya sudah membandingkan dengan contoh atau panduan teks.",
        ],
        explanation:
          "Jawaban: أَنَا مِنْ إِنْدُونِيسِيَا. Untuk lawan bicara perempuan, gunakan أَنْتِ.",
      },
      {
        id: "s5",
        type: "speak",
        prompt:
          "Sampaikan perkenalan lengkap (salam, nama, status, asal). Rekam bila mikrofon tersedia.",
        rubric: [
          "Saya sudah berbicara dengan menyebut keempat unsur.",
          "Saya sudah mendengarkan rekaman atau mengulang sambil memeriksa contoh.",
          "Saya mengetahui bagian yang perlu saya latih kembali.",
        ],
        explanation:
          "Keberanian dan refleksi dihargai. Tidak ada penilaian otomatis terhadap ketepatan pelafalan.",
      },
    ],
  },
  {
    id: "reading",
    title: "Berkenalan dengan Fatimah",
    arabic: "القراءة",
    skill: "reading",
    minutes: 10,
    objective:
      "Menemukan informasi tersurat tentang identitas dan teman dalam teks.",
    lesson:
      "Baca teks dari kanan ke kiri. Temukan informasi setelah اِسْمِي dan مِنْ. صَدِيقَتِي berarti teman perempuan saya, dan أَيْضًا berarti juga.",
    example: reading,
    translation:
      "Nama saya Fatimah. Saya seorang siswi. Saya dari Indonesia. Saya belajar di sebuah sekolah. Teman perempuan saya, Maryam, juga seorang siswi.",
    activities: [
      {
        id: "r1",
        type: "choice",
        prompt: "Siapa tokoh yang memperkenalkan dirinya?",
        passage: reading,
        options: ["Maryam", "Fatimah", "Ahmad"],
        answer: "Fatimah",
        explanation: "Kalimat pertama berbunyi اِسْمِي فَاطِمَةُ.",
      },
      {
        id: "r2",
        type: "boolean",
        prompt: "Fatimah berasal dari Indonesia.",
        passage: reading,
        options: ["Benar", "Salah"],
        answer: "Benar",
        explanation: "Teks menyebut أَنَا مِنْ إِنْدُونِيسِيَا.",
      },
      {
        id: "r3",
        type: "choice",
        prompt: "Di mana Fatimah belajar?",
        passage: reading,
        options: ["Di sekolah", "Di pasar", "Di rumah sakit"],
        answer: "Di sekolah",
        explanation:
          "أَدْرُسُ فِي مَدْرَسَةٍ berarti saya belajar di sebuah sekolah.",
      },
      {
        id: "r4",
        type: "match",
        prompt: "Cocokkan kata dari bacaan.",
        pairs: [
          ["صَدِيقَتِي", "Teman perempuan saya"],
          ["أَيْضًا", "Juga"],
          ["أَدْرُسُ", "Saya belajar"],
        ],
        explanation:
          "Ketiga kata ini membantu memahami hubungan dan kegiatan tokoh.",
      },
      {
        id: "r5",
        type: "text",
        prompt: "Tulis nama teman Fatimah dalam huruf Arab (satu kata).",
        passage: reading,
        answer: "مريم",
        explanation:
          "Teman Fatimah adalah مَرْيَمُ. Harakat boleh ditulis atau dihilangkan.",
      },
    ],
  },
  {
    id: "writing",
    title: "Perkenalan pertamaku",
    arabic: "الكتابة",
    skill: "writing",
    minutes: 15,
    objective:
      "Menyusun kata dan menulis perkenalan singkat dengan pola dasar.",
    lesson:
      "Bahasa Arab ditulis dari kanan ke kiri. Pola أَنَا + identitas tidak membutuhkan kata “adalah”. Pada أَدْرُسُ فِي مَدْرَسَةٍ, akhiran مَدْرَسَةٍ berubah setelah فِي. Tulisan tanpa harakat diterima untuk jawaban berkunci.",
    example: "اِسْمِي مَرْيَمُ. أَنَا طَالِبَةٌ. أَدْرُسُ فِي مَدْرَسَةٍ.",
    translation:
      "Nama saya Maryam. Saya seorang siswi. Saya belajar di sebuah sekolah.",
    activities: [
      {
        id: "w1",
        type: "letters",
        prompt: "Susun huruf menjadi kata “siswa laki-laki” (tanpa harakat).",
        options: ["ل", "ب", "ط", "ا"],
        answer: "طالب",
        explanation: "Urutan huruf dari kanan ke kiri: ط + ا + ل + ب = طالب.",
      },
      {
        id: "w2",
        type: "order",
        prompt: "Susun kalimat: “Saya dari Indonesia”.",
        options: ["إِنْدُونِيسِيَا", "أَنَا", "مِنْ"],
        answer: "أَنَا مِنْ إِنْدُونِيسِيَا",
        explanation: "Pola: أَنَا (saya) + مِنْ (dari) + nama negara.",
      },
      {
        id: "w3",
        type: "fill",
        prompt: "Lengkapi dengan satu kata: أَنَا ____ . (Saya seorang siswi.)",
        answer: "طالبة",
        explanation: "طَالِبَةٌ adalah bentuk perempuan dari طَالِبٌ.",
      },
      {
        id: "w4",
        type: "text",
        prompt: "Tulis dalam bahasa Arab: “Nama saya Ali”.",
        answer: "اسمي علي",
        explanation:
          "اِسْمِي عَلِيٌّ. Harakat, tanda baca akhir, dan spasi berlebih diabaikan.",
      },
      {
        id: "w5",
        type: "free",
        prompt:
          "Tulis 3–4 kalimat perkenalan dirimu dalam bahasa Arab. Gunakan papan huruf bila perlu.",
        rubric: [
          "Saya menyebut nama dengan اِسْمِي.",
          "Saya menyebut status dengan أَنَا طَالِبٌ / طَالِبَةٌ.",
          "Saya menyebut asal dengan أَنَا مِنْ.",
          "Saya sudah membandingkan tulisan saya dengan contoh.",
        ],
        explanation:
          "Contoh: اِسْمِي عَلِيٌّ. أَنَا طَالِبٌ. أَنَا مِنْ إِنْدُونِيسِيَا. Nama dan asal boleh berbeda. Ini refleksi mandiri, bukan penilaian tata bahasa otomatis.",
      },
    ],
  },
  {
    id: "final",
    title: "Misi akhir: Ini aku!",
    arabic: "التقييم",
    skill: "writing",
    minutes: 12,
    objective:
      "Menggabungkan menyimak, berbicara, membaca, dan menulis untuk memperkenalkan diri.",
    lesson:
      "Gunakan semua pola yang telah kamu pelajari. Ada lima aktivitas. Selesaikan minimal 4 dari 5 dengan benar; aktivitas berbicara dan menulis bebas juga wajib dipenuhi untuk lulus.",
    example:
      "مَا اسْمُكِ؟ اِسْمِي مَرْيَمُ. مِنْ أَيْنَ أَنْتِ؟ أَنَا مِنْ إِنْدُونِيسِيَا.",
    translation:
      "Siapa namamu? Nama saya Maryam. Dari mana kamu? Saya dari Indonesia.",
    activities: [
      {
        id: "f1",
        type: "choice",
        prompt: "Dengarkan: siapa nama siswi ini?",
        audio: "مَرْحَبًا. اِسْمِي مَرْيَمُ. أَنَا طَالِبَةٌ.",
        options: ["Fatimah", "Maryam", "Ali"],
        answer: "Maryam",
        explanation: "Ia mengatakan اِسْمِي مَرْيَمُ.",
      },
      {
        id: "f2",
        type: "speak",
        prompt: "Jawab dengan suara: مَا اسْمُكَ؟ atau مَا اسْمُكِ؟",
        rubric: [
          "Saya sudah menjawab dengan اِسْمِي diikuti nama saya.",
          "Saya sudah mengulang dengan suara jelas.",
        ],
        explanation:
          "Gunakan nama sendiri. Aktivitas berbicara dinilai mandiri.",
      },
      {
        id: "f3",
        type: "boolean",
        prompt: "Ali adalah seorang siswa.",
        passage: "اِسْمِي عَلِيٌّ. أَنَا طَالِبٌ. أَدْرُسُ فِي مَدْرَسَةٍ.",
        options: ["Benar", "Salah"],
        answer: "Benar",
        explanation: "Ali mengatakan أَنَا طَالِبٌ.",
      },
      {
        id: "f4",
        type: "order",
        prompt: "Susun: “Saya belajar di sebuah sekolah”.",
        options: ["مَدْرَسَةٍ", "فِي", "أَدْرُسُ"],
        answer: "أَدْرُسُ فِي مَدْرَسَةٍ",
        explanation:
          "Kata kerja أَدْرُسُ diikuti keterangan tempat فِي مَدْرَسَةٍ.",
      },
      {
        id: "f5",
        type: "free",
        prompt:
          "Tulis perkenalan lengkap: nama, status pelajar, dan asal. Periksa sendiri menggunakan rubrik.",
        rubric: [
          "Nama saya ditulis setelah اِسْمِي.",
          "Saya memilih طَالِبٌ atau طَالِبَةٌ yang sesuai.",
          "Saya menulis asal dengan أَنَا مِنْ.",
          "Saya sudah membaca kembali seluruh kalimat.",
        ],
        explanation:
          "Contoh: اِسْمِي مَرْيَمُ. أَنَا طَالِبَةٌ. أَنَا مِنْ إِنْدُونِيسِيَا. Variasi nama dan asal diterima melalui penilaian mandiri.",
      },
    ],
  },
];
export const themes = [
  ["التعارف", "Perkenalan", "Langkah pertama untuk saling mengenal."],
  ["الأسرة", "Keluarga", "Kenali orang-orang terdekatmu."],
  ["المدرسة", "Sekolah", "Jelajahi kehidupan di sekolah."],
  ["الهوايات", "Hobi", "Ceritakan hal yang kamu sukai."],
  ["الحياة اليومية", "Kehidupan sehari-hari", "Bahasa Arab dalam keseharian."],
  ["الطعام والشراب", "Makanan dan minuman", "Temukan rasa dan kosakata baru."],
  ["الأماكن", "Tempat-tempat", "Berkeliling dan mengenal tempat."],
  [
    "الوقت والأنشطة",
    "Waktu dan kegiatan",
    "Atur waktumu, ceritakan kegiatanmu.",
  ],
];
export const skillNames: Record<Skill, string> = {
  listening: "Menyimak",
  speaking: "Berbicara",
  reading: "Membaca",
  writing: "Menulis",
};
export const levels = [
  { name: "Arabic Explorer", xp: 0 },
  { name: "Word Hunter", xp: 80 },
  { name: "Sentence Builder", xp: 160 },
  { name: "Arabic Communicator", xp: 260 },
  { name: "Mission Master", xp: 350 },
];
export const badgeDefs = [
  { id: "first", name: "First Mission", criterion: "Lulus satu misi." },
  {
    id: "listening",
    name: "Listening Hero",
    criterion: "Lulus misi Menyimak.",
  },
  {
    id: "speaking",
    name: "Brave Speaker",
    criterion: "Lulus misi Berbicara, termasuk seluruh refleksi lisan.",
  },
  { id: "reading", name: "Reading Star", criterion: "Lulus misi Membaca." },
  {
    id: "writing",
    name: "Writing Wizard",
    criterion: "Lulus misi Menulis, termasuk tulisan bebas.",
  },
  {
    id: "master",
    name: "Mission Master",
    criterion: "Lulus empat misi dan evaluasi akhir.",
  },
];
