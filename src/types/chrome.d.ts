declare namespace chrome {
  namespace runtime {
    function sendMessage(
      extensionId: string,
      message: any,
      options?: any,
      callback?: (response: any) => void
    ): void;
    var lastError: { message: string } | undefined;
  }
}
