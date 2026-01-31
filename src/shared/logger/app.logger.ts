export function getAppLogger(_name: string): { info: (msg: string, meta?: object) => void } {
  return {
    info: (msg: string, meta?: object) => {
      console.log(msg, meta ?? '');
    },
  };
}
