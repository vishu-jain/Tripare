export function logError(error: Error, info?: object) {
  // You can extend this to send logs to a remote server
  console.error("Logged Error:", error, info);
}
