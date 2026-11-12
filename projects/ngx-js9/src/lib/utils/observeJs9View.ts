interface DisplayImage {
  display: { id: string };
}

interface Js9ViewEvents {
  RegisterPlugin: (
    group: string,
    name: string,
    initialize: () => void,
    options: Record<string, unknown>,
  ) => void;
}

const observers = new WeakMap<Js9ViewEvents, Map<string, () => void>>();

/** JS9's virtual plugin callbacks also cover changes made through its menus and API. */
export function observeJs9View(
  js9: Js9ViewEvents,
  display: string,
  changed: () => void,
): () => void {
  let callbacks = observers.get(js9);
  if (!callbacks) {
    callbacks = new Map();
    observers.set(js9, callbacks);
    const notify = (image: DisplayImage) => callbacks!.get(image.display.id)?.();
    // JS9 constructs an instance from this function's prototype; an arrow cannot be used.
    js9.RegisterPlugin('CATCH', 'ViewObserver', function initialize() {}, {
      winDims: [0, 0],
      onimagedisplay: notify,
      onimageclose: notify,
      onsetpan: notify,
      onsetzoom: notify,
      onsetrotate: notify,
      onsetrot90: notify,
      onsetflip: notify,
    });
  }
  callbacks.set(display, changed);
  return () => callbacks.delete(display);
}
