export interface Election {
  id: number; // 12
  results: number[]; // [0, 0, 0, 0, 5, 7, 2]
  voted: boolean; // [12]
}

export interface ElectionVote {
  id: number;
  vote: number;
}

export interface Voter {
  id: string; // 0xJHSADJH5412SXD
  voted: number[]; // [12]
}
