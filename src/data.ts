import { Chapter } from './types';

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Chương 1: Hello",
    description: "Học cách chào hỏi và giới thiệu tên của con qua tiếng Anh nhé!",
    emoji: "👋",
    videoUrl: "https://www.youtube.com/embed/gVIFEVLzRyI", // Hello Song
    speakingPrompt: "What's your name?",
    vocabulary: [
      { id: "c1-v1", english: "hello", vietnamese: "xin chào", emoji: "👋" },
      { id: "c1-v2", english: "hi", vietnamese: "chào", emoji: "😊" },
      { id: "c1-v3", english: "goodbye", vietnamese: "tạm biệt", emoji: "🙋" },
      { id: "c1-v4", english: "name", vietnamese: "tên", emoji: "🏷️" },
      { id: "c1-v5", english: "friend", vietnamese: "bạn", emoji: "🤝" }
    ],
    sentences: [
      { id: "c1-s1", english: "Hello. I'm Nam.", vietnamese: "Xin chào. Mình là Nam." },
      { id: "c1-s2", english: "What's your name?", vietnamese: "Tên của bạn là gì?" },
      { id: "c1-s3", english: "My name is Mai.", vietnamese: "Tên của mình là Mai." },
      { id: "c1-s4", english: "Goodbye. Friend.", vietnamese: "Tạm biệt nhé người bạn." }
    ],
    quizzes: [
      {
        id: "c1-q1",
        type: "vocab_select_meaning",
        question: "Từ 'goodbye' có nghĩa là gì?",
        options: ["Xin chào", "Tạm biệt", "Bạn bè", "Học sinh"],
        correctAnswer: "Tạm biệt"
      },
      {
        id: "c1-q2",
        type: "sentence_fill",
        question: "Điền từ còn thiếu: 'Hello. I ______ Nam.'",
        options: ["is", "are", "am", "your"],
        correctAnswer: "am"
      },
      {
        id: "c1-q3",
        type: "listen_select",
        question: "Bấm nút nghe bên dưới và chọn câu đúng nhất:",
        options: ["What's your name?", "My name is Mai.", "Hello. I'm Nam.", "Goodbye."],
        correctAnswer: "What's your name?",
        targetText: "What's your name?"
      },
      {
        id: "c1-q4",
        type: "sentence_fill",
        question: "Điền từ còn thiếu: 'My ______ is Mai.'",
        options: ["friend", "hello", "name", "goodbye"],
        correctAnswer: "name"
      }
    ]
  },
  {
    id: 2,
    title: "Chương 2: My School",
    description: "Nhận biết các đồ vật quen thuộc trong và ngoài lớp học của con.",
    emoji: "🎒",
    videoUrl: "https://www.youtube.com/embed/2_Y5SWe1XoM", // School Song
    speakingPrompt: "This is my school.",
    vocabulary: [
      { id: "c2-v1", english: "school", vietnamese: "trường học", emoji: "🏫" },
      { id: "c2-v2", english: "classroom", vietnamese: "lớp học", emoji: "📖" },
      { id: "c2-v3", english: "teacher", vietnamese: "giáo viên", emoji: "👩‍🏫" },
      { id: "c2-v4", english: "student", vietnamese: "học sinh", emoji: "🧑‍🎓" },
      { id: "c2-v5", english: "book", vietnamese: "quyển sách", emoji: "📚" },
      { id: "c2-v6", english: "pen", vietnamese: "cái bút", emoji: "🖊️" }
    ],
    sentences: [
      { id: "c2-s1", english: "This is my school.", vietnamese: "Đây là trường học của tớ." },
      { id: "c2-s2", english: "This is my classroom.", vietnamese: "Đây là lớp học của tớ." },
      { id: "c2-s3", english: "I have a book.", vietnamese: "Tớ có một quyển sách." },
      { id: "c2-s4", english: "I have a pen.", vietnamese: "Tớ có một cái bút." }
    ],
    quizzes: [
      {
        id: "c2-q1",
        type: "vocab_match",
        question: "Ghép từ 'teacher' với nghĩa đúng của nó:",
        options: ["Lớp học", "Học sinh", "Giáo viên", "Quyển sách"],
        correctAnswer: "Giáo viên"
      },
      {
        id: "c2-q2",
        type: "vocab_select_image",
        question: "Chọn từ tiếng Anh đúng của hình ảnh này: 📚",
        options: ["school", "book", "pen", "student"],
        correctAnswer: "book"
      },
      {
        id: "c2-q3",
        type: "sentence_fill",
        question: "Điền từ thích hợp: 'This ______ my classroom.'",
        options: ["am", "are", "is", "have"],
        correctAnswer: "is"
      },
      {
        id: "c2-q4",
        type: "sentence_fill",
        question: "Điền từ thích hợp để nói 'Tớ có một cái bút': 'I ______ a pen.'",
        options: ["is", "has", "have", "classroom"],
        correctAnswer: "have"
      }
    ]
  },
  {
    id: 3,
    title: "Chương 3: My Family",
    description: "Giới thiệu những người thân yêu tuyệt vời nhất trong gia đình nhé!",
    emoji: "🏠",
    videoUrl: "https://www.youtube.com/embed/d_WQEw13TCo", // Family Song
    speakingPrompt: "This is my mother.",
    vocabulary: [
      { id: "c3-v1", english: "father", vietnamese: "bố", emoji: "👨" },
      { id: "c3-v2", english: "mother", vietnamese: "mẹ", emoji: "👩" },
      { id: "c3-v3", english: "brother", vietnamese: "anh/em trai", emoji: "👦" },
      { id: "c3-v4", english: "sister", vietnamese: "chị/em gái", emoji: "👧" },
      { id: "c3-v5", english: "grandmother", vietnamese: "bà", emoji: "👵" },
      { id: "c3-v6", english: "grandfather", vietnamese: "ông", emoji: "👴" }
    ],
    sentences: [
      { id: "c3-s1", english: "This is my father.", vietnamese: "Đây là bố của tớ." },
      { id: "c3-s2", english: "This is my mother.", vietnamese: "Đây là mẹ của tớ." },
      { id: "c3-s3", english: "This is my brother.", vietnamese: "Đây là anh/em trai của tớ." },
      { id: "c3-s4", english: "This is my sister.", vietnamese: "Đây là chị/em gái của tớ." }
    ],
    quizzes: [
      {
        id: "c3-q1",
        type: "vocab_select_meaning",
        question: "Từ nào dưới đây có nghĩa là 'mẹ'?",
        options: ["father", "sister", "mother", "grandmother"],
        correctAnswer: "mother"
      },
      {
        id: "c3-q2",
        type: "sentence_arrange",
        question: "Sắp xếp các từ sau thành câu đúng: [my] [This] [is] [brother]",
        options: ["This my is brother", "This is my brother", "Brother is my This", "is This my brother"],
        correctAnswer: "This is my brother"
      },
      {
        id: "c3-q3",
        type: "vocab_select_image",
        question: "Chọn câu đúng nhất khớp với hình ảnh: 👵 (bà)",
        options: ["This is my grandfather.", "This is my grandmother.", "This is my father.", "This is my sister."],
        correctAnswer: "This is my grandmother."
      },
      {
        id: "c3-q4",
        type: "sentence_fill",
        question: "Điền vào chỗ trống: 'This is ______ father.' (bố của tớ)",
        options: ["I", "me", "my", "you"],
        correctAnswer: "my"
      }
    ]
  },
  {
    id: 4,
    title: "Chương 4: Colours and Toys",
    description: "Khám phá sắc cầu vồng rực rỡ và các món đồ chơi đáng yêu thôi nào!",
    emoji: "🎨",
    videoUrl: "https://www.youtube.com/embed/xNfB6XvD_hE", // Colors and Toys
    speakingPrompt: "What colour is it?",
    vocabulary: [
      { id: "c4-v1", english: "red", vietnamese: "màu đỏ", emoji: "🔴" },
      { id: "c4-v2", english: "blue", vietnamese: "màu xanh dương", emoji: "🔵" },
      { id: "c4-v3", english: "yellow", vietnamese: "màu vàng", emoji: "🟡" },
      { id: "c4-v4", english: "green", vietnamese: "màu xanh lá", emoji: "🟢" },
      { id: "c4-v5", english: "ball", vietnamese: "quả bóng", emoji: "⚽" },
      { id: "c4-v6", english: "doll", vietnamese: "búp bê", emoji: "🧸" },
      { id: "c4-v7", english: "car", vietnamese: "ô tô đồ chơi", emoji: "🚗" },
      { id: "c4-v8", english: "kite", vietnamese: "con diều", emoji: "🪁" }
    ],
    sentences: [
      { id: "c4-s1", english: "What colour is it?", vietnamese: "Nó là màu gì thế?" },
      { id: "c4-s2", english: "It's red.", vietnamese: "Nó màu đỏ." },
      { id: "c4-s3", english: "I have a ball.", vietnamese: "Tớ có một quả bóng." },
      { id: "c4-s4", english: "I have a kite.", vietnamese: "Tớ có một con diều." }
    ],
    quizzes: [
      {
        id: "c4-q1",
        type: "vocab_select_meaning",
        question: "Từ 'blue' biểu thị màu nào sau đây?",
        options: ["Màu đỏ", "Màu xanh lá", "Màu xanh dương", "Màu vàng"],
        correctAnswer: "Màu xanh dương"
      },
      {
        id: "c4-q2",
        type: "vocab_select_image",
        question: "Từ nào tương ứng với hình đồ chơi: 🪁",
        options: ["ball", "doll", "car", "kite"],
        correctAnswer: "kite"
      },
      {
        id: "c4-q3",
        type: "sentence_fill",
        question: "Điền từ thích hợp để tạo câu: '______ colour is it?' (Nó có màu gì?)",
        options: ["What", "How", "Who", "Where"],
        correctAnswer: "What"
      },
      {
        id: "c4-q4",
        type: "sentence_fill",
        question: "Điền từ: 'I have a ______' (Tớ có một ô tô đồ chơi)",
        options: ["ball", "doll", "car", "kite"],
        correctAnswer: "car"
      }
    ]
  },
  {
    id: 5,
    title: "Chương 5: Animals and Likes",
    description: "Làm quen với các bạn thú cưng dễ thương và học cách bày tỏ ý thích nhé!",
    emoji: "🦁",
    videoUrl: "https://www.youtube.com/embed/wCfWmlnJl-A", // Animals song
    speakingPrompt: "I like cats.",
    vocabulary: [
      { id: "c5-v1", english: "cat", vietnamese: "con mèo", emoji: "🐱" },
      { id: "c5-v2", english: "dog", vietnamese: "con chó", emoji: "🐶" },
      { id: "c5-v3", english: "bird", vietnamese: "con chim", emoji: "🐦" },
      { id: "c5-v4", english: "fish", vietnamese: "con cá", emoji: "🐟" },
      { id: "c5-v5", english: "rabbit", vietnamese: "con thỏ", emoji: "🐰" },
      { id: "c5-v6", english: "like", vietnamese: "thích", emoji: "❤️" }
    ],
    sentences: [
      { id: "c5-s1", english: "I like cats.", vietnamese: "Tớ thích những chú mèo." },
      { id: "c5-s2", english: "I like dogs.", vietnamese: "Tớ thích những chú chó." },
      { id: "c5-s3", english: "Do you like birds?", vietnamese: "Cậu có thích chim không?" },
      { id: "c5-s4", english: "Yes, I do.", vietnamese: "Có, tớ thích." },
      { id: "c5-s5", english: "No, I don't.", vietnamese: "Không, tớ không thích." }
    ],
    quizzes: [
      {
        id: "c5-q1",
        type: "vocab_select_meaning",
        question: "Từ 'rabbit' biểu thị con vật nào dưới đây?",
        options: ["Con chim", "Con chó", "Con cá", "Con thỏ"],
        correctAnswer: "Con thỏ"
      },
      {
        id: "c5-q2",
        type: "vocab_select_image",
        question: "Từ tiếng Anh nào phù hợp với hình: 🐟",
        options: ["cat", "dog", "bird", "fish"],
        correctAnswer: "fish"
      },
      {
        id: "c5-q3",
        type: "sentence_fill",
        question: "Hoàn thiện câu hỏi: '______ you like birds?'",
        options: ["Are", "Do", "Does", "Is"],
        correctAnswer: "Do"
      },
      {
        id: "c5-q4",
        type: "sentence_fill",
        question: "Trả lời câu hỏi: 'Do you like birds?' - 'Yes, I ______.'",
        options: ["do", "don't", "like", "am"],
        correctAnswer: "do"
      }
    ]
  }
];
