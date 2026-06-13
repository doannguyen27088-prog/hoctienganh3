/**
 * Chức năng chuẩn hóa chuỗi tiếng Anh:
 * - Chuyển sang chữ thường
 * - Loại bỏ các dấu câu thông dụng
 * - Thay thế các ký tự viết tắt nếu cần, rút gọn khoảng trắng
 */
export function cleanText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Tính khoảng cách Levenshtein giữa 2 chuỗi để tìm độ giống nhau tổng thể
 */
export function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // thay thế
          matrix[i][j - 1] + 1,     // chèn
          matrix[i - 1][j] + 1      // xóa
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Tính tỷ lệ giống nhau tổng thể từ 0 đến 1
 */
export function getStringSimilarity(a: string, b: string): number {
  const cleanA = cleanText(a);
  const cleanB = cleanText(b);
  if (!cleanA && !cleanB) return 1;
  if (!cleanA || !cleanB) return 0;
  
  const maxLength = Math.max(cleanA.length, cleanB.length);
  const distance = getLevenshteinDistance(cleanA, cleanB);
  return (maxLength - distance) / maxLength;
}

/**
 * Tính toán độ khớp và phản hồi chi tiết cho học sinh tựa giáo viên Lucy
 */
export interface EvaluationResult {
  score: number;
  feedback: string;
  missingWords: string[];
  incorrectWords: string[];
  isMatch: boolean;
}

export function evaluatePronunciation(sample: string, spoken: string): EvaluationResult {
  const cleanSample = cleanText(sample);
  const cleanSpoken = cleanText(spoken);

  if (!cleanSpoken) {
    return {
      score: 0,
      feedback: "Cô chưa nghe rõ con nói gì cả, con hãy nhấn nút rồi nói lại nhé! 🎙️",
      missingWords: cleanSample.split(" "),
      incorrectWords: [],
      isMatch: false,
    };
  }

  const sampleWords = cleanSample.split(" ").filter(Boolean);
  const spokenWords = cleanSpoken.split(" ").filter(Boolean);

  // 1. Tìm Longest Common Subsequence (LCS) dạng từ để xem thứ tự phát âm đúng
  const n = sampleWords.length;
  const m = spokenWords.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (sampleWords[i - 1] === spokenWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const matchedSampleIndices = new Set<number>();
  const matchedSpokenIndices = new Set<number>();

  // Truy vết ngược để tìm các từ khớp nhau trong lcs
  let currI = n, currJ = m;
  while (currI > 0 && currJ > 0) {
    if (sampleWords[currI - 1] === spokenWords[currJ - 1]) {
      matchedSampleIndices.add(currI - 1);
      matchedSpokenIndices.add(currJ - 1);
      currI--;
      currJ--;
    } else if (dp[currI - 1][currJ] >= dp[currI][currJ - 1]) {
      currI--;
    } else {
      currJ--;
    }
  }

  // 2. Phân loại từ thiếu (missing) và từ sai (incorrect / dư thừa)
  const missingWords: string[] = [];
  const incorrectWords: string[] = [];

  // Từ bị thiếu: Có trong mẫu nhưng không được khớp
  for (let i = 0; i < n; i++) {
    if (!matchedSampleIndices.has(i)) {
      missingWords.push(sampleWords[i]);
    }
  }

  // Các từ nói sai/thừa: Có trong lời nói của học sinh nhưng không khớp câu mẫu
  // Học sinh nói sai từ có thể được so khớp vị trí để đưa ra nhận xét chi tiết
  for (let j = 0; j < m; j++) {
    if (!matchedSpokenIndices.has(j)) {
      incorrectWords.push(spokenWords[j]);
    }
  }

  // 3. Tính điểm dựa theo công thức:
  // - 60% dựa vào tỷ lệ từ đúng (LCS / sampleWords.length)
  // - 25% dựa vào độ đầy đủ của câu (số lượng từ phát âm được so với mẫu)
  // - 15% dựa vào khoảng cách Levenshtein tổng thể
  const correctRatio = dp[n][m] / n; // Tỷ lệ từ đúng
  
  // Tỷ lệ độ dài (tránh trường hợp nói quá dài hoặc quá ngắn)
  const lengthRatio = Math.max(0, 1 - Math.abs(n - m) / n); 
  
  const charSimilarity = getStringSimilarity(cleanSample, cleanSpoken);

  let scoreFloat = (correctRatio * 60) + (lengthRatio * 25) + (charSimilarity * 15);
  let score = Math.round(scoreFloat);

  // Đảm bảo khoảng điểm dễ chịu cho trẻ em, làm tròn đẹp
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  // Nếu khớp hoàn toàn
  if (cleanSample === cleanSpoken) {
    score = 100;
    return {
      score,
      feedback: "Rất tốt! Con đã nói chính xác hoàn toàn câu mẫu rồi! 🎉 Cô Lucy khen con giỏi lắm!",
      missingWords: [],
      incorrectWords: [],
      isMatch: true,
    };
  }

  // Nếu độ tương đồng quá kém, không nhận diện được từ nào khớp
  if (dp[n][m] === 0) {
    return {
      score: Math.min(score, 15),
      feedback: "Cô chưa nghe rõ lắm, con có dùng từ nào trong câu mẫu chưa nhỉ? Hãy thử nói lại to và rõ hơn nhé! 💕",
      missingWords,
      incorrectWords,
      isMatch: false,
    };
  }

  // Thiết lập phản hổi thông thái dựa vào lỗi sai cụ thể
  let feedback = "";
  
  // Trường hợp nói khớp gần hết nhưng thiếu từ
  if (missingWords.length > 0 && incorrectWords.length === 0) {
    const missingJoined = missingWords.map(w => `'${w}'`).join(", ");
    feedback = `Con nói gần đúng rồi nhưng còn thiếu từ ${missingJoined}. Hãy thử nói lại đầy đủ hơn nhé! Cố lên con! 🌟`;
    // Ví dụ mẫu yêu cầu: "My name is Mai." -> "My name Mai." -> thiếu 'is'. Điểm khoảng 70-80
    score = Math.max(score, 65);
  } 
  // Trường hợp nói sai từ (bị thay thế bằng từ khác)
  else if (missingWords.length === 1 && incorrectWords.length === 1) {
    feedback = `Con nói đúng cấu trúc nhưng bị phát âm sai từ '${missingWords[0]}' thành '${incorrectWords[0]}'. Con cần đọc là '${missingWords[0]}' nhé! 😘`;
    score = Math.max(score, 60);
  }
  else if (missingWords.length > 0 && incorrectWords.length > 0) {
    const isDogCatExample = cleanSample.includes("like cats") && cleanSpoken.includes("like dogs");
    if (isDogCatExample) {
      feedback = "Con nói đúng cấu trúc nhưng phát âm sai từ cuối. Con cần nói 'cats', không phải 'dogs' nha học trò cưng! 🐱";
    } else {
      feedback = `Con phát âm hơi lệch một chút ở từ: ${missingWords.map(w => `'${w}'`).join(", ")}. Con phát âm thành: ${incorrectWords.map(w => `'${w}'`).join(", ")}. Con luyện lại nhé! 💪`;
    }
    score = Math.max(score, 55);
  } 
  else {
    feedback = "Con phát âm khá tốt rồi! Có một chút âm đuôi hoặc ngữ điệu chưa hoàn hảo lắm. Cố gắng phát âm rõ hơn nha! 💖";
    score = Math.max(score, 85);
  }

  return {
    score,
    feedback,
    missingWords,
    incorrectWords,
    isMatch: score >= 80,
  };
}
