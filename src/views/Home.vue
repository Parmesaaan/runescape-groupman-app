<script setup lang="ts">
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from "primevue"
import Group from "../composables/Group.vue";
import Player from "../composables/Player.vue";
</script>

<template>
  <div class="tab-container">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Player</Tab>
        <Tab value="1">Group</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <Player/>
        </TabPanel>
        <TabPanel value="1">
          <Group/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped>
.tab-container {
  align-items: center;
  min-width: 960px;
  min-height: 540px;
  max-width: 90vw;
  max-height: 90vw;
  margin: auto;
  padding: 1rem;
}

.p-tabpanels {
  min-height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
}
</style>