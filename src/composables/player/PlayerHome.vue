<script setup lang="ts">
import {useStore} from "../../stores"
import {computed, onMounted, ref} from "vue"
import {
  formatDateTime,
  getDailyResetCountdown,
  getMonthlyResetCountdown,
  getWeeklyResetCountdown,
  isTaskAvailable
} from "../../utils"

const store = useStore()
const user = computed(() => store.getProfile().user)

const dailyCountdown = ref("")
const weeklyCountdown = ref("")
const monthlyCountdown = ref("")

const updateCountdowns = () => {
  dailyCountdown.value = getDailyResetCountdown()
  weeklyCountdown.value = getWeeklyResetCountdown()
  monthlyCountdown.value = getMonthlyResetCountdown()
}

onMounted(() => {
  updateCountdowns()
  setInterval(updateCountdowns, 1000)
})

</script>

<template>
  <div class="flex flex-column w-full overflow-hidden items-center justify-center">
    <span class="text-2xl">Welcome</span>
    <span class="font-bold text-4xl">{{ user.username }}</span>
    <div class="flex flex-grow flex-row w-full items-center justify-center gap-4">
      <div class="flex flex-column items-center border-2 border-gray-700 rounded-2xl w-[30%] h-[80%]">
        <div class="flex h-[44px] w-[100%] bg-gray-700 rounded-t-xl items-center justify-center">
          <span class="font-medium text-2xl under">Info</span>
        </div>
        <div class="flex flex-column flex-grow justify-center p-2">
          <div class="flex flex-column items-center line-height-2">
            <span class="text-gray-400">Available Tasks</span>
            <span>{{ user.tasks.filter(t => isTaskAvailable(t)).length || 'None' }}</span>
          </div>
          <div class="flex flex-column items-center line-height-2 mt-2">
            <span class="text-gray-400">Joined Groups</span>
            <span>{{ store.getProfile().groups.length || 'None' }}</span>
          </div>
          <div class="flex flex-column items-center line-height-2 mt-2">
            <span class="text-gray-400">Account Created</span>
            <span>{{ formatDateTime(user.createdAt.toString()) }}</span>
          </div>
          <Divider layout="horizontal"/>
          <div class="flex flex-column items-center line-height-2">
            <span class="text-gray-400">Daily Reset</span>
            <span>{{ dailyCountdown }}</span>
          </div>
          <div class="flex flex-column items-center line-height-2 mt-2">
            <span class="text-gray-400">Weekly Reset</span>
            <span>{{ weeklyCountdown }}</span>
          </div>
          <div class="flex flex-column items-center line-height-2 mt-2">
            <span class="text-gray-400">Monthly Reset</span>
            <span>{{ monthlyCountdown }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-column items-center w-[30%] h-[80%]">
        <div class="flex flex-column items-center border-2 border-gray-700 rounded-2xl w-full h-full mb-4">
          <div class="flex h-[44px] w-[100%] bg-gray-700 rounded-t-xl items-center justify-center">
            <span class="font-medium text-2xl under">Links</span>
          </div>
          <div class="flex flex-column flex-grow justify-center gap-2 p-4">
            <a class="flex justify-center" href="https://runescape.wiki/w/Ironman_Mode/Strategies/Efficient_Ironman_Pathway_Guide" target="_blank" rel="noopener noreferrer">
              <Button label="Ironman Guide" icon="pi pi-globe" class="p-button-sm" severity="secondary" raised/>
            </a>
            <a class="flex justify-center" href="https://runescape.wiki/w/Revolution/Bars" target="_blank" rel="noopener noreferrer">
              <Button label="Revolution Bars" icon="pi pi-globe" class="p-button-sm" severity="secondary" raised/>
            </a>
            <a class="flex justify-center" href="https://runescape.wiki/w/Rune_Goldberg_Machine#Current_combinations" target="_blank" rel="noopener noreferrer">
              <Button label="Vis Wax Runes" icon="pi pi-globe" class="p-button-sm" severity="secondary" raised/>
            </a>
          </div>
        </div>
        <div class="flex flex-column items-center border-2 border-gray-700 rounded-2xl w-full mt-auto">
          <div class="flex h-[44px] w-[100%] bg-gray-700 rounded-t-xl items-center justify-center">
            <span class="font-medium text-2xl under">Actions</span>
          </div>
          <div class="flex flex-column flex-grow justify-center gap-2 p-4">
            <Button label="Change Username" icon="pi pi-pencil" class="p-button-sm" severity="secondary" raised />
            <Button label="Delete Account" icon="pi pi-trash" class="p-button-sm" severity="danger" raised />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>