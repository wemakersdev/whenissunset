<script lang="ts">
 
  import dayjs, { Dayjs } from "dayjs";
  import { onMount } from "svelte";
  import { networkLocation } from "@common/basicStores";
  import {padStart, startCase } from "lodash-es";
  import Compass from "@components/Compass/Compass.svelte";
  import { openModal } from "@components/Modals/controllers";
  import { muslimPrayerTimes } from "@common/prayerTimes";
  import { getFormattedPrayerTimes, getPrayerTimes } from "@common/adhan";
  import { calculateAzimuthAndAltitude } from "@common/azimuth";
  // import { f } from "msw/lib/glossary-297d38ba";


  let timeStr: string = "00:00:00";
  let currentDate = dayjs();
  let nextDate = dayjs().add(1, "day");
  let message: string = "";

  let targetSunPos: any;
  const meccaLatitude =  21.422487;
const meccaLongitude =39.826206;

  $: longitude = +($networkLocation?.longitude || 0);
  $: latitude = +($networkLocation?.latitude || 0);

  $: meccaPos = calculateAzimuthAndAltitude({
    latitude: latitude,
    longitude: longitude,
  }, {
    latitude: meccaLatitude,
    longitude: meccaLongitude,
  })

  

  $: timeStr = getTimeString(currentDate);


  $: prayerTimes =getPrayerTimes({
    calculationMethod: "Dubai",
    date: currentDate,
    coordinates: {
      latitude: latitude,
      longitude: longitude,
    },
    timeZone: "Asia/Dubai",
  })
  $: currentPrayer = prayerTimes?.currentPrayer();
  $: currentPrayerDate = currentPrayer !== "none" ? dayjs(prayerTimes[currentPrayer]): undefined;
  $: nextPrayer = prayerTimes?.nextPrayer();
  $: nextPrayerDate = nextPrayer !== "none" ? dayjs(prayerTimes[nextPrayer]): undefined;
  $: currentAction = nextPrayer;

  onMount(() => {
    const handle = () => {
      currentDate = currentDate.clone().add(1, "second");
    };
    const intervalId = setInterval(handle, 1000);
    handle();
    return () => {
      clearInterval(intervalId);
    };
  });


  const getTimeString = (currentDate: Dayjs) => {
    let diff = nextPrayerDate?.diff(currentDate, "second") || 0;

    let timeStr = "";

    const seconds = diff % 60;
    const minutes = Math.floor(diff / 60) % 60;
    const hours = Math.floor(diff / 3600) % 24;

    timeStr = `${padStart(hours + "", 2, "0")}:${padStart(
      minutes + "",
      2,
      "0"
    )}:${padStart(seconds + "", 2, "0")}`;
    message = `${currentAction}`;
    return timeStr;
  };

  

  const isDeviceOrientationSupported = (): Promise<boolean> => {
    return new Promise((res, rej) => {
      const handle = (event: DeviceOrientationEvent) => {
        //@ts-ignore
        if (
          event.alpha ||
          event.beta ||
          event.gamma ||
          (event as any).webkitCompassHeading
        ) {
          res(true);
        } else {
          res(false);
        }
      };
      window.addEventListener("deviceorientation", handle);
      setTimeout(() => {
        window.removeEventListener("deviceorientation", handle);
        res(false);
      }, 1000);
    });
  };

  const handleClickMessage = () => {
    openModal(() => import("@components/Modals/DisplayTimesModal.svelte"), {
      times: getFormattedPrayerTimes(prayerTimes),
    });
  };
</script>


<div class="relative h-full w-full">
  <div
    style="z-index:100000"
    class="absolute inset-0  bg-gradient-to-r from-gray-800 via-gray-900 to-black  pointer-events-none w-full flex items-center justify-center"
  >
    <div
      class="rounded-xl flex flex-col gap-2 text-center text-base-content bg-opacity-50 p-5 px-10"

      
    >
      <span
        class="pointer-events-auto flex mb-2 items-center justify-center"
        role="button"
        on:click={handleClickMessage}
      >
        <span class="border-b border-opacity-60 text-2xl border-base-content">
          {startCase(message)} at
        </span>
      </span>

      <span class="text-5xl md:text-8xl  font-extrabold">
        {nextPrayerDate?.format("hh:mm A")} 
      </span>
      <span class="text-lg md:text-2xl">{timeStr}</span>

      {#await isDeviceOrientationSupported() then isSupported}
        {#if isSupported}
          <Compass
            altitude={meccaPos.altitude}
            azimuth={meccaPos.azimuth}
          />
        {/if}
      {/await}
    </div>
  </div>
</div>
