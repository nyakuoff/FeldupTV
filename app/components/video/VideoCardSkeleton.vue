<template>
  <div class="flex flex-col gap-2">
    <!-- Thumbnail skeleton -->
    <div class="w-full rounded-xl skeleton" style="aspect-ratio: 16/9;" />

    <!-- Info skeleton -->
    <div class="flex gap-3">
      <div class="w-9 h-9 rounded-full skeleton shrink-0 mt-0.5" />
      <div class="flex-1 flex flex-col gap-2">
        <div class="h-4 w-full skeleton rounded" />
        <div class="h-4 w-3/4 skeleton rounded" />
        <div class="h-3 w-1/2 skeleton rounded mt-1" />
      </div>
    </div>
  </div>
</template>
