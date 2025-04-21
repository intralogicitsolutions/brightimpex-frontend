import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoaderVisible: WritableSignal<boolean> = signal(false);

  constructor() {}

  showLoader() {
    this.isLoaderVisible.set(true);
  }

  hideLoader() {
    setTimeout(() => {
      this.isLoaderVisible.set(false);
    }, 500);
  }
}
