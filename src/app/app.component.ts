import { Component } from '@angular/core';
import { AppFormGroup } from './app.formgroup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly app = new AppFormGroup();
}
