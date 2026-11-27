export default function setup(): void {
  if (!process.env.MEILI_TEST_URL) {
    throw new Error("MEILI_TEST_URL is not set. Integration tests did not run.");
  }
}
