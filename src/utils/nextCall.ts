interface NextFn {
  (): void;
}

export interface CallBack<Options> {
  (optionss: Options, next: NextFn, data?: unknown): unknown;
}

class NextCall<Options> {
  constructor(public cbs: CallBack<Options>[]) {}

  init(cbs: CallBack<Options>[]) {
    this.cbs = cbs;
  }

  start(options: Options) {
    let gIdx = 0;
    const next: NextFn = async () => {
      if (gIdx === this.cbs.length) {
        return;
      }
      const curCb = this.cbs[gIdx++];
      const nextI = gIdx;
      const res = await Promise.resolve(curCb(options, next));
      if (res === true && nextI === gIdx) {
        next();
      }
    };
    next();
  }
}

export default NextCall;
