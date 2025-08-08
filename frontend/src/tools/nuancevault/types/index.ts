export interface SimilarWordSet {
  _id?: string;
  words: string[]; // >=2
  definition: string;
  subtleDifference: string;
  exampleSentences: string[]; // 1-5
  createdAt?: string;
  updatedAt?: string;
}

export interface ImportResult {
  success: boolean;
  data?: SimilarWordSet[];
  errors?: { index: number; errors: string[] }[];
  message?: string;
}
