<script lang="ts">
  import { onMount } from "svelte";
  import { AbsoluteOrientationSensor } from "motion-sensors-polyfill";

  export let azimuth: number;
  export let altitude: number;

  let absoluteSensorWorking: boolean = false;

  let heading: number = 0;

  const orientationSensor = new AbsoluteOrientationSensor({
    frequency: 60,
    referenceFrame: "device",
  });

  onMount(() => {
    const handler = (event: Event) => {
      try {
        if (!absoluteSensorWorking) {
          absoluteSensorWorking = true;
        }

        // @ts-ignore
        let q = event.target?.quaternion;
        let alpha =
          Math.atan2(
            2 * q[0] * q[1] + 2 * q[2] * q[3],
            1 - 2 * q[1] * q[1] - 2 * q[2] * q[2]
          ) *
          (180 / Math.PI);
        if (alpha < 0) alpha = 360 + alpha;

        heading = alpha;
      } catch (err) {
        console.error("Error in compass handler", err);
        orientationSensor.stop();
        orientationSensor.removeEventListener("reading", handler);
        absoluteSensorWorking = false;
      }
    };

    orientationSensor.addEventListener("reading", handler);

    orientationSensor.start();

    return () => {
      orientationSensor.removeEventListener("reading", handler);
      orientationSensor.stop();
    };
  });

  const generalDeviceOrientationHandler = (event: any) => {
    if (absoluteSensorWorking) {
      return;
    }

    heading = event.alpha;

    if (typeof event.webkitCompassHeading !== "undefined") {
      heading = event.webkitCompassHeading;
    }
  };

  const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
  };

  $: azimuthInDegrees = radiansToDegrees(azimuth);
</script>

<div class="flex items-center justify-center py-5">
  <div
    style="transform: rotateZ({heading + 180 + azimuthInDegrees}deg);"
    class="h-6 w-1 relative arrow bg-base-content"
  />
</div>

<svelte:window on:deviceorientation={generalDeviceOrientationHandler} />

<style lang="postcss">
  .arrow:after {
    /* create a triangle on the arrow */
    content: "";
    position: absolute;
    top: -10px;
    left: -8px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fff;
    transform: rotate(-360deg);
    z-index: -1;
  }
</style>
