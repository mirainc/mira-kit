const { CI, HEADLESS } = process.env;

export const headless = !!HEADLESS && HEADLESS !== "false";

export const isCI = !!CI && CI !== "false";
