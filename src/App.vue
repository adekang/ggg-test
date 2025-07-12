<script setup>
        
const phone = 'phone';
</script>

<template>
  <div class="flex flex-col items-center h-screen bg-gradient-to-br from-[#FAF6ED] via-[#F5E6D3] to-[#ECD8C3]">
    <h1>{{ $t('message.hello') }}</h1>
    <div :class="`i-carbon-${phone}`" />
  </div>

</template>


<style scoped></style>
