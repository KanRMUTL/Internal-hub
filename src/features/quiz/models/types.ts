import { Timestamp } from 'firebase/firestore'

export type RoomStatus = 'waiting' | 'playing' | 'finished'
export type QuestionState = 'question' | 'result'

export interface QuizOption {
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  text: string
  imageUrl?: string
  timeLimit: number
  options: QuizOption[]
}

export interface QuizRoom {
  id: string
  hostId: string
  password: string
  status: RoomStatus
  currentQuestionIndex: number
  currentQuestionState: QuestionState
  createdAt: Timestamp
  questions: QuizQuestion[]
  startTime?: Timestamp // Time when the current question started
}

export interface PlayerAnswer {
  optionIndex: number
  time: number // Time taken to answer in seconds (or ms)
  correct: boolean
}

export interface QuizPlayer {
  id: string
  nickname: string
  score: number
  streak: number
  lastAnswerTime?: Timestamp
  answers: Record<string, PlayerAnswer> // Keyed by questionId
}
