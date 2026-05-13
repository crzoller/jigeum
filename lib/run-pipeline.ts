import { runPipeline } from "./pipeline";

runPipeline()
  .then((result) => {
    console.log("Pipeline complete:", result);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Pipeline failed:", err);
    process.exit(1);
  });
