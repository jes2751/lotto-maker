const target = process.argv[2] ?? "http://127.0.0.1:3000/stats/numbers/1";

fetch(target)
  .then((response) => response.text())
  .then((html) => {
    const match = html.match(/지금 기준 (\d+)회 전/);
    console.log(match ? match[1] : "no-match");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
