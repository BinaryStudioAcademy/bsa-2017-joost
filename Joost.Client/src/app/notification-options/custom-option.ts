import {ToastOptions} from 'ng2-toastr';

export class CustomOption extends ToastOptions {
  animate = 'flyRight'; // you can pass any options to override defaults
  newestOnTop = true;
  showCloseButton = true;
  dismiss = 'auto';
  toastLife = 3500;
  positionClass = "toast-bottom-right";
  
}
