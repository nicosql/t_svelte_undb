<script lang="ts">
  import { Label } from "$lib/components/ui/label"
  import { cn } from "$lib/utils"
  import type { RatingField } from "@undb/table"
  export let value: number = 0
  export let field: RatingField
  export let readonly = false
  export let onValueChange: (value: number) => void

  $: max = field.max

  let overIndex: number | undefined = undefined

  const onMouseLeave = (e: MouseEvent) => {
    if (readonly) return
    overIndex = undefined
  }

  const onMouseOver = (index: number) => {
    if (readonly) return
    overIndex = index
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={cn("flex h-full items-center", $$restProps.class)} on:mouseleave={onMouseLeave}>
  <!-- svelte-ignore a11y-interactive-supports-focus -->
  {#each Array(max) as _, i}
    <Label class="group items-center">
      <!-- svelte-ignore a11y-mouse-events-have-key-events -->
      <!-- svelte-ignore a11y-interactive-supports-focus -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class={cn(
            "h-4 w-4 cursor-pointer transition-colors",
            (overIndex === undefined && value > i) || (overIndex !== undefined && overIndex >= i)
              ? "text-yellow-400"
              : "text-gray-300",
          )}
          on:mouseover={() => onMouseOver(i)}
        >
          <path
            fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd"
          >
          </path>
        </svg>
      </span>
      <input
        type="radio"
        disabled={readonly}
        value={i + 1}
        bind:group={value}
        class="hidden"
        on:click={async () => {
          if (value && overIndex === value - 1) {
            value = 0
            overIndex = undefined
          }
          onValueChange?.(value)
        }}
        readonly={$$restProps.readonly}
      />
    </Label>
  {/each}
</div>
