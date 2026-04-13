const response = await fetch("https://lotto-maker.cloud/api/v1/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    strategy: "mixed",
    count: 1,
    anonymous_id: "codex-check",
    filters: {
      fixed_numbers: [],
      excluded_numbers: [],
      odd_even: "any",
      sum_min: null,
      sum_max: null,
      allow_consecutive: true
    }
  })
});

console.log("STATUS", response.status);
console.log(await response.text());
