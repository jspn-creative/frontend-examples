<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { pointerBg } from "$lib/actions";

  function getBookingMonth() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleString("en-US", { month: "long" });
  }

  const bookingMonth = getBookingMonth();
</script>

<div class="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
  <!-- Illuminated circle elements -->
  <div class="absolute -top-[40%] -left-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl"></div>
  <div class="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-primary/15 to-transparent blur-3xl"></div>

  <div
    class="relative z-10 max-w-5xl mx-auto px-6 py-24 flex flex-col items-center"
    use:pointerBg={{
      lineAlpha: 0.6,
      color: "var(--color-slate-900)",
    }}
  >
    <!-- Booking status -->
    <div class="flex items-center gap-2 px-4 py-2 mb-4 rounded bg-primary/5 border border-border text-sm font-medium">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/50 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </span>
      <span class="text-foreground tracking-wider uppercase">Now booking for {bookingMonth}</span>
    </div>

    <!-- Heading with gradient text -->
    <h1 class="grid grid-cols-1 grid-rows-1 *:col-start-1 *:row-start-1 *:text-center *:text-4xl *:sm:text-5xl *:md:text-8xl *:font-black *:[text-wrap:balance] *:mb-6 *:bg-clip-text *:text-transparent *:leading-[1] *:tracking-tighter">
      <span class="bg-gradient-to-b from-primary to-primary/70">Websites built to power success</span>
      <span class="bg-stretch opacity-50 bg-bottom bg-[url(https://cdn.prod.website-files.com/63221768b1ed1774c41229cc/67a77803657047da4704fc1e_text%20h1.svg)]">Websites built to power success</span>
    </h1>

    <!-- Subheading -->
    <p class="text-center text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl [text-wrap:pretty]">I help turn your ambitious ideas into reality by creating high-converting and eye-catching websites.</p>

    <!-- CTA Button -->
    <div class="mt-10">
      <Button href="#book" size="lg" variant="default">Book a Call</Button>
    </div>
  </div>
</div>
