import IDX_COLLECTOR_CONFIG from "./config"

const verbosity = IDX_COLLECTOR_CONFIG.verbosity

export const verbose = function(level: number, message: string): void {
  if (verbosity >= level) {
    console.log(message)
  }
}
