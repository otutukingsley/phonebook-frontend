<template>
  <div>
    <NavBar />
    <main class="max-w-7xl mx-auto p-4">
      <slot />
    </main>

    <ViewProfileModal />
    <EditProfileModal />
  </div>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue'
import ViewProfileModal from '~/components/ViewProfileModal.vue'
import EditProfileModal from '~/components/EditProfileModal.vue'
</script>