import { SavedQuestion } from ".prisma/client";

class PrioQueue {
  queue: [number, SavedQuestion][];

  constructor() {
    this.queue = [];
  }

  enqueue(prio: number, element: SavedQuestion): void {
    if (this.queue.length == 0) {
      this.queue.push([prio, element]);
      return;
    }
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i][0] < prio) {
        this.queue.splice(i, 0, [prio, element]);
        return;
      } else if (i == this.queue.length - 1) {
        this.queue.push([prio, element]);
        return;
      }
    }
  }

  dequeue(): [number, SavedQuestion] | undefined {
    return this.queue.shift();
  }

  size(): number {
    return this.queue.length;
  }
}

export { PrioQueue };
