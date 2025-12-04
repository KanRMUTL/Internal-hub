import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  increment,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { db } from 'shared/config/firebase'
import { QuizRoom, QuizPlayer, PlayerAnswer, RoomStatus } from '../models/types'
import { ROOMS_COLLECTION, PLAYERS_SUBCOLLECTION } from '../config/constant'

export const QuizService = {
  // Create a new room
  async createRoom(hostId: string, password: string, questions: any[]): Promise<string> {
    const roomRef = doc(collection(db, ROOMS_COLLECTION))
    const roomId = roomRef.id

    const roomData: Omit<QuizRoom, 'id'> = {
      hostId,
      password,
      status: 'waiting',
      currentQuestionIndex: 0,
      currentQuestionState: 'question',
      createdAt: serverTimestamp() as Timestamp,
      questions,
    }

    await setDoc(roomRef, roomData)
    return roomId
  },

  // Join a room
  async joinRoom(roomId: string, player: Omit<QuizPlayer, 'score' | 'streak' | 'answers'>): Promise<void> {
    const playerRef = doc(db, ROOMS_COLLECTION, roomId, PLAYERS_SUBCOLLECTION, player.id)

    // Check if player already exists to avoid resetting score if re-joining
    const playerSnap = await getDoc(playerRef)

    if (!playerSnap.exists()) {
      await setDoc(playerRef, {
        ...player,
        score: 0,
        streak: 0,
        answers: {},
      })
    }
  },

  // Subscribe to room updates
  subscribeToRoom(roomId: string, callback: (room: QuizRoom | null) => void) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId)
    return onSnapshot(roomRef, (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as QuizRoom)
      } else {
        callback(null)
      }
    })
  },

  // Subscribe to players in a room
  subscribeToPlayers(roomId: string, callback: (players: QuizPlayer[]) => void) {
    const playersRef = collection(db, ROOMS_COLLECTION, roomId, PLAYERS_SUBCOLLECTION)
    return onSnapshot(playersRef, (snap) => {
      const players = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as QuizPlayer)
      callback(players)
    })
  },

  // Subscribe to a single player
  subscribeToPlayer(roomId: string, playerId: string, callback: (player: QuizPlayer | null) => void) {
    const playerRef = doc(db, ROOMS_COLLECTION, roomId, PLAYERS_SUBCOLLECTION, playerId)
    return onSnapshot(playerRef, (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as QuizPlayer)
      } else {
        callback(null)
      }
    })
  },

  // Start game
  async updateRoomStatus(roomId: string, status: RoomStatus) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId)
    await updateDoc(roomRef, {
      status,
      ...(status === 'playing' ? { startTime: serverTimestamp() } : {}),
    })
  },

  // Next question
  async nextQuestion(roomId: string, nextIndex: number) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId)
    await updateDoc(roomRef, {
      currentQuestionIndex: nextIndex,
      currentQuestionState: 'question',
      startTime: serverTimestamp(), // Reset start time for the new question
    })
  },

  // Show results for current question
  async showQuestionResults(roomId: string) {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId)
    await updateDoc(roomRef, {
      currentQuestionState: 'result',
    })
  },

  // Submit answer
  async submitAnswer(roomId: string, playerId: string, questionId: string, answer: PlayerAnswer) {
    const playerRef = doc(db, ROOMS_COLLECTION, roomId, PLAYERS_SUBCOLLECTION, playerId)

    // Use dot notation to update a specific field in the map
    await updateDoc(playerRef, {
      [`answers.${questionId}`]: answer,
      lastAnswerTime: serverTimestamp(),
    })
  },

  // Update score (called by host or cloud function - here we'll do it client side for simplicity for now)
  async updatePlayerScore(roomId: string, playerId: string, points: number, isCorrect: boolean) {
    const playerRef = doc(db, ROOMS_COLLECTION, roomId, PLAYERS_SUBCOLLECTION, playerId)
    await updateDoc(playerRef, {
      score: increment(points),
      streak: isCorrect ? increment(1) : 0,
    })
  },

  // Verify room password
  async verifyRoomPassword(roomId: string, password: string): Promise<boolean> {
    const roomRef = doc(db, ROOMS_COLLECTION, roomId)
    const snap = await getDoc(roomRef)
    if (snap.exists()) {
      return snap.data().password === password
    }
    return false
  },

  // Find room by PIN (password)
  async findRoomByPin(pin: string): Promise<string | null> {
    const q = query(
      collection(db, ROOMS_COLLECTION),
      where('password', '==', pin),
      where('status', '==', 'waiting') // Only find waiting rooms
    )
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id
    }
    return null
  },
}
