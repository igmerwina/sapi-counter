<template>
  <div class="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex flex-col items-center justify-center p-4 overflow-hidden">

    <!-- Floating background blobs -->
    <div class="fixed top-0 left-0 w-[500px] h-[500px] bg-yellow-400 rounded-full opacity-10 blur-3xl pointer-events-none animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
    <div class="fixed bottom-0 right-0 w-[500px] h-[500px] bg-green-400 rounded-full opacity-10 blur-3xl pointer-events-none animate-pulse translate-x-1/2 translate-y-1/2"></div>

    <div class="w-full max-w-xl relative z-10">

      <!-- Header -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-4">
          <span class="text-2xl">🐄</span>
          <span class="text-white font-bold tracking-widest text-sm uppercase">Sapi Counter</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-white mb-1 drop-shadow-lg">Count the Cows!</h1>
        <p class="text-green-200 text-lg">Look carefully at the image below 👇</p>
      </div>

      <!-- Main Game Card -->
      <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl mb-4">

        <!-- Round and Difficulty badges -->
        <div class="flex justify-between items-center mb-4">
          <span class="text-xs font-bold text-white/60 uppercase tracking-wider">Round {{ round }}</span>
          <div class="flex gap-2">
            <button
              v-for="lvl in difficulties"
              :key="lvl.key"
              @click="setDifficulty(lvl.key)"
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200',
                difficulty === lvl.key
                  ? lvl.activeClass
                  : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/20'
              ]"
            >
              {{ lvl.label }}
            </button>
          </div>
        </div>

        <!-- Cow Image -->
        <div class="relative overflow-hidden rounded-2xl mb-5 shadow-xl group">
          <img
            :src="currentRound.image"
            alt="Cows"
            class="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          <div class="absolute bottom-3 right-3 bg-black/50 text-white text-xs rounded-full px-3 py-1 backdrop-blur">
            🔍 Hover to zoom
          </div>
        </div>

        <!-- Counter -->
        <div class="bg-white/10 border border-white/20 rounded-2xl p-6 mb-5 flex items-center justify-between gap-4">
          <button
            @click="decrement"
            :disabled="count <= 0"
            class="w-14 h-14 rounded-full bg-red-400/80 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-3xl font-black transition-all duration-200 active:scale-90 shadow-lg flex items-center justify-center"
          >−</button>

          <div class="text-center flex-1">
            <p class="text-white/60 text-xs uppercase tracking-wider mb-1">Your Count</p>
            <p class="font-black tabular-nums text-white text-7xl transition-all duration-200">{{ count }}</p>
          </div>

          <button
            @click="increment"
            :disabled="count >= 99"
            class="w-14 h-14 rounded-full bg-emerald-400/80 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-3xl font-black transition-all duration-200 active:scale-90 shadow-lg flex items-center justify-center"
          >+</button>
        </div>

        <!-- Submit -->
        <button
          @click="validate"
          :disabled="validated"
          class="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-black text-lg rounded-2xl transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          {{ validated ? '✓ Answered!' : '🐮 Check My Answer' }}
        </button>
      </div>

      <!-- Score Card -->
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-center">
          <p class="text-white/50 text-xs uppercase tracking-wider mb-1">Correct</p>
          <p class="text-3xl font-black text-emerald-400">{{ score.correct }}</p>
        </div>
        <div class="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-center">
          <p class="text-white/50 text-xs uppercase tracking-wider mb-1">Wrong</p>
          <p class="text-3xl font-black text-red-400">{{ score.wrong }}</p>
        </div>
        <div class="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-center">
          <p class="text-white/50 text-xs uppercase tracking-wider mb-1">Streak 🔥</p>
          <p class="text-3xl font-black text-yellow-400">{{ score.streak }}</p>
        </div>
      </div>

      <button @click="resetAll" class="w-full py-2 text-white/40 hover:text-white/70 text-sm font-semibold transition-colors">
        🔄 Reset Everything
      </button>
    </div>

    <!-- Success Modal -->
    <transition name="modal">
      <div v-if="showSuccess" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl border border-white/30">
          <div class="text-7xl mb-4 animate-bounce">🎉</div>
          <h3 class="text-3xl font-black text-white mb-1">Correct!</h3>
          <p class="text-white/80 text-lg mb-1">There were exactly</p>
          <p class="text-6xl font-black text-white mb-1">{{ currentRound.answer }}</p>
          <p class="text-white/80 text-lg mb-4">cows in that photo! 🐄</p>
          <div v-if="score.streak >= 3" class="bg-yellow-400 text-yellow-900 text-sm font-black rounded-full px-4 py-1 mb-4 inline-block">
            🔥 {{ score.streak }} in a row! On fire!
          </div>
          <button @click="nextRound" class="w-full py-3 bg-white text-green-700 font-black text-lg rounded-2xl hover:bg-green-50 transition-all shadow-lg">
            Next Round →
          </button>
        </div>
      </div>
    </transition>

    <!-- Error Modal -->
    <transition name="modal">
      <div v-if="showError" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-gradient-to-br from-red-400 to-rose-600 rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl border border-white/30">
          <div class="text-7xl mb-4">😅</div>
          <h3 class="text-3xl font-black text-white mb-1">Not quite!</h3>
          <p class="text-white/80 text-lg mb-1">You said <span class="font-black text-white text-2xl">{{ count }}</span>, but there were</p>
          <p class="text-6xl font-black text-white mb-1">{{ currentRound.answer }}</p>
          <p class="text-white/80 text-lg mb-6">cows! Look more carefully 🔍</p>
          <div class="flex gap-3">
            <button @click="tryAgain" class="flex-1 py-3 bg-white/20 text-white font-bold rounded-2xl hover:bg-white/30 transition-all border border-white/30">
              Try Again
            </button>
            <button @click="nextRound" class="flex-1 py-3 bg-white text-red-600 font-black rounded-2xl hover:bg-red-50 transition-all shadow-lg">
              Skip →
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'

