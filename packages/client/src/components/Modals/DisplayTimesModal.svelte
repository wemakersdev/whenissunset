<script lang="ts">
  import type { GetTimesResult } from "suncalc";
  import OverlayModalContainer from "./OverlayModalContainer.svelte";
  import dayjs, { type Dayjs } from "dayjs";
  import { startCase } from "lodash-es";
  import { muslimPrayerTimes } from "@common/prayerTimes";

  export let times: GetTimesResult;

  let currentDate = dayjs();


  $: timesMap = Object.entries(times)
    .map(([key, value]) => {
      const diff = dayjs(value).diff(currentDate, "second");
      if (diff < 0) {
        return [key, dayjs(value).add(1, "day")];
      } else {
        return [key, dayjs(value)];
      }
    })
    .sort(([, a], [, b]) => {
      if ((a as Dayjs).isBefore(b)) {
        return -1;
      } else if ((a as Dayjs).isAfter(b)) {
        return 1;
      } else {
        return 0;
      }
    }) as [string, Dayjs][];
</script>

<OverlayModalContainer label="All Times">
  <div class="h-full w-full overflow-auto">
    <div class="flex flex-col gap-1">
      {#each timesMap as [key, item]}
		{#if muslimPrayerTimes[key]}
        <div class="flex flex-row bg-base-200 px-4 py-2 rounded-lg">
          <span class="w-1/2">
            {muslimPrayerTimes[key]}
          </span>
          <span class="w-1/2">
            {item.format("h:mm A")}{item.startOf("day").day() !==
            currentDate.startOf("day").day()
              ? ", Tomorrow"
              : ""}
          </span>
        </div>
		{/if}
      {/each}
    </div>
  </div>
</OverlayModalContainer>