const cowPools = {
  easy: [
    { image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=900&q=80', answer: 3 },
    { image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=900&q=80', answer: 2 },
    { image: 'https://images.unsplash.com/photo-1598715685267-615ba6d0e3ae?w=900&q=80', answer: 4 },
    { image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=900&q=80', answer: 1 },
    { image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=900&q=80', answer: 3 },
  ],
  medium: [
    { image: 'https://images.unsplash.com/photo-1552522884-6a3ee2b19a3e?w=900&q=80', answer: 6 },
    { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', answer: 7 },
    { image: 'https://images.unsplash.com/photo-1551958219-acbc608c6be4?w=900&q=80', answer: 5 },
    { image: 'https://images.unsplash.com/photo-1549317661-bd32c8500a8b?w=900&q=80', answer: 8 },
    { image: 'https://images.unsplash.com/photo-1434318519921-83f06b27fbb6?w=900&q=80', answer: 6 },
  ],
  hard: [
    { image: 'https://images.unsplash.com/photo-1612611095857-7ec3f05b328f?w=900&q=80', answer: 12 },
    { image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80', answer: 9 },
    { image: 'https://images.unsplash.com/photo-1518715303843-586e350080e0?w=900&q=80', answer: 11 },
    { image: 'https://images.unsplash.com/photo-1529336953128-a85760f58cb5?w=900&q=80', answer: 10 },
    { image: 'https://images.unsplash.com/photo-1561495376-dc9c7c5b8b14?w=900&q=80', answer: 13 },
  ],
}

const difficulties = [
  { key: 'easy',   label: '🟢 Easy',   activeClass: 'bg-green-500 border-green-400 text-white' },
  { key: 'medium', label: '🟡 Medium', activeClass: 'bg-yellow-500 border-yellow-400 text-white' },
  { key: 'hard',   label: '🔴 Hard',   activeClass: 'bg-red-500 border-red-400 text-white' },
]

const difficulty = ref('easy')
const count = ref(0)
const round = ref(1)
const validated = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const score = ref({ correct: 0, wrong: 0, streak: 0 })
const usedIndices = ref([])
const currentIndex = ref(0)

function pickNewIndex() {
  const pool = cowPools[difficulty.value]
  let available = pool.map((_, i) => i).filter(i => !usedIndices.value.includes(i))
  if (available.length === 0) {
    usedIndices.value = []
    available = pool.map((_, i) => i)
  }
  const idx = available[Math.floor(Math.random() * available.length)]
  usedIndices.value.push(idx)
  return idx
}

currentIndex.value = pickNewIndex()
const currentRound = computed(() => cowPools[difficulty.value][currentIndex.value])

const increment = () => { if (count.value < 99) count.value++ }
const decrement = () => { if (count.value > 0) count.value-- }

const validate = () => {
  if (validated.value) return
  validated.value = true
  if (count.value === currentRound.value.answer) {
    score.value.correct++
    score.value.streak++
    showSuccess.value = true
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#10b981', '#fbbf24', '#f59e0b', '#ffffff', '#34d399'],
    })
  } else {
    score.value.wrong++
    score.value.streak = 0
    showError.value = true
  }
}

const nextRound = () => {
  showSuccess.value = false
  showError.value = false
  count.value = 0
  validated.value = false
  round.value++
  currentIndex.value = pickNewIndex()
}

const tryAgain = () => {
  showError.value = false
  count.value = 0
  validated.value = false
}

const setDifficulty = (level) => {
  difficulty.value = level
  usedIndices.value = []
  currentIndex.value = pickNewIndex()
  count.value = 0
  validated.value = false
  showSuccess.value = false
  showError.value = false
}

const resetAll = () => {
  score.value = { correct: 0, wrong: 0, streak: 0 }
  round.value = 1
  usedIndices.value = []
  currentIndex.value = pickNewIndex()
  count.value = 0
  validated.value = false
  showSuccess.value = false
  showError.value = false
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
